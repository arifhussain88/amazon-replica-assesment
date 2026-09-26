import { NextResponse } from "next/server";
import { numberField, readJsonObject, statusMessage, stringField } from "@/lib/api";
import { addCartItem, readCart, updateCartItemById } from "@/lib/cart";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readCart());
}

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body) return NextResponse.json(statusMessage(false, "Send a JSON object."), { status: 400 });
  const result = await addCartItem({
    productId: stringField(body, "productId"),
    variantId: stringField(body, "variantId"),
    quantity: numberField(body, "quantity", 1),
  });
  if (result.error) return NextResponse.json(statusMessage(false, result.error), { status: 400 });
  return NextResponse.json(statusMessage(true, "Added to cart."));
}

export async function PATCH(request: Request) {
  const body = await readJsonObject(request);
  if (!body) return NextResponse.json(statusMessage(false, "Send a JSON object."), { status: 400 });
  await updateCartItemById(stringField(body, "itemId"), numberField(body, "quantity", 1));
  return NextResponse.json(statusMessage(true, "Cart updated."));
}
