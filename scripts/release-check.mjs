// Freigabeprüfung der öffentlichen Website. Ohne Abhängigkeiten.
//
// Bricht bei Pflichtbefunden ab: private Verweise, lokale Pfade, fremde E-Mail-Adressen,
// mögliche Zugangsschlüssel, nicht freigegebene Dateien oder externe Links, fehlende
// Anbieterangaben sowie Widersprüche zwischen dem Schalter INDEXABLE (src/config.ts)
// und dem gebauten Ergebnis (noindex, robots.txt, Sitemap, kanonische Adresse).
// Ist INDEXABLE true, sind außerdem sichtbare Freigabehinweise und Platzhalter
// Pflichtbefunde. Weitere Hinweise (zum Beispiel externe Medien) werden nur aufgelistet.
//
// Aufruf: npm run build && npm run release:check
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
if (!existsSync(DIST)) {
  console.error('dist/ fehlt. Zuerst: npm run build');
  process.exit(2);
}

const { PROVIDER, SITE, SITE_URL, INDEXABLE } = await import('../src/config.ts');
const { materials, releasePackage } = await import('../src/data/materials.ts');

const walk = (d, skip = new Set()) =>
  readdirSync(d).flatMap((n) => {
    if (skip.has(n)) return [];
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p, skip) : [p];
  });
const rel = (f) => relative(ROOT, f).replaceAll('\\', '/');
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();

const must = []; // Pflicht für die Review-Version
const open = []; // Hinweise, die nicht blockieren
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
// Freigegebene externe Verweise: die öffentliche Demo-Installation (erfundene Daten, getrennt von jeder
// Betreiberinstallation), vom Betreiber freigegeben am 25.10.2026.
const ALLOWED_EXTERNAL_LINKS = new Set(['https://demo.paolo-sms.de/', 'https://www.youtube.com/watch?v=6b8VwUDiiHQ']);
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
const allowedAssets = new Set([
  'robots.txt',
  'sitemap.xml',
  'brand/paolo-sms-logo.svg',
  'brand/dhv-logo.svg',
  'saeulen/sms-saeulen.png',
  'bilder/meldung-einreichen.png',
  'bilder/dashboard.png',
  'bilder/meldung-klassifizieren.png',
  'bilder/massnahmen.png',
  'bilder/weg-zu-paolo-sms.png',
  'contributors/contributor_peter.webp',
  'contributors/contributor_rainer.webp',
  'contributors/contributor_thomas.webp',
  // hier kommen alte Downloads, die noch angeboten werden (auch ohne explizite Erwähnung)
  'downloads/paolo-sms-0.2.0-pilot.1.tar.gz',
  'downloads/paolo-sms-0.2.0-pilot.1.SHA256SUMS',
]);
for (const m of materials) if (m.availability === 'download' && m.href?.startsWith('/')) allowedAssets.add(m.href.slice(1));
for (const h of [releasePackage.packageHref, releasePackage.checksumHref]) allowedAssets.add(h.slice(1));
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

  // Externe Verweise: keine, außer mailto und freigegebene Verweise
  for (const m of html.matchAll(/<a\b[^>]*\bhref="(https?:[^"]+)"/g)) {
    if (!ALLOWED_EXTERNAL_LINKS.has(m[1])) addMust(`page ${page}`, `externer Link ${m[1]} (nicht freigegeben)`);
  }

  for (const m of html.matchAll(/<aside class="unreleased"[^>]*>([\s\S]*?)<\/aside>/g)) {
    unreleased++;
    // Bei freigegebener Indexierung darf kein Freigabehinweis mehr öffentlich stehen.
    (INDEXABLE ? addMust : addOpen)(`page ${page}`, `Freigabehinweis: ${strip(m[1])}`);
  }
  for (const m of html.matchAll(/<span class="platzhalter"[^>]*>([\s\S]*?)<\/span>/g)) {
    placeholders++;
    // Impressum und Datenschutz: ein offener Platzhalter ist ein Pflichtbefund
    if (page === '/impressum/' || page === '/datenschutz/') addMust(`page ${page}`, `rechtlich relevanter Platzhalter: ${strip(m[1])}`);
    else (INDEXABLE ? addMust : addOpen)(`page ${page}`, `Platzhalter: ${strip(m[1])}`);
  }

  // Suchmaschinenfreigabe: Schalter, noindex und kanonische Adresse müssen zusammenpassen
  const hasNoindex = /<meta name="robots" content="noindex/.test(html);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const is404 = page === '/404.html';
  if (is404) {
    if (!hasNoindex) addMust(`page ${page}`, '404-Seite muss noindex tragen');
  } else if (INDEXABLE) {
    if (hasNoindex) addMust(`page ${page}`, 'noindex trotz INDEXABLE = true');
    if (canonical !== SITE_URL + page) addMust(`page ${page}`, `kanonische Adresse fehlt oder weicht ab (erwartet ${SITE_URL + page}, gefunden ${canonical ?? 'keine'})`);
  } else if (!hasNoindex) {
    addMust(`page ${page}`, 'noindex fehlt bei INDEXABLE = false');
  }
}

