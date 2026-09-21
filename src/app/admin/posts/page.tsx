import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePost, setPostStatus } from "@/app/admin/actions";
import { Icon } from "@/components/icon";

function filterHref(q: string, status?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  const query = params.toString();
  return query ? `/admin/posts?${query}` : "/admin/posts";
}

export default async function AdminPostsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string; q?: string; status?: string }>;
}) {
  const { error, message, q = "", status = "" } = await searchParams;
  const supabase = await createClient();
  const validStatus = ["draft", "published"].includes(status) ? status : "";

  let query = supabase
    .from("posts")
    .select("id, title, slug, status, type, category, updated_at")
    .order("updated_at", { ascending: false });

  if (q.trim()) query = query.ilike("title", `%${q.trim()}%`);
  if (validStatus) query = query.eq("status", validStatus);

  const { data: posts } = await query;

  return (
    <>
      <div className="admin-heading admin-heading-rich">
        <div>
          <p className="eyebrow">CONTEÚDO</p>
          <h1>Informativos</h1>
          <p className="admin-heading-copy">Gerencie rascunhos, publicações e histórico editorial.</p>
        </div>
        <Link className="button solid" href="/admin/posts/new">
          <Icon name="plus" size={16} /> novo
        </Link>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert">{message}</div> : null}

      <div className="admin-filter-bar">
        <form className="search-form search-form-box admin-search" action="/admin/posts">
          <Icon name="search" size={17} />
          <input name="q" placeholder="buscar por título..." defaultValue={q} />
          {validStatus ? <input type="hidden" name="status" value={validStatus} /> : null}
          <button className="mini-button" type="submit">buscar</button>
        </form>
        <nav className="filter-chips">
          <Link className={!validStatus ? "active" : ""} href={filterHref(q)}>Todos</Link>
          <Link className={validStatus === "published" ? "active" : ""} href={filterHref(q, "published")}>Publicados</Link>
          <Link className={validStatus === "draft" ? "active" : ""} href={filterHref(q, "draft")}>Rascunhos</Link>
        </nav>
      </div>

      <div className="admin-card table-card">
        <div className="table-summary">
          <strong>{posts?.length ?? 0}</strong>
          <span>item{posts?.length === 1 ? "" : "s"} encontrado{posts?.length === 1 ? "" : "s"}</span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Atualizado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((post) => (
              <tr key={post.id}>
                <td>
                  <strong>{post.title}</strong>
                  <br />
                  <small>{post.category}</small>
                </td>
                <td><span className="table-type">{post.type}</span></td>
                <td>
                  <span className={`status-badge ${post.status}`}>
                    <span className={`status-mark ${post.status}`} />
                    {post.status === "published" ? "publicado" : "rascunho"}
                  </span>
                </td>
                <td>
                  {new Intl.DateTimeFormat("pt-BR", {
                    timeZone: "America/Cuiaba"
                  }).format(new Date(post.updated_at))}
                </td>
                <td>
                  <div className="actions">
                    <Link className="mini-button icon-button" href={`/admin/posts/${post.id}/edit`}>
                      editar
                    </Link>

                    {post.status === "published" ? (
                      <a className="mini-button icon-button" href={`/informativos/${post.slug}`} target="_blank" rel="noreferrer">
                        <Icon name="external" size={13} /> abrir
                      </a>
                    ) : null}

                    <form action={setPostStatus}>
                      <input type="hidden" name="id" value={post.id} />
                      <input type="hidden" name="status" value={post.status === "published" ? "draft" : "published"} />
                      <button className="mini-button" type="submit">
                        {post.status === "published" ? "despublicar" : "publicar"}
                      </button>
                    </form>

                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <button className="mini-button danger icon-only" type="submit" aria-label={`Excluir ${post.title}`}>
                        <Icon name="trash" size={14} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!posts?.length ? (
          <div className="admin-empty empty-state-action">
            <Icon name="news" size={26} />
            <strong>Nenhum informativo encontrado</strong>
            <Link className="mini-button" href="/admin/posts">limpar filtros</Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
