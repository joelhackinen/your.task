"use client";

import { Button } from "@/components/ui/button";
import { Ellipsis, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/_lib/utils";
import { deleteTaskAction, moveCardAction } from "./actions";
import { CardsContext } from "./cards-context";
import { use } from "react";
import type { SelectTask } from "@/_lib/db/schema/tasks";

export const Task = ({
  task,
}: {
  task: SelectTask,
}) => {
  const cards = use(CardsContext);

  return (
    <li className={cn(
      "flex justify-between items-center px-1 group h-[40px] rounded-md",
      "hover:bg-gray-100 has-data-[state=open]:bg-gray-100",
    )}>
      <div className="truncate">{task.title}</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="group-hover:visible data-[state=open]:visible invisible hover:text-blue-500"
            variant="ghost"
            size="icon"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="sr-only">My Account</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to...</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex flex-col">
                {cards?.cards.map((card) => (
                  card.id === task.cardId
                    ? null
                    : (
                      <Button key={card.id} asChild variant="ghost" className="h-fit" onClick={() => moveCardAction(task.cardId, card.id, task.id)}>
                        <DropdownMenuItem>{card.title}</DropdownMenuItem>
                      </Button>
                    )
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <Button asChild variant="ghost" className="h-fit" onClick={() => deleteTaskAction(task.id, task.cardId)}>
            <DropdownMenuItem className="flex items-center justify-between">
              <span>Delete</span>
              <Trash className="text-red-500" />
            </DropdownMenuItem>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};
