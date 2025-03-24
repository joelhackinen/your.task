"use server";

import { db } from "@/_lib/db";
import { boards, cards, usersBoards } from "@/_lib/db/schema";
import bcrypt from "bcryptjs";
import { CreateBoardFormSchema, JoinBoardFormSchema, } from "../../_lib/definitions";
import { getUser } from "@/_data/user";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { defineAction } from "@/_lib/utils";

export const createBoardAction = defineAction(CreateBoardFormSchema, async (_prev, validatedData) => {
  const user = await getUser();

  if (!user) {
    return {
      data: validatedData,
      message: "You need to be logged in!",
      success: false,
    };
  }

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

  return {
    message: `Board ${name} created!`,
    success: true,
  };
});

export const joinBoardAction = defineAction(JoinBoardFormSchema, async (_prev, validatedData) => {
  const user = await getUser();

  if (!user) {
    return {
      data: validatedData,
      message: "You need to be logged in!",
      success: false,
    };
  }

  const { id, password } = validatedData;

  const [board] = await db
    .select()
    .from(boards)
    .where(eq(boards.id, id));
  
  if (!board) {
    return {
      data: validatedData,
      fieldErrors: {
        id: ["Invalid credentials"],
        password: ["Invalid credentials"],
      },
      success: false,
    };
  }

  if (board.passwordHash && !(await bcrypt.compare(password, board.passwordHash))) {
    return {
      data: validatedData,
      fieldErrors: {
        id: ["Invalid credentials"],
        password: ["Invalid credentials"],
      },
      success: false,
    };
  }
  // handle duplicate composite pkey
  try {
    await db
      .insert(usersBoards)
      .values({ userId: user.id, boardId: board.id, boardName: board.name });
  } catch (err) {
    if (err instanceof postgres.PostgresError && err.code == "23505") {
      return {
        data: validatedData,
        fieldErrors: {
          id: ["You already belong to this board"],
        },
        success: false,
      };
    }
    return {
      data: validatedData,
      fieldErrors: {
        id: ["Error creating a board"],
        password: ["Error creating a board"],
      },
      success: false,
    };
  }
  revalidatePath("/");

  return { message: `Joined ${board.name} succesfully!`, success: true, };
});
