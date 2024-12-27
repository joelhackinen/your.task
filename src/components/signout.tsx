"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export const SignOutComponent = ({
  signOutAction
}: {
  signOutAction: () => Promise<void>
}) => (
    <form action={signOutAction}>
      <SignOutButton />
    </form>
  );

const SignOutButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} size="icon">
      <LogOut />
    </Button>
  );
};