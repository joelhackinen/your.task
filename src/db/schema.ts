import { pgTable, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  username: t.text().notNull().unique(),
  passwordHash: t.text().notNull(),
}));
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const usersBoards = pgTable("users_boards", (t) => ({
  userId: t.uuid().notNull(),
  boardId: t.uuid().notNull(),
  boardName: t.text().notNull(),
}), (t) => [
  primaryKey({ columns: [t.userId, t.boardId ]}),
]);
export type SelectUsersBoards = typeof usersBoards.$inferSelect;

export const boards = pgTable("boards", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  name: t.text().notNull(),
  passwordHash: t.text(),
}));
export type SelectBoard = typeof boards.$inferSelect;
export type InsertBoard = typeof boards.$inferInsert;

export const cards = pgTable("cards", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  boardId: t.uuid().notNull().references(() => boards.id, { onDelete: "cascade", onUpdate: "cascade" }),
  title: t.text().notNull(),
  description: t.text(),
}), (t) => [
  uniqueIndex("unique_board_cards").on(t.boardId, t.title),
]);
export type CardType = typeof cards.$inferSelect;

export const tasks = pgTable("tasks", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  cardId: t.uuid().references(() => cards.id, { onDelete: "cascade", onUpdate: "cascade" }),
  title: t.text().notNull(),
  description: t.text(),
}));
export type TaskType = typeof tasks.$inferSelect;
