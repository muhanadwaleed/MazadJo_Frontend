/** ISO 8601 → value for `<input type="datetime-local" />`. */
export function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** `<input type="datetime-local" />` → ISO 8601 UTC. */
export function datetimeLocalToIso(value: string): string {
  return new Date(value).toISOString();
}

export function defaultListingSchedule(): { starts_at: string; ends_at: string } {
  const start = new Date();
  start.setDate(start.getDate() + 2);
  start.setHours(10, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);
  end.setHours(22, 0, 0, 0);
  return {
    starts_at: isoToDatetimeLocal(start.toISOString()),
    ends_at: isoToDatetimeLocal(end.toISOString()),
  };
}
