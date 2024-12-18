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
import { joinBoardAction } from "./actions";

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
            <Button className="w-36" variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export type JoinBoardActionState = {
  data?: {
    name: FormDataEntryValue,
    password: FormDataEntryValue,
  },
  errors?: {
    name?: string[],
    password?: string[],
  },
  message?: string,
};

const JoinBoardForm = ({ className }: React.ComponentProps<"form">) => {
  const [state, createBoard, pending] = React.useActionState(joinBoardAction, {});
  
  return (
    <form className={cn("grid items-start gap-4", className)} action={createBoard}>
      <div className="grid gap-2">
        <Label htmlFor="boardName">Board link</Label>
        <Input id="boardName" name="name" autoComplete="off" />
        {state?.errors?.name &&
          <p className="text-red-500 text-sm">{state.errors.name}</p>
        }
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" name="password" autoComplete="off" />
        {state?.errors?.password &&
          <p className="text-red-500 text-sm">{state.errors.password}</p>
        }
      </div>
      <Button className="grid [grid-template-areas:'stack'] w-fit" type="submit">
        <span className={cn("[grid-area:stack]", pending && "invisible")}>Create🚀</span>
        <span className={cn("[grid-area:stack]", !pending && "invisible")}>Creating a board...</span>
      </Button>
    </form>
  );
};