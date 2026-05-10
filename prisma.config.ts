// This file is used by Prisma CLI (prisma generate, prisma migrate)
// .env.local is loaded for local dev only; on Vercel env vars are set natively
import { defineConfig } from "prisma/config";

try {
  const { config } = await import("dotenv");
  config({ path: ".env.local" });
} catch {
  // dotenv not available or .env.local missing (e.g. Vercel) — env vars already set
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] ?? "",
  },
});
