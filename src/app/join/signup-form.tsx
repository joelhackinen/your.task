"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/_lib/utils";
import { useActionState } from "react";
import { signUpAction } from "./actions";
import type { ActionState } from "@/_lib/definitions";

export type SignUpActionState = ActionState<{
  username: string;
  password: string;
}>;

export const SignUpForm = () => {
  const [state, signUp, pending] = useActionState(signUpAction, undefined);

  return (
    <form className="space-y-2" action={signUp}>
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" defaultValue={state?.data?.username as string} autoComplete="off" />
        {state?.errors?.username &&
          <p className="text-red-500 text-sm">{state.errors.username}</p>
        }
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" defaultValue={state?.data?.password as string} autoComplete="off" />
        {state?.errors?.password &&
          <p className="text-red-500 text-sm">{state.errors.password}</p>
        }
      </div>
      <Button className="grid [grid-template-areas:'stack']">
        <span className={cn("[grid-area:stack]", pending && "invisible")}>
          Sign up🚀
        </span>
        <span className={cn("[grid-area:stack]", !pending && "invisible")}>
          Signing up...
        </span>
      </Button>
    </form>
  );
};