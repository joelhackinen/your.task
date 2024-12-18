"use client"

import * as React from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "@/_lib/utils";

export const JoinBoardDrawer = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Join Existing</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Join to an existing task board</DrawerTitle>
          <DrawerDescription>
            Use the link of the board to join. You may leave the password empty if the board is public.
          </DrawerDescription>
        </DrawerHeader>
        <JoinBoardForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const JoinBoardForm = ({ className }: React.ComponentProps<"form">) => {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="boardName">Board link</Label>
        <Input id="boardName" placeholder="your.task/example" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" autoComplete="off" />
      </div>
      <Button type="submit">Join 🚀</Button>
    </form>
  );
};