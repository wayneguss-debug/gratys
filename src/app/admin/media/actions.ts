"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireEditor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
]);

function safeFilename(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "bin";
  const base = name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${base || "imagem"}.${extension}`;
}

export async function uploadMedia(formData: FormData) {
  const profile = await requireEditor();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/media?error=Selecione uma imagem.");
  }

  if (!allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
    redirect(
      "/admin/media?error=Use JPG, PNG, WEBP ou AVIF com no máximo 5 MB."
    );
  }

  const supabase = await createClient();
  const path = `${profile.id}/${Date.now()}-${safeFilename(file.name)}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false
  });

  if (error) {
    redirect(`/admin/media?error=${encodeURIComponent(error.message)}`);
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  revalidatePath("/admin/media");
  redirect(`/admin/media?url=${encodeURIComponent(data.publicUrl)}`);
}

export async function deleteMedia(formData: FormData) {
  const profile = await requireEditor();
  const path = String(formData.get("path") ?? "");

  if (!path.startsWith(`${profile.id}/`) || path.includes("..")) {
    redirect("/admin/media?error=Arquivo inválido.");
  }

  const supabase = await createClient();
  const { error } = await supabase.storage.from("media").remove([path]);

  if (error) {
    redirect(`/admin/media?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/media");
  redirect("/admin/media?message=Imagem removida.");
}
