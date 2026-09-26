import { formatMoney } from "@/lib/money";
import { cardSurface } from "@/components/ui/card";
import type { OrderRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OrderSummary({ order }: { order: OrderRecord }) {
  const placed = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(order.createdAt));
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Order {order.orderNumber}</p>
        <h1 className="text-2xl font-semibold">Thanks, {order.fullName.split(" ")[0]}. Your order is placed.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A confirmation is stored for {order.email}. Placed {placed}. Status: {order.status}.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={cn(cardSurface, "p-5")}>
          <h2 className="font-semibold">Ship to</h2>
          <p className="mt-2 text-sm leading-6">
            {order.fullName}
            <br />
            {order.line1}
            <br />
            {order.city}, {order.region} {order.postalCode}
            <br />
            {order.country}
          </p>
        </section>
        <section className={cn(cardSurface, "p-5 text-sm")}>
          <h2 className="font-semibold">Total</h2>
          <dl className="mt-2 space-y-1">
            <div className="flex justify-between">
              <dt>Items</dt>
              <dd>{formatMoney(order.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{order.shippingCents === 0 ? "Free" : formatMoney(order.shippingCents)}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt>Order total</dt>
              <dd>{formatMoney(order.totalCents)}</dd>
            </div>
          </dl>
        </section>
      </div>
      <ul className={cn(cardSurface, "divide-y divide-border")}>
        {order.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-4 p-4 text-sm">
            <span>
              <span className="font-medium">{item.name}</span>
              {item.variantLabel ? <span className="block text-neutral-500">{item.variantLabel}</span> : null}
              <span className="block text-neutral-500">Qty {item.quantity}</span>
            </span>
            <span>{formatMoney(item.unitPriceCents * item.quantity)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
