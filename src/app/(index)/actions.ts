"use server"

import { db } from "@/db";
import { boards } from "@/db/schema";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import type { CreateBoardActionState } from "./create-board-drawer";

export const createBoardAction = async (_previousState: CreateBoardActionState, formData: FormData): Promise<CreateBoardActionState> => {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  await delay(2000);

  let passwordHash: string;
  try {
    passwordHash = await bcrypt.hash(password, 10);
  } catch (err) {
    if (err instanceof Error) {
      return { status: "error", errorType: "HASHING_ERROR", message: err.message };
    }
    return { status: "error", errorType: "UNKNOWN_ERROR", message: "Error happened" };
  }

  try {
    await db.insert(boards).values({ id: uuid(), name, passwordHash });
  } catch (err) {
    if (err instanceof Error)
      return { status: "error", errorType: "DB_ERROR", message: err.message };
    return { status: "error", errorType: "UNKNOWN_ERROR", message: "Error happened" };
  }

  return { status: "success", message: `Board ${name} created!` };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
