"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { signUpAction } from "./actions";
import { InputErrors } from "@/components/input-errors";
import { FormError } from "@/components/form-error";
import { SubmitButton } from "@/components/submit-button";

export const SignUpForm = () => {
  const [state, signUp] = useActionState(signUpAction, undefined);

  const formError = !state?.success ? state?.formError : undefined;

  return (
    <form className="space-y-2" action={signUp}>
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" defaultValue={state?.inputs.username} autoComplete="off" />
        {!state?.success && <InputErrors errors={state?.fieldErrors?.username} />}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" defaultValue={state?.inputs.password} autoComplete="off" />
        {!state?.success && <InputErrors errors={state?.fieldErrors?.password} />}
      </div>
      {formError && <FormError error={formError} />}
      <SubmitButton text="Sign up🚀" pendingText="Signing up..." />
    </form>
  );
};