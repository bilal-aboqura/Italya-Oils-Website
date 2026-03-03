/**
 * Admin panel secret URL — reads from ADMIN_SECRET_PATH env variable.
 *
 * Set it in your .env file:
 *   ADMIN_SECRET_PATH="your-secret-path-here"
 *
 * ⚠️  Never use NEXT_PUBLIC_ prefix — that would expose the secret to the browser.
 * This variable remains server-only and never appears in the client bundle.
 *
 * Fallback: if the env variable is not set, the path defaults to "admin-panel"
 * which is intentionally generic (still better than /admin).
 */
export const ADMIN_SECRET_SEGMENT =
  process.env.ADMIN_SECRET_PATH ?? "admin-panel";

/** The internal Next.js route (never exposed to users) */
export const ADMIN_INTERNAL_PATH = "/admin";

/** Full secret prefix used in server-side hrefs */
export const ADMIN_PATH = `/${ADMIN_SECRET_SEGMENT}`;
