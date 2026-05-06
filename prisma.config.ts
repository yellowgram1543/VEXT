import "dotenv/config";
import { defineConfig } from "prisma/config";

// Hardcoding for SQLite to bypass environment variable confusion
const DB_URL = "file:./prisma/dev.db";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: DB_URL,
  },
});
