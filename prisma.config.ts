import "dotenv/config";
import { defineConfig } from "prisma/config";

// Hardcoding for SQLite to bypass environment variable confusion
const DB_URL = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: DB_URL,
  },
});
