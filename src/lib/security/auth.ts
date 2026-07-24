import { cookies } from "next/headers";
import prisma from "@/lib/db";

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  selectedRole: string;
  profileImage?: string | null;
  isAdmin: boolean;
  isSfAdmin: boolean;
}

export const ADMIN_EMAILS_MAIN = ["webstrixx@gmail.com"];
export const ADMIN_EMAILS_SFADMIN = ["hrstudentforge@gmail.com"];

/**
 * Gets and validates the currently logged-in user from the session cookie.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
      select: {
        id: true,
        email: true,
        fullName: true,
        selectedRole: true,
        profileImage: true,
      },
    });

    if (!user) {
      return null;
    }

    const cleanEmail = user.email.trim().toLowerCase();
    const isAdmin = ADMIN_EMAILS_MAIN.includes(cleanEmail);
    const isSfAdmin = ADMIN_EMAILS_SFADMIN.includes(cleanEmail);

    return {
      ...user,
      isAdmin,
      isSfAdmin,
    };
  } catch (error) {
    console.error("Auth security verification error:", error);
    return null;
  }
}

/**
 * Ensures user is authenticated and has Main Admin privileges.
 */
export async function requireMainAdmin(): Promise<AuthenticatedUser | null> {
  const user = await getAuthenticatedUser();
  if (!user || !user.isAdmin) {
    return null;
  }
  return user;
}

/**
 * Ensures user is authenticated and has SF Admin privileges.
 */
export async function requireSfAdmin(): Promise<AuthenticatedUser | null> {
  const user = await getAuthenticatedUser();
  if (!user || (!user.isSfAdmin && !user.isAdmin)) {
    return null;
  }
  return user;
}
