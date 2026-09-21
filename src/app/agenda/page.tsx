import { FavoriteButton } from "@/components/favorite-button";
import { Icon } from "@/components/icon";
import { getUpcomingEvents } from "@/lib/data";

export const revalidate = 60;

function dateParts(value: string) {
  const date = new Date(value);
  return {
    day: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", timeZone: "America/Cuiaba" }).format(date),
    month: new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "America/Cuiaba" }).format(date),
    full: new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      timeZone: "America/Cuiaba"
    }).format(date)
  };
}

export default async function AgendaPage() {
  const events = await getUpcomingEvents();
  const deadlines = events.filter((event) => event.kind === "deadline").length;

  return (
    <main id="conteudo">
      <section className="page-hero clean-page-hero">
        <div className="container">
          <div className="hero-icon"><Icon name="calendar" size={24} /></div>
          <p className="eyebrow">DATAS IMPORTANTES</p>
          <h1>Agenda</h1>
          <p>
            Eventos, prazos e avisos em ordem cronológica para você saber o que vem pela frente.
          </p>
          <div className="page-actions">
            <a className="secondary-button" href="/agenda/calendario">
              <Icon name="download" size={17} />
              Baixar calendário (.ics)
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="content-toolbar">
            <div><strong>{events.length}</strong><span>próximos itens</span></div>
            <div><strong>{deadlines}</strong><span>prazos</span></div>
          </div>

          {events.length ? (
            <div className="agenda-list">
              {events.map((event) => {
                const date = dateParts(event.starts_at);
                const href = `/agenda#evento-${event.id}`;

                return (
                  <article className="agenda-card" id={`evento-${event.id}`} key={event.id}>
                    <div className="agenda-date">
                      <strong>{date.day}</strong>
                      <span>{date.month}</span>
                    </div>
                    <div className="agenda-content">
                      <div className="agenda-topline">
                        <span className="soft-badge small">{event.kind}</span>
                        <span>{date.full}</span>
                      </div>
                      <h2>{event.title}</h2>
                      <p>{event.description}</p>
                      {event.location ? (
                        <span className="agenda-location"><Icon name="map" size={15} />{event.location}</span>
                      ) : null}
                      <div className="agenda-actions">
                        <FavoriteButton
                          item={{
                            id: event.id,
                            kind: "event",
                            title: event.title,
                            subtitle: event.location || event.kind,
                            href
                          }}
                        />
                        {event.external_url ? (
                          <a className="text-link" href={event.external_url} target="_blank" rel="noreferrer">
                            Abrir referência <Icon name="external" size={14} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="friendly-empty">
              <Icon name="calendar" size={34} />
              <h2>Nenhuma data futura publicada</h2>
              <p>A agenda será atualizada assim que houver informações confirmadas.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
