"use server"

import { db } from "@/db";
import { boards } from "@/db/schema";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export const createBoardAction = async (_previousState: string, formData: FormData) => {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  await delay(2000)

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) throw err;
    await db.insert(boards).values({ id: uuid(), name, passwordHash: hash });
  });
  new Promise(resolve => setTimeout(resolve, 1000));
  return name;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
