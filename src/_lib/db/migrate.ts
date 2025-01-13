import path from "path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "@db";

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), "/src/_lib/db/migrations"),
    });
  } catch (e) {
    console.log(e)
  }
  console.log("Migrations complete");
  await client.end();
}

main();