// 3a. robots.txt und Sitemap
const robotsFile = join(DIST, 'robots.txt');
const sitemapFile = join(DIST, 'sitemap.xml');
if (!existsSync(robotsFile)) addMust('dist: robots.txt', 'fehlt');
else {
  const robots = readFileSync(robotsFile, 'utf8');
  if (INDEXABLE) {
    if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) addMust('dist: robots.txt', 'sperrt die gesamte Seite trotz INDEXABLE = true');
    if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) addMust('dist: robots.txt', 'Verweis auf die Sitemap fehlt');
  } else if (!/^\s*Disallow:\s*\/\s*$/m.test(robots)) addMust('dist: robots.txt', 'sperrt nicht alles bei INDEXABLE = false');
}
if (!existsSync(sitemapFile)) addMust('dist: sitemap.xml', 'fehlt');
else {
  const sitemap = readFileSync(sitemapFile, 'utf8');
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = pages.map((f) => '/' + relative(DIST, f).split(sep).join('/').replace(/index\.html$/, '')).filter((p) => p !== '/404.html').map((p) => SITE_URL + p);
  for (const e of expected) if (!listed.includes(e)) addMust('dist: sitemap.xml', `Seite fehlt: ${e}`);
  for (const l of listed) if (!expected.includes(l)) addMust('dist: sitemap.xml', `Eintrag ohne Seite: ${l}`);
}

// 3b. Logo: Verwendung muss dokumentiert sein
if (allowedAssets.has('brand/paolo-sms-logo.svg')) {
  const brand = join(ROOT, 'BRAND.md');
  if (!existsSync(brand) || !/Berechtigung/.test(readFileSync(brand, 'utf8'))) addMust('BRAND.md', 'Dokumentation der Logo-Berechtigung fehlt');
}

// 3b2. DHV-Logo: Freigabe muss in BRAND.md stehen
if (allowedAssets.has('brand/dhv-logo.svg')) {
  const brand = join(ROOT, 'BRAND.md');
  if (!existsSync(brand) || !/dhv-logo.svg/.test(readFileSync(brand, 'utf8'))) addMust('BRAND.md', 'Dokumentation des DHV-Logos fehlt');
}

// 3b3. DHV-Logo: dokumentierte Farbe (BRAND.md) muss in der ausgelieferten Datei stehen
if (allowedAssets.has('brand/dhv-logo.svg') && existsSync(join(DIST, 'brand/dhv-logo.svg'))) {
  if (!/fill="#55616a"/i.test(readFileSync(join(DIST, 'brand/dhv-logo.svg'), 'utf8'))) addMust('dist: brand/dhv-logo.svg', 'DHV-Logo nicht in dokumentiertem Grau #55616a (siehe BRAND.md)');
}

// 3c. Säulengrafik (enthält das Logo): Freigabe muss in BRAND.md stehen
if (allowedAssets.has('saeulen/sms-saeulen.png')) {
  const brand = join(ROOT, 'BRAND.md');
  if (!existsSync(brand) || !/sms-saeulen\.png/.test(readFileSync(brand, 'utf8'))) addMust('BRAND.md', 'Dokumentation der Säulengrafik (mit Logo) fehlt');
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
console.log(`Seiten: ${pages.length}  |  Indexierbar: ${INDEXABLE}  |  Freigabehinweise: ${unreleased}  |  Platzhalter: ${placeholders}`);
print('Pflichtbefunde', must);
print('Hinweise (blockieren nicht)', open);

if (must.length) {
  console.error(`\nNICHT VERÖFFENTLICHBAR: ${must.length} Pflichtbefund(e).`);
  process.exit(1);
}
console.log('\nFREIGABEFÄHIG.');
