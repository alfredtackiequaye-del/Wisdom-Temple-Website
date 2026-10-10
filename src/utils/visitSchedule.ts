/**
 * Service schedule helpers for the Plan Your Visit page.
 * Wisdom Temple is in Accra, which is on GMT all year, so UTC times are local times there.
 */

const HOUR = 60 * 60 * 1000;
const SUNDAY_START_HOUR = 8; // 8:00 AM
const SUNDAY_LENGTH_H = 2;
const WEDNESDAY_START_HOUR = 19; // 7:00 PM
const WEDNESDAY_LENGTH_H = 2;

/** Start (ms) of the next occurrence of `weekday` (0 = Sunday) at `hour` UTC, on or after `from`. */
const nextOccurrence = (weekday: number, hour: number, lengthH: number, from: number) => {
  const d = new Date(from);
  d.setUTCHours(hour, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + ((weekday - d.getUTCDay() + 7) % 7));
  // Already over (start + length passed)? Take next week's.
  if (d.getTime() + lengthH * HOUR <= from) d.setUTCDate(d.getUTCDate() + 7);
  return d.getTime();
};

export type NextService =
  | { status: "live"; label: string }
  | { status: "upcoming"; label: string; start: number; days: number; hours: number; minutes: number };

/** The next Sunday celebration, or "live" while it is on. */
export const getNextSunday = (now = Date.now()): NextService => {
  const start = nextOccurrence(0, SUNDAY_START_HOUR, SUNDAY_LENGTH_H, now);
  if (now >= start && now < start + SUNDAY_LENGTH_H * HOUR) {
    return { status: "live", label: "Sunday Celebration is on now" };
  }
  const diff = start - now;
  return {
    status: "upcoming",
    label: "Sunday Celebration",
    start,
    days: Math.floor(diff / (24 * HOUR)),
    hours: Math.floor((diff / HOUR) % 24),
    minutes: Math.floor((diff / 60000) % 60),
  };
};

const icsStamp = (ms: number) =>
  new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export interface CalendarVisit {
  title: string;
  start: number;
  lengthH: number;
  location: string;
}

/** Resolves the form's "Planned Sunday" choice to a calendar slot, or null when it has no fixed date. */
export const resolveVisit = (choice: string, now = Date.now()): CalendarVisit | null => {
  const location = "Wisdom Temple, Star Junction, Tabora - Accra, Ghana";
  if (choice.startsWith("This Sunday") || choice.startsWith("Next Sunday")) {
    const first = nextOccurrence(0, SUNDAY_START_HOUR, SUNDAY_LENGTH_H, now);
    const start = choice.startsWith("Next") ? first + 7 * 24 * HOUR : first;
    return { title: "Visit Wisdom Temple: Sunday Celebration", start, lengthH: SUNDAY_LENGTH_H, location };
  }
  if (choice.startsWith("The Secret Place")) {
    return {
      title: "Visit Wisdom Temple: The Secret Place",
      start: nextOccurrence(3, WEDNESDAY_START_HOUR, WEDNESDAY_LENGTH_H, now),
      lengthH: WEDNESDAY_LENGTH_H,
      location,
    };
  }
  return null;
};

/** Builds an .ics file body for one or more slots; opens in Apple, Google and Outlook calendars. */
export const buildIcsMulti = (visits: CalendarVisit[], description = "Our welcome team will meet you at the door.") =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wisdom Temple//Plan Your Visit//EN",
    ...visits.flatMap((visit) => [
      "BEGIN:VEVENT",
      `UID:${visit.start}@wisdomtemple`,
      `DTSTAMP:${icsStamp(Date.now())}`,
      `DTSTART:${icsStamp(visit.start)}`,
      `DTEND:${icsStamp(visit.start + visit.lengthH * HOUR)}`,
      `SUMMARY:${visit.title}`,
      `LOCATION:${visit.location}`,
      `DESCRIPTION:${description}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT2H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Wisdom Temple reminder",
      "END:VALARM",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ].join("\r\n");

/** Single-visit version used by the Plan a Visit page. */
export const buildIcs = (visit: CalendarVisit) =>
  buildIcsMulti([visit], "Doors open 45 minutes before service. Our welcome team will meet you at the door.");

/** Saves an .ics string as a file the browser downloads. */
export const downloadIcs = (body: string, filename: string) => {
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
