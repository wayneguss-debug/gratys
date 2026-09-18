import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Informativo não encontrado" };

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function InformativoPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const published = post.published_at
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(new Date(post.published_at))
    : "sem data";

  return (
    <main id="conteudo">
      <article className="article-wrap">
        <div className="article-meta">
          <span>{post.type}</span>
          <span>{post.category}</span>
          <span>{published}</span>
          <span>{post.reading_minutes} min de leitura</span>
        </div>

        <h1>{post.title}</h1>
        <p className="article-lead">{post.excerpt}</p>

        {post.cover_url?.startsWith("https://jbwrnvmidjvcnkexjsqj.supabase.co/storage/v1/object/public/media/") ? (
          <Image
            src={post.cover_url}
            alt=""
            width={1600}
            height={900}
            sizes="(max-width: 860px) 100vw, 820px"
            style={{ width: "100%", height: "auto", marginTop: 34 }}
          />
        ) : null}

        <div className="article-body">{post.content}</div>

        {post.source_url ? (
          <a
            className="article-source"
            href={post.source_url}
            target="_blank"
            rel="noreferrer"
          >
            consultar fonte original →
          </a>
        ) : null}
      </article>
    </main>
  );
}
