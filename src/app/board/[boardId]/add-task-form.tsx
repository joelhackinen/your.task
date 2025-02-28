"use client";

import type { ActionState } from "@/_lib/definitions";
import { cn } from "@/_lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CardType } from "@/_lib/db/schema";
import { type ComponentRef, useActionState, useEffect, useRef } from "react";
import { addTaskAction } from "./actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export type AddTaskActionState = ActionState<{
  title: string;
  cardId: string;
  description: string;
  keepAdding: string | null;
}>;

export const AddTaskForm = ({
  cards,
  cardId,
}: {
  cards: CardType[],
  cardId: string,
}) => {
  const closeDialogRef = useRef<ComponentRef<typeof DialogClose>>(null);
  const [state, addTask, pending] = useActionState(addTaskAction, undefined);
  const cardName = cards.find(c => c.id === cardId)?.title;
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.message,
      });
      if (!state.data?.keepAdding) closeDialogRef.current?.click();
    }
  }, [state, toast]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" aria-label={`Add new task to ${cardName}`}>
            <PlusCircle />
            <span>Add item</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a task</DialogTitle>
            <DialogDescription>
              Some placeholder text for now
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-2" action={addTask}>
            <div>
              <Label className="font-semibold" htmlFor="cardId">Card</Label>
              <Select defaultValue={state?.data?.cardId as string || cardId} name="cardId">
                <SelectTrigger id="cardId">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>{card.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold" htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={state?.data?.title as string} />
              {state?.errors?.title &&
                <p className="text-red-500 text-sm">{state.errors.title}</p>
              }
            </div>
            <div>
              <Label className="font-semibold" htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={state?.data?.description as string} />
            </div>
            <div className="flex items-center gap-2">
              <input id="keep-adding" type="checkbox" name="keep-adding" defaultChecked={!!state?.data?.keepAdding} />
              <Label htmlFor="keep-adding" className="font-semibold">Keep adding</Label>
            </div>
            <div className="flex justify-between items-center">
              <Button className="grid [grid-template-areas:'stack'] w-fit" type="submit">
                <span className={cn("[grid-area:stack]", pending && "invisible")}>Add🚀</span>
                <span className={cn("[grid-area:stack]", !pending && "invisible")}>Adding...</span>
              </Button>
              <DialogClose asChild ref={closeDialogRef}>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};