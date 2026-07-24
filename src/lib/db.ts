import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

function getActiveDbUrl(): string {
  const envUrl = process.env.DATABASE_URL?.trim();
  if (!envUrl) {
    throw new Error("DATABASE_URL is not configured. Add it to your .env or .env.local file.");
  }
  return envUrl;
}

function createPrismaClient(): PrismaClient {
  const connectionString = getActiveDbUrl();
  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=verify-full")
      ? { rejectUnauthorized: false }
      : undefined,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const prisma: PrismaClient = globalThis.prismaGlobal ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
