import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import schema from "@db/schema";

export function createPostgresJsClient() {
  console.log("🌱 Creating a new Postgres.js client...");
  const sql = postgres(process.env.DATABASE_URL!);
  return drizzle(sql, { casing: "snake_case", schema });
}