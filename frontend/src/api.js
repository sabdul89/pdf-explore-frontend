/**
 * api.js
 * Centralized API base URL handling for local, Vercel, and production.
 *
 * Uses:
 * - VITE_API_BASE (recommended for Vercel env vars)
 * - window.location.origin fallback for frontend URL detection
 * - Hardcoded fallback to Render backend
 */

export const API_BASE =
  // 1️⃣ Use Vercel/Env override if provided
  import.meta.env.VITE_API_BASE ||

  // 2️⃣ If running in browser, infer protocol + domain
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname.replace(
        "localhost",
        "127.0.0.1"
      )}:8000` // local fallback
    : null) ||

  // 3️⃣ Final hardcoded fallback (production-safe)
  "https://pdf-explore.onrender.com";

console.log("🔗 Using API_BASE =", API_BASE);
