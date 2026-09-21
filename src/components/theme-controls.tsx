"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

type Theme = "light" | "dark" | "contrast";

const THEME_KEY = "gratys:theme";

export function ThemeControls() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
    const resolved = stored && ["light", "dark", "contrast"].includes(stored) ? stored : "light";
    document.documentElement.dataset.theme = resolved;
    setTheme(resolved);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem(THEME_KEY, next);
  }

  return (
    <label className="theme-control">
      <Icon name={theme === "dark" ? "moon" : theme === "contrast" ? "contrast" : "sun"} size={17} />
      <span className="sr-only">Tema visual</span>
      <select
        aria-label="Tema visual"
        onChange={(event) => apply(event.target.value as Theme)}
        value={theme}
      >
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
        <option value="contrast">Alto contraste</option>
      </select>
    </label>
  );
}
