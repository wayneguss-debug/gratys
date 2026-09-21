import type { Metadata } from "next";
import { DM_Mono, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import "./polish.css";
import { Icon } from "@/components/icon";
import { ThemeControls } from "@/components/theme-controls";
import { getPublishedPosts, getSiteSettings } from "@/lib/data";

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

export const revalidate = 60;

const navItems = [
  ["/", "Início"],
  ["/informativos", "Informativos"],
  ["/agenda", "Agenda"],
  ["/campus", "Campus"]
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
  const [settings, topPosts] = await Promise.all([
    getSiteSettings(),
    getPublishedPosts(1)
  ]);

  const pinned = topPosts[0]?.pinned ? topPosts[0] : null;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("gratys:theme");document.documentElement.dataset.theme=["light","dark","contrast"].includes(t)?t:"light"}catch(e){document.documentElement.dataset.theme="light"}`
          }}
        />
      </head>
      <body className={`${mono.variable} ${body.variable}`}>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>

        <div className="utility-bar">
          <div className="container utility-inner">
            <span>Projeto acadêmico independente • IFMT Campus Cáceres</span>
            <span>GRATYS TECH • 2026</span>
          </div>
        </div>

        {pinned ? (
          <Link className="portal-alert" href={`/informativos/${pinned.slug}`}>
            <span className="container alert-inner">
              <Icon name="bell" size={17} />
              <strong>Aviso em destaque:</strong>
              <span>{pinned.title}</span>
              <Icon name="arrow" size={16} />
            </span>
          </Link>
        ) : null}

        <header className="site-header">
          <div className="container nav-wrap">
            <Link className="brand" href="/" aria-label={`${settings.site_name} — início`}>
              <span className="brand-symbol" aria-hidden="true">
                <span />
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

            <div className="header-actions">
              <form className="header-search" action="/buscar">
                <Icon name="search" size={17} />
                <input aria-label="Buscar no portal" name="q" placeholder="Buscar..." type="search" />
              </form>

              <Link className="header-icon-link" href="/meu-portal" aria-label="Meu portal">
                <Icon name="bookmark" size={19} />
                <span>Meu portal</span>
              </Link>

              <ThemeControls />
            </div>

            <details className="mobile-menu">
              <summary aria-label="Abrir navegação">
                <span />
                <span />
                <span />
              </summary>
              <nav aria-label="Navegação móvel">
                {navItems.map(([href, label]) => (
                  <Link href={href} key={href}>{label}</Link>
                ))}
                <Link href="/buscar">Buscar</Link>
                <Link href="/meu-portal">Meu portal</Link>
                <Link href="/auth/login">Área da equipe</Link>
              </nav>
            </details>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <span className="brand-symbol small" aria-hidden="true"><span /></span>
              <div>
                <strong>{settings.site_name}</strong>
                <p>{settings.tagline}</p>
              </div>
            </div>
            <div>
              <strong>Navegação</strong>
              <Link href="/informativos">Informativos</Link>
              <Link href="/agenda">Agenda</Link>
              <Link href="/campus">Campus e transporte</Link>
              <Link href="/meu-portal">Meu portal</Link>
            </div>
            <div>
              <strong>Projeto</strong>
              <p>Desenvolvido pela GRATYS TECH no contexto acadêmico do IFMT Campus Cáceres.</p>
              <p>Para decisões oficiais, confirme sempre nos canais institucionais.</p>
            </div>
            <div>
              <strong>Equipe</strong>
              <Link href="/auth/login">Acessar painel editorial</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
