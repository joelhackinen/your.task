import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { seed } from "drizzle-seed";
import { boards, cards, tasks } from "./schema";


const createLocalDbClient = async () => {
  const url = process.env.LOCAL_POSTGRES_URL!;

  const devDb = drizzle(url, {
    casing: "snake_case",
  });

  console.log("⚙️ Performing migration on development database ...");
  try {
    await migrate(devDb, { migrationsFolder: "migrations" });
  } catch (error) {
    console.error("❌ Migration failed\n\n", error);
    process.exit(1);
  }
  console.log("✅ Migration done");

  try {
    await seed(devDb, { boards, cards, tasks }).refine((_f) => ({
      boards: {
        count: 2,
        with: {
          cards: 5,
        },
      },
      cards: {
        with: {
          tasks: 5,
        }
      },
    }));
  } catch (e) {
    console.log("skipping seeding");
  }
  
  return devDb;
};


export const db = await createLocalDbClient();