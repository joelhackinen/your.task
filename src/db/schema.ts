import { pgTable, uniqueIndex } from "drizzle-orm/pg-core";

export const boards = pgTable("boards", (t) => ({
  id: t.serial().primaryKey(),
  name: t.text().notNull(),
  passwordHash: t.text(),
}));

export type BoardType = typeof boards.$inferSelect;

export const cards = pgTable("cards", (t) => ({
  id: t.serial().primaryKey(),
  boardId: t.integer().notNull().references(() => boards.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: t.text().notNull(),
  description: t.text(),
}), (t) => [
  uniqueIndex("unique_board_cards").on(t.boardId, t.name),
]);

export type CardType = typeof cards.$inferSelect;

export const tasks = pgTable("tasks", (t) => ({
  id: t.serial().primaryKey(),
  cardId: t.integer().references(() => cards.id, { onDelete: "cascade", onUpdate: "cascade" }),
  title: t.text().notNull(),
  description: t.text(),
}));

export type TaskType = typeof tasks.$inferSelect;
