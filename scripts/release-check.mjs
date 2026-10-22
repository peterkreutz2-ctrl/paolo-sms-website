// Freigabeprüfung mit zwei Stufen. Ohne Abhängigkeiten.
//
//   --stage=review      Voraussetzungen für die öffentliche Review-Vorschau.
//                       Bricht nur bei „Pflicht Review"-Befunden ab. Offene Punkte
//                       der Produktivfreigabe werden nur aufgelistet.
//   --stage=production  (Standard) Produktivfreigabe. Bricht bei jedem Befund ab,
//                       also auch bei Prototyp-Kennzeichnung, Freigabehinweisen
//                       und Platzhaltern.
//
// Aufruf: npm run build && npm run release:review
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const stageArg = process.argv.find((a) => a.startsWith('--stage='))?.slice(8) ?? 'production';
if (!['review', 'production'].includes(stageArg)) {
  console.error(`Unbekannte Stufe: ${stageArg} (review|production)`);
  process.exit(2);
}
if (!existsSync(DIST)) {
  console.error('dist/ fehlt. Zuerst: npm run build');
  process.exit(2);
}

const { PROVIDER, SITE, PROTOTYPE } = await import('../src/config.ts');
const { materials } = await import('../src/data/materials.ts');

const walk = (d, skip = new Set()) =>
  readdirSync(d).flatMap((n) => {
    if (skip.has(n)) return [];
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p, skip) : [p];
  });
const rel = (f) => relative(ROOT, f).replaceAll('\\', '/');
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();

const must = []; // Pflicht für die Review-Version
const open = []; // offen für die Produktivfreigabe
const addMust = (where, msg) => must.push({ where, msg });
const addOpen = (where, msg) => open.push({ where, msg });

// Muster aus Teilen zusammengesetzt, damit diese Datei sich nicht selbst trifft.
const j = (...p) => p.join('');
const FORBIDDEN = [
  [new RegExp(j('github\\.com/peter', 'kreutz2')), 'Verweis auf das private Anwendungsrepository'],
  [new RegExp(j('paolo-sms', '\\.vercel')), 'Verweis auf die Referenzinstallation (Demo)'],
  [new RegExp(j('[A-Za-z]:\\\\\\\\?Users', '|/c/Us', 'ers|One', 'Drive|sms-', 'mvp|data_', 'r1'), 'i'), 'lokaler Pfad oder interner Verzeichnisname'],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[abp]-[A-Za-z0-9-]{10,}/, 'möglicher Zugangsschlüssel'],
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const ALLOWED_EMAILS = new Set([SITE.email.toLowerCase()]);
const TEXT_EXT = new Set(['.astro', '.ts', '.mjs', '.js', '.json', '.md', '.yml', '.yaml', '.css', '.svg', '.html', '.txt']);

// 1. Gebautes Ergebnis (dist) und Repository-Inhalt (ohne Ignoriertes) durchsuchen
const dist = walk(DIST);
const repo = walk(ROOT, new Set(['node_modules', 'dist', '.astro', '.git', 'package-lock.json', 'FREIGABE.local.md']));
const scan = [...dist.map((f) => [f, 'dist']), ...repo.map((f) => [f, 'repo'])].filter(([f]) => TEXT_EXT.has(extname(f)));
for (const [f, kind] of scan) {
  const text = readFileSync(f, 'utf8');
  const where = `${kind}: ${kind === 'dist' ? relative(DIST, f).replaceAll('\\', '/') : rel(f)}`;
  for (const [re, msg] of FORBIDDEN) if (re.test(text)) addMust(where, msg);
  for (const m of text.matchAll(EMAIL)) {
    if (!ALLOWED_EMAILS.has(m[0].toLowerCase())) addMust(where, `fremde E-Mail-Adresse: ${m[0]}`);
  }
}

// 2. Dateien: nur freigegebene Assets
const allowedAssets = new Set(['brand/paolo-sms-logo.svg']);
for (const m of materials) if (m.availability === 'download' && m.href?.startsWith('/')) allowedAssets.add(m.href.slice(1));
const staticFiles = dist.filter((f) => !f.endsWith('.html') && !relative(DIST, f).replaceAll('\\', '/').startsWith('_astro/'));
for (const f of staticFiles) {
  const r = relative(DIST, f).replaceAll('\\', '/');
  if (!allowedAssets.has(r)) addMust(`dist: ${r}`, 'Datei nicht auf der Freigabeliste (Bilder, PDFs und Metadaten prüfen)');
}
for (const a of allowedAssets) if (!existsSync(join(DIST, a))) addMust(`dist: ${a}`, 'freigegebene Datei fehlt');
for (const f of staticFiles) {
  if (/\.(png|jpe?g|gif|webp|avif|pdf)$/i.test(f) && !allowedAssets.has(relative(DIST, f).replaceAll('\\', '/'))) addMust(`dist: ${relative(DIST, f)}`, 'Bild/PDF ohne Rechte- und Metadatenprüfung');
}
for (const m of materials) {
  if (m.availability === 'download' && (!m.version || !m.stand)) addMust(`materials: ${m.id}`, 'Download ohne Version und Stand');
  if (m.availability === 'external') addOpen(`materials: ${m.id}`, 'externer Link: Sichtbarkeit und Rechte prüfen');
}

