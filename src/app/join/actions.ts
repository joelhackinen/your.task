"use server"

import * as bcrypt from "bcrypt";
import { sleep } from "@/_lib/utils";
import { LoginFormSchema, SignUpFormSchema } from "../../_lib/definitions";
import type { SignUpActionState } from "./signup-form"
import { db } from "@/db";
import { users } from "@/db/schema";
import postgres from "postgres";
import type { LoginActionState } from "./login-form";
import { createSession } from "../../_lib/session";
import { eq } from "drizzle-orm";

export const signUpAction = async (_previousState: SignUpActionState, formData: FormData): Promise<SignUpActionState> => {
  await sleep(1000);
  const data = {
    username: formData.get("username") ?? "",
    password: formData.get("password") ?? "",
  };
  const validationResult = SignUpFormSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      data,
      errors: validationResult.error.flatten().fieldErrors,
    }
  }
  const { username, password } = validationResult.data;
  const passwordHash = await bcrypt.hash(password, 10);

  let userData: {
    id: string;
    username: string;
  }[];

  try {
    userData = await db
      .insert(users)
      .values({ username, passwordHash })
      .returning({ id: users.id, username: users.username });
  } catch (e) {
    if (e instanceof postgres.PostgresError && e.code === "23505") {
      return {
        data: { username, password },
        errors: {
          username: ["Username already in use"]
        } 
      }
    }
    return {
      data: { username, password },
      errors: {
        username: ["Username must be unique"]
      } 
    }
  }
  await createSession(userData[0]?.id!);

  return {
    message: "hello," + userData[0]?.username
  };
};

export const loginAction = async (_previousState: SignUpActionState, formData: FormData): Promise<LoginActionState> => {
  await sleep(1000);
  const data = {
    username: formData.get("username") ?? "",
    password: formData.get("password") ?? "",
  };
  const validationResult = LoginFormSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      data,
      errors: validationResult.error.flatten().fieldErrors,
    }
  }

  const { username, password } = validationResult.data;

  const userData = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  
  const user = userData[0];

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return {
      data,
      errors: {
        username: ["Invalid credentials"],
        password: ["Invalid credentials"],
      },
    };
  }

  await createSession(user.id);

  return { message: "Hello, " + username + "!" };
};