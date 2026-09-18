import { updateSettings } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

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
      <div className="admin-heading">
        <div>
          <p className="eyebrow">IDENTIDADE</p>
          <h1>Configurações</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert">{message}</div> : null}

      <form className="admin-card form-stack" action={updateSettings}>
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

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="is_name_placeholder"
            defaultChecked={settings?.is_name_placeholder ?? true}
          />
          O nome ainda é provisório
        </label>

        <button className="button solid" type="submit">
          salvar identidade
        </button>
      </form>

      <div className="admin-card">
        <h3>Sobre e-mails de autenticação</h3>
        <p>
          Os templates visuais estão versionados no repositório. Para ativá-los
          em produção será necessário configurar um SMTP próprio e então aplicar
          os templates no Supabase Auth.
        </p>
      </div>
    </>
  );
}
