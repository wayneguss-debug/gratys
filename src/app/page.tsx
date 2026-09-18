import Link from "next/link";
import {
  getLocations,
  getPublishedPosts,
  getSiteSettings,
  getTransportSchedules,
  getUpcomingEvents
} from "@/lib/data";

export const revalidate = 60;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function formatEventDate(date: string) {
  const d = new Date(date);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("pt-BR", { month: "short" })
  };
}

export default async function HomePage() {
  const [settings, posts, events, locations, transport] = await Promise.all([
    getSiteSettings(),
    getPublishedPosts(7),
    getUpcomingEvents(5),
    getLocations(),
    getTransportSchedules()
  ]);

  return (
    <main id="conteudo">
      <section className="hero">
        <div className="container hero-layout">
          <div>
            <div className="issue-line">
              <span>EDIÇÃO DIGITAL</span>
              <span>2026</span>
            </div>
            <h1>
              O campus
              <br />
              acontece <em>aqui.</em>
            </h1>
            <p className="hero-copy">{settings.description}</p>
            <div className="hero-actions">
              <Link className="button solid" href="/informativos">
                Abrir mural
              </Link>
              <Link className="button text" href="/agenda">
                Ver próximos prazos →
              </Link>
            </div>
            <p className="disclaimer">
              Projeto acadêmico independente. Para decisões importantes, confirme
              também nos canais oficiais do IFMT.
            </p>
          </div>

          <aside className="hero-board" aria-label="O que você encontra aqui">
            <div className="board-pin" />
            <p className="board-kicker">NO MURAL</p>
            <div className="board-stat">
              <strong>01</strong>
              <span>Informativos e novidades</span>
            </div>
            <div className="board-stat">
              <strong>02</strong>
              <span>Eventos e processos seletivos</span>
            </div>
            <div className="board-stat">
              <strong>03</strong>
              <span>Regras, salas e transporte</span>
            </div>
            <div className="board-note">
              {settings.is_name_placeholder
                ? "Identidade em construção • conteúdo real"
                : "Atualização contínua pela equipe"}
            </div>
          </aside>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <div className="section-head">
            <span className="section-number">01</span>
            <div>
              <p className="eyebrow">O QUE VOCÊ PRECISA SABER</p>
              <h2>Informativos</h2>
            </div>
            <Link className="button text" href="/informativos">
              ver todos →
            </Link>
          </div>

          {posts.length ? (
            <div className="cards-grid">
              {posts.map((post, index) => (
                <article
                  className={`news-card ${index === 0 || post.featured ? "featured" : ""}`}
                  key={post.id}
                >
                  <div className="meta">
                    <span>{post.type}</span>
                    <span>{post.published_at ? formatDate(post.published_at) : ""}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link className="read-more" href={`/informativos/${post.slug}`}>
                    ler informativo →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">Nenhum informativo publicado ainda.</div>
          )}
        </div>
      </section>

      <section className="section deep">
        <div className="container">
          <div className="section-head light">
            <span className="section-number">02</span>
            <div>
              <p className="eyebrow light">MARQUE NA AGENDA</p>
              <h2>Próximos eventos e prazos</h2>
            </div>
            <Link className="button text" href="/agenda">
              agenda completa →
            </Link>
          </div>

          {events.length ? (
            <div className="timeline">
              {events.map((event) => {
                const date = formatEventDate(event.starts_at);
                return (
                  <article className="timeline-item" key={event.id}>
                    <div className="date-box">
                      <strong>{date.day}</strong>
                      <span>{date.month}</span>
                    </div>
                    <div>
                      <h3>{event.title}</h3>
                      <p>
                        {[event.description, event.location]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>
                    <span className="type-pill">{event.kind}</span>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state dark">
              A equipe ainda não publicou eventos ou prazos confirmados.
            </div>
          )}
        </div>
      </section>

      <section className="section yellow">
        <div className="container">
          <div className="section-head">
            <span className="section-number">03</span>
            <div>
              <p className="eyebrow">GUIA RÁPIDO</p>
              <h2>Entenda sem burocracia.</h2>
            </div>
          </div>

          <div className="guide-list">
            {[
              ["A", "Regras básicas", "Orientações institucionais reunidas em linguagem mais simples para consulta rápida."],
              ["B", "Processos e prazos", "Datas importantes, processos seletivos e atividades que precisam de atenção."],
              ["C", "Mudanças e avisos", "Palestras, alterações de horário, saídas antecipadas e comunicados relevantes."]
            ].map(([index, title, copy]) => (
              <article className="guide-row" key={index}>
                <span className="guide-index">{index}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
                <span className="guide-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="campus">
        <div className="container campus-layout">
          <div className="campus-intro">
            <span className="section-number">04</span>
            <p className="eyebrow">MAPA MENTAL DO CAMPUS</p>
            <h2>Onde fica?</h2>
            <p>
              Um guia simples para reduzir a dependência de instruções vagas e
              facilitar a localização de setores e salas.
            </p>
            <div className="hero-actions">
              <Link className="button solid" href="/campus">
                abrir guia do campus
              </Link>
            </div>
          </div>

          <div className="location-list">
            {locations.slice(0, 6).map((location) => (
              <article className="location-item" key={location.id}>
                <div>
                  <strong>{location.name}</strong>
                  <p>
                    {[location.building, location.floor, location.reference]
                      .filter(Boolean)
                      .join(" • ") || location.description}
                  </p>
                </div>
                <span className="location-tag">{location.category}</span>
              </article>
            ))}
            {!locations.length && (
              <div className="empty-state">
                O guia será preenchido apenas com locais confirmados pela equipe.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <div className="section-head">
            <span className="section-number">05</span>
            <div>
              <p className="eyebrow">MOBILIDADE</p>
              <h2>Transporte sem adivinhação.</h2>
            </div>
          </div>

          {transport.length ? (
            <div className="transport-list">
              {transport.slice(0, 6).map((item) => (
                <article className="transport-card" key={item.id}>
                  <time>{item.departure_time.slice(0, 5)}</time>
                  <strong>{item.line_name}</strong>
                  <span>
                    {item.direction}
                    {item.note ? ` • ${item.note}` : ""}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              Nenhum horário de transporte confirmado foi publicado ainda.
            </div>
          )}
        </div>
      </section>

      <section className="manifesto" id="sobre">
        <div className="container manifesto-grid">
          <div className="manifesto-mark">“</div>
          <div>
            <p className="eyebrow">SOBRE O PROJETO</p>
            <h2>Informação útil não deveria parecer um labirinto.</h2>
            <p className="manifesto-copy">
              A proposta da GRATYS TECH é aproximar a comunicação do cotidiano
              real de alunos e servidores: menos ruído, menos procura e mais
              contexto.
            </p>
          </div>
          <div className="values-cloud" aria-label="Valores da equipe">
            {["Inclusão", "Veracidade", "Integridade", "Responsabilidade", "Respeito", "Confiança"].map(
              (value) => <span key={value}>{value}</span>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
