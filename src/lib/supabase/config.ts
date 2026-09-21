const FALLBACK_SUPABASE_URL =
  "https://jbwrnvmidjvcnkexjsqj.supabase.co";

const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_1pAbktJsG3fwkPUCZBAbJw_JqYRPqXm";

/**
 * NEXT_PUBLIC_* values remain the preferred configuration.
 * The fallback is intentionally limited to Supabase's public URL and
 * publishable key so preview builds remain bootable when Vercel project
 * settings have not been populated yet.
 */
export function getSupabaseConfig() {
  return {
    url:
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
      FALLBACK_SUPABASE_URL,
    publishableKey:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
      FALLBACK_SUPABASE_PUBLISHABLE_KEY
  };
}
