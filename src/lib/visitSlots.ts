export const VISIT_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export function formatSlot(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/** Curated list of common IANA timezones for the visit selector. */
export const COMMON_TIMEZONES = [
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Istanbul",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
  "UTC",
] as const;

/** Detect the user's IANA timezone, falling back to UTC. */
export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** Short label like "GMT-5" for the given IANA timezone. */
export function timezoneOffsetLabel(tz: string, at: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(at);
    const off = parts.find((p) => p.type === "timeZoneName")?.value || "";
    return off.replace("GMT", "UTC");
  } catch {
    return "";
  }
}

/** Format a UTC ISO date + HH:mm slot in the given timezone, e.g. "Apr 24, 2026 · 10:00 AM (UTC-5)". */
export function formatVisitInTimezone(
  isoDate: string,
  slot: string | undefined,
  tz: string,
): string {
  const d = new Date(isoDate);
  const datePart = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
  const timePart = slot ? formatSlot(slot) : "";
  const off = timezoneOffsetLabel(tz, d);
  return `${datePart}${timePart ? ` · ${timePart}` : ""}${off ? ` (${off})` : ""}`;
}
