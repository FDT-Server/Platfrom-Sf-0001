import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): boolean {
  // Support legacy SHA-256 hashes for accounts created before the bcrypt upgrade
  const sha256Hash = crypto.createHash("sha256").update(password).digest("hex");
  if (hash === sha256Hash) return true;
  // Standard bcrypt check
  return bcrypt.compareSync(password, hash);
}
