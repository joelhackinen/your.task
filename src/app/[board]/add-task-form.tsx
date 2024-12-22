import type { ActionState } from "@/_lib/definitions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

export type AddTaskActionState = ActionState<{
  title: string;
  description?: string;
}>;

export const AddTaskForm = ({
  cardId,
}: {
  cardId: string,
}) => {
  return (
    <form className="flex">
      <Input />
      <Button type="submit" variant="outline">
        <PlusCircle />
      </Button>
    </form>
  );
};