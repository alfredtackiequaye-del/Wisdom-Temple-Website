import { parseEventDates } from "./structuredData";

export type EventStatus =
  | { kind: "live" }
  | { kind: "soon"; days: number }
  | { kind: "past" }
  | { kind: "recurring" };

const dayNumber = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
};

/** Where an event sits relative to today. Ghana is on GMT, so UTC dates are local dates. */
export const getEventStatus = (date: string, time: string, now = new Date()): EventStatus => {
  const parsed = parseEventDates(date, time);
  if (!parsed) return { kind: "recurring" };
  const start = dayNumber(parsed.startDate);
  const end = parsed.endDate ? dayNumber(parsed.endDate) : start;
  const today = Math.floor(now.getTime() / 86_400_000);
  if (today < start) return { kind: "soon", days: start - today };
  if (today <= end) return { kind: "live" };
  return { kind: "past" };
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** Month and day of an event's first date, for the calendar badge. Null for recurring events. */
export const getEventDateParts = (date: string, time: string): { month: string; day: string } | null => {
  const parsed = parseEventDates(date, time);
  if (!parsed) return null;
  const [, m, d] = parsed.startDate.slice(0, 10).split("-").map(Number);
  return { month: MONTHS[m - 1], day: String(d) };
};
