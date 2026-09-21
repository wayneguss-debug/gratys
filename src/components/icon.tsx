export type IconName =
  | "home"
  | "news"
  | "calendar"
  | "map"
  | "image"
  | "settings"
  | "external"
  | "plus"
  | "search"
  | "arrow"
  | "clock"
  | "check"
  | "draft"
  | "upload"
  | "spark"
  | "bus"
  | "grid"
  | "logout"
  | "copy"
  | "trash"
  | "bookmark"
  | "bookmark-filled"
  | "sun"
  | "moon"
  | "contrast"
  | "user"
  | "download"
  | "share"
  | "bell";

const paths: Record<IconName, React.ReactNode> = {
  home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.7V21h13V9.7"/><path d="M9.5 21v-6h5v6"/></>,
  news: <><path d="M5 3h11a3 3 0 0 1 3 3v15H7a2 2 0 0 1-2-2V3Z"/><path d="M5 17H3V6a2 2 0 0 1 2-2"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/><path d="M8 14h2M14 14h2M8 18h2"/></>,
  map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5L5 20"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.37.35.7.6 1 .28.28.63.48 1 .6h.09v4H21c-.37.14-.72.34-1 .6-.25.3-.46.63-.6 1Z"/></>,
  external: <><path d="M14 3h7v7M10 14 21 3"/><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/></>,
  draft: <><path d="M4 4h10l6 6v10H4Z"/><path d="M14 4v6h6M8 14h8M8 18h5"/></>,
  upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 15v5h14v-5"/></>,
  spark: <><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z"/><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z"/></>,
  bus: <><rect x="5" y="3" width="14" height="15" rx="3"/><path d="M8 18v2M16 18v2M5 11h14M8 7h8"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/></>,
  grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9"/></>,
  copy: <><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
  bookmark: <path d="M6 4h12v17l-6-4-6 4Z"/>,
  "bookmark-filled": <path d="M6 4h12v17l-6-4-6 4Z" fill="currentColor"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
  moon: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>,
  contrast: <><circle cx="12" cy="12" r="9"/><path d="M12 3v18M12 7a5 5 0 0 1 0 10"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
  share: <><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>
};

export function Icon({
  name,
  size = 20,
  className
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
