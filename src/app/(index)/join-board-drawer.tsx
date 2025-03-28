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
import { useActionState, useEffect, useRef, useState, type ComponentProps, type ComponentRef, type RefObject } from "react";
import { useToast } from "@/hooks/use-toast";
import { InputErrors } from "@/components/input-errors";
import { FormError } from "@/components/form-error";
import { SubmitButton } from "@/components/submit-button";

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

interface JoinBoardFormProps extends ComponentProps<"form"> {
  drawerRef: RefObject<HTMLButtonElement>
}

const JoinBoardForm = ({ className, drawerRef }: JoinBoardFormProps) => {
  const [state, joinBoard, _pending] = useActionState(joinBoardAction, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Joined successfully",
      });
      drawerRef.current.click();
    }
  }, [state?.success, toast, drawerRef]);

  const formError = !state?.success ? state?.formError : null;
  
  return (
    <form className={cn("grid items-start gap-4", className)} action={joinBoard}>
      <div className="grid gap-2">
        <Label htmlFor="boardIdField">Board ID</Label>
        <Input id="boardIdField" name="id" defaultValue={state?.inputs.id} autoComplete="off" />
        {!state?.success && <InputErrors errors={state?.fieldErrors?.id} />}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="boardPasswordField">Password</Label>
        <Input type="password" id="boardPasswordField" name="password" defaultValue={state?.inputs.password} autoComplete="off" />
        {!state?.success && <InputErrors errors={state?.fieldErrors?.password} />}
      </div>
      {formError && <FormError error={formError} />}
      <SubmitButton className="w-36" text="Create🚀" pendingText="Creating a board..." />
    </form>
  );
};