import { useEffect } from "react";
import { ChurchEvent, SiteContentConfig } from "../types";
import { CHURCH_INFO } from "../data/churchData";

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** "8:00 AM" -> "08:00", or null. */
export const to24h = (time: string): string | null => {
  const m = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  const hours = (Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0);
  return `${pad(hours)}:${m[2]}`;
};

/**
 * Parses free-text event dates such as "October 30, 2026" or
 * "October 7 - 9 & October 11, 2026" into ISO start/end dates.
 * Returns null when the text can't be read reliably.
 */
export const parseEventDates = (
  date: string,
  time: string,
): { startDate: string; endDate?: string } | null => {
  const years = [...date.matchAll(/\b(20\d{2})\b/g)].map((m) => m[1]);
  if (!years.length) return null;

  const days: { month: number; day: number }[] = [];
  let month = -1;
  const withoutYear = date.replace(/\b20\d{2}\b/g, "");
  for (const token of withoutYear.matchAll(/([A-Za-z]+)?\s*(\d{1,2})(?!\d)/g)) {
    const word = token[1]?.toLowerCase();
    const idx = word
      ? MONTHS.findIndex((name) => name.startsWith(word.slice(0, 3)))
      : -1;
    if (idx >= 0) month = idx;
    if (month < 0) continue;
    days.push({ month, day: Number(token[2]) });
  }
  if (!days.length) return null;

  const iso = (
    year: string,
    { month: m, day }: { month: number; day: number },
  ) => `${year}-${pad(m + 1)}-${pad(day)}`;
  const startDay = iso(years[0], days[0]);
  const endDay = iso(years[years.length - 1], days[days.length - 1]);
  const startTime = to24h(time);

  // Ghana is on GMT all year.
  return {
    startDate: startTime ? `${startDay}T${startTime}:00+00:00` : startDay,
    endDate: endDay > startDay ? endDay : undefined,
  };
};

export const buildChurchJsonLd = (
  origin: string,
  content: SiteContentConfig,
  events: ChurchEvent[],
) => {
  const abs = (path: string) =>
    /^https?:\/\//.test(path) || path.startsWith("data:")
      ? path
      : `${origin}${path}`;
  const place = {
    "@type": "Place",
    name: CHURCH_INFO.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: CHURCH_INFO.landmark,
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
      addressCountry: "GH",
    },
  };
  const service = (day: string, name: string, time: string, hours: number) => {
    const opens = to24h(time);
    if (!opens) return null;
    const closes = `${pad((Number(opens.slice(0, 2)) + hours) % 24)}${opens.slice(2)}`;
    return {
      "@type": "OpeningHoursSpecification",
      name,
      dayOfWeek: `https://schema.org/${day}`,
      opens,
      closes,
    };
  };

  const church = {
    "@type": "Church",
    "@id": `${origin}/#church`,
    name: CHURCH_INFO.name,
    url: `${origin}/`,
    logo: abs("/church_logo_white.png"),
    image: abs("/assets/optimized/hero_icgc_banner.webp"),
    description: CHURCH_INFO.description,
    telephone: `+233${CHURCH_INFO.phone.replace(/^0/, "")}`,
    email: CHURCH_INFO.email,
    address: place.address,
    openingHoursSpecification: [
      service(
        "Sunday",
        content.sundayServiceName,
        content.sundayServiceTime,
        3,
      ),
      service(
        "Wednesday",
        content.midweekServiceName,
        content.midweekServiceTime,
        2,
      ),
    ].filter(Boolean),
  };

  const eventNodes = events.flatMap((event) => {
    const dates = parseEventDates(event.date, event.time);
    if (!dates) return [];
    return [
      {
        "@type": "Event",
        name: event.name,
        description: event.shortDescription,
        ...dates,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { ...place, name: event.venue || CHURCH_INFO.name },
        image: event.image.startsWith("data:") ? undefined : abs(event.image),
        organizer: { "@id": `${origin}/#church` },
        isAccessibleForFree: true,
      },
    ];
  });

  return {
    "@context": "https://schema.org",
    "@graph": [church, ...eventNodes],
  };
};

/** Keeps a single JSON-LD block in <head> in sync with live content and events. */
export const useStructuredData = (
  content: SiteContentConfig,
  events: ChurchEvent[],
) => {
  useEffect(() => {
    const id = "wt-structured-data";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(
      buildChurchJsonLd(window.location.origin, content, events),
    );
  }, [content, events]);
};
