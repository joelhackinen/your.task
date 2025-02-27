import "@lib/load-env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/_lib/db/migrations",
  schema: "./src/_lib/db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env["POSTGRES_URL"]!
  }
});