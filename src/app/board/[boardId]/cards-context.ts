import type { CardType } from "@/_lib/db/schema";
import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

// Define the shape of the context value
interface CardsContextType {
  cards: CardType[];
  setCards: Dispatch<SetStateAction<CardType[]>>;
}

// Create the context with a default value
export const CardsContext = createContext<CardsContextType | undefined>(undefined);

// Hook to use the StringListContext
export const useCards = () => {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error("useCards must be used within a useCardsProvider");
  }
  return context;
};
