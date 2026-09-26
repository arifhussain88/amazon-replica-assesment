import { beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { DELETE as deleteCartItem } from "@/app/api/cart/[itemId]/route";
import { GET as getCart, PATCH as patchCart, POST as postCart } from "@/app/api/cart/route";
import { GET as getBrands } from "@/app/api/brands/route";
import { GET as getCategories } from "@/app/api/categories/route";
import { GET as getOrder } from "@/app/api/orders/[orderNumber]/route";
import { POST as postOrder } from "@/app/api/orders/route";
import { GET as getProduct } from "@/app/api/products/[slug]/route";
import { GET as getProducts } from "@/app/api/products/route";
import { createSession, hashPassword, SESSION_COOKIE } from "@/lib/auth";
import { ORDER_COOKIE } from "@/lib/cart";
import { getDb } from "@/lib/db";
import { products, users } from "@/lib/db/schema";
import { deleteCookie, resetCookies } from "./setup";

type ProductCard = {
  slug: string;
  brand: string;
  categorySlug: string;
  priceCents: number;
  ratingTimes10: number;
  description?: string;
  reviews?: unknown[];
};

type CartBody = {
  lines: Array<{ id: string; quantity: number; slug: string }>;
  subtotalCents: number;
};

type ErrorBody = { error?: string };
type StatusBody = { ok: boolean; message: string };

type OrderBody = {
  orderNumber: string;
  email: string;
  items: unknown[];
};

const owner = {
  id: "user-owner",
  name: "Ada Lovelace",
  email: "ada@example.com",
};

const other = {
  id: "user-other",
  name: "Grace Hopper",
  email: "grace@example.com",
};

const address = {
  fullName: "Ada Lovelace",
  line1: "1 Market Street",
  city: "Seattle",
  region: "WA",
  postalCode: "98101",
  country: "United States",
};

const payment = {
  cardName: "Ada Lovelace",
  cardNumber: "4242424242424242",
  expiry: "12/30",
  cvc: "123",
};

beforeAll(async () => {
  const db = await getDb();
  const passwordHash = hashPassword("test-password");
  await db.insert(users).values([
    { ...owner, passwordHash, createdAt: new Date() },
    { ...other, passwordHash, createdAt: new Date() },
  ]);
});

describe("catalog", () => {
  it("lists products", async () => {
    const body = await read<ProductCard[]>(await getProducts(get("/api/products")));
    expect(body.some((product) => product.slug === "usb-c-65w-charger")).toBe(true);
  });

  it("filters products with the existing search parameters", async () => {
    const filtered = await read<ProductCard[]>(
      await getProducts(get("/api/products?q=charger&category=electronics&brand=Northline&min=20&max=30&rating=4&sort=price-asc")),
    );
    expect(filtered.map((product) => product.slug)).toContain("usb-c-65w-charger");
    expect(filtered.every((product) => product.brand === "Northline" && product.categorySlug === "electronics")).toBe(true);
    expect(filtered.every((product) => product.priceCents >= 2000 && product.priceCents <= 3000)).toBe(true);
    expect(filtered.every((product) => product.ratingTimes10 >= 40)).toBe(true);
    const prices = filtered.map((product) => product.priceCents);
    expect(prices).toEqual([...prices].sort((left, right) => left - right));

    const empty = await read<ProductCard[]>(await getProducts(get("/api/products?q=not-a-real-product")));
    expect(empty).toEqual([]);
  });

  it("returns a product detail", async () => {
    const response = await getProduct(get("/api/products/usb-c-65w-charger"), { params: Promise.resolve({ slug: "usb-c-65w-charger" }) });
    expect(response.status).toBe(200);
    const body = await read<ProductCard>(response);
    expect(body.slug).toBe("usb-c-65w-charger");
    expect(body.description).toContain("65W");
    expect(body.reviews?.length).toBeGreaterThan(0);
  });

  it("returns 404 for a missing product", async () => {
    const response = await getProduct(get("/api/products/missing"), { params: Promise.resolve({ slug: "missing" }) });
    expect(response.status).toBe(404);
    expect((await read<ErrorBody>(response)).error).toBe("Product not found.");
  });

  it("lists categories", async () => {
    const body = await read<Array<{ slug: string; name: string }>>(await getCategories());
    expect(body.some((category) => category.slug === "electronics" && category.name === "Electronics")).toBe(true);
  });

  it("lists brands", async () => {
    const all = await read<string[]>(await getBrands(get("/api/brands")));
    expect(all).toContain("Northline");
    const electronics = await read<string[]>(await getBrands(get("/api/brands?category=electronics")));
    expect(electronics).toContain("Northline");
    expect(electronics).toContain("Lumen Audio");
    expect(electronics).not.toContain("Bramble");
  });
});

describe("cart", () => {
  it("reads an empty cart", async () => {
    resetCookies();
    const body = await read<CartBody>(await getCart());
    expect(body).toEqual({ lines: [], subtotalCents: 0 });
  });

  it("adds, updates, and removes an item", async () => {
    resetCookies();
    const added = await postCart(json("/api/cart", { productId: "prod-usb-c-65w-charger", quantity: 1 }));
    expect(added.status).toBe(200);
    expect(await read<StatusBody>(added)).toEqual({ ok: true, message: "Added to cart." });
    const cart = await read<CartBody>(await getCart());
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0]?.slug).toBe("usb-c-65w-charger");
    expect(cart.subtotalCents).toBe(2900);

    const updated = await patchCart(json("/api/cart", { itemId: cart.lines[0]?.id, quantity: 2 }));
    expect(await read<StatusBody>(updated)).toEqual({ ok: true, message: "Cart updated." });
    const next = await read<CartBody>(await getCart());
    expect(next.lines[0]?.quantity).toBe(2);
    expect(next.subtotalCents).toBe(5800);

    const removed = await deleteCartItem(new Request("http://localhost/api/cart/item"), {
      params: Promise.resolve({ itemId: cart.lines[0]?.id ?? "" }),
    });
    expect(await read<StatusBody>(removed)).toEqual({ ok: true, message: "Removed from cart." });
    expect(await read<CartBody>(await getCart())).toEqual({ lines: [], subtotalCents: 0 });
  });

  it("rejects invalid cart input", async () => {
    resetCookies();
    const malformed = await postCart(new Request("http://localhost/api/cart", { method: "POST", body: "not-json" }));
    expect(malformed.status).toBe(400);
    expect(await read<StatusBody>(malformed)).toEqual({ ok: false, message: "Send a JSON object." });

    const missingProduct = await read<StatusBody>(await postCart(json("/api/cart", { quantity: 1 })));
    expect(missingProduct).toEqual({ ok: false, message: "Choose a quantity between 1 and 20." });

    const tooMany = await read<StatusBody>(await postCart(json("/api/cart", { productId: "prod-usb-c-65w-charger", quantity: 50 })));
    expect(tooMany).toEqual({ ok: false, message: "Choose a quantity between 1 and 20." });

    const unavailable = await read<StatusBody>(await postCart(json("/api/cart", { productId: "prod-missing", quantity: 1 })));
    expect(unavailable).toEqual({ ok: false, message: "That product is no longer available." });

    const needsVariant = await read<StatusBody>(await postCart(json("/api/cart", { productId: "prod-harbor-compact-speaker", quantity: 1 })));
    expect(needsVariant.ok).toBe(false);
    expect(needsVariant.message).toMatch(/choose a color/i);
  });
});

