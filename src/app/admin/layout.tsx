import Link from "next/link";
import { requireEditor } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const profile = await requireEditor();

  return (
    <main id="conteudo" className="admin-shell">
      <div className="container admin-layout">
        <aside className="admin-sidebar">
          <strong>Painel editorial</strong>
          <small>
            {profile.display_name || "Equipe"} • {profile.role}
          </small>

          <nav className="admin-nav">
            <Link href="/admin">Visão geral</Link>
            <Link href="/admin/posts">Informativos</Link>
            <Link href="/admin/events">Agenda</Link>
            <Link href="/admin/campus">Campus e transporte</Link>
            <Link href="/admin/media">Biblioteca de mídia</Link>
            {profile.role === "admin" ? (
              <Link href="/admin/settings">Configurações</Link>
            ) : null}
            <Link href="/">Ver portal</Link>
          </nav>

          <form action={signOut} style={{ marginTop: 24 }}>
            <button className="mini-button" type="submit">
              sair
            </button>
          </form>
        </aside>

        <section className="admin-main">{children}</section>
      </div>
    </main>
  );
}
