"use server";

import { addCartItem, removeCartItemById, updateCartItemById, type CartMutationResult } from "@/lib/cart";

export type CartActionState = CartMutationResult;

export async function addToCart(_prev: CartActionState, formData: FormData): Promise<CartActionState> {
  return addCartItem({
    productId: String(formData.get("productId") ?? ""),
    variantId: String(formData.get("variantId") ?? ""),
    quantity: Number(formData.get("quantity") ?? 1),
  });
}

export async function updateCartItem(formData: FormData) {
  await updateCartItemById(String(formData.get("itemId") ?? ""), Number(formData.get("quantity") ?? 1));
}

export async function removeCartItem(formData: FormData) {
  await removeCartItemById(String(formData.get("itemId") ?? ""));
}
