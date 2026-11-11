const pad = (n: number) => String(n).padStart(2, '0');

const ROMAN_MONTHS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** Tanggal lokal (WIB) format YYYY-MM-DD. Jangan pakai toISOString() karena itu UTC. */
export function toLocalDateISO(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Timestamp lokal format "YYYY-MM-DD HH:mm". */
export function nowStamp(d: Date = new Date()): string {
  return `${toLocalDateISO(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function addDaysISO(days: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return toLocalDateISO(d);
}

export function romanMonth(d: Date = new Date()): string {
  return ROMAN_MONTHS[d.getMonth()];
}
