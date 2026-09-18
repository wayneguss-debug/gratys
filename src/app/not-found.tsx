import Link from "next/link";

export default function NotFound() {
  return (
    <main id="conteudo" className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">404</p>
        <h1>Essa página saiu do mural.</h1>
        <p>O endereço não existe, mudou ou ainda não foi publicado.</p>
        <Link className="button solid" href="/">
          voltar ao início
        </Link>
      </section>
    </main>
  );
}
