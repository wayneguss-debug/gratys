import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mural do Campus",
    short_name: "Mural",
    description:
      "Avisos, prazos, eventos e orientações do cotidiano acadêmico em um só lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fc",
    theme_color: "#ffffff",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
