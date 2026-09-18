import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/password-actions";

export default async function RecoveryPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <main id="conteudo" className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">RECUPERAÇÃO</p>
        <h1>Esqueceu a senha?</h1>
        <p>Informe o e-mail da conta para receber um link de recuperação.</p>

        {error ? <div className="alert error">{error}</div> : null}
        {message ? <div className="alert">{message}</div> : null}

        <form className="form-stack" action={requestPasswordReset}>
          <div className="field">
            <label htmlFor="recovery-email">E-mail</label>
            <input id="recovery-email" name="email" type="email" required />
          </div>
          <button className="button solid" type="submit">enviar link</button>
        </form>

        <div className="hero-actions">
          <Link className="button text" href="/auth/login">voltar ao login →</Link>
        </div>
      </section>
    </main>
  );
}
