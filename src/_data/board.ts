import { db } from "@/db";
import { cards } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getCards = async (boardId: string) => {
  return await db.select().from(cards).where(eq(cards.boardId, boardId));
};