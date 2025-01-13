"use client";

import { Button } from "@/components/ui/button";
import type { TaskType } from "@/_lib/db/schema";
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

export const Task = ({
  task,
}: {
  task: TaskType
}) => (
    <li className={cn(
      "flex justify-between items-center px-1 group h-[40px] rounded-md",
      "hover:bg-gray-100 has-[[data-state=open]]:bg-gray-100",
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
              <DropdownMenuSubContent>
                <DropdownMenuItem>Doing</DropdownMenuItem>
                <DropdownMenuItem>Done</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center justify-between">
            <div>Delete</div>
            <Trash className="text-red-500" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
