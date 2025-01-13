import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.development"] });

export default defineConfig({
  out: "./src/_lib/db/migrations",
  schema: "./src/_lib/db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env["POSTGRES_URL"]!
  }
});