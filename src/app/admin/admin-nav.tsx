"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";

const baseItems: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Visão geral", icon: "grid" },
  { href: "/admin/posts", label: "Informativos", icon: "news" },
  { href: "/admin/events", label: "Agenda", icon: "calendar" },
  { href: "/admin/campus", label: "Campus e transporte", icon: "map" },
  { href: "/admin/media", label: "Biblioteca de mídia", icon: "image" }
];

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = isAdmin
    ? [...baseItems, { href: "/admin/settings", label: "Configurações", icon: "settings" as IconName }]
    : baseItems;

  return (
    <nav className="admin-nav" aria-label="Navegação editorial">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            className={active ? "active" : undefined}
            href={item.href}
            key={item.href}
            aria-current={active ? "page" : undefined}
          >
            <span className="admin-nav-icon">
              <Icon name={item.icon} size={17} />
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
