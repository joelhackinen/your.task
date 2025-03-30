import { createPostgresJsClient } from "./clients/postgresjs";
import schema, { boards, cards, tasks, users, usersBoards } from "@db/schema";
import { reset, seed } from "drizzle-seed";
import "@lib/load-env";

async function main() {
  const db = createPostgresJsClient();
  await reset(db, schema);

  const [[insertedBoard], [insertedUser]] = await Promise.all([
    db.insert(boards)
      .values({ name: "seeded board" })
      .returning(),
    db.insert(users)
      .values({ username: "jole", passwordHash: "$2b$10$Ev.CsKBOl3Dvo/O4fonwuuJrLOTM33SqH8au2U62xnBVcrIBiMTYG" })
      .returning({ id: users.id }),
  ]);
  if (!insertedBoard || !insertedUser) throw new Error("Couldn't seed the DB");

  await seed(db, { cards, tasks, usersBoards }).refine((f) => ({
    usersBoards: {
      count: 1,
      columns: {
        userId: f.default({
          defaultValue: insertedUser.id,
        }),
        boardId: f.default({
          defaultValue: insertedBoard.id,
        }),
        boardName: f.default({
          defaultValue: insertedBoard.name,
        }),
      },
    },
    cards: {
      count: 3,
      columns: {
        boardId: f.default({
          defaultValue: insertedBoard.id,
        }),
      },
      with: {
        tasks: 5,
      },
    },
  }));

  await db.$client.end();
}

main();