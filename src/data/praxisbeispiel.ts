// Praxisbeispiel „Hecke im Abflugbereich“ entlang der vier Schritte des Risikomanagements.
// Farben und Nummern kommen aus risikoSchritte, damit Beispiel und Kreislauf zusammenpassen.
// Genannt werden nur Funktionen, die in der Anwendung vorhanden sind: Meldeformular, Priorität und
// Risikomatrix, Maßnahme mit Verantwortlichem, Frist und Status „Erledigt“, Sicherheitshinweis mit
// Sichtbarkeit „Angemeldete Personen“. Einen Sicherheitshinweis nimmt der Safety Manager über die
// Sichtbarkeit aus der Veröffentlichung; ein Ablaufdatum gibt es nicht.

import { risikoSchritte } from './risikomanagement';

export interface BeispielSchritt {
  n: number;
  title: string;
  /** Kurzer Zeitpunkt im Beispiel */
  when: string;
  text: string[];
  /** Funktion in PAOLO, die der Schritt zeigt */
  inPaolo: string;
  color: string;
  numColor: string;
}

const farbe = (n: number) => risikoSchritte.find((s) => s.n === n)!;

export const beispielSchritte: BeispielSchritt[] = [
  {
    n: 1,
    title: 'Erkennen',
    when: 'Im Sommer',
    text: [
      'Ein Vereinsmitglied bemerkt, dass eine Hecke im Abflugbereich eines Startplatzes des Vereins zu hoch gewachsen ist.',
      'Es meldet die Gefährdung über PAOLO, ohne Anmeldung und auf Wunsch anonym.',
    ],
    inPaolo: 'Öffentliches Meldeformular',
    color: farbe(1).color,
    numColor: farbe(1).numColor,
  },
  {
    n: 2,
    title: 'Bewerten',
    when: 'Sofort nach der Meldung',
    text: [
      'Der Safety Manager bewertet die Meldung nach Priorität und Risikomatrix und erkennt: Hier muss zeitnah gehandelt werden.',
      'Er wartet deshalb nicht auf die nächste Sicherheitsbesprechung.',
    ],
    inPaolo: 'Priorität und Risikobewertung an der Meldung',
    color: farbe(2).color,
    numColor: farbe(2).numColor,
  },
  {
    n: 3,
    title: 'Mindern',
    when: 'Von der Meldung bis zum Rückschnitt',
    text: [
      'Der Safety Manager legt selbst eine Maßnahme an und informiert die Verantwortlichen.',
      'Der Naturschutz erlaubt den Rückschnitt erst im Oktober, die Maßnahme bleibt bis dahin offen.',
      'Nach dem Rückschnitt prüft er, ob die Gefährdung beseitigt ist, und setzt die Maßnahme auf „Erledigt“.',
    ],
    inPaolo: 'Maßnahme mit Verantwortlichem, Fälligkeitsdatum und Status',
    color: farbe(3).color,
    numColor: farbe(3).numColor,
  },
  {
    n: 4,
    title: 'Kommunizieren',
    when: 'Solange die Maßnahme offen ist',
    text: [
      'Damit die Mitglieder die Gefährdung kennen, veröffentlicht der Safety Manager einen vereinsinternen Sicherheitshinweis.',
      'Ist die Hecke zurückgeschnitten, braucht es ihn nicht mehr: Der Safety Manager nimmt ihn aus der aktiven Veröffentlichung.',
    ],
    inPaolo: 'Sicherheitshinweis mit Sichtbarkeit „Angemeldete Personen“',
    color: farbe(4).color,
    numColor: farbe(4).numColor,
  },
];