describe("orders", () => {
  it("places an order and allows the buyer or the just-placed cookie to read it", async () => {
    resetCookies();
    await createSession(owner.id);
    const added = await postCart(json("/api/cart", { productId: "prod-usb-c-65w-charger", quantity: 1 }));
    expect(added.status).toBe(200);

    const response = await postOrder(json("/api/orders", { ...address, ...payment }));
    expect(response.status).toBe(201);
    const order = await read<OrderBody>(response);
    expect(order.orderNumber).toMatch(/^NL-/);
    expect(order.email).toBe(owner.email);
    expect(order.items).toHaveLength(1);
    expect(await read<CartBody>(await getCart())).toEqual({ lines: [], subtotalCents: 0 });

    const lookup = (orderNumber: string) =>
      getOrder(get(`/api/orders/${orderNumber}`), { params: Promise.resolve({ orderNumber }) });

    expect((await lookup(order.orderNumber)).status).toBe(200);

    deleteCookie(SESSION_COOKIE);
    expect((await lookup(order.orderNumber)).status).toBe(200);

    deleteCookie(ORDER_COOKIE);
    expect((await lookup(order.orderNumber)).status).toBe(404);

    await createSession(other.id);
    expect((await lookup(order.orderNumber)).status).toBe(404);

    await createSession(owner.id);
    const owned = await lookup(order.orderNumber);
    expect(owned.status).toBe(200);
    expect((await read<OrderBody>(owned)).orderNumber).toBe(order.orderNumber);
  });

  it("rejects checkout without a session, with a bad card, or with an empty cart", async () => {
    resetCookies();
    const signedOut = await postOrder(json("/api/orders", { ...address, ...payment }));
    expect(signedOut.status).toBe(401);
    expect((await read<ErrorBody>(signedOut)).error).toBe("Sign in before checkout.");

    await createSession(owner.id);
    const badCard = await postOrder(json("/api/orders", { ...address, ...payment, cardNumber: "1234" }));
    expect(badCard.status).toBe(400);
    expect((await read<ErrorBody>(badCard)).error).toMatch(/valid card number/);

    const empty = await postOrder(json("/api/orders", { ...address, ...payment }));
    expect(empty.status).toBe(400);
    expect((await read<ErrorBody>(empty)).error).toBe("Your cart is empty.");
  });

  it("rejects an order when stock is no longer available", async () => {
    resetCookies();
    await createSession(owner.id);
    const added = await postCart(json("/api/cart", { productId: "prod-ceramic-round-brush", quantity: 1 }));
    expect(added.status).toBe(200);

    const db = await getDb();
    await db.update(products).set({ stock: 0 }).where(eq(products.id, "prod-ceramic-round-brush"));

    const response = await postOrder(json("/api/orders", { ...address, ...payment }));
    expect(response.status).toBe(400);
    expect((await read<ErrorBody>(response)).error).toMatch(/does not have enough stock/);
  });

  it("hides an unknown order number", async () => {
    resetCookies();
    await createSession(owner.id);
    const response = await getOrder(get("/api/orders/NL-MISSING"), { params: Promise.resolve({ orderNumber: "NL-MISSING" }) });
    expect(response.status).toBe(404);
  });
});

function get(path: string) {
  return new Request(`http://localhost${path}`);
}

function json(path: string, body: unknown) {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function read<T>(response: Response) {
  return response.json() as Promise<T>;
}
