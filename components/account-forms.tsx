"use client";

import { useActionState, type ComponentProps } from "react";
import { register, signIn, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initial: AuthState = {};

export function AccountForms({ nextPath }: { nextPath: string }) {
  const [signInState, signInAction, signingIn] = useActionState(signIn, initial);
  const [registerState, registerAction, registering] = useActionState(register, initial);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={signInAction} className="space-y-3 rounded-md border border-[#e3e6e6] bg-white p-5">
        <h2 className="text-lg font-semibold">Sign in</h2>
        <input type="hidden" name="next" value={nextPath} />
        <Field label="Email" name="email" idPrefix="sign-in" type="email" autoComplete="email" />
        <Field label="Password" name="password" idPrefix="sign-in" type="password" autoComplete="current-password" />
        {signInState.error ? <p className="text-sm text-[#b12704]">{signInState.error}</p> : null}
        <Button type="submit" className="w-full" disabled={signingIn}>
          {signingIn ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <form action={registerAction} className="space-y-3 rounded-md border border-[#e3e6e6] bg-white p-5">
        <h2 className="text-lg font-semibold">Create account</h2>
        <input type="hidden" name="next" value={nextPath} />
        <Field label="Name" name="name" idPrefix="register" autoComplete="name" />
        <Field label="Email" name="email" idPrefix="register" type="email" autoComplete="email" />
        <Field label="Password" name="password" idPrefix="register" type="password" autoComplete="new-password" />
        <p className="text-xs text-neutral-600">At least 8 characters. This stays on this shop only.</p>
        {registerState.error ? <p className="text-sm text-[#b12704]">{registerState.error}</p> : null}
        <Button type="submit" variant="ink" className="w-full" disabled={registering}>
          {registering ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  idPrefix,
  ...props
}: { label: string; name: string; idPrefix: string } & ComponentProps<"input">) {
  const id = `${idPrefix}-${name}`;
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} required {...props} />
    </div>
  );
}
