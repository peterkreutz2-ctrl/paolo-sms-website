# Entwicklungsregeln

## Zwei Repositories, zwei Zuständigkeiten

| | Diese Website (`paolo-sms-website`) | PAOLO-SMS-Anwendung (`paolo-sms`) |
|---|---|---|
| Inhalt | Statische Informationswebsite (Astro), öffentlich | Webanwendung mit Meldeformular, Dashboard und Anmeldung, privat |
| Zielgruppe | Interessierte Vereine und Flugschulen | Meldende und interne Benutzer einer Installation |
| Anwendungsspezifisches | gehört **nicht** hierher: keine Anmeldung, kein „Internes Dashboard“, keine Rolleninformationen der Anwendung | |
| Tests | `npm run verify` | Lint, Typen, Node-Suites und E2E (Better Auth und Clerk) nach den Regeln der Anwendung |

„Webseite“ oder „Website“ meint dieses Repository, nicht die Startseite der
Anwendung. Wer unsicher ist, welches Repository gemeint ist, fragt nach, bevor er
ändert.

- Änderungen an der Website werden ausschließlich in diesem Repository
  vorgenommen, Änderungen an der Anwendung ausschließlich im Anwendungsrepository.
- Inhalte dürfen als Vorlage von einem Repository ins andere wandern, werden dort
  aber an Ton (hier: Du-Form), Navigation und Zweck angepasst.
- Verweise auf das private Anwendungsrepository, lokale Pfade oder die
  Referenzinstallation stehen nirgends in diesem Repository; der Release-Check
  bricht sonst ab.

## Testanforderungen dieser Website

- Vor jeder Übergabe: `npm run verify` (Build, Strukturprüfung, Review-Freigabe).
- Darstellung lokal prüfen, mindestens bei 320, 768, 1024 und 1280 px; kein
  horizontaler Überlauf (siehe README).
- **Keine** E2E-Tests mit Better Auth oder Clerk: Sie betreffen die Anwendung und
  hier nichts, was getestet werden könnte.
- Änderungen laufen über einen Feature-Branch; ein Merge auf `main` löst das
  Deployment auf GitHub Pages aus und erfolgt erst nach Freigabe des Betreibers.

## Freigaben

- Neue oder geänderte, nicht freigegebene Inhalte werden mit `Unreleased`
  gekennzeichnet.
- Neue Bilddateien stehen erst nach Eintrag in `BRAND.md` und in der Freigabeliste
  von `scripts/release-check.mjs` im gebauten Ergebnis.
- Name und Logo von PAOLO bleiben reserviert; das Logo wird nur als unveränderte
  Original-Vektordatei eigenständig verwendet (siehe `BRAND.md`).
