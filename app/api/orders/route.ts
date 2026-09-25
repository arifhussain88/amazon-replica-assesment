import { NextResponse } from "next/server";
import { readJsonObject } from "@/lib/api";
import { placeOrderFromCart } from "@/lib/checkout";
import { getOrderForViewer } from "@/lib/queries";

export const dynamic = "force-dynamic";

const addressKeys = ["fullName", "line1", "city", "region", "postalCode", "country"] as const;

export async function POST(request: Request) {
  const body = await readJsonObject(request);
  if (!body) return NextResponse.json({ error: "Send a JSON object." }, { status: 400 });

  const result = await placeOrderFromCart({
    address: addressPayload(body),
    payment: paymentPayload(body),
  });
  if ("error" in result) {
    const status = result.error === "Sign in before checkout." ? 401 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  const order = await getOrderForViewer(result.orderNumber);
  return NextResponse.json(order ?? { orderNumber: result.orderNumber }, { status: 201 });
}

function addressPayload(body: Record<string, unknown>) {
  const nested = record(body.address);
  const source = nested ?? body;
  const explicit = nested != null || addressKeys.some((key) => body[key] != null);
  if (!explicit) return undefined;
  return {
    fullName: source.fullName,
    line1: source.line1,
    city: source.city,
    region: source.region,
    postalCode: source.postalCode,
    country: source.country,
  };
}

function paymentPayload(body: Record<string, unknown>) {
  const source = record(body.payment) ?? body;
  return {
    cardName: source.cardName,
    cardNumber: source.cardNumber,
    expiry: source.expiry,
    cvc: source.cvc,
  };
}

function record(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}
