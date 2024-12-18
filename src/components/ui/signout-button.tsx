"use client"

import { LogOut } from "lucide-react";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";

export const SignOutButton = ({
  signOutAction
}: {
  signOutAction: () => Promise<void>
}) => {
  const { toast } = useToast();

  const handleClick = async () => {
    const { id, update } = toast({ title: "You are being logged out" });
    await signOutAction();
    update({ id, title: "You have been logged out" });
  ;}

  return (
    <Button onClick={handleClick} size="icon">
      <LogOut />
    </Button>
  );
};