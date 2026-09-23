import "server-only";

import { cookies } from "next/headers";
import { addressSchema, type AddressInput } from "@/lib/validators";

const DRAFT_COOKIE = "nl_delivery";

export async function saveDeliveryDraft(address: AddressInput) {
  const jar = await cookies();
  jar.set(DRAFT_COOKIE, JSON.stringify(address), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
}

export async function readDeliveryDraft(): Promise<AddressInput | null> {
  const jar = await cookies();
  const raw = jar.get(DRAFT_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = addressSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function clearDeliveryDraft() {
  const jar = await cookies();
  jar.delete(DRAFT_COOKIE);
}
