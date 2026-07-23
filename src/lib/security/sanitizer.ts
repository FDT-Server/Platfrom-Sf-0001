/**
 * Input Sanitization & Anti-XSS Security Helpers
 */

/**
 * Escapes HTML special characters to prevent Reflected and Stored XSS attacks.
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

/**
 * Validates whether an email string follows a legitimate format.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Validates whether a URL uses http or https schemes (prevents javascript: URIs).
 */
export function isValidSafeUrl(url: string | null | undefined): boolean {
  if (!url) return true; // Optional fields are allowed to be empty
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
