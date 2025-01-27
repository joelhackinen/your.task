import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTaskForm } from "./add-task-form";
import { Tasks } from "./tasks";
import { cn } from "@/_lib/utils";
import { getCards } from "@/_data/board";

interface CardsProps extends React.ComponentProps<"div"> {
  className: string;
  params: Promise<{ boardId: string }>,
}

export const Cards = async ({ params, className }: CardsProps) => {
  const boardId = (await params).boardId;
  const cards = await getCards(boardId);

  return (
    <div className={cn("flex gap-4 overflow-y-auto", className)}>
      {cards.map((c) => (
        <Card className="flex-1 min-w-52 overflow-y-auto" key={c.id}>
          <CardHeader className="flex flex-row justify-between items-center sticky top-0 backdrop-blur-xs">
            <CardTitle>
              {c.title}
            </CardTitle>
            <AddTaskForm cards={cards} cardId={c.id} />
          </CardHeader>
          <CardContent className="overflow-y-auto px-4">
            <Tasks card={c} />
          </CardContent>
        </Card>
      ))}
      <Button className="relative h-full w-10" variant="outline" size="icon" aria-label="New card">
        <PlusCircle className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
      </Button>
    </div>
  );
};