import type { Metadata } from "next";
import { Archivo_Black, DM_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "./polish.css";
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

function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured;

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  return vercelHost
    ? `https://${vercelHost.replace(/^https?:\/\//, "")}`
    : "http://localhost:3000";
}

const navItems = [
  ["/informativos", "01 / Informativos"],
  ["/agenda", "02 / Agenda"],
  ["/campus", "03 / Campus"],
  ["/#sobre", "04 / Projeto"]
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.site_name,
      template: `%s • ${settings.site_name}`
    },
    description: settings.description,
    metadataBase: new URL(getSiteUrl()),
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
            <span className="strip-status">
              <i aria-hidden="true" />
              {settings.is_name_placeholder ? "Identidade em construção" : "Portal acadêmico"}
            </span>
          </div>
        </div>

        <header className="site-header">
          <div className="container nav-wrap">
            <Link className="brand" href="/" aria-label={`${settings.site_name} — início`}>
              <span className="brand-mark portal-mark" aria-hidden="true">
                <span className="portal-mark-dot" />
              </span>
              <span className="brand-copy">
                <strong>{settings.site_name}</strong>
                <small>{settings.tagline}</small>
              </span>
            </Link>

            <nav className="main-nav" aria-label="Navegação principal">
              {navItems.map(([href, label]) => (
                <Link href={href} key={href}>
                  {label}
                </Link>
              ))}
            </nav>

            <details className="mobile-menu">
              <summary aria-label="Abrir navegação">Menu</summary>
              <nav aria-label="Navegação móvel">
                {navItems.map(([href, label]) => (
                  <Link href={href} key={href}>
                    {label}
                  </Link>
                ))}
                <Link href="/auth/login">Área da equipe</Link>
              </nav>
            </details>
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
