# QA checklist — v0.1.0

## Dependency regression tests

1. Select `Military` as Lifepath 1.
2. Spend 5 Lifepath Skill dots, add 2 Focuses, spend 3 Resource dots.
3. Change Lifepath 1 to `Artist`.
   - Expected: all Military-specific allocations for Lifepath 1 are cleared.
   - Expected: visible reconciliation message/change-log entry.
4. Create Lifepath 2 allocations, then enable `Young / inexperienced character`.
   - Expected: Lifepath 2 disappears and all its dependent data is cleared.
5. Put a free Focus on a Skill whose rating comes only from free Skill dots.
6. Lower that Skill to 0.
   - Expected: dependent Focus is removed and logged.
7. Try to raise any final Skill above 3.
   - Expected: edit rejected with a visible error.
8. Try to add a third Focus to one Skill.
   - Expected: edit rejected.
9. Export JSON, change upstream state, then import the old JSON.
   - Expected: imported state is reconciled against current rules/data.

## Budget validation

- Each standard Lifepath: exactly 5 Skill dots / 2 Focuses / 3 Resource dots.
- Free pool: exactly 8 Skill dots / 2 Focuses / 3 Resource dots.
- V5 Attributes: 4×1, 3×3, 2×4, 1×1 distribution.
