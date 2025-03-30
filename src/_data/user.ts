import { verifySession } from "@/_lib/session";
import { db } from "@/_lib/db";
import { boards, cards, users, usersBoards } from "@/_lib/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session?.userId) return;

  const [user] = await db
    .select({
      id: users.id,
      username: users.username
    })
    .from(users)
    .where(eq(users.id, session.userId));

  return user;
});

export const hasAccessToBoard = cache(async (userId: string, boardId: string) => {
  const usersBoards = await getUsersBoards(userId);
  return usersBoards.some(b => b.boardId === boardId);
});

export const getUsersBoards = cache(async (userId: string) => {
  const boards = await db.select().from(usersBoards).where(eq(usersBoards.userId, userId));
  return boards;
});

export const getBoard = cache(async (boardId: string) => {
  const [board] = await db.select().from(boards).where(eq(boards.id, boardId));
  return board;
});

export const getBoardByCardId = cache(async (cardId: string) => {
  const [card] = await db.select().from(cards).where(eq(cards.id, cardId));
  if (!card) return;

  return await getBoard(card.boardId);
});