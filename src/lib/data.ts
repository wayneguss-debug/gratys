import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const publicClient = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

export type SiteSettings = {
  site_name: string;
  tagline: string;
  description: string;
  instagram_url: string | null;
  contact_url: string | null;
  is_name_placeholder: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  type: "news" | "notice" | "orientation";
  status: "draft" | "published";
  featured: boolean;
  pinned: boolean;
  category: string;
  cover_url: string | null;
  source_url: string | null;
  reading_minutes: number;
  published_at: string | null;
  updated_at: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  kind: "event" | "deadline" | "notice";
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  external_url: string | null;
  all_day: boolean;
};

export type CampusLocation = {
  id: string;
  name: string;
  category: "room" | "sector" | "service" | "other";
  building: string | null;
  floor: string | null;
  reference: string | null;
  map_hint: string | null;
  description: string;
};

export type TransportSchedule = {
  id: string;
  line_name: string;
  direction: string;
  departure_time: string;
  active_days: string[];
  note: string;
  valid_from: string | null;
  valid_until: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data } = await publicClient
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    data ?? {
      site_name: "Mural do Campus",
      tagline: "informação que circula",
      description:
        "Avisos, prazos, eventos e orientações do cotidiano acadêmico em um só lugar.",
      instagram_url: null,
      contact_url: null,
      is_name_placeholder: true
    }
  ) as SiteSettings;
}

export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  let query = publicClient
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("pinned", { ascending: false })
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data } = await publicClient
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return (data as Post | null) ?? null;
}

export async function getUpcomingEvents(limit?: number): Promise<EventItem[]> {
  let query = publicClient
    .from("events")
    .select("*")
    .eq("is_published", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data ?? []) as EventItem[];
}

export async function getLocations(): Promise<CampusLocation[]> {
  const { data } = await publicClient
    .from("campus_locations")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (data ?? []) as CampusLocation[];
}

export async function getTransportSchedules(): Promise<TransportSchedule[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await publicClient
    .from("transport_schedules")
    .select("*")
    .eq("is_active", true)
    .or(`valid_from.is.null,valid_from.lte.${today}`)
    .or(`valid_until.is.null,valid_until.gte.${today}`)
    .order("departure_time", { ascending: true });

  return (data ?? []) as TransportSchedule[];
}
