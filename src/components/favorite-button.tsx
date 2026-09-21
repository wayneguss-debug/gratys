"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import {
  type FavoriteItem,
  readFavorites,
  writeFavorites
} from "@/lib/favorites";

export function FavoriteButton({
  item,
  compact = false
}: {
  item: Omit<FavoriteItem, "savedAt">;
  compact?: boolean;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setSaved(readFavorites().some((favorite) => favorite.id === item.id && favorite.kind === item.kind));
    };

    refresh();
    window.addEventListener("gratys:favorites", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("gratys:favorites", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [item.id, item.kind]);

  function toggle() {
    const current = readFavorites();
    const exists = current.some((favorite) => favorite.id === item.id && favorite.kind === item.kind);

    if (exists) {
      writeFavorites(current.filter((favorite) => !(favorite.id === item.id && favorite.kind === item.kind)));
      return;
    }

    writeFavorites([
      {
        ...item,
        savedAt: Date.now()
      },
      ...current
    ].slice(0, 80));
  }

  return (
    <button
      aria-pressed={saved}
      className={compact ? "favorite-button compact" : "favorite-button"}
      onClick={toggle}
      type="button"
    >
      <Icon name={saved ? "bookmark-filled" : "bookmark"} size={compact ? 16 : 18} />
      {compact ? null : <span>{saved ? "Salvo" : "Salvar"}</span>}
    </button>
  );
}
