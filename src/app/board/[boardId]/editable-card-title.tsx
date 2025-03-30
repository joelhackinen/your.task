"use client";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { editCardTitleAction } from "./actions";
import type { SelectCard } from "@/_lib/db/schema/cards";

export const EditableCardTitle = ({
  card
}: {
  card: SelectCard,
} & ComponentProps<typeof CardTitle>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(card.title);

  const handleSubmit = async () => {
    await editCardTitleAction(card.id, newTitle);
    setIsEditing(false);
  };

  return (
    <CardTitle className="w-full m-0">
      <div className="flex items-center justify-between">
      {
        isEditing
          ? (
              <>
                <Input className="p-1" name="newTitle" value={newTitle} onChange={(e) => setNewTitle(e.currentTarget.value)} />
                <Button className="size-6" variant="ghost" size="icon" onClick={handleSubmit} aria-label="Save title">
                  <CheckIcon />
                </Button>
                <Button className="size-6" variant="ghost" size="icon" onClick={() => setIsEditing(false)} aria-label="Cancel editing">
                  <XIcon />
                </Button>
              </>
          )
          : (
              <>
                <div>{card.title}</div>
                <Button className="shrink-0" variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="Edit title">
                  <PencilIcon />
                </Button>
              </>
          )
      }
      </div>
    </CardTitle>
  );
};