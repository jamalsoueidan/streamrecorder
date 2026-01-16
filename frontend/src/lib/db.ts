import * as schema from "@/db/schema/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://postgres:nice2709@localhost:5432/strapi",
});

export const db = drizzle(pool, { schema });
