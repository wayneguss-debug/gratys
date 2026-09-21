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
  const notices = events.filter((event) => event.kind === "notice").length;

  return (
    <main id="conteudo">
      <section className="page-hero agenda-hero">
        <div className="container">
          <p className="eyebrow">DATAS IMPORTANTES</p>
          <h1>Agenda</h1>
          <p>
            Eventos, prazos e avisos organizados por data para facilitar o
            acompanhamento do cotidiano acadêmico.
          </p>
          <div className="archive-stats">
            <span><strong>{events.length}</strong> próximos itens</span>
            <span><strong>{deadlines}</strong> prazos</span>
            <span><strong>{notices}</strong> avisos</span>
          </div>
        </div>
      </section>

      <section className="section deep">
        <div className="container">
          <div className="section-head light">
            <span className="section-number">A</span>
            <div>
              <p className="eyebrow light">CRONOLOGIA</p>
              <h2>O que vem pela frente</h2>
            </div>
          </div>

          {events.length ? (
            <div className="timeline timeline-detailed">
              {events.map((event) => {
                const date = dateParts(event.starts_at);
                return (
                  <article className="timeline-item" key={event.id}>
                    <div className="date-box">
                      <strong>{date.day}</strong>
                      <span>{date.month}</span>
                    </div>
                    <div>
                      <p className="timeline-date-label">{date.full}</p>
                      <h3>{event.title}</h3>
                      <p>
                        {[event.description, event.location]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                      {event.external_url ? (
                        <a className="event-link" href={event.external_url} target="_blank" rel="noreferrer">
                          abrir referência <Icon name="external" size={14} />
                        </a>
                      ) : null}
                    </div>
                    <span className="type-pill">{event.kind}</span>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state dark empty-state-action">
              <Icon name="calendar" size={30} />
              <strong>Nenhuma data futura publicada</strong>
              <span>A agenda será atualizada quando houver informações confirmadas.</span>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
