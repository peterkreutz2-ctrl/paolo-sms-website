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
    purpose: 'Zwei Seiten: Was PAOLO ist, wer was davon hat, wie der Betrieb aussieht und welche Lizenz gilt.',
    availability: 'pending',
    format: 'PDF',
    extent: '2 Seiten',
    releaseNote: 'Eine aktualisierte Fassung ist in Vorbereitung; die Freigabe steht aus.',
  },
  {
    id: 'promo',
    group: 'kennenlernen',
    title: 'Video „PAOLO Promo1"',
    audience: 'Alle Interessierten',
    purpose: 'Kurzvorstellung von PAOLO im Video.',
    availability: 'pending',
    format: 'Video (externer Link)',
    releaseNote: 'Der Link wird nach Prüfung von Rechten, Untertiteln und Aktualität ergänzt.',
  },
  {
    id: 'vorstellung',
    group: 'vorstellen',
    title: 'Vorstellung (Foliensatz)',
    audience: 'Vorstand, Schulleitung, Safety Manager',
    purpose: 'Foliensatz für Mitgliederversammlung oder Teambesprechung: Warum Sicherheitsmanagement, Ablauf und PAOLO-Funktionen.',
    availability: 'pending',
    format: 'PDF',
    releaseNote: 'Eine bereinigte Fassung ist in Vorbereitung; Inhalte und Abbildungen werden vor der Veröffentlichung geprüft.',
  },
  {
    id: 'einfuehrung',
    group: 'einfuehrung',
    title: 'Einführung und Betrieb von PAOLO SMS',
    audience: 'Leitung, Betreiber, IT-Dienstleister',
    purpose: 'Leitfaden für Vereine und Flugschulen: Rollen benennen, Betriebsweg wählen, einrichten, Betrieb aufnehmen.',
    availability: 'pending',
    format: 'PDF',
    releaseNote: 'Eine aktualisierte Ausgabe ist in Vorbereitung.',
  },
  {
    id: 'handbuch',
    group: 'einfuehrung',
    title: 'PAOLO-SMS-Handbuch',
    audience: 'Safety Manager, Leitung',
    purpose: 'Grundlagen des Sicherheitsmanagements im Luftsport und die Arbeit mit PAOLO im Zusammenhang.',
    availability: 'pending',
    format: 'PDF',
    releaseNote: 'Liegt als Entwurf vor. Ob und in welcher Fassung es veröffentlicht wird, ist noch nicht entschieden.',
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
