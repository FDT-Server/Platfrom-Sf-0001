import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  const isNeonOrRemote =
    connectionString?.includes("neon.tech") ||
    connectionString?.includes("sslmode=") ||
    process.env.NODE_ENV === "production";

  const pool = new Pool({
    connectionString,
    ssl: isNeonOrRemote ? { rejectUnauthorized: false } : undefined,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as any);
}

const prisma: PrismaClient = globalThis.prismaGlobal ?? createPrismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
