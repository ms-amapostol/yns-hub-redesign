# What Kind of Work — the interest profiler

**Door 2.** Six minutes, thirty items, tap-only. Sits before Three Doors:
this decides *what kind of work*, Three Doors decides *how you get in*.

## What it is

A short-form interest inventory. Thirty items, five for each of the six
interest areas used by the O*NET Interest Profiler (Holland's RIASEC), rated
yes / maybe / no. Yes scores 2, maybe 1, no 0.

**The items are written from scratch**, in the language of someone who has
worked retail. "Work out why something stopped working, and fix it" rather
than a textbook phrasing. O*NET's own item wording is not reused; the
framework is the public part and the phrasing is ours. Worth a look from
whoever handles this sort of thing before launch.

**No item names a job.** People answer "would I like doing that" far more
honestly than "am I a creative person."

## From six areas to nine categories

The six area scores are weighted into the nine YNS categories in `FIT` at the
top of `activities/interests.js`. Weights rather than one-to-one, because real
work is a blend: health scores on people, hands and working-things-out at once.

That table is the editorial judgement in this activity and the thing most
worth arguing about. It is nine lines and it is meant to be edited.

## What it writes

| Fact | Shape | Used by |
|---|---|---|
| `interest_code` | three letters, e.g. `RSC` | nothing yet; kept for later |
| `interest_top` | a sentence for the hub's speech bubble | the hub |
| `category_ranking` | all nine, best first | nothing yet; a good input for role suggestions |
| `top_category` | one category, **only when the top two actually separate** | Three Doors, Two Conversations, Career ABCs |
| `training_appetite` | none · short · medium · long | the result copy; a natural input for Three Doors |

`top_category` is the key several existing activities already read, so this
feeds them without any of them knowing it exists.

## Results

Three categories, each with two or three real roles and a real wage band, read
from `data/roles.json` at the person's level. Nothing is invented: the numbers
are BLS via CareerOneStop, and the band is labelled as national.

A flat profile is called out rather than hidden. If all six areas come out
close, the result says so and points at A Day In The Life, because for that
person the life around the job matters more than the field.

## Module 2

The closing question about appetite for training is Module 2's core argument,
compressed. Each answer's response reflects the module: tuition benefits for
"none", certificates and licences for "short", apprenticeships and associate
degrees for "medium", and a caution for "long" that several of these paths do
not need four years.

## New mechanic: `rate`

This activity introduced one mechanic the spec does not have yet.

```
mechanic: "rate"
items:   [{ k, t }]        the questions in this batch
options: [{ k, t }]        the same answers for every item
```

Answers accumulate across every `rate` screen in the activity under
`extra.rate_all`, so `results()` and `onComplete()` see the whole instrument in
one place rather than per screen.

**One implementation note that matters on a phone:** tapping an answer patches
that row only. Repainting the screen on every tap loses the scroll position,
which means the list jumps under your thumb between question two and three.

`onComplete()` is also now called by the mock runtime, which the spec already
describes and `stilltrue.js` already uses.
