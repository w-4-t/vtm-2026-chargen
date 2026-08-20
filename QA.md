# QA — v0.2.0

## Clan-first flow

1. Clear localStorage or open the generator for the first time.
2. Confirm that Step 1 is `Clan` and no free-text Clan field exists on `Основа`.
3. Try `Далі` without selecting a Clan.
   - Expected: navigation is blocked and an explicit message asks for a confirmed Clan.
4. Tap a Clan card.
   - Expected: dedicated detail view with description, Disciplines, Bane, Compulsion.
5. Use `All Clans`.
   - Expected: returns to the Clan list without changing the confirmed Clan.
6. Open Brujah and press `Choose Brujah`.
   - Expected: Brujah becomes the confirmed Clan and downstream steps unlock.
7. Return to Clan, select Ventrue, confirm it.
   - Expected: selected Clan changes immediately and the change is written to the dependency log.

## Migration

Import or load a v0.1 character where `identity.clan` is `"Brujah"`.

Expected:
- it migrates to the stable `brujah` clan ID;
- Review displays `Brujah`, not `brujah`;
- no free-text Clan field reappears.

## Existing dependency regression

1. Choose two Lifepaths and spend dependent dots.
2. Change Lifepath 1.
   - Expected: only Lifepath 1 dependent Skill dots / Focuses / Resources are cleared.
3. Enable Young Character.
   - Expected: Lifepath 2 and all of its dependent choices disappear.
4. Add a Focus and then reduce its Skill to 0.
   - Expected: the Focus is automatically removed and the change is logged.
5. Export JSON, edit it to contain a stale Focus on a zero Skill, import it.
   - Expected: import reconciliation removes the stale Focus.
