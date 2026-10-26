// Informationsmaterialien. Neue Materialien: Eintrag ergänzen, Datei unter
// public/materialien/ ablegen (nur freigegebene Dateien!), `availability` auf
// 'download' setzen und `href` eintragen. Mehr ist nicht nötig.
//
// availability:
//   download   – öffentliche Datei auf dieser Website (PDF bevorzugt)
//   external   – externer Link (verlässt die Website)
//   in-app     – nur innerhalb einer PAOLO-Installation, nach Anmeldung
//   on-request – nicht öffentlich, auf Anfrage
//   pending    – für die Veröffentlichung vorgesehen, noch nicht freigegeben
//
// `releaseNote` erscheint öffentlich als Hinweis „Nicht freigegeben" und wird vom
// Release-Check gezählt. Nur neutrale Aussagen: keine Dateinamen, Pfade, internen
// Adressen oder Rechtefragen im Detail (diese stehen in der lokalen Freigabeliste).
// Vor dem Livegang leer lassen.

export type Availability = 'download' | 'external' | 'in-app' | 'on-request' | 'pending';

export type GroupId = 'kennenlernen' | 'vorstellen' | 'einfuehrung' | 'anwendung' | 'technik';

export interface Material {
  id: string;
  group: GroupId;
  title: string;
  audience: string;
  purpose: string;
  availability: Availability;
  format?: string;
  /** Umfang bzw. Dauer, soweit bekannt */
  extent?: string;
  version?: string;
  stand?: string;
  href?: string;
  releaseNote?: string;
}

export const groups: { id: GroupId; title: string; audience: string }[] = [
  {
    id: 'kennenlernen',
    title: 'PAOLO kennenlernen',
    audience: 'Verantwortliche ohne Vorkenntnisse – 5 bis 10 Minuten',
  },
  {
    id: 'vorstellen',
    title: 'PAOLO im Verein oder in der Flugschule vorstellen',
    audience: 'Vorstand, Schulleitung und Safety Manager, die PAOLO intern vorstellen',
  },
  {
    id: 'einfuehrung',
    title: 'Die Einführung vorbereiten',
    audience: 'Leitung, Betreiber und IT-Dienstleister',
  },
  {
    id: 'anwendung',
    title: 'In der Anwendung',
    audience: 'Meldende und Mitarbeitende einer PAOLO-Installation',
  },
  {
    id: 'technik',
    title: 'Technik und Mitwirkung',
    audience: 'Entwicklerinnen, Entwickler und IT-Dienstleister',
  },
];

