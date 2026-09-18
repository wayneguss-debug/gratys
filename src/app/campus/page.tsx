import { getLocations, getTransportSchedules } from "@/lib/data";

export const revalidate = 60;

export default async function CampusPage() {
  const [locations, transport] = await Promise.all([
    getLocations(),
    getTransportSchedules()
  ]);

  return (
    <main id="conteudo">
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">GUIA PRÁTICO</p>
          <h1>Campus</h1>
          <p>
            Localização de setores, salas e serviços, além de horários de
            transporte publicados pela equipe.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container campus-layout">
          <div className="campus-intro">
            <p className="eyebrow">LOCAIS</p>
            <h2>Onde fica?</h2>
            <p>
              A lista só exibe informações marcadas como ativas e confirmadas.
            </p>
          </div>

          <div className="location-list">
            {locations.length ? (
              locations.map((location) => (
                <article className="location-item" key={location.id}>
                  <div>
                    <strong>{location.name}</strong>
                    <p>
                      {[
                        location.building,
                        location.floor,
                        location.reference,
                        location.map_hint
                      ]
                        .filter(Boolean)
                        .join(" • ") || location.description}
                    </p>
                  </div>
                  <span className="location-tag">{location.category}</span>
                </article>
              ))
            ) : (
              <div className="empty-state">
                Nenhum local confirmado foi cadastrado ainda.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <div className="section-head">
            <span className="section-number">T</span>
            <div>
              <p className="eyebrow">TRANSPORTE</p>
              <h2>Horários publicados</h2>
            </div>
          </div>

          {transport.length ? (
            <div className="transport-list">
              {transport.map((item) => (
                <article className="transport-card" key={item.id}>
                  <time>{item.departure_time.slice(0, 5)}</time>
                  <strong>{item.line_name}</strong>
                  <span>{item.direction}</span>
                  {item.note ? <span>{item.note}</span> : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              A equipe ainda não publicou horários confirmados.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
