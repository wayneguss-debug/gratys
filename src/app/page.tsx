import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";
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
    year: "numeric",
    timeZone: "America/Cuiaba"
  }).format(new Date(date));
}

function formatEventDate(date: string) {
  const d = new Date(date);
  return {
    day: new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      timeZone: "America/Cuiaba"
    }).format(d),
    month: new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      timeZone: "America/Cuiaba"
    }).format(d)
  };
}

export default async function HomePage() {
  const [settings, allPosts, allEvents, locations, transport] = await Promise.all([
    getSiteSettings(),
    getPublishedPosts(),
    getUpcomingEvents(),
    getLocations(),
    getTransportSchedules()
  ]);

  const posts = allPosts.slice(0, 7);
  const events = allEvents.slice(0, 5);

  const quickLinks: {
    href: string;
    icon: IconName;
    eyebrow: string;
    title: string;
    detail: string;
  }[] = [
    {
      href: "/informativos",
      icon: "news",
      eyebrow: "MURAL",
      title: "Informativos",
      detail: allPosts.length === 1 ? "1 publicação disponível" : `${allPosts.length} publicações disponíveis`
    },
    {
      href: "/agenda",
      icon: "calendar",
      eyebrow: "DATAS",
      title: "Agenda",
      detail: allEvents.length === 1 ? "1 item futuro" : `${allEvents.length} itens futuros`
    },
    {
      href: "/campus",
      icon: "map",
      eyebrow: "GUIA",
      title: "Campus",
      detail: locations.length === 1 ? "1 local confirmado" : `${locations.length} locais confirmados`
    },
    {
      href: "/campus#transporte",
      icon: "bus",
      eyebrow: "MOBILIDADE",
      title: "Transporte",
      detail: transport.length === 1 ? "1 horário ativo" : `${transport.length} horários ativos`
    }
  ];

  return (
    <main id="conteudo">
      <section className="hero">
        <div className="container hero-layout">
          <div>
            <div className="issue-line">
              <span>EDIÇÃO DIGITAL</span>
              <span>IFMT • 2026</span>
            </div>
            <h1>
              O campus
              <br />
              acontece <em>aqui.</em>
            </h1>
            <p className="hero-copy">{settings.description}</p>
            <div className="hero-actions">
              <Link className="button solid" href="/informativos">
                Abrir mural <Icon name="arrow" size={16} />
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

          <aside className="hero-board" aria-label="Resumo do portal">
            <div className="board-pin" />
            <p className="board-kicker">PAINEL DO CAMPUS</p>
            <div className="board-stat">
              <strong>{String(allPosts.length).padStart(2, "0")}</strong>
              <span>informativos publicados</span>
            </div>
            <div className="board-stat">
              <strong>{String(allEvents.length).padStart(2, "0")}</strong>
              <span>datas futuras na agenda</span>
            </div>
            <div className="board-stat">
              <strong>{String(locations.length).padStart(2, "0")}</strong>
              <span>locais no guia</span>
            </div>
            <div className="board-note">
              {settings.is_name_placeholder
                ? "Identidade em construção • conteúdo real"
                : "Atualização contínua pela equipe"}
            </div>
          </aside>
        </div>
      </section>

      <section className="portal-shortcuts" aria-label="Acessos rápidos">
        <div className="container shortcut-grid">
          {quickLinks.map((item) => (
            <Link className="shortcut-card" href={item.href} key={item.href}>
              <span className="shortcut-icon"><Icon name={item.icon} size={21} /></span>
              <span className="shortcut-copy">
                <small>{item.eyebrow}</small>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </span>
              <Icon name="arrow" size={17} />
            </Link>
          ))}
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
                    ler informativo <Icon name="arrow" size={14} />
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
                abrir guia do campus <Icon name="arrow" size={16} />
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

      <section className="section white" id="transporte">
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
