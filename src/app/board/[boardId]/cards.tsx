import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AddTaskForm } from "./add-task-form";
import { Tasks } from "./tasks";
import { cn } from "@/_lib/utils";
import { getCards } from "@/_data/board";
import { CardsContextProvider } from "./cards-provide";
import { CreateCardButton } from "./create-card-button";
import { EditableCardTitle } from "./editable-card-title";

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
          <Card className="flex-1 flex flex-col min-w-52" key={c.id}>
            <CardHeader className="flex flex-row justify-between items-center sticky top-0 backdrop-blur-xs p-4">
              <EditableCardTitle card={c} />
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto px-4">
              <Tasks card={c} />
            </CardContent>
            <CardFooter className="border-t py-1 px-2 justify-start">
              <AddTaskForm cards={cards} cardId={c.id} />
            </CardFooter>
          </Card>
        ))}
      </CardsContextProvider>
      <CreateCardButton boardId={boardId} />
    </div>
  );
};