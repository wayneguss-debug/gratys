"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

export function ShareButton({
  title,
  url
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const absolute = new URL(url, window.location.origin).toString();

    if (navigator.share) {
      try {
        await navigator.share({ title, url: absolute });
        return;
      } catch {
        // The user can cancel the native share sheet.
      }
    }

    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="favorite-button" onClick={share} type="button">
      <Icon name={copied ? "check" : "share"} size={18} />
      <span>{copied ? "Link copiado" : "Compartilhar"}</span>
    </button>
  );
}
