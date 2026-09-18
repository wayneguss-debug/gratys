import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const posts = await getPublishedPosts();

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/informativos`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/agenda`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/campus`, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${base}/informativos/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
