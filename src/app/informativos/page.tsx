import Link from "next/link";
import { Icon } from "@/components/icon";
import { getPublishedPosts } from "@/lib/data";

export const revalidate = 60;

const typeLabels = {
  news: "Notícias",
  notice: "Avisos",
  orientation: "Orientações"
} as const;

function formatDate(date: string | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Cuiaba"
  }).format(new Date(date));
}

function filterHref(q: string, type?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (type) params.set("type", type);
  const query = params.toString();
  return query ? `/informativos?${query}` : "/informativos";
}

export default async function InformativosPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q = "", type = "" } = await searchParams;
  const posts = await getPublishedPosts();
  const term = q.trim().toLocaleLowerCase("pt-BR");
  const validType = ["news", "notice", "orientation"].includes(type) ? type : "";

  const filtered = posts.filter((post) => {
    const matchesTerm = term
      ? [post.title, post.excerpt, post.category, post.type]
          .join(" ")
          .toLocaleLowerCase("pt-BR")
          .includes(term)
      : true;
    const matchesType = validType ? post.type === validType : true;
    return matchesTerm && matchesType;
  });

  return (
    <main id="conteudo">
      <section className="page-hero archive-hero">
        <div className="container">
          <p className="eyebrow">ARQUIVO DO MURAL</p>
          <h1>Informativos</h1>
          <p>
            Notícias, avisos e orientações publicados pela equipe em ordem de
            atualização.
          </p>
          <div className="archive-stats">
            <span><strong>{posts.length}</strong> publicações</span>
            <span><strong>{filtered.length}</strong> exibidas</span>
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <div className="filter-toolbar">
            <form className="search-form search-form-box" action="/informativos">
              <Icon name="search" size={18} />
              <input
                aria-label="Buscar informativos"
                name="q"
                placeholder="buscar por título, assunto ou categoria..."
                defaultValue={q}
              />
              {validType ? <input type="hidden" name="type" value={validType} /> : null}
              <button className="mini-button" type="submit">buscar</button>
            </form>

            <nav className="filter-chips" aria-label="Filtrar por tipo">
              <Link className={!validType ? "active" : ""} href={filterHref(q)}>Todos</Link>
              {Object.entries(typeLabels).map(([key, label]) => (
                <Link
                  className={validType === key ? "active" : ""}
                  href={filterHref(q, key)}
                  key={key}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="section-head compact-section-head">
            <span className="section-number">01</span>
            <div>
              <p className="eyebrow">RESULTADOS</p>
              <h2>
                {q
                  ? `Busca por “${q}”`
                  : validType
                    ? typeLabels[validType as keyof typeof typeLabels]
                    : "Tudo que foi publicado"}
              </h2>
            </div>
            <span className="result-counter">{filtered.length} resultado{filtered.length === 1 ? "" : "s"}</span>
          </div>

          {filtered.length ? (
            <div className="news-list">
              {filtered.map((post) => (
                <Link className="news-row" href={`/informativos/${post.slug}`} key={post.id}>
                  <span className="date">{formatDate(post.published_at)}</span>
                  <div>
                    <p className="row-category">{post.category}</p>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                  <span className="row-tail">
                    <span className="tag">{typeLabels[post.type]}</span>
                    <Icon name="arrow" size={18} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state empty-state-action">
              <Icon name="search" size={28} />
              <strong>Nenhum informativo encontrado</strong>
              <span>Tente outro termo ou remova os filtros.</span>
              <Link className="mini-button" href="/informativos">limpar filtros</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
