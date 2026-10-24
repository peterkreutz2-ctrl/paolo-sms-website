# PAOLO SMS – Produktwebsite (Review-Version)

Statische Informationswebsite für PAOLO SMS, Zielgruppe Gleitschirmvereine und
Flugschulen.

> **Vorläufige Review-Version, keine offizielle Produktfreigabe.** Die Website
> trägt auf jeder Seite einen Prototyp-Hinweis und `noindex`. Sie dient dazu,
> dass Projektbeteiligte sie beurteilen können. Hinweise zum Review stehen in
> [REVIEW.md](REVIEW.md).

Alle Rechte vorbehalten, bis eine Lizenz für Inhalte und Code festgelegt ist.
Name und Logo von PAOLO sind vom Lizenzrecht der Anwendung ausgenommen und
gesondert vorbehalten; die Verwendung des Logos auf dieser Website ist in
[BRAND.md](BRAND.md) dokumentiert.

## Schnellstart

```bash
npm ci               # nur Astro 7.4.2 (exakt gepinnt)
npm run dev          # http://localhost:4321
npm run verify       # Build, Strukturprüfung und Review-Freigabeprüfung
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
| Ausgeliefertes JavaScript | keines | **keines** | Next-Laufzeit |
| GitHub Pages | trivial | statischer Ordner `dist/` | möglich, mit Eigenheiten |

Gewählt wurde Astro: statischer Inhalt, Komponenten und eine Datendatei für
Materialien, ohne Laufzeit-JavaScript und mit minimalen Abhängigkeiten. Kein
Tailwind, keine UI-Bibliothek, keine Webfonts, keine Integrationen.

## Aufbau

```
src/config.ts            PROTOTYPE-Schalter, Name, E-Mail, Anbieter, Navigation
src/layouts/Base.astro   Kopf, Navigation, Fuß, Prototyp-Hinweis, Sprungmarke
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
  kein `<script>`, `<iframe>`, Cookie-/Storage-Zugriff oder Fremdressourcen.
- `npm run release:review`: Voraussetzungen für die **öffentliche
  Review-Version** (Pflicht). Bricht ab bei privaten Verweisen, lokalen Pfaden,
  fremden E-Mail-Adressen, möglichen Zugangsschlüsseln, nicht freigegebenen
  Dateien oder externen Links, fehlenden Anbieterangaben oder fehlender
  Prototyp-Kennzeichnung. Offene Punkte der Produktivfreigabe werden nur
  aufgelistet.
- `npm run release:production`: strenge Stufe für die spätere Produktivfreigabe.
  Schlägt fehl, solange Hinweise, Platzhalter oder die Prototyp-Kennzeichnung
  bestehen.
- In der GitHub-Action zusätzlich `npm audit --omit=dev --audit-level=high`.

## Datenschutz und Barrierefreiheit

- Keine Cookies, kein `localStorage`, kein Tracking, kein `<script>`, kein
  `<iframe>`, keine Ressourcen von Dritten; Schrift: Arial-Stack.
- Sprungmarke, Landmarken, sichtbarer Fokus, Zielgrößen ab 44 px, `lang="de"`,
  `prefers-reduced-motion`; kein horizontaler Überlauf von 320 bis 1280 px.
- Nicht geprüft: Screenreader, axe oder PAC, echte Smartphones, Druckausgabe.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` baut bei jedem Push auf `main`, führt Audit,
`npm test` und `npm run release:review` aus und veröffentlicht `dist/` über die
GitHub-Pages-Actions. Die Actions sind auf Commit-SHAs gepinnt. Die Seite wird
zunächst nur unter der GitHub-Pages-Adresse ausgeliefert
(`SITE_BASE=/<Repositoryname>/`). Eine eigene Domain ist nicht eingerichtet.
