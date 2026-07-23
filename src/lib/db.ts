import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const SUPABASE_DATABASE_URL = "postgresql://postgres.kskthifgazwqgprwvjwx:dbpasswordstudentforge@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

function getActiveDbUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl || envUrl.includes("neon.tech")) {
    return SUPABASE_DATABASE_URL;
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
