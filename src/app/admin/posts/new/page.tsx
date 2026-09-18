import { createPost } from "@/app/admin/actions";

export default async function NewPostPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">COMPOSITOR</p>
          <h1>Novo informativo</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <form className="admin-card form-stack" action={createPost}>
        <div className="field">
          <label htmlFor="title">Título</label>
          <input id="title" name="title" required maxLength={180} />
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="slug">Slug opcional</label>
            <input id="slug" name="slug" placeholder="gerado pelo título" />
          </div>

          <div className="field">
            <label htmlFor="category">Categoria</label>
            <input id="category" name="category" defaultValue="campus" required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="excerpt">Resumo</label>
          <textarea id="excerpt" name="excerpt" required maxLength={420} />
        </div>

        <div className="field">
          <label htmlFor="content">Conteúdo</label>
          <textarea id="content" name="content" required style={{ minHeight: 320 }} />
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="type">Tipo</label>
            <select id="type" name="type" defaultValue="news">
              <option value="news">Notícia</option>
              <option value="notice">Aviso</option>
              <option value="orientation">Orientação</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="status">Status inicial</label>
            <select id="status" name="status" defaultValue="draft">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="cover_url">Imagem de capa (URL)</label>
            <input id="cover_url" name="cover_url" type="url" />
          </div>

          <div className="field">
            <label htmlFor="source_url">Fonte original (URL)</label>
            <input id="source_url" name="source_url" type="url" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="reading_minutes">Minutos de leitura</label>
          <input
            id="reading_minutes"
            name="reading_minutes"
            type="number"
            min="1"
            max="60"
            defaultValue="2"
          />
        </div>

        <div className="two-col">
          <label className="checkbox-row">
            <input type="checkbox" name="featured" />
            Destaque editorial
          </label>
          <label className="checkbox-row">
            <input type="checkbox" name="pinned" />
            Fixar no topo
          </label>
        </div>

        <div className="hero-actions">
          <button className="button solid" type="submit">
            salvar informativo
          </button>
        </div>
      </form>
    </>
  );
}
