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
  // Stylesheet in jede Seite einbetten: GitHub Pages liefert HTML bis zu 10 Minuten aus dem Cache. Ein
  // zwischengespeichertes HTML verwies nach einer Veröffentlichung auf eine gelöschte Datei
  // /_astro/Base.<Hash>.css (404), die Seite erschien ohne Gestaltung. Eingebettet gibt es diese
  // Abhängigkeit nicht.
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
