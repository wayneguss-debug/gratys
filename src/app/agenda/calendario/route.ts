import { getUpcomingEvents } from "@/lib/data";

function escapeIcs(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toIcsDate(value: string) {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export async function GET() {
  const events = await getUpcomingEvents();

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//GRATYS TECH//Mural do Campus//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events.flatMap((event) => {
      const end = event.ends_at || new Date(new Date(event.starts_at).getTime() + 60 * 60 * 1000).toISOString();

      return [
        "BEGIN:VEVENT",
        `UID:${event.id}@gratys.vercel.app`,
        `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
        `DTSTART:${toIcsDate(event.starts_at)}`,
        `DTEND:${toIcsDate(end)}`,
        `SUMMARY:${escapeIcs(event.title)}`,
        `DESCRIPTION:${escapeIcs(event.description || "")}`,
        event.location ? `LOCATION:${escapeIcs(event.location)}` : "",
        event.external_url ? `URL:${event.external_url}` : "",
        "END:VEVENT"
      ].filter(Boolean);
    }),
    "END:VCALENDAR"
  ].join("\r\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="agenda-campus.ics"',
      "Cache-Control": "public, max-age=300"
    }
  });
}
