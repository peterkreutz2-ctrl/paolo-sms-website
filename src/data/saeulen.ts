// Die vier Säulen eines Sicherheitsmanagementsystems (Folie 3 der Übersicht).
// Die Texte stehen zweimal auf der Seite: in der Grafik `public/saeulen/sms-saeulen.png`
// (ab 64em) und als Karten (darunter). Beide tragen dieselben Aussagen; wer einen Text
// ändert, muss die Grafik neu exportieren.

export interface Saeule {
  title: string;
  text: string;
  /** Symbol als SVG-Pfade (24x24, Strich), nur Dekoration */
  icon: string;
}

export const saeulen: Saeule[] = [
  {
    title: 'Sicherheitsrichtlinie',
    text: 'Rahmenwerk etablieren, Prozesse und Rollen definieren.',
    icon: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  },
  {
    title: 'Risikomanagement',
    text: 'Risiken erkennen, bewerten, mindern und kommunizieren.',
    icon: '<path d="M21 12a9 9 0 0 0-15.5-6.2L3 8.3M3 3v5.3h5.3M3 12a9 9 0 0 0 15.5 6.2l2.5-2.5M21 21v-5.3h-5.3"/>',
  },
  {
    title: 'Überwachung',
    text: 'Informationen nachhalten, analysieren und verwalten.',
    icon: '<path d="M3 3v18h18M8 17v-5M13 17V8M18 17v-8"/>',
  },
  {
    title: 'Förderung',
    text: 'Schulung und Ausbildung sowie Kommunikation.',
    icon: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8"/>',
  },
];
