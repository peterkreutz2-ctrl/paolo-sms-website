// Zentrale Einstellungen. Die Website hat keine Laufzeit-Konfiguration.

/**
 * Suchmaschinenfreigabe. `true`: Die Seiten sind indexierbar, `robots.txt` und
 * `sitemap.xml` werden ausgeliefert. `false`: Jede Seite trägt `noindex` und
 * `robots.txt` sperrt alles. Der Release-Check (`npm run release:check`) prüft,
 * dass Schalter, Seiten und Dateien zusammenpassen, und verlangt bei `true`, dass
 * keine Freigabehinweise oder Platzhalter mehr sichtbar sind.
 */
export const INDEXABLE = true;

/** Öffentliche Adresse (identisch mit `site` in astro.config.mjs, ohne Schrägstrich am Ende). */
export const SITE_URL = 'https://paolo-sms.de';

/**
 * Besucherstatistik (GoatCounter, gehostet). Der Zählcode ist die einzige erlaubte
 * Ausnahme von der Skriptfreiheit der Seite; `scripts/check-site.mjs` prüft, dass genau
 * dieser Tag und kein anderes Skript im gebauten Ergebnis steht. Wer die Werte ändert,
 * muss die Datenschutzerklärung (`src/pages/datenschutz.astro`) mit anpassen.
 */
export const GOATCOUNTER = {
  endpoint: 'https://paolo-sms.goatcounter.com/count',
  script: 'https://gc.zgo.at/count.js',
} as const;

export const SITE = {
  name: 'PAOLO SMS',
  titleDefault: 'PAOLO SMS – Sicherheitsmanagement für Gleitschirmvereine und Flugschulen',
  description:
    'PAOLO macht Sicherheitsmanagement einfach: Safety-Management-System für Gleitschirmvereine und Flugschulen. Sicherheit wird zu einem Teil des täglichen Betriebs.',
  email: 'info@paolo-sms.de',
  stand: 'November 2026',
} as const;

/**
 * Anbieter (Impressum, Datenschutz). Festgelegt vom Betreiber; der Release-Check
 * prüft, dass diese Angaben im gebauten Impressum stehen.
 */
export const PROVIDER = {
  name: 'Peter Kreutz',
  street: 'Neue Fahrt 11',
  city: '60437 Frankfurt am Main',
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/** Hauptnavigation. „Kontakt" wird im Layout als Schaltfläche gesetzt. */
export const NAV: NavItem[] = [
  { label: 'So funktioniert es', href: '/#saeulen' },
  { label: 'Einführen', href: '/einfuehren/' },
  { label: 'Materialien', href: '/materialien/' },
  { label: 'Mitmachen', href: '/mitmachen/' },
];

export const FOOTER_NAV: NavItem[] = [
  { label: 'Einführen', href: '/einfuehren/' },
  { label: 'Materialien', href: '/materialien/' },
  { label: 'Mitmachen', href: '/mitmachen/' },
  { label: 'Impressum', href: '/impressum/' },
  { label: 'Datenschutz', href: '/datenschutz/' },
];
