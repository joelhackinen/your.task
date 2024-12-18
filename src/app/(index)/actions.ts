"use server"

import { db } from "@/db";
import { boards, usersBoards } from "@/db/schema";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import type { CreateBoardActionState } from "./create-board-drawer";
import { CreateBoardFormSchema } from "../../_lib/definitions";
import { sleep } from "@/_lib/utils";
import { getUser } from "@/_data/user";
import { revalidatePath } from "next/cache";

export const createBoardAction = async (_previousState: CreateBoardActionState, formData: FormData): Promise<CreateBoardActionState> => {
  await sleep(2000);

  const boardData = {
    name: formData.get("name") ?? "",
    password: formData.get("password") ?? "",
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
    }
  }
  const { name, password } = validationResult.data;

  let passwordHash = await bcrypt.hash(password, 10);

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

  return { message: `Board ${name} created!` };
};
