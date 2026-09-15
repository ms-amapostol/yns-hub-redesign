# Five activities, one direction

**The problem.** Five Door 2 activities ask overlapping questions in different
ways, and each one used to write `top_category` outright. Whoever finished last
won. The same person could be told Health & Care on Tuesday and Finance & Data
on Wednesday from answers that never contradicted each other.

Three separate things were going wrong. They have three separate fixes.

---

## 1. The same question, five times → asked once, by whoever gets there first

**Level** ("where are you right now, really?") was asked by the hub intake, by
each of the three quizzes, and by Career ABCs. Four times, in four wordings.

The hub now owns it. It derives level from intake question three and hands it to
each quiz on the URL as `?lvl=`. `Quiz.presetLevel()` reads it, and each quiz
drops its own level question rather than asking it again.

| Hub intake answer | Level handed over |
|---|---|
| Never had a job / A few part-time jobs | `early` |
| In a job right now | `some` |
| Years in, thinking of switching | `experienced` |

The in-hub activities already work this way: the runtime drops any rung whose
`asks` fact is already known. This extends the same rule across the iframe
boundary.

**Still to do:** Career ABCs asks its own three intake questions. The mapping
and the three-line fix are in `career-abcs-integration.md`.

---

## 2. Five recommenders → one resolver

Nothing writes `top_category` any more. Each activity files **evidence**: its own
ranked list of categories, plus a weight for how strong that instrument is.

```
addEvidence("interests", ["health", "gov", "trades", ...])
```

One resolver adds it up. First place scores 3, second 2, third 1, multiplied by
the weight of the instrument that said it.

| Source | Weight | Why |
|---|---|---|
| What Kind of Work | 3 | Thirty items, five per interest area. The most direct measurement of the thing being measured. |
| The Story | 2 | A narrative of the life you would want. Real evidence, and also a mood on the night. |
| A Day In The Life | 2 | Same shape, different slice. |
| Spend Your 100 | 1 | Measures what you value in work more than which field, so it gets a light touch on category. |

**Those weights are an editorial judgement and they are meant to be argued
with.** They live in `SOURCE_WEIGHT` at the top of the evidence section in
`js/hub.js`.

Re-taking an activity **replaces** that activity's evidence rather than adding a
second vote, so nobody can stack the result by repeating one quiz.

A tie is reported as a tie. `top_category` is only set when the top two
genuinely separate, because picking a winner from a dead heat is the same
dishonesty as overwriting.

---

## 3. Disagreement → said out loud

The rail now carries a **Your direction** card: the current read, what comes
second, how many signals it rests on, and which activities they were.

When the instruments disagree on first place, it says so:

> These do not all point the same way, and that is worth knowing rather than
> hiding. Each one measures something different, so the answer above is the
> weight of all of them together.

That line is the whole argument for asking five times. Five instruments that
agree is a strong read. Five that disagree is information about the person,
usually that the life they want and the work they enjoy are pulling in
different directions. Hiding that behind a single confident answer wastes the
evidence.

---

## What this changes for later activities

`top_category` is still the key that Three Doors, Two Conversations and Career
ABCs read, so none of them needed changing. They now read a resolved answer
built from everything, rather than whatever finished most recently.

## Still open

- **Spend Your 100 measures values, not field.** Its weight of 1 is a blunt way
  of saying so. The better fix is a separate `value_ranking` fact that shapes
  which roles get shown inside a category, rather than which category wins.
- **Training appetite overlaps with route preference.** `training_appetite`
  (how much training, asked by What Kind of Work) and `route_preference` (which
  specific route, asked by Three Doors) are a general question and its
  refinement. Three Doors should read the appetite and pre-mark the routes that
  fit it rather than starting from a blank table.
- **Still True? can rule a category out.** Its `ruled_out` reflection should
  subtract from the evidence rather than sitting alongside it.
