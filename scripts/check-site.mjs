// Strukturprüfung des gebauten Prototyps (dist/). Ohne Abhängigkeiten.
// Prüft, was sich ohne Browser prüfen lässt; ersetzt keine Prüfung mit Screenreader
// oder einem Werkzeug wie axe/PAC.
//
// Aufruf: npm run build && npm run check
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, posix } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const BASE = (process.env.SITE_BASE ?? '/').replace(/\/?$/, '/');

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(DIST)) {
  console.error('dist/ fehlt. Zuerst: npm run build');
  process.exit(2);
}

const files = walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));
const errors = [];
const warnings = [];
const externalLinks = new Map();
const err = (page, msg) => errors.push(`${page}: ${msg}`);

const exists = (rel) => {
  const clean = rel.split('#')[0].split('?')[0];
  const target = join(DIST, clean);
  if (existsSync(target) && statSync(target).isFile()) return true;
  return existsSync(join(target, 'index.html'));
};

for (const file of pages) {
  const page = relative(DIST, file).replaceAll('\\', '/');
  const html = readFileSync(file, 'utf8');
  const is404 = page === '404.html';

  if (!/<html lang="de"/.test(html)) err(page, 'html lang="de" fehlt');
  if (!/<title>[^<]+<\/title>/.test(html)) err(page, '<title> fehlt');
  if (!/<meta name="description"/.test(html)) err(page, 'Meta-Beschreibung fehlt');
  if (!/<meta name="viewport"/.test(html)) err(page, 'Viewport fehlt');
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) err(page, `${h1} <h1> statt genau einer`);
  if (!/class="skip" href="#inhalt"/.test(html)) err(page, 'Sprungmarke fehlt');
  if ((html.match(/<main[\s>]/g) ?? []).length !== 1) err(page, 'genau ein <main> erwartet');
  if (!/<nav[^>]*aria-label=/.test(html)) err(page, '<nav> ohne aria-label');

  // Überschriftenreihenfolge: keine übersprungenen Ebenen
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) err(page, `Überschriftenebene übersprungen (h${levels[i - 1]} → h${levels[i]})`);
  }

  // Bilder: alt-Attribut vorhanden (leer erlaubt für dekorative Bilder)
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(m[0])) err(page, `<img> ohne alt: ${m[0].slice(0, 80)}`);
  }

  // Keine Ressourcen von Dritten, kein eingebetteter Fremdinhalt, kein Skript
  if (/<iframe\b/.test(html)) err(page, '<iframe> gefunden');
  if (/<script\b/.test(html)) err(page, '<script> gefunden (Prototyp ist skriptfrei)');
  for (const m of html.matchAll(/<(?:link|img|source|video|audio)\b[^>]*\b(?:src|href|srcset)="(https?:)?\/\/[^"]+"/g)) {
    if (!/rel="(?:noopener|noreferrer)/.test(m[0]) && !/<a\b/.test(m[0])) err(page, `externe Ressource: ${m[0].slice(0, 100)}`);
  }
  if (/url\(\s*['"]?https?:/.test(html)) err(page, 'externe url() im Inline-CSS');
  if (/document\.cookie|localStorage|sessionStorage/.test(html)) err(page, 'Cookie-/Storage-Zugriff gefunden');

  // Links
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    const href = m[1];
    if (/^(mailto:|tel:)/.test(href)) continue;
    if (/^https?:\/\//.test(href)) {
      externalLinks.set(href, (externalLinks.get(href) ?? new Set()).add(page));
      continue;
    }
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (id && !new RegExp(`\\bid="${id}"`).test(html)) err(page, `Anker fehlt: ${href}`);
      continue;
    }
    if (!href.startsWith(BASE)) { err(page, `Link außerhalb von base: ${href}`); continue; }
    const rel = href.slice(BASE.length);
    if (!exists(rel)) err(page, `toter Link: ${href}`);
    const [pathPart, anchor] = href.split('#');
    if (anchor) {
      const targetFile = join(DIST, pathPart.slice(BASE.length), 'index.html');
      if (existsSync(targetFile) && !new RegExp(`\\bid="${anchor}"`).test(readFileSync(targetFile, 'utf8'))) {
        err(page, `Anker in Zielseite fehlt: ${href}`);
      }
    }
  }
  // Lokale Bilder/Assets
  for (const m of html.matchAll(/\b(?:src|href)="(\/[^"#?]*\.(?:png|svg|webp|jpg|jpeg|css|pdf))"/g)) {
    const ref = m[1];
    if (!ref.startsWith(BASE)) { err(page, `Asset außerhalb von base: ${ref}`); continue; }
    if (!exists(ref.slice(BASE.length))) err(page, `Asset fehlt: ${ref}`);
  }
  if (is404) continue;
}

// Dateigrößen
const big = files.filter((f) => statSync(f).size > 500 * 1024);
for (const f of big) warnings.push(`groß (> 500 KB): ${relative(DIST, f)} = ${(statSync(f).size / 1024).toFixed(0)} KB`);

console.log(`Geprüft: ${pages.length} Seiten, ${files.length} Dateien.`);
if (externalLinks.size) {
  console.log('\nExterne Links (verlassen die Website, manuell prüfen):');
  for (const [h, p] of externalLinks) console.log(`  ${h}  ← ${[...p].join(', ')}`);
}
if (warnings.length) console.log('\nHinweise:\n  ' + warnings.join('\n  '));
if (errors.length) {
  console.error(`\n${errors.length} Fehler:\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('\nKeine Strukturfehler.');
