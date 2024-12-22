import { verifySession } from "@/_lib/session"
import { db } from "@/db";
import { users, usersBoards } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getUser = cache(async () => {
  const session = await verifySession();

  if (!session?.userId) return;

  const data = await db
    .select({
      id: users.id,
      username: users.username
    })
    .from(users)
    .where(eq(users.id, session.userId));

  const user = data[0];
  return user;
});

export const getBoards = async (userId: string) => {
  return await db
    .select({ boardId: usersBoards.boardId, boardName: usersBoards.boardName })
    .from(usersBoards)
    .where(eq(usersBoards.userId, userId));
};

export const getBoard = cache(async (userId: string, boardId: string) => {
  const usersBoards = await getBoards(userId);
  return usersBoards.find(b => b.boardId === boardId);
});