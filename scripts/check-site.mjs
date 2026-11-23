// Strukturprüfung des gebauten Prototyps (dist/). Ohne Abhängigkeiten.
// Prüft, was sich ohne Browser prüfen lässt; ersetzt keine Prüfung mit Screenreader
// oder einem Werkzeug wie axe/PAC.
//
// Aufruf: npm run build && npm run check
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, posix } from 'node:path';

const { CLOUDFLARE_ANALYTICS, SITE } = await import('../src/config.ts');
// So rendert Astro den Tag (Anführungszeichen im Attribut als &quot;).
const CF_TAG = `<script type="module" src="${CLOUDFLARE_ANALYTICS.script}" data-cf-beacon="{&quot;token&quot;:&quot;${CLOUDFLARE_ANALYTICS.token}&quot;}"></script>`;

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
  // Skripte: Datenblöcke (type="application/ld+json") sind nicht ausführbar und erlaubt. Einzige
  // ausführbare Ausnahme ist der Cloudflare-Zählcode (src/config.ts, CLOUDFLARE_ANALYTICS), exakt
  // in dieser Form und genau einmal. Jedes andere Skript, auch inline, ist ein Fehler.
  const isData = (s) => /^<script\b[^>]*type="application\/ld\+json"/.test(s);
  const scripts = [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map((m) => m[0]).filter((s) => !isData(s));
  for (const s of scripts) if (s !== CF_TAG) err(page, `nicht erlaubtes <script>: ${s.slice(0, 100)}`);
  if (scripts.filter((s) => s === CF_TAG).length !== 1) err(page, 'Cloudflare-Zählcode fehlt oder steht mehrfach');
  if (/<script\b/.test(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ''))) err(page, 'nicht abgeschlossenes <script>');
  for (const m of html.matchAll(/<(?:link|img|source|video|audio)\b[^>]*\b(?:src|href|srcset)="(https?:)?\/\/[^"]+"/g)) {
    // Die kanonische Adresse (rel="canonical") verweist auf die Seite selbst, sie ist keine Ressource.
    if (!/rel="(?:noopener|noreferrer|canonical)/.test(m[0]) && !/<a\b/.test(m[0])) err(page, `externe Ressource: ${m[0].slice(0, 100)}`);
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

// Kontakt: Die Schaltfläche „Kontakt“ der Hauptnavigation darf kein reiner mailto:-Link sein. Ohne
// registriertes E-Mail-Programm (oder wenn der Browser mailto: selbst verwaltet, aber nichts damit
// anfangen kann) passiert beim Klick nichts. Sie muss auf eine Seite führen, auf der die Adresse als
// Klartext steht und kopierbar ist.
for (const file of pages) {
  const page = relative(DIST, file).replaceAll('\\', '/');
  if (page === '404.html') continue;
  const html = readFileSync(file, 'utf8');
  const m = html.match(/<a class="btn" href="([^"]*)"[^>]*>Kontakt<\/a>/);
  if (!m) { err(page, 'Schaltfläche „Kontakt“ in der Hauptnavigation fehlt'); continue; }
  if (/^mailto:/i.test(m[1])) { err(page, 'Schaltfläche „Kontakt“ ist ein reiner mailto:-Link (ohne E-Mail-Programm passiert beim Klick nichts)'); continue; }
  const target = join(DIST, m[1].slice(BASE.length).split('#')[0], 'index.html');
  if (!existsSync(target)) { err(page, `Ziel der Schaltfläche „Kontakt“ fehlt: ${m[1]}`); continue; }
  const text = readFileSync(target, 'utf8').replace(/<[^>]+>/g, ' ');
  if (!text.includes(SITE.email)) err(page, `Zielseite der Schaltfläche „Kontakt“ nennt ${SITE.email} nicht als Klartext`);
}

// Gestaltung: Das Stylesheet muss in jeder Seite eingebettet sein. GitHub Pages liefert HTML bis zu
// 10 Minuten aus dem Cache. Ein zwischengespeichertes HTML, das auf eine ausgelagerte, mit Hash
// benannte Datei (/_astro/Base.<Hash>.css) verweist, zeigt nach einer Veröffentlichung die Seite
// ohne Gestaltung, weil die alte Datei dann nicht mehr existiert (404).
for (const file of pages) {
  const page = relative(DIST, file).replaceAll('\\', '/');
  const html = readFileSync(file, 'utf8');
  if (/<link\b[^>]*rel="stylesheet"/.test(html)) err(page, 'ausgelagertes Stylesheet (<link rel="stylesheet">): Gestaltung muss eingebettet sein');
  if (/\/_astro\//.test(html)) err(page, 'Verweis auf /_astro/ (Dateiname mit Hash, nach einer neuen Veröffentlichung nicht mehr vorhanden)');
  const css = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('');
  if (css.length < 5000 || !css.includes('.nav') || !css.includes('.site-header') || !css.includes('.wrap')) err(page, `eingebettetes Stylesheet fehlt oder ist unvollständig (${css.length} Zeichen)`);
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

