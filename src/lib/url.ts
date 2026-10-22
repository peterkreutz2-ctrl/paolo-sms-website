/**
 * Baut einen internen Link unter Beachtung von `base` (siehe astro.config.mjs).
 * `path` beginnt immer mit '/', optional mit Anker, z. B. '/einfuehren/#rollen'.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
