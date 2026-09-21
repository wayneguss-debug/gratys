import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data";

function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  return host ? `https://${host.replace(/^https?:\/\//, "")}` : "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const posts = await getPublishedPosts();

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/informativos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/agenda`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/campus`, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((post) => ({
      url: `${base}/informativos/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
