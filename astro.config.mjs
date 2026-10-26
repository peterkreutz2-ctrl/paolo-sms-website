// @ts-check
import { defineConfig } from 'astro/config';

// Rein statische Ausgabe für GitHub Pages. Kein Adapter, keine Integrationen.
//
// `site` ist die Produktionsadresse: Die Seite wird unter https://paolo-sms.de/
// ausgeliefert (GitHub Pages mit Custom Domain).
//
// `base`: Unter der eigenen Domain bleibt es '/'. Nur für eine lokale Vorschau
// unter einem Unterpfad per Umgebungsvariable SITE_BASE=/<pfad>/ bauen; der
// Deploy-Workflow setzt sie bewusst nicht. Alle Links laufen über
// src/lib/url.ts.
export default defineConfig({
  site: 'https://paolo-sms.de',
  base: process.env.SITE_BASE ?? '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
