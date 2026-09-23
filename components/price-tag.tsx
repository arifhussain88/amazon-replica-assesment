import { formatMoney } from "@/lib/money";
import { priceBounds } from "@/lib/pricing";

export function PriceTag({
  priceCents,
  compareAtPriceCents,
  variants = [],
  selectedPriceCents,
}: {
  priceCents: number;
  compareAtPriceCents?: number | null;
  variants?: { priceCents: number | null }[];
  selectedPriceCents?: number;
}) {
  const bounds = priceBounds({ priceCents, variants });
  const amount = selectedPriceCents ?? bounds.min;
  const showFrom = selectedPriceCents == null && bounds.varies;
  const compare = compareAtPriceCents && compareAtPriceCents > amount ? compareAtPriceCents : null;
  return (
    <p className="flex min-h-7 flex-wrap items-baseline gap-2">
      {showFrom ? <span className="text-sm text-neutral-600">From</span> : null}
      <span className="text-lg font-semibold">{formatMoney(amount)}</span>
      {compare ? <span className="text-sm text-neutral-500 line-through">{formatMoney(compare)}</span> : null}
    </p>
  );
}
