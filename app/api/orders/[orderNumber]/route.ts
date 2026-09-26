import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { recentOrderNumber } from "@/lib/cart";
import { getOrderForViewer } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await context.params;
  const [user, recent, order] = await Promise.all([
    getCurrentUser(),
    recentOrderNumber(),
    getOrderForViewer(orderNumber),
  ]);
  const ownsOrder = Boolean(order && user && order.userId === user.id);
  const justPlaced = recent === orderNumber;
  if (!order || (!ownsOrder && !justPlaced)) {
    return NextResponse.json({ error: "Order not available." }, { status: 404 });
  }
  return NextResponse.json(order);
}
