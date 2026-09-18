"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, requireEditor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const optionalUrl = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .refine((value) => value === null || z.url().safeParse(value).success, "URL inválida");

const postSchema = z.object({
  title: z.string().trim().min(4).max(180),
  slug: z.string().trim().max(180).optional(),
  excerpt: z.string().trim().min(10).max(420),
  content: z.string().trim().min(20),
  type: z.enum(["news", "notice", "orientation"]),
  category: z.string().trim().min(2).max(60),
  status: z.enum(["draft", "published"]),
  reading_minutes: z.coerce.number().int().min(1).max(60),
  cover_url: optionalUrl,
  source_url: optionalUrl
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 170);
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function refreshPublicContent() {
  revalidatePath("/");
  revalidatePath("/informativos");
  revalidatePath("/agenda");
  revalidatePath("/campus");
}

export async function createPost(formData: FormData) {
  const profile = await requireEditor();
  const parsed = postSchema.safeParse({
    title: value(formData, "title"),
    slug: value(formData, "slug"),
    excerpt: value(formData, "excerpt"),
    content: value(formData, "content"),
    type: value(formData, "type"),
    category: value(formData, "category"),
    status: value(formData, "status"),
    reading_minutes: value(formData, "reading_minutes"),
    cover_url: value(formData, "cover_url"),
    source_url: value(formData, "source_url")
  });

  if (!parsed.success) {
    redirect("/admin/posts/new?error=Revise os campos obrigatórios.");
  }

  const supabase = await createClient();
  const slug = slugify(parsed.data.slug || parsed.data.title);

  const { error } = await supabase.from("posts").insert({
    ...parsed.data,
    slug,
    author_id: profile.id,
    featured: formData.get("featured") === "on",
    pinned: formData.get("pinned") === "on",
    published_at:
      parsed.data.status === "published" ? new Date().toISOString() : null
  });

  if (error) {
    redirect(`/admin/posts/new?error=${encodeURIComponent(error.message)}`);
  }

  refreshPublicContent();
  redirect("/admin/posts?message=Informativo salvo.");
}

export async function setPostStatus(formData: FormData) {
  await requireEditor();
  const id = value(formData, "id");
  const status = value(formData, "status");

  if (!id || !["draft", "published"].includes(status)) return;

  const supabase = await createClient();
  await supabase
    .from("posts")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null
    })
    .eq("id", id);

  refreshPublicContent();
  revalidatePath("/admin/posts");
}

export async function deletePost(formData: FormData) {
  await requireEditor();
  const id = value(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);

  refreshPublicContent();
  revalidatePath("/admin/posts");
}

export async function createEvent(formData: FormData) {
  await requireEditor();

  const title = value(formData, "title").trim();
  const startsAt = value(formData, "starts_at");
  if (title.length < 3 || !startsAt) {
    redirect("/admin/events?error=Informe título e data.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("events").insert({
    title,
    description: value(formData, "description").trim(),
    kind: value(formData, "kind") || "event",
    starts_at: new Date(startsAt).toISOString(),
    ends_at: value(formData, "ends_at")
      ? new Date(value(formData, "ends_at")).toISOString()
      : null,
    location: value(formData, "location").trim() || null,
    external_url: value(formData, "external_url").trim() || null,
    all_day: formData.get("all_day") === "on",
    is_published: formData.get("is_published") === "on"
  });

  if (error) {
    redirect(`/admin/events?error=${encodeURIComponent(error.message)}`);
  }

  refreshPublicContent();
  redirect("/admin/events?message=Evento salvo.");
}

export async function deleteEvent(formData: FormData) {
  await requireEditor();
  const id = value(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
  refreshPublicContent();
  revalidatePath("/admin/events");
}

export async function createLocation(formData: FormData) {
  await requireEditor();

  const name = value(formData, "name").trim();
  if (name.length < 2) {
    redirect("/admin/campus?error=Informe o nome do local.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("campus_locations").insert({
    name,
    category: value(formData, "category") || "sector",
    building: value(formData, "building").trim() || null,
    floor: value(formData, "floor").trim() || null,
    reference: value(formData, "reference").trim() || null,
    map_hint: value(formData, "map_hint").trim() || null,
    description: value(formData, "description").trim(),
    is_active: formData.get("is_active") === "on"
  });

  if (error) {
    redirect(`/admin/campus?error=${encodeURIComponent(error.message)}`);
  }

  refreshPublicContent();
  redirect("/admin/campus?message=Local salvo.");
}

export async function deleteLocation(formData: FormData) {
  await requireEditor();
  const id = value(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("campus_locations").delete().eq("id", id);
  refreshPublicContent();
  revalidatePath("/admin/campus");
}

export async function createTransport(formData: FormData) {
  await requireEditor();

  const lineName = value(formData, "line_name").trim();
  const departureTime = value(formData, "departure_time");
  if (lineName.length < 2 || !departureTime) {
    redirect("/admin/campus?error=Informe linha e horário.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("transport_schedules").insert({
    line_name: lineName,
    direction: value(formData, "direction").trim(),
    departure_time: departureTime,
    note: value(formData, "note").trim(),
    valid_from: value(formData, "valid_from") || null,
    valid_until: value(formData, "valid_until") || null,
    is_active: formData.get("is_active") === "on"
  });

  if (error) {
    redirect(`/admin/campus?error=${encodeURIComponent(error.message)}`);
  }

  refreshPublicContent();
  redirect("/admin/campus?message=Horário salvo.");
}

export async function deleteTransport(formData: FormData) {
  await requireEditor();
  const id = value(formData, "id");
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("transport_schedules").delete().eq("id", id);
  refreshPublicContent();
  revalidatePath("/admin/campus");
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();

  const siteName = value(formData, "site_name").trim();
  const tagline = value(formData, "tagline").trim();
  const description = value(formData, "description").trim();

  if (!siteName || !tagline || !description) {
    redirect("/admin/settings?error=Preencha nome, tagline e descrição.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: siteName,
      tagline,
      description,
      instagram_url: value(formData, "instagram_url").trim() || null,
      contact_url: value(formData, "contact_url").trim() || null,
      is_name_placeholder: formData.get("is_name_placeholder") === "on",
      updated_at: new Date().toISOString()
    })
    .eq("id", 1);

  if (error) {
    redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/settings?message=Configurações atualizadas.");
}
