import {
  createLocation,
  createTransport,
  deleteLocation,
  deleteTransport
} from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCampusPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  const supabase = await createClient();

  const [{ data: locations }, { data: transport }] = await Promise.all([
    supabase.from("campus_locations").select("*").order("name"),
    supabase.from("transport_schedules").select("*").order("departure_time")
  ]);

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">CAMPUS</p>
          <h1>Locais e transporte</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert">{message}</div> : null}

      <div className="two-col">
        <form className="admin-card form-stack" action={createLocation}>
          <h3>Novo local</h3>
          <div className="field">
            <label htmlFor="location-name">Nome</label>
            <input id="location-name" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="location-category">Categoria</label>
            <select id="location-category" name="category" defaultValue="sector">
              <option value="room">Sala</option>
              <option value="sector">Setor</option>
              <option value="service">Serviço</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="building">Bloco</label>
              <input id="building" name="building" />
            </div>
            <div className="field">
              <label htmlFor="floor">Piso</label>
              <input id="floor" name="floor" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="reference">Referência</label>
            <input id="reference" name="reference" />
          </div>
          <div className="field">
            <label htmlFor="map-hint">Como chegar</label>
            <input id="map-hint" name="map_hint" />
          </div>
          <div className="field">
            <label htmlFor="location-description">Descrição</label>
            <textarea id="location-description" name="description" />
          </div>
          <label className="checkbox-row">
            <input type="checkbox" name="is_active" defaultChecked />
            Exibir no portal
          </label>
          <button className="button solid" type="submit">salvar local</button>
        </form>

        <form className="admin-card form-stack" action={createTransport}>
          <h3>Novo horário</h3>
          <div className="field">
            <label htmlFor="line-name">Linha/identificação</label>
            <input id="line-name" name="line_name" required />
          </div>
          <div className="field">
            <label htmlFor="direction">Destino/sentido</label>
            <input id="direction" name="direction" required />
          </div>
          <div className="field">
            <label htmlFor="departure">Horário</label>
            <input id="departure" name="departure_time" type="time" required />
          </div>
          <div className="field">
            <label htmlFor="transport-note">Observação</label>
            <input id="transport-note" name="note" />
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="valid-from">Válido a partir de</label>
              <input id="valid-from" name="valid_from" type="date" />
            </div>
            <div className="field">
              <label htmlFor="valid-until">Válido até</label>
              <input id="valid-until" name="valid_until" type="date" />
            </div>
          </div>
          <label className="checkbox-row">
            <input type="checkbox" name="is_active" defaultChecked />
            Exibir no portal
          </label>
          <button className="button solid" type="submit">salvar horário</button>
        </form>
      </div>

      <div className="two-col">
        <div className="admin-card">
          <h3>Locais cadastrados</h3>
          {(locations ?? []).map((location) => (
            <div className="guide-row" key={location.id}>
              <span className="guide-index">•</span>
              <div>
                <strong>{location.name}</strong>
                <p>{location.category}</p>
              </div>
              <form action={deleteLocation}>
                <input type="hidden" name="id" value={location.id} />
                <button className="mini-button danger" type="submit">excluir</button>
              </form>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h3>Horários cadastrados</h3>
          {(transport ?? []).map((item) => (
            <div className="guide-row" key={item.id}>
              <span className="guide-index">{String(item.departure_time).slice(0, 5)}</span>
              <div>
                <strong>{item.line_name}</strong>
                <p>{item.direction}</p>
              </div>
              <form action={deleteTransport}>
                <input type="hidden" name="id" value={item.id} />
                <button className="mini-button danger" type="submit">excluir</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
