"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireEditor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().min(4).max(180),
  slug: z.string().trim().min(1).max(180),
  excerpt: z.string().trim().min(10).max(420),
  content: z.string().trim().min(20),
  type: z.enum(["news", "notice", "orientation"]),
  category: z.string().trim().min(2).max(60),
  status: z.enum(["draft", "published"]),
  reading_minutes: z.coerce.number().int().min(1).max(60),
  cover_url: z.string().trim(),
  source_url: z.string().trim()
});

export async function updatePost(formData: FormData) {
  await requireEditor();

  const parsed = schema.safeParse({
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    type: String(formData.get("type") ?? ""),
    category: String(formData.get("category") ?? ""),
    status: String(formData.get("status") ?? ""),
    reading_minutes: String(formData.get("reading_minutes") ?? "2"),
    cover_url: String(formData.get("cover_url") ?? ""),
    source_url: String(formData.get("source_url") ?? "")
  });

  if (!parsed.success) {
    const id = String(formData.get("id") ?? "");
    redirect(`/admin/posts/${id}/edit?error=Revise os campos.`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      content: parsed.data.content,
      type: parsed.data.type,
      category: parsed.data.category,
      status: parsed.data.status,
      reading_minutes: parsed.data.reading_minutes,
      cover_url: parsed.data.cover_url || null,
      source_url: parsed.data.source_url || null,
      featured: formData.get("featured") === "on",
      pinned: formData.get("pinned") === "on",
      published_at:
        parsed.data.status === "published" ? new Date().toISOString() : null
    })
    .eq("id", parsed.data.id);

  if (error) {
    redirect(
      `/admin/posts/${parsed.data.id}/edit?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath("/");
  revalidatePath("/informativos");
  revalidatePath(`/informativos/${parsed.data.slug}`);
  redirect("/admin/posts?message=Informativo atualizado.");
}
