import { getUpcomingEvents } from "@/lib/data";

export const revalidate = 60;

export default async function AgendaPage() {
  const events = await getUpcomingEvents();

  return (
    <main id="conteudo">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">DATAS IMPORTANTES</p>
          <h1>Agenda</h1>
          <p>
            Eventos, prazos e avisos organizados por data para facilitar o
            acompanhamento do cotidiano acadêmico.
          </p>
        </div>
      </section>

      <section className="section deep">
        <div className="container">
          {events.length ? (
            <div className="timeline">
              {events.map((event) => {
                const date = new Date(event.starts_at);
                return (
                  <article className="timeline-item" key={event.id}>
                    <div className="date-box">
                      <strong>{String(date.getDate()).padStart(2, "0")}</strong>
                      <span>{date.toLocaleDateString("pt-BR", { month: "short" })}</span>
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
              Nenhum evento ou prazo confirmado foi publicado ainda.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
