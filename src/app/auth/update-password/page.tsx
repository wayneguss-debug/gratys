import { updatePassword } from "@/app/auth/password-actions";

export default async function UpdatePasswordPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main id="conteudo" className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">NOVA SENHA</p>
        <h1>Redefina o acesso</h1>

        {error ? <div className="alert error">{error}</div> : null}

        <form className="form-stack" action={updatePassword}>
          <div className="field">
            <label htmlFor="new-password">Nova senha</label>
            <input
              id="new-password"
              name="password"
              type="password"
              minLength={8}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="confirm-password">Confirmar senha</label>
            <input
              id="confirm-password"
              name="confirm_password"
              type="password"
              minLength={8}
              required
            />
          </div>

          <button className="button solid" type="submit">
            atualizar senha
          </button>
        </form>
      </section>
    </main>
  );
}
