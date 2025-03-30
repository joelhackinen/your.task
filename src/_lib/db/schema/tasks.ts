import { pgTable } from "drizzle-orm/pg-core";
import cards from "./cards";

const tasks = pgTable("tasks", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  cardId: t.uuid().notNull().references(() => cards.id, { onDelete: "cascade", onUpdate: "cascade" }),
  title: t.text().notNull(),
  description: t.text(),
}));
export type SelectTask = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export default tasks;