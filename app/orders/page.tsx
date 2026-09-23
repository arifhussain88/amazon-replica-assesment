import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { formatMoney } from "@/lib/money";
import { listOrdersForUser } from "@/lib/queries";

export const metadata: Metadata = { title: "Your orders" };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account?next=/orders");
  const orders = await listOrdersForUser(user.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Your orders</h1>
          <p className="mt-1 text-sm text-neutral-600">{user.email}</p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>
      {orders.length === 0 ? (
        <p className="rounded-md bg-white p-5 text-sm">
          No orders yet. <Link href="/search" className="text-[#1a5276]">Start shopping</Link>
        </p>
      ) : (
        <ul className="divide-y divide-[#e3e6e6] rounded-md border border-[#e3e6e6] bg-white">
          {orders.map((order) => (
            <li key={order.orderNumber} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
              <div>
                <Link href={`/orders/${order.orderNumber}`} className="font-semibold text-[#1a5276]">
                  {order.orderNumber}
                </Link>
                <p className="text-neutral-600">
                  {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(order.createdAt))} · {order.status}
                </p>
              </div>
              <p className="font-semibold">{formatMoney(order.totalCents)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
