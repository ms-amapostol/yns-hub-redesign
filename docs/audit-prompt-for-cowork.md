# Audit prompt for Claude in Cowork

Paste everything below the line into a Cowork session with the `yns-hub-redesign` repo folder open. It walks the whole site and every activity against the standard we set, and produces one report rather than a running commentary.

---

You are auditing a static web app: a career-planning hub for early-talent adults, built for people who have worked retail, food service or similar and are working out their next step. The folder is `yns-hub-redesign`. Open `index.html` in a browser (serve the folder; do not open it via `file://`, because the quiz pages need same-origin storage). Then read `js/hub.js`, `js/mock-runtime.js`, every file in `activities/`, the four pages in `apps/`, and every file in `docs/`.

Produce a single report, in this order, as a markdown file called `AUDIT.md` at the root of the folder. Do not change any other file. For every finding give the file, the line or the screen, the exact current text, and a proposed replacement.

## 1. Voice

The voice standard: warm and convivial, like a coach holding your hand through the whole thing. Second person throughout, gender-neutral throughout. Plain words, grade-eight sentences, no jargon in a title. No shame, ever.

Flag every place the copy:
- assumes the person feels stuck, lost, behind, or in crisis, unless they have picked that option themselves in the intake
- uses "she", "her", "he", "his" for the user (comments in code do not count; user-facing text does)
- uses a contrasting construction of the form "not X but Y" or "it isn't A; it's B"
- uses the words "genuinely", "honestly" or "straightforward" as filler
- talks about the user in the third person
- says "lead gen", "partners" or "advertising" anywhere a user can see it

## 2. Consistency

Every activity ends with a result screen, a "Seven days" pick, and lands back on the hub. Every card shows minutes. Every result screen says where a number came from. Flag any activity that breaks any of these.

Check that these facts are only ever asked once across the whole site and read everywhere else: `level`, `why_statement`, `top_category`, `money_in`, `floor_monthly`, `training_appetite`. Flag any second asking.

Check the counts: the demo bar, the rail heading "All N activities", and the actual number of cards across the five doors must agree.

## 3. Honesty

The site describes and never recommends a financial product, provider, fund, school or employer. Every wage figure is labelled as a national band from BLS via CareerOneStop. Every projection is labelled as an assumption. Flag any sentence that reads as advice, any number without a source, and any promise the site cannot keep (a plan that "will" be emailed, a coach that "will" reply, a partner that "will" call).

## 4. Function

Play every one of the 26 activities from a fresh browser state, then again after answering the intake differently. For each, confirm: it opens, every screen advances, the result renders with the person's own words in it, the Seven days pick appears in the Planner, and "See my results" reopens it without re-asking. Then:
- Close an activity halfway through the header X. Confirm the card is NOT marked done.
- Finish The Story, then reopen it via "See my results". Confirm it lands on results.
- Add two places in Portfolio, change one to Applied, click Save as PDF, and confirm both appear on the first page.
- Delete a Planner line, confirm the warning names the activity, confirm the activity is playable again from the start.
- Type in every money field (The Floor, Money Plainly, Every Dollar a Job, the three calculators) and confirm the total updates without the field losing focus.
- On a 390px wide viewport, confirm nothing overflows and every button is reachable.

Report every failure with steps to reproduce.

## 5. Accessibility, quickly

Tab through the intake and one activity with the keyboard only. Flag any control you cannot reach or activate. Flag any image without alt text and any button without a visible label.

## 6. What to leave alone

Do not rewrite the activities' content, the weights table in `interests.js`, or the `FIT` map. Do not touch the four files in `apps/` beyond reading them. Do not "improve" tone beyond the standard above. Report; do not edit.

End the report with a ten-line summary a non-developer can act on, ordered by how much each item would matter to a first-time user on a phone at 11pm.
