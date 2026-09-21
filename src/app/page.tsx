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

function eventDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "America/Cuiaba"
  }).format(new Date(date));
}

export default async function HomePage() {
  const [settings, posts, events, locations, transport] = await Promise.all([
    getSiteSettings(),
    getPublishedPosts(6),
    getUpcomingEvents(4),
    getLocations(),
    getTransportSchedules()
  ]);

  return (
    <main id="conteudo">
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <span className="soft-badge">Portal acadêmico independente</span>
            <h1>Informação do campus, sem complicação.</h1>
            <p>{settings.description}</p>

            <div className="hero-actions">
              <Link className="primary-button" href="/buscar">
                <Icon name="search" size={18} />
                Encontrar informação
              </Link>
              <Link className="secondary-button" href="/agenda">
                Ver agenda
                <Icon name="arrow" size={17} />
              </Link>
            </div>

            <div className="hero-trust">
              <Icon name="check" size={18} />
              <span>Conteúdo publicado pela equipe editorial e organizado para consulta rápida.</span>
            </div>
          </div>

          <aside className="home-summary" aria-label="Resumo do portal">
            <div className="summary-heading">
              <div>
                <span>Agora no portal</span>
                <strong>Visão rápida</strong>
              </div>
              <Icon name="grid" size={22} />
            </div>
            <div className="summary-grid">
              <Link href="/informativos">
                <strong>{posts.length}</strong>
                <span>informativos recentes</span>
              </Link>
              <Link href="/agenda">
                <strong>{events.length}</strong>
                <span>datas próximas</span>
              </Link>
              <Link href="/campus">
                <strong>{locations.length}</strong>
                <span>locais cadastrados</span>
              </Link>
              <Link href="/campus#transporte">
                <strong>{transport.length}</strong>
                <span>horários ativos</span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="quick-access">
        <div className="container">
          <div className="simple-section-heading">
            <div>
              <span className="section-kicker">Acesso rápido</span>
              <h2>O que você precisa?</h2>
            </div>
          </div>

          <div className="quick-access-grid">
            {([
              ["/informativos", "news", "Informativos", "Avisos, notícias e orientações"],
              ["/agenda", "calendar", "Agenda", "Eventos, prazos e datas importantes"],
              ["/campus", "map", "Guia do campus", "Salas, setores e referências"],
              ["/campus#transporte", "bus", "Transporte", "Horários e destinos"],
              ["/buscar", "search", "Busca global", "Encontre tudo em um só lugar"],
              ["/meu-portal", "bookmark", "Meu portal", "Seus itens salvos neste dispositivo"]
            ] as [string, IconName, string, string][]).map(([href, icon, title, description]) => (
              <Link className="quick-access-card" href={href} key={href}>
                <span className="quick-access-icon"><Icon name={icon} size={22} /></span>
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <Icon name="arrow" size={17} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="simple-section-heading">
            <div>
              <span className="section-kicker">Atualizações</span>
              <h2>Informativos recentes</h2>
            </div>
            <Link className="text-link" href="/informativos">Ver todos <Icon name="arrow" size={16} /></Link>
          </div>

          {posts.length ? (
            <div className="content-card-grid">
              {posts.map((post) => (
                <article className="content-card" key={post.id}>
                  <div className="content-card-meta">
                    <span>{post.type}</span>
                    <time>{post.published_at ? formatDate(post.published_at) : ""}</time>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="content-card-footer">
                    <span>{post.category}</span>
                    <Link href={`/informativos/${post.slug}`}>Ler <Icon name="arrow" size={15} /></Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="friendly-empty compact">
              <Icon name="news" size={30} />
              <h2>Nenhum informativo publicado</h2>
              <p>Quando a equipe publicar novidades, elas aparecerão aqui.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container home-split">
          <div>
            <div className="simple-section-heading">
              <div>
                <span className="section-kicker">Próximas datas</span>
                <h2>Agenda</h2>
              </div>
              <Link className="text-link" href="/agenda">Abrir agenda <Icon name="arrow" size={16} /></Link>
            </div>

            <div className="agenda-preview">
              {events.length ? events.map((event) => (
                <Link className="agenda-preview-row" href={`/agenda#evento-${event.id}`} key={event.id}>
                  <span className="agenda-preview-date">{eventDate(event.starts_at)}</span>
                  <span>
                    <strong>{event.title}</strong>
                    <small>{event.location || event.kind}</small>
                  </span>
                  <Icon name="arrow" size={16} />
                </Link>
              )) : (
                <div className="friendly-empty compact">
                  <p>Nenhuma data futura publicada.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="campus-preview-card">
            <div className="campus-preview-icon"><Icon name="map" size={26} /></div>
            <span className="section-kicker">Guia do campus</span>
            <h2>Chegue ao lugar certo mais rápido.</h2>
            <p>
              Consulte salas, setores, serviços e referências de localização sem depender de instruções vagas.
            </p>
            <Link className="primary-button" href="/campus">Abrir guia <Icon name="arrow" size={16} /></Link>
          </aside>
        </div>
      </section>

      <section className="section trust-section" id="sobre">
        <div className="container trust-grid">
          <div>
            <span className="section-kicker">Sobre o projeto</span>
            <h2>Menos ruído. Mais contexto.</h2>
          </div>
          <p>
            A GRATYS TECH organiza informações do cotidiano acadêmico em uma experiência mais clara e acessível. O portal é independente e não substitui os canais oficiais do IFMT.
          </p>
          <div className="trust-points">
            {["Leitura simples", "Busca centralizada", "Informação organizada", "Acesso rápido"].map((item) => (
              <span key={item}><Icon name="check" size={16} />{item}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
