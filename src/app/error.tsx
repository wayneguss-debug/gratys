"use client";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">ERRO</p>
        <h1>Algo saiu do lugar.</h1>
        <p>
          O portal encontrou um problema inesperado. Você pode tentar carregar
          esta parte novamente.
        </p>
        <button className="button solid" onClick={() => reset()}>
          tentar novamente
        </button>
      </section>
    </main>
  );
}
