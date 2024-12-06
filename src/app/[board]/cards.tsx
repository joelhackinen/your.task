import * as React from "react";
import type { CardType } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardsProps {
  cardsPromise: Promise<CardType[]>;
}

export const Cards = ({ cardsPromise}: CardsProps) => {
  const cards = React.use(cardsPromise);

  return (
    <div className="w-full flex gap-4">
      {cards.map((c) => (
        <Card key={c.id}>
          <CardHeader>
            <CardTitle>
              {c.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            tasks here
          </CardContent>
        </Card>
      ))}
    </div>
  );
};