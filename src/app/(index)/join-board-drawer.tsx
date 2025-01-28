"use client";

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
import type { ActionState } from "@/_lib/definitions";
import { useActionState, useEffect, useRef, useState, type ComponentProps, type ComponentRef, type RefObject } from "react";
import { useToast } from "@/hooks/use-toast";

export const JoinBoardDrawer = () => {
  const [open, setOpen] = useState(false);
    const drawerTriggerRef = useRef<ComponentRef<typeof DrawerTrigger>>(null!);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger ref={drawerTriggerRef} asChild>
        <Button>Join Existing</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Join to an existing task board</DrawerTitle>
          <DrawerDescription>
            Use the link of the board to join. You may leave the password empty if the board is public.
          </DrawerDescription>
        </DrawerHeader>
        <JoinBoardForm className="px-4" drawerRef={drawerTriggerRef} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button className="w-36" variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export type JoinBoardActionState = ActionState<{
  id: string;
  password: string;
}>;

interface JoinBoardFormProps extends ComponentProps<"form"> {
  drawerRef: RefObject<HTMLButtonElement>
}

const JoinBoardForm = ({ className, drawerRef }: JoinBoardFormProps) => {
  const [state, joinBoard, pending] = useActionState(joinBoardAction, undefined);
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
    <form className={cn("grid items-start gap-4", className)} action={joinBoard}>
      <div className="grid gap-2">
        <Label htmlFor="boardIdField">Board ID</Label>
        <Input id="boardIdField" name="id" defaultValue={state?.data?.id as string} autoComplete="off" />
        {state?.errors?.id &&
          <p className="text-red-500 text-sm">{state.errors.id}</p>
        }
      </div>
      <div className="grid gap-2">
        <Label htmlFor="boardPasswordField">Password</Label>
        <Input type="password" id="boardPasswordField" name="password" defaultValue={state?.data?.password as string} autoComplete="off" />
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