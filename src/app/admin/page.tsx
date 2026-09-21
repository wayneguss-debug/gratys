import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Icon, type IconName } from "@/components/icon";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Cuiaba"
  }).format(new Date(value));
}

export default async function AdminPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const [
    posts,
    published,
    drafts,
    events,
    locations,
    transport,
    recentPosts,
    upcomingEvents
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("campus_locations").select("*", { count: "exact", head: true }),
    supabase.from("transport_schedules").select("*", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id,title,status,category,updated_at")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("events")
      .select("id,title,kind,starts_at,is_published")
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(4)
  ]);

  const stats: [string, number, string, IconName, string][] = [
    ["Informativos", posts.count ?? 0, "/admin/posts", "news", `${published.count ?? 0} publicados`],
    ["Rascunhos", drafts.count ?? 0, "/admin/posts?status=draft", "draft", "aguardando revisão"],
    ["Agenda", events.count ?? 0, "/admin/events", "calendar", "eventos e prazos"],
    ["Campus", (locations.count ?? 0) + (transport.count ?? 0), "/admin/campus", "map", "locais + horários"]
  ];

  return (
    <>
      <div className="admin-heading admin-heading-rich">
        <div>
          <p className="eyebrow">CENTRAL EDITORIAL</p>
          <h1>Visão geral</h1>
          <p className="admin-heading-copy">
            Publique, revise e acompanhe o que está visível no portal.
          </p>
        </div>
        <div className="workspace-status">
          <span className="status-dot" />
          sistema operacional
        </div>
      </div>

      <div className="quick-actions">
        <Link className="quick-action primary" href="/admin/posts/new">
          <span className="quick-action-icon"><Icon name="plus" size={20} /></span>
          <span><strong>Novo informativo</strong><small>criar publicação</small></span>
        </Link>
        <Link className="quick-action" href="/admin/events">
          <span className="quick-action-icon"><Icon name="calendar" size={20} /></span>
          <span><strong>Nova data</strong><small>evento ou prazo</small></span>
        </Link>
        <Link className="quick-action" href="/admin/media">
          <span className="quick-action-icon"><Icon name="upload" size={20} /></span>
          <span><strong>Enviar mídia</strong><small>capa ou imagem</small></span>
        </Link>
      </div>

      <div className="stats-grid">
        {stats.map(([label, count, href, icon, note]) => (
          <Link className="stat-card stat-card-rich" href={href} key={label}>
            <span className="stat-icon"><Icon name={icon} size={20} /></span>
            <strong>{String(count).padStart(2, "0")}</strong>
            <span>{label}</span>
            <small>{note}</small>
          </Link>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-card dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">EDIÇÃO</p>
              <h3>Conteúdo recente</h3>
            </div>
            <Link className="mini-button" href="/admin/posts">ver todos</Link>
          </div>

          <div className="compact-list">
            {(recentPosts.data ?? []).map((post) => (
              <Link href={`/admin/posts/${post.id}/edit`} className="compact-row" key={post.id}>
                <span className={`status-mark ${post.status}`} />
                <span className="compact-main">
                  <strong>{post.title}</strong>
                  <small>{post.category} • {formatDate(post.updated_at)}</small>
                </span>
                <span className={`status-badge ${post.status}`}>
                  {post.status === "published" ? "publicado" : "rascunho"}
                </span>
              </Link>
            ))}
            {!recentPosts.data?.length ? (
              <div className="admin-empty">Nenhum informativo cadastrado.</div>
            ) : null}
          </div>
        </section>

        <section className="admin-card dashboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">PRÓXIMAS DATAS</p>
              <h3>Agenda</h3>
            </div>
            <Link className="mini-button" href="/admin/events">gerenciar</Link>
          </div>

          <div className="compact-list">
            {(upcomingEvents.data ?? []).map((event) => (
              <div className="compact-row" key={event.id}>
                <span className="date-chip">
                  {formatDate(event.starts_at)}
                </span>
                <span className="compact-main">
                  <strong>{event.title}</strong>
                  <small>{event.kind}</small>
                </span>
                <span className={`status-badge ${event.is_published ? "published" : "draft"}`}>
                  {event.is_published ? "visível" : "oculto"}
                </span>
              </div>
            ))}
            {!upcomingEvents.data?.length ? (
              <div className="admin-empty">Nenhuma data futura cadastrada.</div>
            ) : null}
          </div>
        </section>
      </div>

      <section className="admin-card editorial-checklist">
        <div>
          <p className="eyebrow">ANTES DE PUBLICAR</p>
          <h3>Checklist editorial</h3>
        </div>
        <div className="checklist-grid">
          {[
            "Fonte ou origem confirmada",
            "Data e horário revisados",
            "Texto curto e objetivo",
            "Links testados"
          ].map((item) => (
            <span key={item}><Icon name="check" size={16} />{item}</span>
          ))}
        </div>
      </section>
    </>
  );
}
