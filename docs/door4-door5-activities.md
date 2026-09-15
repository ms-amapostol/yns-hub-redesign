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


## Third pass (Sept 15): SMART built rather than described, and savings made a decision

### Your Six Months

The activity used to explain SMART and then check whether the answers happened
to satisfy it. It now **produces** one.

- **Month one is written as a SMART goal**, assembled from four blanks: what
  you'll have done, how many, how you'll know, and by when. The sentence builds
  as you type, so nobody has to hold five criteria in their head while writing.
- **Months two to six are written to the same shape**, prefilled from month one,
  and each line is checked for a number and a by-when. Flagged, never corrected,
  because it is their plan. "2 of 5 are ready" is more use than five ticks.
- The class's instruction to work backwards from the finish line is what that
  screen does.

**Bug fixed at the same time:** the results screen only read `extra`, so on a
second run — where a slot whose fact is known gets dropped — every SMART part
reported as thin even though the answers were on file. It falls back to facts now.

### Every Dollar a Job

**Pay yourself first is now a decision made before the budget screen**, not one
row among fourteen. A savings line that competes with thirteen others loses
every time. Options are $20 a month, 5%, 10%, or an honest "nothing yet", and
the chosen amount arrives pre-filled in the budget.

The result screen reads the savings line back: the amount, the share of income,
and what it becomes over twenty years at the same 7% assumption the compounding
activity uses, labelled as an assumption both times. If savings came out at
zero it says so kindly and suggests moving $20 off the fun line. If there is no
surprise fund it names that too, because that is the line that stops a flat tyre
becoming a credit card balance.

### Two small runtime additions

- `compose` now keeps the assembled sentence in `extra.<slot>_text`, not just
  the blanks, and can write it to a fact with `asksText: true`.
- An activity can define `onStep({slot, answer, facts, setFact})` to react to a
  single answer before the next screen renders. Used here so the savings
  decision can be turned into an amount, which needs income that the choice
  itself does not carry.


## Fourth pass (Sept 15): the last three money activities, and where the course is offered

| File | Activity | From Module 5 |
|---|---|---|
| `activities/invest.js` | **Where Money Can Live** — five places from safest to riskiest, one screen each, then two decisions: where money you need within a year goes, and where ten-year money goes | "Opportunities to Grow Your Wealth" |
| `activities/retire.js` | **The Match** — 401k, 403b, pension, Roth in one line each; a calculator showing the employer match in dollars using the class's $40,000 / 3% / 3% example; one status question with five honest options | "All Things Retirement" |
| `activities/taxes.js` | **Where Your Paycheck Goes** — the four kinds of line on a payslip; gross-to-net with the class's 25–31% rule of thumb, labelled as a rule of thumb; the W-4 as the one thing you control | "All about the Benjamins", "Gross vs. Net Income" |

All three describe and never recommend. The `calc` mechanic gained two modes, `match` and `net`, alongside the original compounding mode.

**Credit** is the one Module 5 topic still without an activity. It is a natural fifth: "Credit, Plainly", the score, the two habits (pay in full, pay on time), and the 0% rule.

### The course, in two places only

- On the results screen of each money activity (`wix: true` on the card): one card, one link to `https://www.yournextstepai.com/curriculum`.
- Once, on the hub, when all five doors are finished.

Nowhere else. Not on arrival, not per door.

### Door 3 ready state

When `top_category`, stage B and stage C all exist, the door shows "You've got the story, the paper and the practice. Here's where to point it," with the four CareerOneStop search links. It appears only when true.

### Career ABCs → Places

If stage B named a target company, it is added to Places as a company, status "looking", once. Never overwritten.

### The signup screen

`YNS.signup()` renders the account screen with the four real perks and the consent box, unticked. The button is disabled and labelled for Matt. The consent sentence is the one to copy into the privacy policy.