export const materials: Material[] = [
  {
    id: 'factsheet',
    group: 'kennenlernen',
    title: 'Factsheet',
    audience: 'Vorstand, Schulleitung, Interessierte',
    purpose: 'Eine Seite: Was PAOLO ist, wer was davon hat, wie der Betrieb aussieht und welche Lizenz gilt.',
    availability: 'download',
    format: 'PDF',
    extent: '1 Seite',
    version: '1.3',
    stand: '26.10.2026',
    href: '/materialien/PAOLO-SMS_Factsheet_R1.0_V1.3.pdf',
  },
  {
    id: 'promo',
    group: 'kennenlernen',
    title: 'Video „PAOLO Promo1"',
    audience: 'Alle Interessierten',
    purpose: 'Kurzvorstellung von PAOLO im Video.',
    availability: 'external',
    format: 'Video (externer Link)',
    href: 'https://www.youtube.com/watch?v=6b8VwUDiiHQ',
  },
  {
    id: 'vorstellung',
    group: 'vorstellen',
    title: 'PAOLO vorstellen – Entscheidungspräsentation',
    audience: 'Vorstand, Schulleitung, Safety Manager',
    purpose: 'Eine kompakte, selbsterklärende Präsentation für Vereinsvorstände und Flugschulleitungen. Sie unterstützt die Entscheidung über die Einführung von PAOLO und kann ohne begleitenden Vortrag gelesen werden.',
    availability: 'download',
    format: 'PDF',
    extent: '9 Seiten',
    version: '0.2',
    stand: '26.10.2026',
    href: '/materialien/PAOLO-SMS_Entscheidungspraesentation_R1.0_V0.2.pdf',
  },
  {
    id: 'einfuehrung',
    group: 'einfuehrung',
    title: 'Einführung und Betrieb von PAOLO SMS',
    audience: 'Leitung, Betreiber, IT-Dienstleister',
    purpose: 'Leitfaden für Vereine und Flugschulen: Rollen benennen, Betriebsweg wählen, einrichten, Betrieb aufnehmen.',
    availability: 'download',
    format: 'PDF',
    extent: '12 Seiten',
    version: '1.0',
    stand: '13.10.2026',
    href: '/materialien/PAOLO-SMS_Einfuehrung-Betrieb_R0.1_V1.0.pdf',
  },
  {
    id: 'handbuch',
    group: 'einfuehrung',
    title: 'PAOLO-SMS-Handbuch',
    audience: 'Safety Manager, Leitung',
    purpose: 'Ein Nachschlagewerk zu den Grundlagen und Methoden des Sicherheitsmanagements im Luftsport sowie deren Umsetzung mit PAOLO. Es dient der Vertiefung und ist keine Voraussetzung für die Einführung oder den Betrieb.',
    availability: 'pending',
    format: 'PDF',
  },
  {
    id: 'hilfe',
    group: 'anwendung',
    title: 'Rollenbezogene Anwendungshilfe',
    audience: 'Administrator, Safety Manager, Safety Assistant',
    purpose: 'Hilfetexte je Rolle und Nachschlagedokumente (Glossar, Berechtigungen, Datenschutzbetrieb, Backup) direkt in der Anwendung.',
    availability: 'in-app',
    format: 'In der Anwendung nach Anmeldung',
  },
  {
    id: 'vorlagen',
    group: 'anwendung',
    title: 'Dokumentvorlagen',
    audience: 'Safety Manager',
    purpose: 'Fertige Vorlagen für Sicherheitsrichtlinie, SMS-Handbuch, Notfallplan, Protokoll der Sicherheitsbesprechung, Sicherheitshinweis, Checkliste und Bedienungsanleitung.',
    availability: 'in-app',
    format: 'In der Anwendung nach Anmeldung',
  },
  {
    id: 'quellpaket',
    group: 'technik',
    title: 'Quellpaket 0.2.0-pilot.1 – Vorabversion, nicht für den Produktivbetrieb freigegeben',
    audience: 'IT-Dienstleister, Betreiber, Entwicklerinnen und Entwickler',
    purpose:
      'Vorabversion – nicht für den Produktivbetrieb freigegeben. Das Paket enthält Quellcode und Dokumentation, um PAOLO SMS ohne Zugang zum Entwicklungsrepository zu installieren, zu aktualisieren, zu sichern und wiederherzustellen. Verwende ausschließlich Testdaten: Noch nicht alle Sicherheits- und Betriebsprüfungen sind abgeschlossen, und das Paket ist nicht signiert. Prüfe nach dem Download die SHA-256. Quellcommit 8a2abb68a7b711790242253f7e673f4d34f20a1a, Lizenz GPL-3.0-or-later.',
    availability: 'download',
    format: 'TAR.GZ',
    extent: '3,0 MB',
    version: '0.2.0-pilot.1',
    stand: '26.10.2026',
    href: '/downloads/paolo-sms-0.2.0-pilot.1.tar.gz',
  },
  {
    id: 'quellpaket-pruefsumme',
    group: 'technik',
    title: 'Prüfsumme (SHA-256) zum Quellpaket 0.2.0-pilot.1',
    audience: 'IT-Dienstleister, Betreiber',
    purpose:
      'SHA-256 des Quellpakets: 4d19961de36afcc5496dcf4d07fd87d0c44884ef30ab57f154e76960cb95c87c. Lade die Datei in dasselbe Verzeichnis wie das Paket und prüfe mit „sha256sum -c“. Die Prüfsumme belegt die Unversehrtheit des Archivs, nicht die Herkunft.',
    availability: 'download',
    format: 'Text',
    version: '0.2.0-pilot.1',
    stand: '26.10.2026',
    href: '/downloads/paolo-sms-0.2.0-pilot.1.SHA256SUMS',
  },
  {
    id: 'technik',
    group: 'technik',
    title: 'Technische Dokumentation',
    audience: 'Entwicklerinnen, Entwickler, IT-Dienstleister',
    purpose: 'Installation, Datenbankmigrationen, Updates, Backup und Architektur.',
    availability: 'on-request',
    format: 'Zugriff während der Pilotphase auf Anfrage',
    href: 'mailto:info@paolo-sms.de?subject=Anfrage%20technische%20Dokumentation',
  },
];
