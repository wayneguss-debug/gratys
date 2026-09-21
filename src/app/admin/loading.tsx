export default function AdminLoading() {
  return (
    <div className="admin-loading" aria-label="Carregando painel">
      <div className="loading-line medium" />
      <div className="loading-line title" />
      <div className="stats-grid">
        <div className="loading-card small" />
        <div className="loading-card small" />
        <div className="loading-card small" />
        <div className="loading-card small" />
      </div>
      <div className="loading-card tall" />
    </div>
  );
}
