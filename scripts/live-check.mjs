// Prüfung der veröffentlichten Website (nach dem Deployment). Ohne Abhängigkeiten.
// Aufruf: node scripts/live-check.mjs [https://paolo-sms.de]
//
// Ruft jede Seite aus der Sitemap mit Cache-Umgehung ab und prüft: Status 200, eingebettetes
// Stylesheet, keine Verweise auf /_astro/, alle lokalen Bilder und Dateien erreichbar. Bricht mit
// Fehlercode 1 ab, wenn etwas fehlt. Hintergrund: Eine Seite ohne Gestaltung (Stylesheet nicht
// erreichbar) fällt sonst erst auf, wenn ein Besucher sie meldet.
const base = (process.argv[2] ?? 'https://paolo-sms.de').replace(/\/$/, '');
const bust = `live=${Date.now()}`;
const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

async function get(path, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(`${base}${path}${path.includes('?') ? '&' : '?'}${bust}`, { redirect: 'follow' });
      if (r.status === 200) return r;
      last = r;
    } catch (e) {
      last = { status: `Netzwerkfehler ${e.message}` };
    }
    await new Promise((res) => setTimeout(res, 5000));
  }
  return last;
}

const sm = await get('/sitemap.xml');
if (sm.status !== 200) { console.error(`sitemap.xml: Status ${sm.status}`); process.exit(1); }
const pages = [...(await sm.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (!pages.length) { console.error('sitemap.xml enthält keine Seiten'); process.exit(1); }

const assets = new Set();
for (const p of pages) {
  const r = await get(p);
  if (r.status !== 200) { err(p, `Status ${r.status}`); continue; }
  const html = await r.text();
  const type = r.headers.get('content-type') ?? '';
  if (!/text\/html/.test(type)) err(p, `Content-Type ${type}`);
  const css = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('');
  if (css.length < 5000 || !css.includes('.nav') || !css.includes('.wrap')) err(p, `eingebettetes Stylesheet fehlt oder ist unvollständig (${css.length} Zeichen)`);
  if (/<link\b[^>]*rel="stylesheet"/.test(html)) err(p, 'ausgelagertes Stylesheet gefunden');
  if (/\/_astro\//.test(html)) err(p, 'Verweis auf /_astro/');
  for (const m of html.matchAll(/\b(?:src|href)="(\/[^"#?]+\.(?:png|svg|webp|jpg|pdf|txt|md|gz|SHA256SUMS))(?:\?[^"]*)?"/g)) assets.add(m[1]);
}
for (const a of assets) {
  const r = await get(a, 2);
  if (r.status !== 200) err(a, `Status ${r.status}`);
}

console.log(`Live-Prüfung ${base}: ${pages.length} Seiten, ${assets.size} Dateien.`);
if (errors.length) {
  console.error(`${errors.length} Fehler:\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('Live-Prüfung bestanden.');
