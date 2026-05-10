import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Parse connection params individually to avoid URL-encoding issues with special chars in passwords.
// Supports both a full DATABASE_URL or individual DB_* vars as fallback.
function buildPoolConfig() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set. Add it in Vercel → Settings → Environment Variables.");
  }

  try {
    // Attempt to parse the URL — works when password is correctly %40-encoded
    const u = new URL(raw);
    return {
      host: u.hostname,
      port: parseInt(u.port || "6543"),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ""),
      ssl: { rejectUnauthorized: false },
    };
  } catch {
    // URL is malformed (e.g. unencoded @ in password) — fall back to connectionString directly
    return {
      connectionString: raw,
      ssl: { rejectUnauthorized: false },
    };
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const pool = new Pool(buildPoolConfig());
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
