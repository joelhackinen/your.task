import { pgTable } from "drizzle-orm/pg-core";

const boards = pgTable("boards", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  name: t.text().notNull(),
  passwordHash: t.text(),
}));
export type SelectBoard = typeof boards.$inferSelect;
export type InsertBoard = typeof boards.$inferInsert;

export default boards;