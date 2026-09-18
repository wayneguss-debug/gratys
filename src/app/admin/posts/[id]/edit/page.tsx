import { notFound } from "next/navigation";
import { updatePost } from "@/app/admin/posts/update-action";
import { createClient } from "@/lib/supabase/server";

export default async function EditPostPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">EDITOR</p>
          <h1>Editar informativo</h1>
        </div>
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      <form className="admin-card form-stack" action={updatePost}>
        <input type="hidden" name="id" value={post.id} />

        <div className="field">
          <label htmlFor="title">Título</label>
          <input id="title" name="title" defaultValue={post.title} required />
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input id="slug" name="slug" defaultValue={post.slug} required />
          </div>
          <div className="field">
            <label htmlFor="category">Categoria</label>
            <input id="category" name="category" defaultValue={post.category} required />
          </div>
        </div>

        <div className="field">
          <label htmlFor="excerpt">Resumo</label>
          <textarea id="excerpt" name="excerpt" defaultValue={post.excerpt} required />
        </div>

        <div className="field">
          <label htmlFor="content">Conteúdo</label>
          <textarea
            id="content"
            name="content"
            defaultValue={post.content}
            required
            style={{ minHeight: 320 }}
          />
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="type">Tipo</label>
            <select id="type" name="type" defaultValue={post.type}>
              <option value="news">Notícia</option>
              <option value="notice">Aviso</option>
              <option value="orientation">Orientação</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={post.status}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        <div className="two-col">
          <div className="field">
            <label htmlFor="cover-url">Imagem de capa</label>
            <input
              id="cover-url"
              name="cover_url"
              type="url"
              defaultValue={post.cover_url ?? ""}
            />
          </div>
          <div className="field">
            <label htmlFor="source-url">Fonte original</label>
            <input
              id="source-url"
              name="source_url"
              type="url"
              defaultValue={post.source_url ?? ""}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="reading-minutes">Minutos de leitura</label>
          <input
            id="reading-minutes"
            name="reading_minutes"
            type="number"
            min="1"
            max="60"
            defaultValue={post.reading_minutes ?? 2}
          />
        </div>

        <div className="two-col">
          <label className="checkbox-row">
            <input type="checkbox" name="featured" defaultChecked={post.featured} />
            Destaque editorial
          </label>
          <label className="checkbox-row">
            <input type="checkbox" name="pinned" defaultChecked={post.pinned} />
            Fixar no topo
          </label>
        </div>

        <button className="button solid" type="submit">
          salvar alterações
        </button>
      </form>
    </>
  );
}
