"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="mini-button icon-button" type="button" onClick={copy}>
      <Icon name={copied ? "check" : "copy"} size={14} />
      {copied ? "copiado" : "copiar URL"}
    </button>
  );
}
