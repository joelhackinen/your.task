import { pgTable } from "drizzle-orm/pg-core";
import boards from "./boards";

const cards = pgTable("cards", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  boardId: t.uuid().notNull().references(() => boards.id, { onDelete: "cascade", onUpdate: "cascade" }),
  title: t.text().notNull(),
  description: t.text(),
}));
export type SelectCard = typeof cards.$inferSelect;
export type InsertCard = typeof cards.$inferInsert;

export default cards;