import type { Metadata } from "next";
import { OrderSummary } from "@/components/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getOrderForViewer } from "@/lib/queries";

export const metadata: Metadata = { title: "Your orders" };

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";
  const order = typeof params.order === "string" ? params.order : "";
  const record = email && order ? await getOrderForViewer(order.trim(), email.trim()) : null;
  const lookedUp = Boolean(email || order);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your orders</h1>
        <p className="mt-1 text-sm text-neutral-600">Look up a guest order with the email and order number from checkout. No account needed.</p>
      </div>
      <form action="/orders" className="grid max-w-xl gap-3 rounded-md bg-white p-5 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={email} required />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label htmlFor="order">Order number</Label>
          <Input id="order" name="order" defaultValue={order} placeholder="NL-########" required />
        </div>
        <Button type="submit" className="sm:col-span-2">
          Find order
        </Button>
      </form>
      {lookedUp && !record ? <p className="text-sm text-[#b12704]">No order matched that email and order number.</p> : null}
      {record ? <OrderSummary order={record} /> : null}
    </div>
  );
}
