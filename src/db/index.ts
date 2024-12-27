import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";


declare global {
  // eslint-disable-next-line no-var
  var _db: ReturnType<typeof drizzle> | undefined;
}

const createLocalDbClient = async () => {
  const existingDb = global._db;
  if (existingDb) return existingDb;
  const url = process.env.LOCAL_POSTGRES_URL!;

  const newDb = drizzle(url, {
    casing: "snake_case",
  });

  console.log("⚙️ Performing migration on development database ...");
  try {
    await migrate(newDb, { migrationsFolder: "drizzle" });
  } catch (error) {
    console.error("❌ Migration failed\n\n", error);
    console.dir(error);
    process.exit(1);
  }
  console.log("✅ Migration done");

  global._db = newDb;
  
  return newDb;
};


export const db = await createLocalDbClient();