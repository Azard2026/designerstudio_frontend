/**
 * Production: Caddy serves the API on the same domain at /api.
 * Local development: Next.js (3000) calls FastAPI directly on port 8000.
 * Set NEXT_PUBLIC_API_BASE_URL to override either default.
 */
const runningLocally =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (runningLocally
    ? "http://localhost:8000/api"
    : "http://43.204.238.189:8000/api");
