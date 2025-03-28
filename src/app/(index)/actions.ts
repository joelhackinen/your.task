"use server";

import { db } from "@/_lib/db";
import { boards, cards, usersBoards } from "@/_lib/db/schema";
import bcrypt from "bcryptjs";
import { CreateBoardFormSchema, JoinBoardFormSchema, } from "../../_lib/definitions";
import { getUser } from "@/_data/user";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { defineAction } from "@/_lib/define-action";
import { redirect } from "next/navigation";

export const createBoardAction = defineAction(CreateBoardFormSchema, async (_prev, validatedData, success) => {
  const user = await getUser();

  if (!user) redirect("/join");

  const { name, password } = validatedData;

  const passwordHash = await bcrypt.hash(password, 10);
  const insertResult = await db.insert(boards).values({
    name,
    passwordHash
  }).returning();

  const addedBoard = insertResult[0]!;

  await db.insert(usersBoards).values({
    userId: user.id,
    boardId: addedBoard.id,
    boardName: name,
  });

  await db.insert(cards).values([
    {
      boardId: addedBoard.id,
      title: "Todo",
    },
    {
      boardId: addedBoard.id,
      title: "Doing",
    },
    {
      boardId: addedBoard.id,
      title: "Done",
    },
  ]);

  revalidatePath("/");

  return success();
});

export const joinBoardAction = defineAction(JoinBoardFormSchema, async (_prev, validatedData, success, error) => {
  const user = await getUser();

  if (!user) redirect("/join");

  const { id, password } = validatedData;

  const [board] = await db
    .select()
    .from(boards)
    .where(eq(boards.id, id));
  
  if (!board) {
    return error({
      formError: "Invalid credentials",
    });
  }

  if (board.passwordHash && !(await bcrypt.compare(password, board.passwordHash))) {
    return error({
      formError: "Invalid credentials",
    });
  }
  // handle duplicate composite pkey
  try {
    await db
      .insert(usersBoards)
      .values({ userId: user.id, boardId: board.id, boardName: board.name });
  } catch (err) {
    if (err instanceof postgres.PostgresError && err.code == "23505") {
      return error({
        fieldErrors: {
          id: ["You already belong to this board"],
        },
      });
    }
    return error({
      formError: "An error happened when creating a board. Try again!",
    });
  }
  revalidatePath("/");

  return success();
});
