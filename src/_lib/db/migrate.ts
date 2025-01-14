import path from "path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "@db";

async function main() {
  console.log("POSTGRES_URL=" + process.env.POSTGRES_URL);
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "/src/_lib/db/migrations"),
  });
  console.log("Migrations complete");
  await client.end();
}

main();