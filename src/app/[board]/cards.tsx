import * as React from "react";
import type { CardType } from "@/db/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTaskForm } from "./add-task-form";

interface CardsProps {
  cardsPromise: Promise<CardType[]>;
}

export const Cards = ({ cardsPromise }: CardsProps) => {
  const cards = React.use(cardsPromise);

  return (
    <div className="flex gap-4 h-96">
      {cards.map((c) => (
        <Card className="flex-1 relative" key={c.id}>
          <CardHeader>
            <CardTitle>
              {c.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            tasks here
          </CardContent>
          <CardFooter className="absolute bottom-0">
            <AddTaskForm cardId={c.id} />
          </CardFooter>
        </Card>
      ))}
      <Button className="relative h-full" variant="outline" size="icon">
        <PlusCircle className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
      </Button>
    </div>
  );
};