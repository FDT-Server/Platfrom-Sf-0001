import crypto from 'crypto';

/**
 * Hashes a password using SHA-256.
 * Standard implementation using Node's native crypto module.
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}
