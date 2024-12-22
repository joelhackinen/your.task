import { config } from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.development"] });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env["LOCAL_POSTGRES_URL"]!
  }
});