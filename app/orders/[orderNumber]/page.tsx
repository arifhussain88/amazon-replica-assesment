import type { Metadata } from "next";
import Link from "next/link";
import { OrderSummary } from "@/components/order-summary";
import { cardSurface } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { recentOrderNumber } from "@/lib/cart";
import { getOrderForViewer } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Order" };

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const [user, recent, order] = await Promise.all([
    getCurrentUser(),
    recentOrderNumber(),
    getOrderForViewer(orderNumber),
  ]);
  const ownsOrder = Boolean(order && user && order.userId === user.id);
  const justPlaced = recent === orderNumber;
  if (!order || (!ownsOrder && !justPlaced)) {
    return (
      <div className={cn(cardSurface, "max-w-xl p-5")}>
        <h1 className="text-2xl font-semibold">Order not available</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with the account that placed this order to see it in your history.</p>
        <Link href="/orders" className="mt-4 inline-block text-sm text-primary">
          Your orders
        </Link>
      </div>
    );
  }

  return <OrderSummary order={order} />;
}