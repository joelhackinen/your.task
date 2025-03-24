"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/_lib/utils";
import { useActionState } from "react";
import { loginAction } from "./actions";
import { InputErrors } from "@/components/input-errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export const LoginForm = () => {
  const [state, login, pending] = useActionState(loginAction, undefined);

  const fieldErrors = !state?.success ? state?.fieldErrors : undefined;
  const formError = !state?.success ? state?.formError : undefined;
  const inputs = !state?.success ? state?.inputs : undefined;
  
  return (
    <form className="space-y-2" action={login}>
      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" defaultValue={inputs?.username as string} autoComplete="off" />
        <InputErrors errors={fieldErrors?.username} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" defaultValue={inputs?.password as string} autoComplete="off" />
        <InputErrors errors={fieldErrors?.password} />
      </div>
      <Alert variant="destructive" className={cn(!formError && "hidden")}>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {formError}
        </AlertDescription>
      </Alert>
      <Button className="grid [grid-template-areas:'stack']">
        <span className={cn("[grid-area:stack]", pending && "invisible")}>
          Log In🚀
        </span>
        <span className={cn("[grid-area:stack]", !pending && "invisible")}>
          Logging in...
        </span>
      </Button>
    </form>
  );
};