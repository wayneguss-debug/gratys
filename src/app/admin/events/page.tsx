import { createEvent, deleteEvent } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEventsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">AGENDA</p>
          <h1>Eventos e prazos</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert">{message}</div> : null}

      <form className="admin-card form-stack" action={createEvent}>
        <div className="two-col">
          <div className="field">
            <label htmlFor="event-title">Título</label>
            <input id="event-title" name="title" required />
          </div>
          <div className="field">
            <label htmlFor="kind">Tipo</label>
            <select id="kind" name="kind" defaultValue="event">
              <option value="event">Evento</option>
              <option value="deadline">Prazo</option>
              <option value="notice">Aviso</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="event-description">Descrição</label>
          <textarea id="event-description" name="description" />
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="starts-at">Início</label>
            <input id="starts-at" name="starts_at" type="datetime-local" required />
          </div>
          <div className="field">
            <label htmlFor="ends-at">Fim</label>
            <input id="ends-at" name="ends_at" type="datetime-local" />
          </div>
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="location">Local</label>
            <input id="location" name="location" />
          </div>
          <div className="field">
            <label htmlFor="external-url">Link externo</label>
            <input id="external-url" name="external_url" type="url" />
          </div>
        </div>

        <div className="two-col">
          <label className="checkbox-row">
            <input type="checkbox" name="all_day" />
            Dia inteiro
          </label>
          <label className="checkbox-row">
            <input type="checkbox" name="is_published" />
            Publicar agora
          </label>
        </div>

        <button className="button solid" type="submit">
          salvar na agenda
        </button>
      </form>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Publicado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(events ?? []).map((event) => (
              <tr key={event.id}>
                <td>{new Intl.DateTimeFormat("pt-BR").format(new Date(event.starts_at))}</td>
                <td>{event.title}</td>
                <td>{event.kind}</td>
                <td>{event.is_published ? "sim" : "não"}</td>
                <td>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <button className="mini-button danger" type="submit">
                      excluir
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
