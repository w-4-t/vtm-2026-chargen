# VTM V5 + V6 Lifepath Chargen — v0.1.1

Static, client-side character-generation test harness intended for GitHub Pages.

## Scope implemented

- V5 base identity/Attributes shell.
- V6 13-Skill model.
- Standard neonate: 2 Lifepaths.
- Each Lifepath: 5 Skill dots, 2 Focuses, 3 Resource dots.
- Free: 8 Skill dots, 2 Focuses, 3 Resource dots.
- Skill chargen cap: 3.
- Focus: +2 dice; max 2 Focuses per Skill at chargen.
- Young character: 1 Lifepath; no compensating chargen dots; ×2 catch-up XP concept is displayed.
- V6 Resources used for chargen allocation only. Runtime resource mechanics are intentionally deferred.
- Provisional non-conflicting Merit list only.
- Flaws are optional ST hooks with no point compensation.
- Predator Type is not required; feeding pattern is free text.
- Local save + JSON import/export.

## Reactive dependency handling

The app does not trust later-step state when an earlier choice changes.

Examples:
- Changing a Lifepath clears that Lifepath's Skill allocation, Focuses, and Resource allocation.
- Enabling Young Character clears Lifepath 2 and its dependent data.
- Lowering a Skill to 0 removes Focuses that depend on it.
- Global Skill cap and Focus-per-Skill cap are enforced at edit time.
- A visible change log explains automatic reconciliation.

This is deliberate: an upstream change must immediately change or invalidate downstream state instead of leaving a rules-illegal character that still looks valid.

## Editing the database

No backend is required. Edit these files directly:

- `data/lifepaths.js`
- `data/skills.js`
- `data/resources.js`
- `data/merits.js`
- `data/rules.js`

They are plain JavaScript data files rather than fetched JSON so the package also works when `index.html` is opened directly from disk.

## GitHub Pages

Upload the whole folder to repository root, enable Pages from `main / root`, then open the published URL.

## Deliberately deferred

- Full V5 clan/Discipline/Power chargen.
- Discipline maturing.
- V6 Resource runtime mechanics (tests, spending, depletion, recovery).
- Final Merit catalogue and adapted V5 Merits.
- Final Focus catalogue review.
- Skill gaps such as Drive/Etiquette/Leadership.
- Advancement UI/tracker (cost rules are data-only for now).
