import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient name."),
  line1: z.string().trim().min(4, "Enter a street address."),
  city: z.string().trim().min(2, "Enter a city."),
  region: z.string().trim().min(2, "Enter a state or region."),
  postalCode: z.string().trim().min(3, "Enter a postal code.").max(12),
  country: z.enum(["United States", "Canada", "United Kingdom"]),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const paymentSchema = z.object({
  cardName: z.string().trim().min(2, "Enter the name on the card."),
  cardNumber: z.string().trim().min(1, "Enter a card number."),
  expiry: z.string().trim().min(1, "Enter an expiration date."),
  cvc: z.string().trim().min(1, "Enter a security code."),
});

export function cardError(input: { cardNumber: string; expiry: string; cvc: string }) {
  const digits = input.cardNumber.replace(/\s+/g, "");
  if (!/^\d{15,16}$/.test(digits) || !luhnValid(digits)) {
    return "Enter a valid card number. 4242 4242 4242 4242 works for this demo.";
  }
  if (!expiryValid(input.expiry)) {
    return "Enter an expiration date as MM/YY that has not passed.";
  }
  if (!/^\d{3,4}$/.test(input.cvc)) {
    return "Enter a 3 or 4 digit security code.";
  }
  return null;
}

function luhnValid(num: string) {
  let sum = 0;
  let alternate = false;
  for (let index = num.length - 1; index >= 0; index -= 1) {
    let digit = Number(num[index]);
    if (Number.isNaN(digit)) return false;
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function expiryValid(value: string) {
  const match = /^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const end = new Date(year, month, 1);
  return end > new Date();
}
