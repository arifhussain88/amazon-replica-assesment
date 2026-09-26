import Link from "next/link";

export function CheckoutSteps({ current }: { current: "delivery" | "payment" }) {
  return (
    <ol className="mb-4 flex gap-4 text-sm">
      <li>
        <Link href="/checkout" className={current === "delivery" ? "font-semibold" : "text-primary"}>
          1. Delivery
        </Link>
      </li>
      <li className={current === "payment" ? "font-semibold" : "text-muted-foreground"}>2. Payment</li>
    </ol>
  );
}
