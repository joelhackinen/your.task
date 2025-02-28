"use client";

import type { CardType } from "@/_lib/db/schema";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useState, type ComponentProps } from "react";

export const EditableCardTitle = ({
  card
}: {
  card: CardType
} & ComponentProps<typeof CardTitle>) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <CardTitle className="w-full m-0">
      {
        isEditing
          ? (
              <form className="flex items-center justify-between">
                <Input className="p-1" defaultValue={card.title} />
                <Button className="size-6" variant="ghost" size="icon">
                  <CheckIcon />
                </Button>
                <Button className="size-6" variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                  <XIcon />
                </Button>
              </form>
          )
          : (
              <div className="flex items-center justify-between">
                <div>{card.title}</div>
                <Button className="shrink-0" variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                  <PencilIcon />
                </Button>
              </div>
          )
      }
    </CardTitle>
  );
};