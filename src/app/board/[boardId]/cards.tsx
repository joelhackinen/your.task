import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTaskForm } from "./add-task-form";
import { Tasks } from "./tasks";
import { cn } from "@/_lib/utils";
import { getCards } from "@/_data/board";
import { CardsContextProvider } from "./cards-provide";
import { CreateCardButton } from "./create-card-button";

interface CardsProps extends React.ComponentProps<"div"> {
  className: string;
  params: Promise<{ boardId: string }>,
}

export const Cards = async ({ params, className }: CardsProps) => {
  const boardId = (await params).boardId;
  const cards = await getCards(boardId);

  return (
    <div className={cn("flex gap-4 overflow-y-auto", className)}>
      <CardsContextProvider initialCards={cards}>
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
      </CardsContextProvider>
      <CreateCardButton boardId={boardId} />
    </div>
  );
};