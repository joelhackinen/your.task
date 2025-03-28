"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CardType } from "@/_lib/db/schema";
import { useActionState, useEffect } from "react";
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
import { InputErrors } from "@/components/input-errors";
import { SubmitButton } from "@/components/submit-button";


export const AddTaskForm = ({
  cards,
  cardId,
}: {
  cards: CardType[],
  cardId: string,
}) => {
  const [state, addTask, _pending] = useActionState(addTaskAction, undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.success) {
      toast({
        title: `Added ${state.inputs.title} succesfully`,
      });
    }
  }, [state?.success, state?.inputs.title, toast]);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" aria-label={`Add new task`} >
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
              <Select defaultValue={state?.inputs.cardId || cardId} name="cardId">
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
              <Input id="title" name="title" defaultValue={state?.inputs.title} />
              {!state?.success && <InputErrors errors={state?.fieldErrors?.title} />}
            </div>
            <div>
              <Label className="font-semibold" htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={state?.inputs.description} />
            </div>
            <div className="flex justify-between items-center">
              <SubmitButton text="Add🚀" pendingText="Adding..." />
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};