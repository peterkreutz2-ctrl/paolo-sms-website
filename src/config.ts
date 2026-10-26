// Zentrale Einstellungen. Die Website hat keine Laufzeit-Konfiguration.

/**
 * Prototyp-Schalter. Solange `true`:
 *  - jede Seite trägt `noindex` und einen sichtbaren Hinweis „Prototyp",
 *  - `npm run release:check` schlägt fehl.
 * Erst nach Abarbeitung der Freigabepunkte (FREIGABE.md) auf `false` setzen.
 */
export const PROTOTYPE = true;

export const SITE = {
  name: 'PAOLO SMS',
  titleDefault: 'PAOLO SMS – Sicherheitsmanagement für Gleitschirmvereine und Flugschulen',
  description:
    'PAOLO macht Sicherheitsmanagement einfach: Safety-Management-System für Gleitschirmvereine und Flugschulen. Sicherheit wird zu einem Teil des täglichen Betriebs.',
  email: 'info@paolo-sms.de',
  stand: 'Oktober 2026',
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
