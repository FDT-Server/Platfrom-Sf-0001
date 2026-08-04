import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prismaFresh: PrismaClient | undefined;
}

const SUPABASE_DATABASE_URL = "postgresql://postgres:dbpasswordstudentforge@db.kskthifgazwqgprwvjwx.supabase.co:5432/postgres";

function getActiveDbUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl || envUrl.includes("neon.tech")) {
    return SUPABASE_DATABASE_URL;
  }
  return envUrl;
}

function createPrismaClient(): PrismaClient {
  const connectionString = getActiveDbUrl();
  const needsSsl =
    connectionString.includes("supabase.com") ||
    connectionString.includes("neon.tech") ||
    connectionString.includes("sslmode=");
  const pool = new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const prisma: PrismaClient = globalThis.prismaFresh ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaFresh = prisma;
}
