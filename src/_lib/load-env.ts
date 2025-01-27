import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
const config = loadEnvConfig(
  projectDir,
  process.env.NODE_ENV === "development",
);

console.log(
  "These .env files were loaded:",
  config.loadedEnvFiles.map((f) => f.path),
);