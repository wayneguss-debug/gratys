import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main id="conteudo" className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">VERIFICAÇÃO</p>
        <h1>Confira seu e-mail</h1>
        <p>
          Enviamos uma mensagem de confirmação. Depois de validar o endereço,
          volte para a área da equipe e faça login.
        </p>
        <div className="hero-actions">
          <Link className="button solid" href="/auth/login">
            voltar ao login
          </Link>
          <Link className="button text" href="/">
            ir para o portal →
          </Link>
        </div>
      </section>
    </main>
  );
}
