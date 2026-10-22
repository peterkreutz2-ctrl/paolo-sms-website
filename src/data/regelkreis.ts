// Die fünf Schritte des SMS-Regelkreises.
// Schrittnamen und `task` stammen unverändert aus dem Flyer (fachliche Entscheidung).
// `inPaolo` nennt nur Funktionen, die in der Anwendung nachweisbar vorhanden sind.
// Hinweistexte (`releaseNote`) stehen öffentlich auf der Seite: keine internen Details.

export interface Step {
  n: number;
  title: string;
  /** Aufgabe laut Flyer, unverändert */
  task: string;
  /** Zusatzzeile laut Flyer */
  hint?: string;
  /** Belegte Funktion in PAOLO */
  inPaolo: string;
  color: string;
  /** Zahlenfarbe im Ring: Kontrast >= 3:1 für große, fette Zahlen */
  numColor: string;
  /** Nur im Prototyp sichtbarer Freigabehinweis */
  releaseNote?: string;
}

export const steps: Step[] = [
  {
    n: 1,
    title: 'Melden',
    task: 'Sicherheitsereignisse und Beobachtungen erfassen',
    hint: 'auch anonym möglich',
    inPaolo:
      'Öffentliches Meldeformular ohne Anmeldung, auf Wunsch anonym. Sechs Meldearten; Pflicht sind nur Kurzbeschreibung und Beschreibung.',
    color: '#FD5F04',
    numColor: '#343F47',
    releaseNote:
      'Der Wortlaut stammt unverändert aus dem Flyer. „Sicherheitsereignisse" ist noch nicht in der Projekt-Terminologie geführt; die Formulierung wird abgestimmt.',
  },
  {
    n: 2,
    title: 'Bewerten',
    task: 'Relevanz erkennen und Prioritäten setzen',
    inPaolo:
      'Meldungsstatus, Priorität (Niedrig bis Kritisch) und Risikobewertung nach Eintrittswahrscheinlichkeit und Schweregrad mit Risikomatrix.',
    color: '#FDB205',
    numColor: '#343F47',
  },
  {
    n: 3,
    title: 'Maßnahmen festlegen',
    task: 'Verantwortlichkeiten und Fristen bestimmen',
    inPaolo: 'Maßnahmen mit Verantwortlichen, Fälligkeitsdatum und Maßnahmenstatus.',
    color: '#6CB324',
    numColor: '#343F47',
  },
  {
    n: 4,
    title: 'Umsetzen & nachverfolgen',
    task: 'Maßnahmen verfolgen und Wirksamkeit prüfen',
    inPaolo:
      'Das Dashboard zeigt offene und überfällige Maßnahmen. Die Wirksamkeit wird gemeinsam in der Sicherheitsbesprechung geprüft.',
    color: '#0262D5',
    numColor: '#FFFFFF',
    releaseNote:
      'Eine eigene Funktion zur Dokumentation der Wirksamkeitsprüfung gibt es derzeit nicht. Sie wird hier als fachliche Aufgabe beschrieben; die Formulierung wird abgestimmt.',
  },
  {
    n: 5,
    title: 'Informieren & lernen',
    task: 'Sicherheitsinformationen teilen und Besprechungen dokumentieren',
    inPaolo:
      'Sicherheitshinweise (intern oder öffentlich), Protokolle der Sicherheitsbesprechung und SMS-Dokumente mit fertigen Vorlagen.',
    color: '#A9D3F5',
    numColor: '#343F47',
    releaseNote:
      'Das Hellblau des fünften Segments ist aus dem Flyer abgeleitet und noch kein freigegebener Markenfarbwert.',
  },
];
