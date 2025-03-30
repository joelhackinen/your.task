import "@lib/load-env";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL missing from env");

export default defineConfig({
  out: "./src/_lib/db/migrations",
  schema: "./src/_lib/db/schema",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: connectionString,
  },
});