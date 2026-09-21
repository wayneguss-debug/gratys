import { updateSettings } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/icon";

export default async function AdminSettingsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  await requireAdmin();
  const { error, message } = await searchParams;
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  return (
    <>
      <div className="admin-heading admin-heading-rich">
        <div>
          <p className="eyebrow">IDENTIDADE</p>
          <h1>Configurações</h1>
          <p className="admin-heading-copy">Controle a identidade pública sem alterar o código.</p>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert">{message}</div> : null}

      <div className="settings-grid">
        <form className="admin-card form-stack settings-form" action={updateSettings}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">PORTAL</p>
              <h3>Identidade pública</h3>
            </div>
          </div>

          <div className="field">
            <label htmlFor="site-name">Nome do portal</label>
            <input
              id="site-name"
              name="site_name"
              defaultValue={settings?.site_name ?? "Mural do Campus"}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="tagline">Tagline</label>
            <input
              id="tagline"
              name="tagline"
              defaultValue={settings?.tagline ?? "informação que circula"}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              defaultValue={settings?.description ?? ""}
              required
            />
          </div>

          <div className="two-col">
            <div className="field">
              <label htmlFor="instagram-url">Instagram</label>
              <input
                id="instagram-url"
                name="instagram_url"
                type="url"
                defaultValue={settings?.instagram_url ?? ""}
              />
            </div>
            <div className="field">
              <label htmlFor="contact-url">Contato</label>
              <input
                id="contact-url"
                name="contact_url"
                type="url"
                defaultValue={settings?.contact_url ?? ""}
              />
            </div>
          </div>

          <label className="checkbox-row checkbox-card">
            <input
              type="checkbox"
              name="is_name_placeholder"
              defaultChecked={settings?.is_name_placeholder ?? true}
            />
            <span>
              <strong>Nome provisório</strong>
              <small>Exibe no portal que a identidade ainda está em construção.</small>
            </span>
          </label>

          <button className="button solid" type="submit">
            salvar identidade
          </button>
        </form>

        <aside className="admin-card identity-preview">
          <p className="eyebrow">PRÉVIA</p>
          <div className="preview-brand">
            <span className="preview-logo"><span /></span>
            <div>
              <strong>{settings?.site_name ?? "Mural do Campus"}</strong>
              <small>{settings?.tagline ?? "informação que circula"}</small>
            </div>
          </div>
          <p>{settings?.description}</p>
          <div className="preview-state">
            <span className="status-dot" />
            {settings?.is_name_placeholder ? "identidade em construção" : "identidade definida"}
          </div>
        </aside>
      </div>

      <div className="admin-card info-card">
        <span className="info-icon"><Icon name="spark" size={22} /></span>
        <div>
          <h3>E-mails de autenticação</h3>
          <p>
            Os templates visuais já estão versionados no repositório. Para usar
            remetente próprio em produção, falta configurar SMTP no Supabase Auth.
          </p>
        </div>
      </div>
    </>
  );
}
