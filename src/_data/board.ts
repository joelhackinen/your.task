import { db } from "@/_lib/db";
import { cards, tasks } from "@db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getCards = cache(async (boardId: string) => (
  await db.select().from(cards).where(eq(cards.boardId, boardId))
));

export const getTasks = cache(async (cardId: string) => (
  await db.select().from(tasks).where(eq(tasks.cardId, cardId))
));

export const getBoardData = async (boardId: string) => {
  const r = await db.query.boards.findFirst({
    where: (boards, { eq }) => (eq(boards.id, boardId)),
    columns: {
      passwordHash: false,
    },
    with: {
      cards: {
        with: {
          tasks: true,
        }
      }
    }
  });
  console.dir(r);

  return r;
};
