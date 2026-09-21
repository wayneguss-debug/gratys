import { Icon } from "@/components/icon";
import { getLocations, getTransportSchedules } from "@/lib/data";

export const revalidate = 60;

export default async function CampusPage() {
  const [locations, transport] = await Promise.all([
    getLocations(),
    getTransportSchedules()
  ]);

  const services = locations.filter((location) => location.category === "service").length;
  const rooms = locations.filter((location) => location.category === "room").length;

  return (
    <main id="conteudo">
      <section className="page-hero campus-hero">
        <div className="container">
          <p className="eyebrow">GUIA PRÁTICO</p>
          <h1>Campus</h1>
          <p>
            Localização de setores, salas e serviços, além de horários de
            transporte publicados pela equipe.
          </p>
          <div className="archive-stats">
            <span><strong>{locations.length}</strong> locais</span>
            <span><strong>{services}</strong> serviços</span>
            <span><strong>{rooms}</strong> salas</span>
            <span><strong>{transport.length}</strong> horários</span>
          </div>
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
            <div className="campus-tip">
              <Icon name="map" size={20} />
              <span>Use bloco, piso e referência para localizar o destino mais rápido.</span>
            </div>
          </div>

          <div className="location-list">
            {locations.length ? (
              locations.map((location, index) => (
                <article className="location-item location-item-rich" key={location.id}>
                  <span className="location-number">{String(index + 1).padStart(2, "0")}</span>
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
                    {location.description ? <small>{location.description}</small> : null}
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

      <section className="section white" id="transporte">
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
                <article className="transport-card transport-card-rich" key={item.id}>
                  <span className="transport-icon"><Icon name="bus" size={20} /></span>
                  <time>{item.departure_time.slice(0, 5)}</time>
                  <strong>{item.line_name}</strong>
                  <span>{item.direction}</span>
                  {item.note ? <small>{item.note}</small> : null}
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
