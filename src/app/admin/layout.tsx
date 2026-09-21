import Link from "next/link";
import { requireEditor } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";
import { AdminNav } from "@/app/admin/admin-nav";
import { Icon } from "@/components/icon";

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
          <Link className="admin-brand" href="/admin">
            <span className="admin-brand-mark" aria-hidden="true">
              <span />
            </span>
            <span>
              <strong>Painel editorial</strong>
              <small>workspace GRATYS</small>
            </span>
          </Link>

          <div className="admin-profile">
            <span className="profile-avatar">
              {(profile.display_name || "E").slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{profile.display_name || "Equipe"}</strong>
              <small>{profile.role}</small>
            </span>
          </div>

          <AdminNav isAdmin={profile.role === "admin"} />

          <div className="admin-sidebar-footer">
            <Link className="sidebar-action" href="/">
              <Icon name="external" size={16} />
              Ver portal
            </Link>
            <form action={signOut}>
              <button className="sidebar-action" type="submit">
                <Icon name="logout" size={16} />
                Sair
              </button>
            </form>
          </div>
        </aside>

        <section className="admin-main">{children}</section>
      </div>
    </main>
  );
}
