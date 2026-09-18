import type { Metadata } from "next";
import { Archivo_Black, DM_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getSiteSettings } from "@/lib/data";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display"
});

const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono"
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.site_name,
      template: `%s • ${settings.site_name}`
    },
    description: settings.description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    openGraph: {
      type: "website",
      locale: "pt_BR",
      title: settings.site_name,
      description: settings.description
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${mono.variable} ${body.variable}`}>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>

        <div className="top-strip">
          <div className="container strip-inner">
            <span>Projeto Integrador • GRATYS TECH</span>
            <span>IFMT Campus Cáceres</span>
            {settings.is_name_placeholder ? <span>Nome provisório</span> : <span>Portal acadêmico</span>}
          </div>
        </div>

        <header className="site-header">
          <div className="container nav-wrap">
            <Link className="brand" href="/">
              <span className="brand-mark" aria-hidden="true">MC</span>
              <span className="brand-copy">
                <strong>{settings.site_name}</strong>
                <small>{settings.tagline}</small>
              </span>
            </Link>

            <nav className="main-nav" aria-label="Navegação principal">
              <Link href="/informativos">01 / Informativos</Link>
              <Link href="/agenda">02 / Agenda</Link>
              <Link href="/campus">03 / Campus</Link>
              <Link href="/#sobre">04 / Projeto</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="container footer-grid">
            <div>
              <strong>{settings.site_name}</strong>
              <p>{settings.is_name_placeholder ? "nome provisório" : settings.tagline}</p>
            </div>
            <div>
              <strong>GRATYS TECH</strong>
              <p>Projeto Integrador • 2026</p>
            </div>
            <div>
              <p>Contexto: IFMT Campus Cáceres</p>
              <p>Projeto acadêmico independente. Não é um canal oficial do IFMT.</p>
            </div>
            <div className="footer-team">
              <Link href="/auth/login">Área da equipe →</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
