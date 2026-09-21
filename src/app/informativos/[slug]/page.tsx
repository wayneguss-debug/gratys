import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import { ShareButton } from "@/components/share-button";
import { Icon } from "@/components/icon";
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
        year: "numeric",
        timeZone: "America/Cuiaba"
      }).format(new Date(post.published_at))
    : "sem data";

  const href = `/informativos/${post.slug}`;

  return (
    <main id="conteudo">
      <article className="article-wrap article-clean">
        <nav className="article-breadcrumb" aria-label="Navegação estrutural">
          <a href="/informativos">Informativos</a>
          <Icon name="arrow" size={14} />
          <span>{post.category}</span>
        </nav>

        <div className="article-meta">
          <span>{post.type}</span>
          <span>{published}</span>
          <span>{post.reading_minutes} min de leitura</span>
        </div>

        <h1>{post.title}</h1>
        <p className="article-lead">{post.excerpt}</p>

        <div className="article-actions">
          <FavoriteButton
            item={{
              id: post.id,
              kind: "post",
              title: post.title,
              subtitle: post.category,
              href
            }}
          />
          <ShareButton title={post.title} url={href} />
        </div>

        {post.cover_url?.startsWith("https://jbwrnvmidjvcnkexjsqj.supabase.co/storage/v1/object/public/media/") ? (
          <div className="article-cover">
            <Image
              src={post.cover_url}
              alt=""
              fill
              sizes="(max-width: 860px) 100vw, 820px"
            />
          </div>
        ) : null}

        <div className="article-body">{post.content}</div>

        {post.source_url ? (
          <a
            className="source-card"
            href={post.source_url}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <small>Fonte / referência</small>
              <strong>Consultar conteúdo original</strong>
            </span>
            <Icon name="external" size={18} />
          </a>
        ) : null}
      </article>
    </main>
  );
}
