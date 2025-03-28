"use server";

import bcrypt from "bcryptjs";
import { LoginFormSchema, SignUpFormSchema } from "../../_lib/definitions";
import { db } from "@/_lib/db";
import { users } from "@/_lib/db/schema";
import { PostgresError } from "postgres";
import { createSession } from "../../_lib/session";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { QueryResultError, QueryResultSuccess } from "@/_lib/QueryResult";
import { defineAction } from "@/_lib/define-action";

export const signUpAction = defineAction(SignUpFormSchema, async (_prev, validatedData, _success, error) => {
  const { username, password } = validatedData;
  const passwordHash = await bcrypt.hash(password, 10);

  const result = await db
    .insert(users)
    .values({ username, passwordHash })
    .returning()
    .then((value) => new QueryResultSuccess(value[0]!))
    .catch((reason: PostgresError) => new QueryResultError(reason));
  
  if (!result.success) {
    return error({
      fieldErrors: {
        username: ["This username is already in use"],
      },
    });
  }
  
  const user = result.data;
  await createSession(user.id);

  redirect("/");
});

export const loginAction = defineAction(LoginFormSchema, async (_prev, validatedData, _success, error) => {
  const { username, password } = validatedData;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .then((value) => new QueryResultSuccess(value))
    .catch((reason: PostgresError) => new QueryResultError(reason.code));
  
  if (!result.success) {
    return error({
      formError: "Unknown error",
    });
  }

  const user = result.data[0];

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return error({
      formError: "Invalid credentials",
    });
  }

  await createSession(user.id);

  redirect("/");
});
