import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { AccountForms } from "@/components/account-forms";
import { Button } from "@/components/ui/button";
import { getCurrentUser, safeNextPath } from "@/lib/auth";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const nextPath = safeNextPath(typeof params.next === "string" ? params.next : "/orders");
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="max-w-lg space-y-4 rounded-md bg-white p-5">
        <h1 className="text-2xl font-semibold">Hello, {user.name.split(" ")[0]}</h1>
        <p className="text-sm text-neutral-600">Signed in as {user.email}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/orders">Order history</Link>
          </Button>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Your account</h1>
        <p className="mt-1 text-sm text-neutral-600">Sign in to check out and see your orders.</p>
      </div>
      <AccountForms nextPath={nextPath} />
    </div>
  );
}
