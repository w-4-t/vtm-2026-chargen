# VTM V5 — Lifepath Chargen v0.3.0

Static GitHub Pages/PWA prototype for the current V5-base / V6-chargen adaptation.

## Current flow

1. Clan
2. Identity
3. Attributes
4. Lifepaths
5. Skills
6. Focuses
7. Resources
8. Disciplines
9. Merits / Flaws
10. Humanity
11. Feeding
12. Review

## Design baseline implemented

- V5 remains the base character system.
- Clan is the first major upstream choice and has its own descriptive screen.
- V5 Attribute distribution is enforced as slots: one 4, three 3s, four 2s, one 1.
- Two Lifepaths for a standard neonate; one for a Young character.
- Skills: 5 + 5 Lifepath dots, then 8 free dots; final chargen cap 3.
- Focuses: 2 + 2 + 2, +2 dice each, max 2 Focuses on one Skill at chargen.
- Focus screen shows the complete current RAW V6 example Focus list for the selected Skill plus separate Lifepath hints and Custom Focus entry.
- Resources: 3 + 3 + 3. Review aggregates matching Resources while retaining source contributions.
- V5 neonate Discipline baseline without mandatory Predator Type: one clan Discipline at 2, a different clan Discipline at 1, one Power per dot. Caitiff may choose any two Disciplines.
- Starting Humanity 7; optional ST-approved fledgling start at 8.
- 1–3 Convictions, each stored together with its linked Touchstone.
- Derived Review values: Health = Stamina + 3; Willpower = Composure + Resolve; starting Blood Potency from Generation (10–11 = 2, 12–13 = 1).
- Predator Type is not mandatory; feeding pattern is freeform.
- V6-style Merits/Flaws remain provisional and deliberately limited.

## Reactive integrity

The application treats upstream choices as sources of truth. Changing Clan, Lifepath, Young status, Skills, or other dependencies reconciles downstream state instead of leaving stale selections. Important destructive reconciliation is written to the change log and surfaced to the user.

v0.3 also avoids whole-wizard rerenders for normal steppers and Attribute changes. The active panel is only rebuilt when its structure actually changes; when it must be rebuilt, scroll position is preserved.

## Storage

- Auto-saves to `localStorage`.
- Manual Save button is retained.
- JSON export/import.
- Schema v2 character JSON migrates to schema v3 on import/load.

## Hosting

The directory is ready for GitHub Pages and includes `.nojekyll`, a manifest, service worker, and PWA icons.
