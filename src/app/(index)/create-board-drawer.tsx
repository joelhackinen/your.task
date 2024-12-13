"use client"

import { useState, useActionState } from "react";

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
import { cn } from "@/lib/utils";
import { createBoardAction } from "./actions";

export const CreateBoardDrawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Create New</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create a new task board</DrawerTitle>
          <DrawerDescription>
            Give it a name and share your tasks with others!
          </DrawerDescription>
        </DrawerHeader>
        <CreateBoardForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button className="w-36" variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};


const CreateBoardForm = ({ className }: React.ComponentProps<"form">) => {
  const [_message, createBoard, pending] = useActionState(createBoardAction, "");
  return (
    <form
      action={createBoard}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="boardName">Board name</Label>
        <Input name="name" id="boardName" defaultValue="your.task" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Protect the board with password (leave empty if not needed)</Label>
        <Input name="password" type="password" id="password" autoComplete="off" />
      </div>
      <Button className="grid [grid-template-areas:'stack'] w-fit" type="submit">
        <span className={cn("[grid-area:stack]", pending && "invisible")}>Create🚀</span>
        <span className={cn("[grid-area:stack]", !pending && "invisible")}>Creating a board...</span>
      </Button>
    </form>
  );
};