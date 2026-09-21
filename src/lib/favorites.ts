export const FAVORITES_KEY = "gratys:favorites:v1";

export type FavoriteKind = "post" | "event" | "location" | "transport";

export type FavoriteItem = {
  id: string;
  kind: FavoriteKind;
  title: string;
  href: string;
  subtitle?: string;
  savedAt: number;
};

export function readFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FavoriteItem[]) : [];
  } catch {
    return [];
  }
}

export function writeFavorites(items: FavoriteItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("gratys:favorites"));
}
