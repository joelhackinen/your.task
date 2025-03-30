import { pgTable } from "drizzle-orm/pg-core";

const users = pgTable("users", (t) => ({
  id: t.uuid().defaultRandom().primaryKey(),
  username: t.text().notNull().unique(),
  passwordHash: t.text().notNull(),
}));

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export default users;