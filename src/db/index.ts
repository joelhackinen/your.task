import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const createLocalDbClient = async () => {
  const url = process.env.LOCAL_POSTGRES_URL!;

  const devDb = drizzle(url, {
    casing: "snake_case",
  });

  console.log("⚙️ Performing migration on development database ...");
  try {
    await migrate(devDb, { migrationsFolder: "drizzle" });
  } catch (error) {
    console.error("❌ Migration failed\n\n", error);
    console.dir(error)
    process.exit(1);
  }
  console.log("✅ Migration done");
  
  return devDb;
};


export const db = await createLocalDbClient();