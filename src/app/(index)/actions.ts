"use server";

import { db } from "@/db";
import { boards, cards, usersBoards } from "@/db/schema";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import type { CreateBoardActionState } from "./create-board-drawer";
import { CreateBoardFormSchema } from "../../_lib/definitions";
import { getUser } from "@/_data/user";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import type { JoinBoardActionState } from "./join-board-drawer";
import postgres from "postgres";

export const createBoardAction = async (
  _: CreateBoardActionState,
  formData: FormData
) => {
  const boardData = {
    name: formData.get("name"),
    password: formData.get("password"),
  };

  const user = await getUser();

  if (!user) {
    return {
      data: boardData,
      message: "You need to be logged in!"
    };
  }
  const validationResult = CreateBoardFormSchema.safeParse(boardData);

  if (!validationResult.success) {
    return {
      data: boardData,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { name, password } = validationResult.data;

  const passwordHash = await bcrypt.hash(password, 10);

  const boardId = uuid();

  await db.insert(boards).values({
    id: boardId,
    name,
    passwordHash
  });
  await db.insert(usersBoards).values({
    userId: user.id,
    boardId,
    boardName: name,
  });
  revalidatePath("/");

  const [id1, id2, id3] = [uuid(), uuid(), uuid()];
  await db.insert(cards).values({
    id: id1,
    boardId,
    title: "Todo",
  });
  await db.insert(cards).values({
    id: id2,
    boardId,
    title: "Doing",
  });
  await db.insert(cards).values({
    id: id3,
    boardId,
    title: "Done",
  });

  return { message: `Board ${name} created!` };
};


export const joinBoardAction = async (
  _: JoinBoardActionState,
  formData: FormData
) => {
  const boardData = {
    name: formData.get("name"),
    password: formData.get("password"),
  };

  const user = await getUser();

  if (!user) {
    return {
      data: boardData,
      message: "You need to be logged in!"
    };
  }
  const validationResult = CreateBoardFormSchema.safeParse(boardData);

  if (!validationResult.success) {
    return {
      data: boardData,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { name, password } = validationResult.data;

  const [board] = await db
    .select()
    .from(boards)
    .where(eq(boards.name, name));
  
  if (!board) {
    return {
      data: boardData,
      errors: {
        name: ["Board " + name + " doesn't exist"],
      },
    };
  }

  if (board.passwordHash && !(await bcrypt.compare(password, board.passwordHash))) {
    return {
      data: boardData,
      errors: {
        password: ["Invalid password"],
      },
    };
  }
  // handle duplicate composite pkey
  try {
    await db
      .insert(usersBoards)
      .values({ userId: user.id, boardId: board.id, boardName: board.name })
  } catch (err) {
    if (err instanceof postgres.PostgresError && err.code == "23505") {
      return {
        data: boardData,
        errors: {
          name: ["You already have this board"],
        },
      };
    }
    return {
      data: boardData,
      errors: {
        name: ["Error creating a board"],
        password: ["Error creating a board"],
      },
    };
  }

  return { message: `Joined ${name} succesfully!` };
};
