import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const [posts, events, locations, transport] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("campus_locations").select("*", { count: "exact", head: true }),
    supabase.from("transport_schedules").select("*", { count: "exact", head: true })
  ]);

  const stats = [
    ["Informativos", posts.count ?? 0, "/admin/posts"],
    ["Agenda", events.count ?? 0, "/admin/events"],
    ["Locais", locations.count ?? 0, "/admin/campus"],
    ["Horários", transport.count ?? 0, "/admin/campus"]
  ] as const;

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">CENTRAL EDITORIAL</p>
          <h1>Visão geral</h1>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map(([label, count, href]) => (
          <Link className="stat-card" href={href} key={label}>
            <strong>{count}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </div>

      <div className="admin-card">
        <h3>Fluxo recomendado</h3>
        <p>
          Publique apenas informações confirmadas, use fontes quando existirem e
          mantenha datas e horários revisados. Rascunhos ficam visíveis somente
          para a equipe editorial.
        </p>
        <div className="hero-actions">
          <Link className="button solid" href="/admin/posts/new">
            novo informativo
          </Link>
          <Link className="button text" href="/admin/events">
            cadastrar evento →
          </Link>
        </div>
      </div>
    </>
  );
}