// 3. Seiten
const pages = dist.filter((f) => f.endsWith('.html'));
let unreleased = 0;
let placeholders = 0;
for (const file of pages) {
  const page = '/' + relative(DIST, file).replaceAll('\\', '/').replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');

  // Externe Verweise: in der Review-Version keine (außer mailto)
  for (const m of html.matchAll(/<a\b[^>]*\bhref="(https?:[^"]+)"/g)) addMust(`page ${page}`, `externer Link ${m[1]} (nicht freigegeben)`);

  for (const m of html.matchAll(/<aside class="unreleased"[^>]*>([\s\S]*?)<\/aside>/g)) {
    unreleased++;
    addOpen(`page ${page}`, `Freigabehinweis: ${strip(m[1])}`);
  }
  for (const m of html.matchAll(/<span class="platzhalter"[^>]*>([\s\S]*?)<\/span>/g)) {
    placeholders++;
    // Impressum und Datenschutz: ein offener Platzhalter ist ein Pflichtbefund
    if (page === '/impressum/' || page === '/datenschutz/') addMust(`page ${page}`, `rechtlich relevanter Platzhalter: ${strip(m[1])}`);
    else addOpen(`page ${page}`, `Platzhalter: ${strip(m[1])}`);
  }

  // Prototyp-Kennzeichnung: in der Review-Version Pflicht, in Produktion zu entfernen
  const hasNoindex = /<meta name="robots" content="noindex/.test(html);
  const hasBanner = /class="proto"/.test(html);
  if (stageArg === 'review') {
    if (!hasNoindex) addMust(`page ${page}`, 'noindex fehlt');
    if (!hasBanner) addMust(`page ${page}`, 'Prototyp-Hinweis fehlt');
  }
  if (hasNoindex || hasBanner) addOpen(`page ${page}`, 'Prototyp-Kennzeichnung (noindex, Hinweis) ist noch gesetzt');
}
if (stageArg === 'review' && PROTOTYPE !== true) addMust('src/config.ts', 'PROTOTYPE muss in der Review-Version true bleiben');

// 3b. Logo: Verwendung muss dokumentiert sein
if (allowedAssets.has('brand/paolo-sms-logo.svg')) {
  const brand = join(ROOT, 'BRAND.md');
  if (!existsSync(brand) || !/Berechtigung/.test(readFileSync(brand, 'utf8'))) addMust('BRAND.md', 'Dokumentation der Logo-Berechtigung fehlt');
}

// 4. Impressum: festgelegte Anbieterangaben müssen im gebauten Impressum stehen
const imp = join(DIST, 'impressum', 'index.html');
if (!existsSync(imp)) addMust('dist: impressum', 'Impressum fehlt');
else {
  const t = strip(readFileSync(imp, 'utf8'));
  for (const v of [PROVIDER.name, PROVIDER.street, PROVIDER.city, SITE.email]) if (!t.includes(v)) addMust('dist: impressum', `Angabe fehlt: ${v}`);
}
const ds = join(DIST, 'datenschutz', 'index.html');
if (!existsSync(ds)) addMust('dist: datenschutz', 'Datenschutzerklärung fehlt');
else {
  const t = strip(readFileSync(ds, 'utf8'));
  for (const v of [PROVIDER.name, PROVIDER.city, 'weitergeleitet']) if (!t.includes(v)) addMust('dist: datenschutz', `Angabe fehlt: ${v}`);
}

// Ausgabe
const print = (title, list) => {
  console.log(`\n## ${title} (${list.length})`);
  for (const f of list) console.log(`- ${f.where}: ${f.msg}`);
};
console.log(`Stufe: ${stageArg}  |  Seiten: ${pages.length}  |  Freigabehinweise: ${unreleased}  |  Platzhalter: ${placeholders}`);
print('Pflicht für die Review-Version', must);
print('Offen für die Produktivfreigabe', open);

if (must.length) {
  console.error(`\nNICHT VERÖFFENTLICHBAR (Review-Version): ${must.length} Pflichtbefund(e).`);
  process.exit(1);
}
if (stageArg === 'review') {
  console.log(`\nREVIEW-VERSION FREIGABEFÄHIG. ${open.length} Punkte bleiben für die Produktivfreigabe offen (nicht blockierend).`);
  process.exit(0);
}
if (open.length) {
  console.error(`\nNICHT PRODUKTIV FREIGABEFÄHIG: ${open.length} offene Punkte.`);
  process.exit(1);
}
console.log('\nKeine offenen Befunde.');
