"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearSession, createSession, hashPassword, safeNextPath, verifyPassword } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export type AuthState = { error?: string };

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const db = await getDb();
  const rows = await db.select().from(users).where(eq(users.email, parsed.data.email.toLowerCase())).limit(1);
  const user = rows[0];
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return { error: "Email or password does not match." };
  }
  await createSession(user.id);
  revalidatePath("/", "layout");
  redirect(safeNextPath(String(formData.get("next") ?? "")));
}

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentials
    .extend({ name: z.string().trim().min(2, "Enter your name.") })
    .safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const db = await getDb();
  const email = parsed.data.email.toLowerCase();
  let existing: { id: string }[];
  try {
    existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  } catch {
    return { error: "Accounts are not ready yet. Reload the page and try again." };
  }
  if (existing.length > 0) return { error: "An account with that email already exists. Sign in instead." };

  const id = crypto.randomUUID();
  try {
    await db.insert(users).values({
      id,
      name: parsed.data.name,
      email,
      passwordHash: hashPassword(parsed.data.password),
      createdAt: new Date(),
    });
  } catch {
    return { error: "Could not create the account. Try a different email." };
  }
  await createSession(id);
  revalidatePath("/", "layout");
  redirect(safeNextPath(String(formData.get("next") ?? "")));
}

export async function signOut() {
  await clearSession();
  revalidatePath("/", "layout");
  redirect("/");
}
