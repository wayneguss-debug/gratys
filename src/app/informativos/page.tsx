import Link from "next/link";
import { getPublishedPosts } from "@/lib/data";

export const revalidate = 60;

function formatDate(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

export default async function InformativosPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const posts = await getPublishedPosts();
  const term = q.trim().toLocaleLowerCase("pt-BR");
  const filtered = term
    ? posts.filter((post) =>
        [post.title, post.excerpt, post.category, post.type]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(term)
      )
    : posts;

  return (
    <main id="conteudo">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">ARQUIVO DO MURAL</p>
          <h1>Informativos</h1>
          <p>
            Notícias, avisos e orientações publicados pela equipe em ordem de
            atualização.
          </p>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <div className="section-head">
            <span className="section-number">01</span>
            <div>
              <p className="eyebrow">BUSCA</p>
              <h2>{q ? `Resultados para “${q}”` : "Tudo que foi publicado"}</h2>
            </div>
            <form className="search-form" action="/informativos">
              <input
                aria-label="Buscar informativos"
                name="q"
                placeholder="palavra-chave..."
                defaultValue={q}
              />
              <button className="mini-button" type="submit">buscar</button>
            </form>
          </div>

          {filtered.length ? (
            <div className="news-list">
              {filtered.map((post) => (
                <Link className="news-row" href={`/informativos/${post.slug}`} key={post.id}>
                  <span className="date">{formatDate(post.published_at)}</span>
                  <div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                  <span className="tag">{post.type}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              Nenhum informativo corresponde à busca.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
