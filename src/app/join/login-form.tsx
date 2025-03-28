"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { loginAction } from "./actions";
import { InputErrors } from "@/components/input-errors";
import { FormError } from "@/components/form-error";
import { SubmitButton } from "@/components/submit-button";

export const LoginForm = () => {
  const [state, login, _pending] = useActionState(loginAction, undefined);

  const formError = !state?.success ? state?.formError : undefined;
  
  return (
    <form className="space-y-2" action={login}>
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
      {formError && <FormError error={formError}/> }
      <SubmitButton text="Log In🚀" pendingText="Logging in..." />
    </form>
  );
};