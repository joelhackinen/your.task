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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

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
  const [state, joinBoard, pending] = useActionState(joinBoardAction, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      if (state.message) {
        toast({
          title: state.message,
        });
      }
      drawerRef.current.click();
    }
  }, [state?.success, state?.message, toast, drawerRef]);

  const fieldErrors = !state?.success ? state?.fieldErrors : {};
  const inputs = !state?.success ? state?.inputs : {};
  const formError = !state?.success ? state?.formError : null;
  
  return (
    <form className={cn("grid items-start gap-4", className)} action={joinBoard}>
      <div className="grid gap-2">
        <Label htmlFor="boardIdField">Board ID</Label>
        <Input id="boardIdField" name="id" defaultValue={inputs?.id as string} autoComplete="off" />
        <InputErrors errors={fieldErrors?.id} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="boardPasswordField">Password</Label>
        <Input type="password" id="boardPasswordField" name="password" defaultValue={inputs?.password as string} autoComplete="off" />
        <InputErrors errors={fieldErrors?.password} />
      </div>
      <Alert variant="destructive" className={cn(!formError && "hidden")}>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {formError}
        </AlertDescription>
      </Alert>
      <Button className="grid [grid-template-areas:'stack'] w-fit" type="submit">
        <span className={cn("[grid-area:stack]", pending && "invisible")}>Create🚀</span>
        <span className={cn("[grid-area:stack]", !pending && "invisible")}>Creating a board...</span>
      </Button>
    </form>
  );
};