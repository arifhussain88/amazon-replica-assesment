"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { placeOrderFromCart } from "@/lib/checkout";
import { saveDeliveryDraft } from "@/lib/checkout-draft";
import { addressSchema } from "@/lib/validators";

export type CheckoutState = {
  error?: string;
};

export async function saveDelivery(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in before checkout." };
  const parsed = addressSchema.safeParse({
    fullName: formData.get("fullName"),
    line1: formData.get("line1"),
    city: formData.get("city"),
    region: formData.get("region"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the address and try again." };
  }
  await saveDeliveryDraft(parsed.data);
  redirect("/checkout/payment");
}

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const result = await placeOrderFromCart({
    payment: {
      cardName: formData.get("cardName"),
      cardNumber: formData.get("cardNumber"),
      expiry: formData.get("expiry"),
      cvc: formData.get("cvc"),
    },
  });
  if ("error" in result) return { error: result.error };
  redirect(`/orders/${result.orderNumber}`);
}
