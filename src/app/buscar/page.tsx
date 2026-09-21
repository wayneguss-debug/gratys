import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { Icon } from "@/components/icon";
import {
  getLocations,
  getPublishedPosts,
  getTransportSchedules,
  getUpcomingEvents
} from "@/lib/data";

export const revalidate = 60;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

function matches(term: string, values: Array<string | null | undefined>) {
  const haystack = normalize(values.filter(Boolean).join(" "));
  return haystack.includes(term);
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const term = normalize(query);

  const [posts, events, locations, transport] = await Promise.all([
    getPublishedPosts(),
    getUpcomingEvents(),
    getLocations(),
    getTransportSchedules()
  ]);

  const postResults = term
    ? posts.filter((post) =>
        matches(term, [post.title, post.excerpt, post.category, post.content])
      )
    : [];
  const eventResults = term
    ? events.filter((event) =>
        matches(term, [event.title, event.description, event.location, event.kind])
      )
    : [];
  const locationResults = term
    ? locations.filter((location) =>
        matches(term, [
          location.name,
          location.category,
          location.building,
          location.floor,
          location.reference,
          location.description
        ])
      )
    : [];
  const transportResults = term
    ? transport.filter((item) =>
        matches(term, [item.line_name, item.direction, item.note])
      )
    : [];

  const total =
    postResults.length +
    eventResults.length +
    locationResults.length +
    transportResults.length;

  return (
    <main id="conteudo">
      <section className="page-hero clean-page-hero search-hero">
        <div className="container">
          <div className="hero-icon"><Icon name="search" size={24} /></div>
          <p className="eyebrow">BUSCA GLOBAL</p>
          <h1>Encontrar no portal</h1>
          <p>
            Pesquise ao mesmo tempo em informativos, agenda, locais e transporte.
          </p>

          <form className="global-search-page" action="/buscar">
            <Icon name="search" size={20} />
            <input
              autoFocus
              defaultValue={query}
              name="q"
              placeholder="Ex.: biblioteca, matrícula, ônibus..."
              type="search"
            />
            <button className="primary-button" type="submit">Buscar</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!query ? (
            <div className="friendly-empty compact">
              <Icon name="search" size={30} />
              <h2>Digite o que você precisa encontrar</h2>
              <p>A busca usa apenas o conteúdo que já foi confirmado e publicado no portal.</p>
            </div>
          ) : (
            <>
              <div className="search-summary">
                <strong>{total}</strong>
                <span>{total === 1 ? "resultado" : "resultados"} para “{query}”</span>
              </div>

              {total === 0 ? (
                <div className="friendly-empty compact">
                  <Icon name="search" size={30} />
                  <h2>Nada encontrado</h2>
                  <p>Tente uma palavra mais curta ou um assunto diferente.</p>
                </div>
              ) : (
                <div className="search-groups">
                  {postResults.length ? (
                    <section>
                      <div className="simple-section-heading">
                        <h2>Informativos</h2><span>{postResults.length}</span>
                      </div>
                      <div className="result-list">
                        {postResults.map((post) => (
                          <article className="result-card" key={post.id}>
                            <Link href={`/informativos/${post.slug}`}>
                              <span className="result-type">Informativo</span>
                              <h3>{post.title}</h3>
                              <p>{post.excerpt}</p>
                            </Link>
                            <FavoriteButton
                              compact
                              item={{
                                id: post.id,
                                kind: "post",
                                title: post.title,
                                subtitle: post.category,
                                href: `/informativos/${post.slug}`
                              }}
                            />
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {eventResults.length ? (
                    <section>
                      <div className="simple-section-heading">
                        <h2>Agenda</h2><span>{eventResults.length}</span>
                      </div>
                      <div className="result-list">
                        {eventResults.map((event) => (
                          <article className="result-card" key={event.id}>
                            <Link href={`/agenda#evento-${event.id}`}>
                              <span className="result-type">Agenda</span>
                              <h3>{event.title}</h3>
                              <p>{[event.description, event.location].filter(Boolean).join(" • ")}</p>
                            </Link>
                            <FavoriteButton
                              compact
                              item={{
                                id: event.id,
                                kind: "event",
                                title: event.title,
                                subtitle: event.location || event.kind,
                                href: `/agenda#evento-${event.id}`
                              }}
                            />
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {locationResults.length ? (
                    <section>
                      <div className="simple-section-heading">
                        <h2>Locais</h2><span>{locationResults.length}</span>
                      </div>
                      <div className="result-list">
                        {locationResults.map((location) => (
                          <article className="result-card" key={location.id}>
                            <Link href={`/campus#local-${location.id}`}>
                              <span className="result-type">Campus</span>
                              <h3>{location.name}</h3>
                              <p>{[location.building, location.floor, location.reference].filter(Boolean).join(" • ") || location.description}</p>
                            </Link>
                            <FavoriteButton
                              compact
                              item={{
                                id: location.id,
                                kind: "location",
                                title: location.name,
                                subtitle: location.reference || location.category,
                                href: `/campus#local-${location.id}`
                              }}
                            />
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {transportResults.length ? (
                    <section>
                      <div className="simple-section-heading">
                        <h2>Transporte</h2><span>{transportResults.length}</span>
                      </div>
                      <div className="result-list">
                        {transportResults.map((item) => (
                          <article className="result-card" key={item.id}>
                            <Link href="/campus#transporte">
                              <span className="result-type">Transporte</span>
                              <h3>{item.line_name} • {item.departure_time.slice(0, 5)}</h3>
                              <p>{item.direction}{item.note ? ` • ${item.note}` : ""}</p>
                            </Link>
                            <FavoriteButton
                              compact
                              item={{
                                id: item.id,
                                kind: "transport",
                                title: `${item.line_name} • ${item.departure_time.slice(0, 5)}`,
                                subtitle: item.direction,
                                href: "/campus#transporte"
                              }}
                            />
                          </article>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
