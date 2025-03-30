"use client";

import { useState, type ReactNode } from "react";
import { CardsContext } from "./cards-context";
import type { SelectCard } from "@/_lib/db/schema/cards";

// Provider component implementation
export const CardsContextProvider = ({ initialCards, children }: { initialCards: SelectCard[], children: ReactNode}) => {
  const [cards, setCards] = useState<SelectCard[]>(initialCards);

  return (
    <CardsContext.Provider value={{ cards, setCards }}>
      {children}
    </CardsContext.Provider>
  );
};