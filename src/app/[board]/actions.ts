"use server"

import { db } from "@/db"; 
import { boards, cards, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getBoardAction = async (boardId: string) => {
  return (await db.select().from(boards).where(eq(boards.id, boardId)))[0];
};

export const getCardsAction = async (boardId: string) => {
  return await db.select().from(cards).where(eq(cards.boardId, boardId));
};

export const getTasksAction = async (cardId: string) => {
  return await db.select().from(tasks).where(eq(tasks.cardId, cardId));
};