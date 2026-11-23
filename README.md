# PAOLO SMS – Produktwebsite

Statische Informationswebsite für PAOLO SMS, Zielgruppe Gleitschirmvereine und
Flugschulen.

Die Seite ist öffentlich unter https://paolo-sms.de/ erreichbar und für
Suchmaschinen freigegeben (Schalter `INDEXABLE` in `src/config.ts`). Hinweise für
Rückmeldungen stehen in [REVIEW.md](REVIEW.md).

Alle Rechte vorbehalten, bis eine Lizenz für Inhalte und Code festgelegt ist.
Name und Logo von PAOLO sind vom Lizenzrecht der Anwendung ausgenommen und
gesondert vorbehalten; die Verwendung des Logos auf dieser Website ist in
[BRAND.md](BRAND.md) dokumentiert.

## Schnellstart

```bash
npm ci               # installiert die in package-lock.json festgelegten Versionen
npm run dev          # http://localhost:4321
npm run verify       # Build, Strukturprüfung und Freigabeprüfung
npm run preview      # gebaute Seite lokal ansehen
```

Voraussetzung: Node.js >= 22.23.4 (getestet mit 24).

## Technologie: Astro (statisch)

| Kriterium | HTML/CSS von Hand | **Astro** | Next.js `output: 'export'` |
|---|---|---|---|
| Einfachheit | einfach bei 1–3 Seiten | einfach, eine Konfigurationsdatei | mehr Konfiguration (basePath, Bilder) |
| Wiederholte Teile | doppelt gepflegt | Komponenten und Layout | Komponenten, React-Laufzeit |
| Neue Materialien | HTML je Seite | **ein Eintrag** in `src/data/materials.ts` | Daten plus React-Code |
| Abhängigkeiten | keine | **eine** (`astro`) | React, Next und Kette |
| Ausgeliefertes JavaScript | keines | **keines eigenes** (nur der Zählcode von Cloudflare Web Analytics) | Next-Laufzeit |
| GitHub Pages | trivial | statischer Ordner `dist/` | möglich, mit Eigenheiten |

Gewählt wurde Astro: statischer Inhalt, Komponenten und eine Datendatei für
Materialien, ohne eigenes Laufzeit-JavaScript und mit minimalen Abhängigkeiten. Kein
Tailwind, keine UI-Bibliothek, keine Webfonts, keine Integrationen.

## Aufbau

```
src/config.ts            INDEXABLE-Schalter, Name, E-Mail, Anbieter, Navigation
src/layouts/Base.astro   Kopf, Navigation, Fuß, Suchmaschinen-Metadaten, Sprungmarke
src/pages/               Start, Einführen, Materialien, Mitmachen, Impressum, Datenschutz, 404
src/components/          Saeulen, MaterialCard, Unreleased, Placeholder
src/data/saeulen.ts      die vier Säulen eines SMS
src/data/materials.ts    alle Informationsmaterialien
src/styles/global.css    ein Stylesheet
public/brand/            Logo (Original-SVG, unverändert)
public/saeulen/          Säulengrafik der Startseite (enthält das Logo, siehe BRAND.md)
scripts/                 check-site.mjs, release-check.mjs
.github/workflows/       Build, Prüfungen und Deployment auf GitHub Pages
```

## Ein Material ergänzen

1. Freigegebene Datei (PDF bevorzugt, ohne Autoren- und Pfad-Metadaten) nach
   `public/materialien/` legen.
2. In `src/data/materials.ts` `availability: 'download'`, `href`
   (`/materialien/<datei>.pdf`; der Basispfad wird ergänzt), `version` und
   `stand` setzen und `releaseNote` entfernen.
3. In der Tabelle „Versionen und Änderungen" auf der Materialseite ergänzen.
4. `npm run verify`.

Der Release-Check lässt nur Dateien zu, die auf seiner Freigabeliste stehen
(Logo, Säulengrafik und als `download` eingetragene Materialien).

## Entwicklungsregeln

Dieses Repository und die PAOLO-SMS-Anwendung sind getrennt; die Regeln stehen in
[AGENTS.md](AGENTS.md). Kurz: Änderungen an dieser Website prüft `npm run verify`,
E2E-Tests mit Better Auth oder Clerk gehören ausschließlich zur Anwendung.

## Prüfungen

- `npm test`: Build und Strukturprüfung (`scripts/check-site.mjs`): Sprache,
  Titel, genau eine H1, Überschriftenreihenfolge, Textalternativen, tote Links,
  kein `<iframe>`, Cookie-/Storage-Zugriff oder Fremdressourcen und kein `<script>`
  außer dem Cloudflare-Zählcode (genau dieser Tag, genau einmal je Seite).
  Dazu gehört die Kontaktprüfung (siehe „Kontakt“ unten).
- `npm run release:check`: Freigabeprüfung des gebauten Ergebnisses. Bricht ab bei
  privaten Verweisen, lokalen Pfaden, fremden E-Mail-Adressen, möglichen
  Zugangsschlüsseln, nicht freigegebenen Dateien oder externen Links, fehlenden
  Anbieterangaben und Widersprüchen zum Schalter `INDEXABLE` (`noindex`,
  `robots.txt`, `sitemap.xml`, kanonische Adresse). Bei `INDEXABLE = true` sind
  sichtbare Freigabehinweise (`Unreleased`) und Platzhalter Pflichtbefunde.
  Hinweise ohne Blockade (zum Beispiel externe Medien) werden nur aufgelistet.
  Nicht geprüft werden die Inhalte der PDFs unter `public/materialien/`; sie
  stehen in der lokalen Freigabeliste.
