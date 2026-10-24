// Die vier Schritte des Risikomanagements (Säule „Risikomanagement“ des SMS).
// Die Farben folgen der Segmentmarke des PAOLO-Logos (Fluss im Uhrzeigersinn: Orange, Grün, Blau, Gelb).
// `inPaolo` nennt nur Funktionen, die in der Anwendung nachweisbar vorhanden sind.

export interface RisikoSchritt {
  n: number;
  title: string;
  task: string;
  /** Belegte Funktion in PAOLO */
  inPaolo: string;
  color: string;
  /** Zahlenfarbe im Ring: Kontrast >= 3:1 für große, fette Zahlen */
  numColor: string;
}

export const risikoSchritte: RisikoSchritt[] = [
  {
    n: 1,
    title: 'Erkennen',
    task: 'Gefahren und Beobachtungen aus dem Flugbetrieb erfassen, bevor etwas passiert.',
    inPaolo:
      'Öffentliches Meldeformular ohne Anmeldung, auf Wunsch anonym. Pflicht sind nur Kurzbeschreibung und Beschreibung.',
    color: '#FD5F04',
    numColor: '#343F47',
  },
  {
    n: 2,
    title: 'Bewerten',
    task: 'Eintrittswahrscheinlichkeit und Schweregrad einschätzen und Prioritäten setzen.',
    inPaolo:
      'Meldungsstatus, Priorität und Risikobewertung mit Risikomatrix aus Eintrittswahrscheinlichkeit und Schweregrad.',
    color: '#6CB324',
    numColor: '#343F47',
  },
  {
    n: 3,
    title: 'Mindern',
    task: 'Maßnahmen festlegen, Verantwortliche und Fristen bestimmen und die Umsetzung verfolgen.',
    inPaolo:
      'Maßnahmen mit Verantwortlichen, Fälligkeitsdatum und Status. Das Dashboard zeigt offene und überfällige Maßnahmen.',
    color: '#0262D5',
    numColor: '#FFFFFF',
  },
  {
    n: 4,
    title: 'Kommunizieren',
    task: 'Erkenntnisse und Entscheidungen im Team teilen, damit die Organisation daraus lernt.',
    inPaolo:
      'Sicherheitshinweise (intern oder öffentlich), Protokolle der Sicherheitsbesprechung und SMS-Dokumente mit Vorlagen.',
    color: '#FDB205',
    numColor: '#343F47',
  },
];
