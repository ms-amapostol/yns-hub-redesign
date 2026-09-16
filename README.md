# Your Next Step — hub redesign (review build)

A working mock of a redesigned `apps.yournextstepai.com`. Open `index.html` in a browser, or serve the folder (GitHub Pages works as-is).

**What it does**

1. Asks the person to pick a character, then three questions: do they know what they want, what brought them here, where they are with work.
2. Routes them to one of five **starting doors**: Get to know you · Explore what's out there · Get the job · Mindset and money · Make the plan. All five stay open.
3. Plays **26 activities**: 20 inside the hub from their content files in `activities/`, plus the three quizzes and the three Career ABCs stages from their own pages in `apps/`.
4. Fills in the character piece by piece as activities finish, and gives it a speech bubble that quotes what the person actually said.

**What's stubbed**

- The three quiz prototypes (The Story, A Day In The Life, Spend Your 100) and Career ABCs are separate apps. Their cards link to the live versions and, in the mock, set a sample field (Health & Care) so gated activities have something to read.
- `js/mock-runtime.js` is a review harness, not `yns-activity.js`. It plays the content files (all twelve mechanics, ladders with `needs`, prefill, factsFrom, results, actions) but does no axis scoring, half-lives, reflections, or Supabase. Facts live in memory for the session.
- Nothing persists across reloads.

## Layout

```
index.html                 the hub
css/hub.css                brand tokens lifted from yns-brand.css, plus hub and modal styles
js/hub.js                  intake, routing, doors, avatar, speech bubble
js/mock-runtime.js         plays activities/*.js in a modal
activities/                13 content files (9 live + 4 new)
vendor/                    yns-taxonomy.js and quiz-shared.js from the live hub (The Floor reads wage data through them)
data/roles.json            wage data, copied from the live hub
data/activities-registry-additions.json   registry blocks for the 4 new activities
data/fact-keys-migration.md               new fact keys for the 4 new activities
avatars/                   15 character portraits, <body>-<tone>.png
docs/                      design notes, avatar prompts, notes on the 4 new activities
```

## Wiring it in, if the team likes it

- **Routing and doors** (`js/hub.js`): the three questions, the five doors, and `route()` are ~120 lines and map onto `yns-welcome.js` and `yns-browse.js`. Answers should go to the profile so they survive devices.
- **Avatar and bubble**: the tile reveal reads a count of completed activities; the bubble reads fact keys (table in `docs/avatar-prompts.md`). Both fit `yns-progress.js`.
- **The four new activities**: copy `activities/{grit,bounce,money101,smart6}.js`, merge the registry JSON, run the fact-key migration, `node scripts/stamp-assets.mjs`. Then `YNSActivity.validate()` and the readability and referents scripts. Details in `docs/door4-door5-activities.md`.
- **Open decisions**: listed at the end of `docs/hub-redesign-notes.md`.

## Credits

Avatar art generated with Nano Banana from the prompts in `docs/`. Wage data: CareerOneStop / BLS OES, via the live hub's `data/roles.json`.
