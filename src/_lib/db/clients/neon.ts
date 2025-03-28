import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

export function createNeonClient() {
  console.log("🌱 Creating a new NeonDB client...");
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { casing: "snake_case" });
}