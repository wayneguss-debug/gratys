import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePost, setPostStatus } from "@/app/admin/actions";

export default async function AdminPostsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, type, category, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">CONTEÚDO</p>
          <h1>Informativos</h1>
        </div>
        <Link className="button solid" href="/admin/posts/new">
          novo
        </Link>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
      {message ? <div className="alert">{message}</div> : null}

      <div className="admin-card">
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
                <td>{post.type}</td>
                <td>{post.status}</td>
                <td>
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(post.updated_at)
                  )}
                </td>
                <td>
                  <div className="actions">
                    {post.status === "published" ? (
                      <a
                        className="mini-button"
                        href={`/informativos/${post.slug}`}
                        target="_blank"
                      >
                        abrir
                      </a>
                    ) : null}

                    <form action={setPostStatus}>
                      <input type="hidden" name="id" value={post.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={post.status === "published" ? "draft" : "published"}
                      />
                      <button className="mini-button" type="submit">
                        {post.status === "published" ? "despublicar" : "publicar"}
                      </button>
                    </form>

                    <form action={deletePost}>
                      <input type="hidden" name="id" value={post.id} />
                      <button className="mini-button danger" type="submit">
                        excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!posts?.length ? <p>Nenhum informativo cadastrado.</p> : null}
      </div>
    </>
  );
}
