import type { CardType } from "@/_lib/db/schema";
import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

interface CardsContextType {
  cards: CardType[];
  setCards: Dispatch<SetStateAction<CardType[]>>;
}

export const CardsContext = createContext<CardsContextType | undefined>(undefined);

export const useCards = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error("useCards must be used within a useCardsProvider");
  }
  return context;
};
