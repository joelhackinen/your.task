"use client";

import { useState, type ReactNode } from "react";
import { CardsContext } from "./cards-context";
import type { CardType } from "@/_lib/db/schema";

// Provider component implementation
export const CardsContextProvider = ({ initialCards, children }: { initialCards: CardType[], children: ReactNode}) => {
  const [cards, setCards] = useState<CardType[]>(initialCards);

  return (
    <CardsContext.Provider value={{ cards, setCards }}>
      {children}
    </CardsContext.Provider>
  );
};