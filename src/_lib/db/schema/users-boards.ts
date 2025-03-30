import { pgTable, primaryKey } from "drizzle-orm/pg-core";

const usersBoards = pgTable("users_boards", (t) => ({
  userId: t.uuid().notNull(),
  boardId: t.uuid().notNull(),
  boardName: t.text().notNull(),
}), (t) => [
  primaryKey({ columns: [t.userId, t.boardId ]}),
]);
export type SelectUsersBoards = typeof usersBoards.$inferSelect;
export type InsertUsersBoards = typeof usersBoards.$inferInsert;

export default usersBoards;