import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Verify admin session from cookie. Returns true if authenticated.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) return false;

  const expectedToken = crypto
    .createHmac("sha256", adminPassword)
    .update("skyledger-admin-session")
    .digest("hex");

  return sessionToken === expectedToken;
}
