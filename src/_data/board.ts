import { db } from "@/db";
import { cards, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getCards = cache(async (boardId: string) => (
  await db.select().from(cards).where(eq(cards.boardId, boardId))
));

export const getTasks = cache(async (cardId: string) => (
  await db.select().from(tasks).where(eq(tasks.cardId, cardId))
));