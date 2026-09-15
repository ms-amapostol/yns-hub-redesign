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


## Door 4 and 5, second pass (Sept 15)

### New activities

| File | Activity | From |
|---|---|---|
| `activities/able.js` | **Solve It** | Module 4 #12, the ABLE framework, lifted out of The Week It's Hard and given its own card. Assess, Brainstorm, List, Execute, each on its own screen with its letter, ending in ten minutes of work with a day attached. |
| `activities/budget0.js` | **Every Dollar a Job** | Module 5, Budgeting 101. A zero-based budget: income at the top, categories underneath, live "still to assign" figure, and a CSV export with a spent column and a difference column already in it. |
| `activities/compound.js` | **What Money Does Over Time** | Module 5. A live compound-interest calculator. Defaults to $25 a month rather than $500, because a default of $500 is a door closing for this audience. |

**On the compound activity and advice.** It teaches the mechanism and stops.
No product, no provider, no projection. The rate is labelled as an assumption,
the screen after the calculator says plainly that real returns move around and
can be negative, that high-interest debt beats any likely return, and that an
employer match is the first place money should go. Worth a read from whoever
owns risk before launch.

### Typed, not dragged

`buildup`, `hours` and the two new mechanics all take typed numbers now.
Sliders and steppers are a poor way to say "$1,247", and worse on a phone.
Stepper buttons remain next to the money fields for nudging.

The fields patch the running total in place rather than repainting the screen,
because repainting steals focus mid-typing.

### Two new mechanics

```
mechanic: "budget"   rows with groups, an income figure read from a fact,
                     a live remainder, and a CSV export
mechanic: "calc"     typed inputs and a computed readout that updates live
```

### SMART, made explicit

`smart6.js` now labels each screen with its letter (S, M, A, R, T), and the
result screen shows the five parts back as a checked goal, naming any part
that is thin rather than ticking everything. Module 4's instruction to work
backwards from the finish line is what the month-by-month screen does.

### The Planner

Every activity ends by asking for one thing to do this week. Those answers used
to live on the screen that produced them and nowhere else. They now append to
`steps_open` with their source and date, and the **Planner** button in the top
bar lists them with a tick box, plus the dated things: the six-month goal, its
first step, and the note for a hard week.

`steps_open` is the key `stilltrue.js` already reads, so the check-in picks
these up without changing.
