# QA — v0.3.0

## 1. UI stability

- Open Skills on a phone-sized viewport.
- Scroll into the middle of the list.
- Press +/− repeatedly.
- Expected: the page does not jump to the top and the active control remains in place.
- Repeat on Attributes and Lifepath Resource steppers.

## 2. Attribute slot enforcement

- Start a new character.
- Attributes should initially be unset.
- Assign one Attribute to 4.
- Expected: 4 becomes disabled for all other Attributes.
- Assign three Attributes to 3.
- Expected: 3 becomes disabled elsewhere.
- Complete exactly 4×1, 3×3, 2×4, 1×1.
- Expected: Next becomes possible; Health and Willpower previews update from the selected Attributes.

## 3. Focus screen

- Give at least 1 dot to Awareness.
- Open Focuses and choose Awareness in any eligible bucket.
- Expected full RAW list visible on this screen: Empathy, Insight, Instinct, Supernatural.
- Check Lifepath bucket.
- Expected: its V6 Lifepath tips appear separately from the RAW list.
- Add a RAW Focus and a Custom Focus.
- Expected: both are visible and grant +2 in Review; duplicate/max-per-Skill restrictions remain enforced.

## 4. Disciplines

- Choose Toreador.
- On Disciplines select Auspex 2 and Celerity 1.
- Expected: two Auspex Power slots and one Celerity Power slot appear.
- Fill all three; Next should be allowed.
- Go back to Clan and change to Brujah.
- Expected: old Discipline ratings and Powers are cleared and the change log reports it.
- Caitiff test: select Caitiff and confirm that any two Disciplines can be chosen at 2/1.

## 5. Humanity / Touchstones

- Humanity starts at 7.
- Add up to three Convictions.
- Expected: each Conviction contains its own Touchstone fields.
- Empty Conviction or Touchstone blocks progress from the Humanity step.
- Starting Stains remain 0.

## 6. Derived Review

With Stamina 2, Composure 2, Resolve 3, Generation 13:
- Health = 5
- Willpower = 5
- Blood Potency = 1
- Humanity = chosen starting value

## 7. Resource aggregation

- Put Wealth 3 into one Lifepath and Wealth 1 into another.
- Expected Review: Wealth 4, with source detail showing both contributions.

## 8. Legacy migration

Import `Robert_Bert_Clover.json` from v0.2.
Expected:
- schema becomes 3;
- name, Clan, Attributes, Lifepaths, Skills, Focuses, Resources, Merit, Flaws, feeding pattern remain;
- Humanity defaults to 7 with a new blank Conviction/Touchstone pair;
- Disciplines are empty and must be completed;
- Wealth aggregates to 4 in Review.

## 9. PWA/GitHub Pages

- `.nojekyll` exists at project root.
- Reload after deploying v0.3.0.
- Expected: service worker cache changes to `vtm-v5v6-chargen-v0.3.0`; v0.2 assets should not remain active.
