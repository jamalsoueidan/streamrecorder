import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  dbCredentials: {
    url: "postgresql://postgres:testerne@localhost:5432/strapi",
  },
});
