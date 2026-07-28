import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

function loadEnvFile(filePath: string): void {
  try {
    const content = readFileSync(filePath, "utf8");

    for (const line of content.split(/\r?\n/)) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#") || !trimmedLine.includes("=")) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf("=");
      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, "");

      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore missing env files; Prisma will still validate DATABASE_URL below.
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

const SUPABASE_DIRECT_URL = "postgresql://postgres.kskthifgazwqgprwvjwx:dbpasswordstudentforge@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

function getMigrationUrl(): string {
  const url = process.env["DIRECT_URL"] || process.env["DATABASE_URL"];
  if (!url || url.includes("neon.tech")) {
    return SUPABASE_DIRECT_URL;
  }
  return url;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getMigrationUrl(),
  },
});
