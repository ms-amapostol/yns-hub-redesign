# Four activities for Doors 4 and 5

Content files for the YNS activity runtime, written to `ACTIVITY-SPEC.md` as published at apps.yournextstepai.com (September 2026).

| File | Activity | Door | Curriculum source |
|---|---|---|---|
| `activities/grit.js` | Bounce Back | 4 Mindset and money | Module 4 (growth mindset, resilience) |
| `activities/bounce.js` | The Week It's Hard | 4 Mindset and money | Module 4 |
| `activities/money101.js` | Money, Plainly | 4 Mindset and money | Module 5 (budgeting, money basics) |
| `activities/smart6.js` | Your Six Months | 5 Make the plan | Module 6 (6-month SMART goal) |

## Install (the spec's own checklist)
1. Copy the four files into `activities/`.
2. Merge `activities-registry-additions.json` into `data/activities.json`.
3. Run the migration in `fact-keys-migration.md`.
4. `node scripts/stamp-assets.mjs`.
5. `YNSActivity.validate()` in dev, then `scratchpad/readability.mjs` and `scratchpad/referents.mjs`.

## Mechanics used
`learn`, `text` (with `prefill` and `examples`), `choice`, `buildup` (with `factsFrom`). No new mechanics. Nothing scores axes.

## What each activity takes from the class (second pass, Sept 14)
| Activity | From the scripts |
|---|---|
| Bounce Back | Module 4 #6 three self-check questions → `mindset_lean` slot; fixed→growth self-talk swap; Dweck and Duckworth stated as the class states them, attributed |
| The Week It's Hard | Module 4 #12 ABLE framework walked once (Assess, Brainstorm, List, Execute) and written into the note |
| Money, Plainly | Module 5 gross vs. net (the class's $40,000 → ~$2,500/mo example, 25–31% deductions, attributed); zero-based budget "every dollar has a job"; "managing money is managing behavior" |
| Your Six Months | Module 6 begin-with-the-end-in-mind: five-year line → six-month objective → month-by-month; Module 4 SMART as five plain questions; the C → B+ achievability example; rinse and repeat |

Not covered, and worth their own activities later: credit scores and credit management (Module 5), retirement and compound interest (Module 5), the vision board itself (Module 1 / Module 6 check-in), MBTI and VARK (Module 1).


## Your Why → the five whys (Sept 14)
`activities/why.js` now walks five "why?" screens, each quoting the last answer, with a stop-here link from the third on. The sentence screen is prefilled from the deepest answer and tagged as before. `why_statement`, `why_who`, `why_test` are unchanged so nothing downstream moves. New free-text keys `why_1`–`why_5`. Note for Delante: the five rungs carry `needs: {not:{fact:"why_statement"}}`, which reads true for a first-timer and drops the screens for anyone with a why on file. `skipLabel` and `skipTo: "<slot id>"` are two small optional rung fields the mock runtime honors (custom skip wording; skip jumps to a named slot instead of the next one). Without `skipTo` the live runtime would show why 4 and 5 after a stop at 3, so this one is worth adopting: it is about six lines in the run loop.
