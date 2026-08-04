import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const SUPABASE_DATABASE_URL = "postgresql://postgres.zqqahsvhbmxqgokbfkxz:%2F%40gcFUq6Gb44KUC@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";

function getActiveDbUrl(): string {
  return SUPABASE_DATABASE_URL;
}

function createPrismaClient(): PrismaClient {
  const connectionString = getActiveDbUrl();
  const needsSsl =
    connectionString.includes("supabase.com") ||
    connectionString.includes("neon.tech") ||
    connectionString.includes("sslmode=");
  const pool = new Pool({
    connectionString,
    max: 50,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

declare global {
  var prismaFresh: PrismaClient | undefined;
}

const prisma: PrismaClient = globalThis.prismaFresh ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaFresh = prisma;
}
