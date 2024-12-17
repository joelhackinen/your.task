"use server"

import { db } from "@/db";
import { boards } from "@/db/schema";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import type { CreateBoardActionState } from "./create-board-drawer";
import { CreateBoardFormSchema } from "../../lib/definitions";
import { sleep } from "@/lib/utils";

export const createBoardAction = async (_previousState: CreateBoardActionState, formData: FormData): Promise<CreateBoardActionState> => {
  await sleep(2000);
  const validationResult = CreateBoardFormSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    }
  }
  const { name, password } = validationResult.data;

  let passwordHash = await bcrypt.hash(password, 10);
  await db.insert(boards).values({
    id: uuid(),
    name,
    passwordHash
  });

  return { message: `Board ${name} created!` };
};