- In der GitHub-Action zusätzlich `npm audit --omit=dev --audit-level=high`.

## Kontakt

Die Schaltfläche „Kontakt“ der Hauptnavigation führt auf die Seite `/kontakt/`
(`src/pages/kontakt.astro`). Dort steht die Adresse aus `SITE.email` als Klartext, mit einem
Klick markierbar (`user-select: all`, ohne JavaScript), dazu ein `mailto:`-Link.

**Ursache des früheren Fehlers (23.11.2026):** Die Schaltfläche war ein reiner
`mailto:info@paolo-sms.de`-Link. Der Link war technisch korrekt und nichts überdeckte ihn; der Browser
übergibt `mailto:` aber an das Betriebssystem oder verwaltet es selbst. Auf dem geprüften Rechner ist
Chrome selbst als Standard für `mailto:` eingetragen, ohne Webmail-Dienst, und tut deshalb nichts. Wer
kein E-Mail-Programm eingerichtet hat, sieht beim Klick ebenfalls keine Reaktion und kennt die Adresse
nicht.

**Absicherung:** `scripts/check-site.mjs` bricht ab, wenn die Schaltfläche „Kontakt“ wieder ein
`mailto:`-Link ist, ihr Ziel fehlt oder die Zielseite die Adresse nicht als Klartext nennt.

**Einheitliche Kontaktlinks:** Alle Schaltflächen zum Kontakt führen auf `/kontakt/` (Navigation, „Fragen?
Schreib uns“ auf „Einführen“, „E-Mail schreiben“ auf „Mitmachen“, „Per E-Mail anfragen“ bei der
technischen Dokumentation auf „Materialien“). Die Fußzeile hat „Kontakt“ als letzten Navigationspunkt
und keinen `mailto:`-Link. `mailto:`-Links im Text (Impressum, Datenschutz, Materialien) zeigen die
Adresse als Linktext. `check-site.mjs` prüft das: keine `mailto:`-Schaltfläche außerhalb von
`/kontakt/`, jede `mailto:`-Adresse ist `SITE.email`, „Kontakt“ ist in jeder Fußzeile der letzte Punkt, und
die Adresse steht auf `/kontakt/` als Klartext.

## Gestaltung ohne ausgelagerte Stylesheet-Datei

Das Stylesheet ist in jede Seite eingebettet (`build.inlineStylesheets: 'always'` in
`astro.config.mjs`).

**Ursache eines Ausfalls am 23.11.2026:** Astro legt das Stylesheet sonst als
`/_astro/Base.<Hash>.css` ab; der Hash ändert sich mit jeder Änderung am CSS. GitHub Pages liefert HTML
bis zu 10 Minuten aus dem Cache (`max-age=600`). Ein Besucher mit zwischengespeichertem HTML verwies
nach einer neuen Veröffentlichung auf eine inzwischen gelöschte Datei (404): Die Seite erschien ohne
Gestaltung (Navigation als Aufzählung, Grafiken in voller Breite).

**Absicherung:** `scripts/check-site.mjs` bricht ab, wenn eine Seite ein ausgelagertes Stylesheet oder
einen Verweis auf `/_astro/` enthält oder das eingebettete Stylesheet fehlt. `scripts/live-check.mjs`
prüft nach jeder Veröffentlichung die Live-Seite (Job `live-check` im Workflow): Status 200,
eingebettetes Stylesheet, erreichbare Bilder und Dateien. Lokal:
`node scripts/live-check.mjs https://paolo-sms.de`.

## Datenschutz und Barrierefreiheit

- Keine Cookies, kein `localStorage`, kein `<iframe>`, keine Ressourcen von
  Dritten; Schrift: Arial-Stack. Einzige Ausnahme ist die Besucherstatistik
  (siehe unten).
- Besucherstatistik: Cloudflare Web Analytics, eingebunden als ein Skript-Tag im
  Layout (`CLOUDFLARE_ANALYTICS` in `src/config.ts`). Die Seite läuft weiter über
  GitHub Pages; es gibt keinen Cloudflare-Proxy und keine DNS-Änderung. Der
  Strukturtest lässt genau diesen Tag zu und sonst kein Skript; der Release-Check
  verlangt, dass die Datenschutzerklärung den Dienst nennt. Wer Adresse oder
  Skript ändert, passt `src/pages/datenschutz.astro` mit an. Auswertung nur im
  Cloudflare-Dashboard; Export oder Archivierung sind nicht vorgesehen.
- Sprungmarke, Landmarken, sichtbarer Fokus, Zielgrößen ab 44 px, `lang="de"`,
  `prefers-reduced-motion`; kein horizontaler Überlauf von 320 bis 1280 px.
- Nicht geprüft: Screenreader, axe oder PAC, echte Smartphones, Druckausgabe.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` baut bei jedem Pull Request gegen `main` und führt
dieselben Prüfungen aus, ohne zu veröffentlichen. Bei jedem Push auf `main` baut es, führt Audit,
`npm test` und `npm run release:check` aus und veröffentlicht `dist/` über die
GitHub-Pages-Actions. Die Actions sind auf Commit-SHAs gepinnt. Die Seite wird
unter der eigenen Domain https://paolo-sms.de/ ausgeliefert (`site` und
`base: '/'` in `astro.config.mjs`); die Domain ist in den GitHub-Pages-
Einstellungen hinterlegt. Der Workflow setzt `SITE_BASE` nicht. Die frühere
Projektadresse leitet GitHub auf die Domain weiter.
