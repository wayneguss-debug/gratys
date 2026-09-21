import Image from "next/image";
import { uploadMedia, deleteMedia } from "@/app/admin/media/actions";
import { requireEditor } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/icon";

export default async function AdminMediaPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; url?: string; message?: string }>;
}) {
  const { error, url, message } = await searchParams;
  const profile = await requireEditor();
  const supabase = await createClient();

  const { data: files } = await supabase.storage
    .from("media")
    .list(profile.id, {
      limit: 40,
      sortBy: { column: "created_at", order: "desc" }
    });

  const media = (files ?? [])
    .filter((file) => file.name && file.id)
    .map((file) => {
      const path = `${profile.id}/${file.name}`;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      return {
        path,
        name: file.name,
        url: data.publicUrl,
        createdAt: file.created_at
      };
    });

  return (
    <>
      <div className="admin-heading admin-heading-rich">
        <div>
          <p className="eyebrow">MÍDIA</p>
          <h1>Biblioteca</h1>
          <p className="admin-heading-copy">Envie capas e reutilize URLs sem sair do painel.</p>
        </div>
        <span className="media-count">{media.length} arquivo{media.length === 1 ? "" : "s"}</span>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert">{message}</div> : null}

      <form className="admin-card upload-card" action={uploadMedia}>
        <div className="upload-zone">
          <span className="upload-icon"><Icon name="upload" size={28} /></span>
          <div>
            <h3>Enviar nova imagem</h3>
            <p>JPG, PNG, WEBP ou AVIF • até 5 MB</p>
          </div>
          <input
            id="media-file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
          />
          <button className="button solid" type="submit">
            enviar arquivo
          </button>
        </div>
      </form>

      {url ? (
        <div className="admin-card upload-success">
          <span className="success-icon"><Icon name="check" size={22} /></span>
          <div>
            <h3>Upload concluído</h3>
            <p>A URL já está pronta para usar no campo de capa.</p>
            <code>{url}</code>
          </div>
          <CopyButton value={url} />
        </div>
      ) : null}

      <section className="admin-card media-library">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">ARQUIVOS</p>
            <h3>Imagens enviadas</h3>
          </div>
        </div>

        {media.length ? (
          <div className="media-grid">
            {media.map((item) => (
              <article className="media-tile" key={item.path}>
                <div className="media-preview">
                  <Image
                    alt={item.name}
                    fill
                    sizes="(max-width: 720px) 100vw, 260px"
                    src={item.url}
                  />
                </div>
                <div className="media-meta">
                  <strong title={item.name}>{item.name}</strong>
                  <small>
                    {item.createdAt
                      ? new Intl.DateTimeFormat("pt-BR", {
                          timeZone: "America/Cuiaba"
                        }).format(new Date(item.createdAt))
                      : "arquivo"}
                  </small>
                </div>
                <div className="media-actions">
                  <CopyButton value={item.url} />
                  <form action={deleteMedia}>
                    <input type="hidden" name="path" value={item.path} />
                    <button className="mini-button danger icon-only" type="submit" aria-label={`Excluir ${item.name}`}>
                      <Icon name="trash" size={14} />
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty empty-state-action">
            <Icon name="image" size={28} />
            <strong>Sua biblioteca ainda está vazia</strong>
            <span>O primeiro upload aparecerá aqui.</span>
          </div>
        )}
      </section>
    </>
  );
}
