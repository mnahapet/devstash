import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Only set datasource when DIRECT_URL is available (not needed for prisma generate)
  ...(process.env.DIRECT_URL && {
    datasource: {
      url: process.env.DIRECT_URL,
    },
  }),
});
