import type { Metadata } from "next";
import Link from "next/link";
import { OrderSummary } from "@/components/order-summary";
import { recentOrderNumber } from "@/lib/cart";
import { getOrderForViewer } from "@/lib/queries";

export const metadata: Metadata = { title: "Order confirmation" };

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { orderNumber } = await params;
  const query = await searchParams;
  const email = typeof query.email === "string" ? query.email : "";
  const recent = await recentOrderNumber();
  const allowed = recent === orderNumber;
  const order = allowed || email ? await getOrderForViewer(orderNumber, allowed ? undefined : email) : null;

  if (!order) {
    return (
      <div className="max-w-xl rounded-md bg-white p-5">
        <h1 className="text-2xl font-semibold">Find this order</h1>
        <p className="mt-2 text-sm text-neutral-600">Enter the email used at checkout to view order {orderNumber}.</p>
        <form action={`/orders/${orderNumber}`} className="mt-4 space-y-3">
          <input name="email" type="email" required placeholder="Email" className="h-10 w-full rounded-md border border-[#888] px-3" />
          <button type="submit" className="h-10 rounded-md bg-[#f5b942] px-4 text-sm font-medium">
            View order
          </button>
        </form>
        <Link href="/orders" className="mt-4 inline-block text-sm text-[#1a5276]">
          Look up a different order
        </Link>
      </div>
    );
  }

  return <OrderSummary order={order} />;
}
