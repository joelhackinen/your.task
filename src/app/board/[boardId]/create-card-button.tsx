"use client";

import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { createCardAction } from "./actions";

export const CreateCardButton = ({
  boardId,
}: {
  boardId: string,
}) => (
    <Button
      className="relative h-full w-8"
      variant="outline"
      aria-label="New card"
      onClick={() => createCardAction(boardId)}
    >
      <PlusCircleIcon className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
    </Button>
  );