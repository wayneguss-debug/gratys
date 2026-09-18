import { uploadMedia } from "@/app/admin/media/actions";

export default async function AdminMediaPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; url?: string }>;
}) {
  const { error, url } = await searchParams;

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">MÍDIA</p>
          <h1>Biblioteca</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <form className="admin-card form-stack" action={uploadMedia}>
        <div className="field">
          <label htmlFor="media-file">Imagem</label>
          <input
            id="media-file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
          />
        </div>
        <p className="form-note">
          Máximo de 5 MB. Formatos aceitos: JPG, PNG, WEBP e AVIF.
        </p>
        <button className="button solid" type="submit">
          enviar imagem
        </button>
      </form>

      {url ? (
        <div className="admin-card">
          <h3>Upload concluído</h3>
          <p>Use esta URL no campo de capa do informativo:</p>
          <div className="field">
            <input readOnly value={url} aria-label="URL pública da imagem" />
          </div>
        </div>
      ) : null}
    </>
  );
}
