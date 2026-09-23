export const STORE_NAME = "Northline";

export const FREE_SHIPPING_CENTS = 3500;
export const SHIPPING_CENTS = 599;

export function shippingCents(subtotalCents: number) {
  return subtotalCents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
}
