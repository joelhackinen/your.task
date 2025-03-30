import type { SelectCard } from "@/_lib/db/schema/cards";
import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

interface CardsContextType {
  cards: SelectCard[];
  setCards: Dispatch<SetStateAction<SelectCard[]>>;
}

export const CardsContext = createContext<CardsContextType | undefined>(undefined);

export const useCards = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error("useCards must be used within a useCardsProvider");
  }
  return context;
};
