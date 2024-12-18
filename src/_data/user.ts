import { verifySession } from "@/_lib/session"
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getUser = cache(async () => {
  const session = await verifySession();

  if (!session?.userId) return;

  const data = await db
    .select({
      id: users.id,
      username: users.username
    })
    .from(users)
    .where(eq(users.id, session.userId));

  const user = data[0];
  return user;
});