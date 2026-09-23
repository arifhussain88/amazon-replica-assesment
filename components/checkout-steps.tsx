import Link from "next/link";

export function CheckoutSteps({ current }: { current: "delivery" | "payment" }) {
  return (
    <ol className="mb-4 flex gap-4 text-sm">
      <li>
        <Link href="/checkout" className={current === "delivery" ? "font-semibold" : "text-[#1a5276]"}>
          1. Delivery
        </Link>
      </li>
      <li className={current === "payment" ? "font-semibold" : "text-neutral-500"}>2. Payment</li>
    </ol>
  );
}
