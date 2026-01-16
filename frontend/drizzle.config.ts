import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  dbCredentials: {
    url: "postgresql://postgres:nice2709@localhost:5432/strapi",
  },
});
