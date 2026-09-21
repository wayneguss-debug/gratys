export default function Loading() {
  return (
    <main id="conteudo" className="loading-shell" aria-label="Carregando conteúdo">
      <div className="container">
        <div className="loading-line wide" />
        <div className="loading-line title" />
        <div className="loading-line medium" />
        <div className="loading-grid">
          <div className="loading-card" />
          <div className="loading-card" />
          <div className="loading-card" />
        </div>
      </div>
    </main>
  );
}
