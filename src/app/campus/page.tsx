import { FavoriteButton } from "@/components/favorite-button";
import { Icon } from "@/components/icon";
import { getLocations, getTransportSchedules } from "@/lib/data";

export const revalidate = 60;

export default async function CampusPage() {
  const [locations, transport] = await Promise.all([
    getLocations(),
    getTransportSchedules()
  ]);

  return (
    <main id="conteudo">
      <section className="page-hero clean-page-hero">
        <div className="container">
          <div className="hero-icon"><Icon name="map" size={24} /></div>
          <p className="eyebrow">GUIA PRÁTICO</p>
          <h1>Campus</h1>
          <p>
            Encontre salas, setores e serviços com referências mais claras e consulte horários de transporte.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container campus-page-grid">
          <aside className="campus-side">
            <span className="section-kicker">Locais confirmados</span>
            <h2>Onde fica?</h2>
            <p>Use as referências abaixo para localizar o destino sem depender de instruções vagas.</p>
            <div className="side-stat"><strong>{locations.length}</strong><span>locais cadastrados</span></div>
          </aside>

          <div className="location-cards">
            {locations.length ? locations.map((location, index) => {
              const href = `/campus#local-${location.id}`;
              return (
                <article className="location-card" id={`local-${location.id}`} key={location.id}>
                  <div className="location-card-head">
                    <span className="location-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="soft-badge small">{location.category}</span>
                    <FavoriteButton
                      compact
                      item={{
                        id: location.id,
                        kind: "location",
                        title: location.name,
                        subtitle: location.reference || location.category,
                        href
                      }}
                    />
                  </div>
                  <h3>{location.name}</h3>
                  <p className="location-primary">
                    {[location.building, location.floor, location.reference].filter(Boolean).join(" • ") || "Referência ainda não informada"}
                  </p>
                  {location.map_hint ? <p><strong>Como chegar:</strong> {location.map_hint}</p> : null}
                  {location.description ? <p>{location.description}</p> : null}
                </article>
              );
            }) : (
              <div className="friendly-empty compact"><p>Nenhum local confirmado foi cadastrado ainda.</p></div>
            )}
          </div>
        </div>
      </section>

      <section className="section section-soft" id="transporte">
        <div className="container">
          <div className="simple-section-heading">
            <div>
              <span className="section-kicker">Mobilidade</span>
              <h2>Transporte</h2>
            </div>
            <span className="section-count">{transport.length} horários</span>
          </div>

          {transport.length ? (
            <div className="transport-grid">
              {transport.map((item) => (
                <article className="transport-item" key={item.id}>
                  <div className="transport-time">{item.departure_time.slice(0, 5)}</div>
                  <div>
                    <strong>{item.line_name}</strong>
                    <span>{item.direction}</span>
                    {item.note ? <small>{item.note}</small> : null}
                  </div>
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
          ) : (
            <div className="friendly-empty compact"><p>Nenhum horário confirmado foi publicado ainda.</p></div>
          )}
        </div>
      </section>
    </main>
  );
}
