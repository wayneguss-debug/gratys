import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  display_name: string | null;
  role: "viewer" | "editor" | "admin";
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", data.claims.sub)
    .maybeSingle();

  return (profile as Profile | null) ?? null;
}

export async function requireEditor() {
  const profile = await getCurrentProfile();

  if (!profile || !["editor", "admin"].includes(profile.role)) {
    redirect("/auth/login?error=Acesso restrito à equipe editorial.");
  }

  return profile;
}

export async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/admin");
  }

  return profile;
}
