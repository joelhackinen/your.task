"use client";

import { useState, useActionState, useRef, type ComponentRef, type ComponentProps, type RefObject, useEffect } from "react";

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
import { createBoardAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import type { ActionState } from "@/_lib/definitions";

export const CreateBoardDrawer = () => {
  const [open, setOpen] = useState(false);

  const drawerTriggerRef = useRef<ComponentRef<typeof DrawerTrigger>>(null!);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild ref={drawerTriggerRef}>
        <Button>Create New</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create a new task board</DrawerTitle>
          <DrawerDescription>
            Give it a name and share your tasks with others!
          </DrawerDescription>
        </DrawerHeader>
        <CreateBoardForm className="px-4" drawerRef={drawerTriggerRef} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button className="w-36" variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export type CreateBoardActionState = ActionState<{
  name: string;
  password: string;
}>;

interface CreateBoardFormProps extends ComponentProps<"form"> {
  drawerRef: RefObject<HTMLButtonElement>
}

const CreateBoardForm = ({
  className,
  drawerRef,
}: CreateBoardFormProps) => {
  const [state, createBoard, pending] = useActionState(createBoardAction, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.message,
      });
      drawerRef.current.click();
    }
  }, [state, toast, drawerRef]);

  return (
    <form
      action={createBoard}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="boardName">Board name</Label>
        <Input name="name" id="boardName" placeholder="your.task" defaultValue={state?.data?.name as string} autoComplete="off" />
        {state?.errors?.name &&
          <p className="text-red-500 text-sm">{state.errors.name}</p>
        }
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Protect the board with password (leave empty if not needed)</Label>
        <Input name="password" type="password" id="password" defaultValue={state?.data?.password as string} autoComplete="off" />
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