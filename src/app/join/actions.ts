"use server";

import * as bcrypt from "bcrypt";
import { LoginFormSchema, SignUpFormSchema } from "../../_lib/definitions";
import type { SignUpActionState } from "./signup-form";
import { db } from "@/_lib/db";
import { users } from "@/_lib/db/schema";
import { PostgresError } from "postgres";
import { createSession } from "../../_lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { QueryResultError, QueryResultSuccess } from "@/_lib/QueryResult";


export const signUpAction = async (_: SignUpActionState, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const validationResult = SignUpFormSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      data,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }
  const { username, password } = validationResult.data;
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db
    .insert(users)
    .values({ username, passwordHash })
    .returning({ id: users.id, username: users.username })
    .then((value) => new QueryResultSuccess(value[0]!))
    .catch((reason: PostgresError) => new QueryResultError(reason));
  
  if (!result.success) {
    return {
      data,
      errors: {
        username: ["This username is already in use"],
      },
    };
  }
  
  const user = result.data;
  await createSession(user.id);

  redirect("/");
};

export const loginAction = async (_: SignUpActionState, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const validationResult = LoginFormSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      data,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validationResult.data;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .then((value) => new QueryResultSuccess(value))
    .catch((reason: PostgresError) => new QueryResultError(reason.code));
  
  if (!result.success) {
    return {
      data,
      errors: {
        username: ["Unknown error"],
        password: ["Unknown error"],
      },
    }
  }

  const user = result.data[0];

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

  redirect("/");
};