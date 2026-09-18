import Link from "next/link";
import { signIn, signUp } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <main id="conteudo" className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">ÁREA DA EQUIPE</p>
        <h1>Acesso editorial</h1>
        <p>
          Use sua conta para publicar e administrar conteúdos do portal. Contas
          comuns não recebem acesso editorial automaticamente.
        </p>

        {error ? <div className="alert error">{error}</div> : null}
        {message ? <div className="alert">{message}</div> : null}

        <div className="auth-tabs">
          <form className="form-stack" action={signIn}>
            <h3>Entrar</h3>
            <div className="field">
              <label htmlFor="login-email">E-mail</label>
              <input id="login-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="login-password">Senha</label>
              <input id="login-password" name="password" type="password" required />
            </div>
            <button className="button solid" type="submit">
              entrar
            </button>
            <Link className="button text" href="/auth/recovery">
              esqueci minha senha →
            </Link>
          </form>

          <form className="form-stack" action={signUp}>
            <h3>Criar conta</h3>
            <div className="field">
              <label htmlFor="display-name">Nome</label>
              <input id="display-name" name="display_name" autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="signup-email">E-mail</label>
              <input id="signup-email" name="email" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="signup-password">Senha</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                minLength={8}
                required
              />
            </div>
            <button className="button light" type="submit">
              criar conta
            </button>
            <p className="form-note">
              A confirmação por e-mail é obrigatória. O acesso ao painel depende
              também do papel atribuído à conta.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
