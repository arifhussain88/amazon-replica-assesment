export function priceBounds(product: {
  priceCents: number;
  variants: { priceCents: number | null }[];
}) {
  const amounts = [
    product.priceCents,
    ...product.variants.map((variant) => variant.priceCents ?? product.priceCents),
  ];
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  return { min, max, varies: min !== max };
}

export function stockFor(
  product: { stock: number; variants: { id: string; stock: number }[] },
  variantId?: string | null,
) {
  if (product.variants.length === 0) return product.stock;
  if (!variantId) return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
  return product.variants.find((variant) => variant.id === variantId)?.stock ?? 0;
}
