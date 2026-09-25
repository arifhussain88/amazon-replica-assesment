import { NextResponse } from "next/server";
import { statusMessage } from "@/lib/api";
import { removeCartItemById } from "@/lib/cart";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, context: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await context.params;
  await removeCartItemById(itemId);
  return NextResponse.json(statusMessage(true, "Removed from cart."));
}
