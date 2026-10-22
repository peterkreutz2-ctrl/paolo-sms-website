// @ts-check
import { defineConfig } from 'astro/config';

// Rein statische Ausgabe für GitHub Pages. Kein Adapter, keine Integrationen.
//
// `site` ist bewusst nicht gesetzt: Die Domain paolo-sms.de ist noch nicht
// eingerichtet, und ohne `site` entstehen keine Canonical-/Sitemap-URLs auf
// eine noch nicht betriebene Adresse. Beim Livegang setzen (siehe README).
//
// `base`: Unter einer eigenen Domain bleibt es '/'. Unter der
// GitHub-Projekt-Adresse (<konto>.github.io/<repo>/) vorab per Umgebungsvariable
// SITE_BASE=/<repo>/ bauen. Alle Links laufen über src/lib/url.ts.
export default defineConfig({
  base: process.env.SITE_BASE ?? '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
