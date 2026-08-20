# VTM V5 / V6 Lifepath Chargen — v0.2.0

Static GitHub Pages-ready character generator prototype.

## Current design baseline

- V5 is the base game.
- Clan is the first substantive chargen step and an upstream rules choice.
- V6-style 13 Skills and Lifepaths.
- Standard neonate: 2 Lifepaths.
- 5 Skill dots per Lifepath + 8 free = 18 total allocation dots.
- Skill cap at chargen: 3.
- Focuses are detached from Skill rating thresholds.
- 2 Focuses per Lifepath + 2 free = 6 Focuses.
- Focus bonus: +2 dice.
- Maximum 2 Focuses on one Skill at chargen.
- V6 Resources: 3 dots per Lifepath + 3 free = 9 Resource dots.
- Runtime Resource mechanics are intentionally deferred.
- Starting Merit list is provisional and contains only currently non-conflicting candidates.
- Flaws have no point compensation and act as ST-facing hooks.
- Predator Type is not required; feeding practice is descriptive unless player and ST agree on specific mechanics.
- Young / inexperienced character: 1 Lifepath, no compensating starting dots, ×2 catch-up XP rate.

## Clan screen

`data/clans.js` is the data source for the Clan step. Each entry currently contains:

- name and short identifier;
- short identity description;
- V5 clan Disciplines;
- compact Bane summary;
- compact Compulsion summary.

The text is intentionally compact for chargen navigation. Clan-specific mechanics can be expanded later without changing the UI.

Clan is stored as a stable data ID, not free text. Changing Clan runs reconciliation hooks for later clan-dependent choices. Existing v0.1 character JSON/localStorage values using a Clan name such as `Brujah` are migrated to the matching ID on load.

Thin-blood is not presented as a Clan because it needs a separate chargen path. Caitiff is included as a special clanless option.

## Reactive dependency behavior

The generator does not trust stale downstream state.

- Changing a Lifepath clears that Lifepath's Skill dots, Focuses, and Resources.
- Enabling Young Character clears Lifepath 2 and its dependent choices.
- Reducing a Skill to 0 removes Focuses that depend on it.
- Imported state is reconciled against current data.
- Clan is an upstream dependency. Current v0.2 has future-facing reconciliation hooks for clan-dependent Disciplines, clan-specific selections, and restricted Merits.

## Data files

- `data/clans.js`
- `data/skills.js`
- `data/lifepaths.js`
- `data/resources.js`
- `data/merits.js`
- `data/rules.js`

These can be edited directly for GitHub Pages deployment without a backend.
