# Career ABCs, split into three hub activities

**What changed.** Door 3 used to hold one twenty-minute card. It now holds the
app's own three stages as three cards, plus Two Conversations.

| Hub activity | Opens | Counts as done when |
|---|---|---|
| A · What you've already done | `apps/career-abcs_v2.html#a` | `about.stories.length > 0` |
| B · Put it on paper | `#b` | `build.cover` exists, or any experience entry has bullets, or `build.summary` is set |
| C · Say it out loud | `#c` | `carry.practice.length > 0` |

**Nothing in the app was modified to make this work.** It already routes on
`location.hash` (`#home`, `#a`, `#b`, `#c`), and it already persists everything
to `localStorage` under `yns.abcs.v1`. The hub opens the iframe at a stage and,
on close, reads that key to derive completion. So wandering between stages
inside the app still lands correctly on the hub afterwards.

**The storage keys above are now a contract between the two.** If the app's
state shape changes, `abcsDone()` in `js/hub.js` is the one place to update.

## Bringing in a resume or cover letter you already have

The app has a real document importer: PDF, DOC, DOCX, TXT, RTF, MD, an 8MB cap,
pdf.js and mammoth loaded from CDN, and it pulls the jobs and bullet points out
and turns them into stories. It was only reachable from the app's home screen,
and only before any stories existed, so most people never saw it.

Card A now carries a second way in: **"Already have a resume or cover letter?
Bring it in."** It opens the app at `#home` and clicks the importer's own button
as soon as it appears. Same origin, so this is a click rather than a fork.

**Request for the source repo:** add a `#upload` route that opens the importer
directly. The hub would then deep-link it like any other stage, and the DOM
watcher in `openApp()` could be deleted. It is about five lines next to the
existing `STAGES` routing.

**Cover letters specifically.** The importer parses any document into text, so a
cover letter comes in fine, though today it is treated as resume material. Worth
deciding in the source repo whether an uploaded cover letter should instead
prefill `build.cover`. Since the words are the person's own, the
claim-bearing guard in `coverletter.test.mjs` is not at risk.

## The duplicate intake, and how to close it

The hub asks three questions. The app asks its own three. Two of them map
directly:

| Hub answer | App field | Mapping |
|---|---|---|
| Never had a job / A few part-time jobs | `about.stage` | `starting_out` |
| In a job right now | `about.stage` | `early_ic` |
| Years in, thinking of switching | `about.stage` | `experienced_ic` |
| Need a job soon + no real history | `about.direction` | `first_role` |
| Rough idea, want work that fits | `about.direction` | `same_field` |
| Thinking of switching | `about.direction` | `change_field` |
| (not asked anywhere in the hub) | `about.education` | — |

**Deliberately not hand-rolled here.** Writing the raw answers into
`yns.abcs.v1` from the hub would leave `about.persona` unset, and
`derivePersona()` lives inside the app's closure. Duplicating that mapping in
the hub would be two copies of the same rules drifting apart.

The clean version is three lines in the app's `boot()`: if the three raw answers
exist and `persona` is empty, call `derivePersona()` and set `seen.survey`. Then
the hub writes the raw answers and the app's intake never appears twice.

That needs the hub to ask a fourth question, the last thing you finished, which
Three Doors would also use. That is Anastasia's call.

---

## Career ABCs fixes made in the bundle (Sept 15) — port these to source

These edits were made directly in `apps/career-abcs_v2.html`. **They will be
lost the next time the app is rebuilt from source** unless ported. Each one
names the source file it belongs in.

| # | Change | Source file |
|---|---|---|
| 1 | When embedded (`window.parent !== window`), the app bar drops its own Back/Home nav and the Coach on/off chip. The hub is the chrome. | `src/app/main.js` → `paintShell` |
| 2 | `yns-profile.js` renders nothing inside an iframe: no second Back/Home, no theme toggle, no progress dots. | `apps/yns-profile.js` → `paint` |
| 3 | Resume print CSS centres the name, contact line and headline (Module 3 convention). Headline paragraph gets `class="headline"`. | `src/content/resume.js` → `PRINT_CSS`, `resumeHTML` |
| 4 | Every bullet on a job has **edit** as well as remove. `manualBullet(jobId, editIndex)` handles both. | `src/content/resume.js` → `renderJobs`, `manualBullet` |
| 5 | **Impact-statement builder** at the top of "Pull from a story": three boxes (what you did / measured by / result) prefilled from the story, clause-leading verbs moved to past tense, the number sentence and any numeric sentence from the situation pulled into "measured by", assembled live into an editable line. The generated alternatives stay underneath. | `src/content/resume.js` → `storyToBullet` (`xyzPrefill`, `xyzAssemble`) |
| 6 | Cover letter screen: section retitled *The job you're applying for*, plus **Hiring manager's name** (`build.target.hiringManager`) and **The posting** (`build.target.jdText`, shared with the tailoring tab). `buildCoverInputs` passes `hiringManager`. The generator already supported both; the UI never collected them. | `src/content/coverletter.js` → `renderCover`, `buildCoverInputs` |
| 7 | **Edit the letter**: a textarea under the preview, saved to `build.cover.full` with `edited: true`. Print and Word use `cover.full`, so the edit is what ships. | `src/content/coverletter.js` → `renderCover`, `wireCover` |
| 8 | `tellStory`: a number entered as a whole sentence (5+ words) is used as a sentence rather than prefixed with "The number on that was". Skills in "What I bring" are lower-cased unless acronyms. | `src/content/coverletter.js` → `tellStory`, `buildSkillsParagraph` |
| 9 | Stage B tabs renumbered and reordered: **1 · Resume → 2 · The job you want → 3 · Cover letter**. Sticky footer buttons walk that sequence. The tailoring tab intro explains it feeds the cover letter. | `src/content/coverletter.js` → `renderBuild`, `renderTarget` |
| 10 | Practice: the gold pill only says *you banked a story for this* when a banked story actually carries the tag; otherwise a quiet *a banked story would answer this*. A "How to practise" note explains the mic, the clock, How did that go, Different question, and the question-type menu. Shows the running count of answers practised. | `src/content/coverletter.js` → `renderPractice` |
| 11 | Kit page headline is always *Your kit* (with the name after it) and the subtitle says "Best in order: A, then B, then C. Nothing is locked." | `src/app/main.js` → `renderHome` |

| 12 | **The interview kit** is a real page at `#kit`: four status tiles, the documents with their PDF and Word buttons, every story in one line, every practised answer with its feedback, who they are meeting, what they will ask, and a night-before checklist. Printable as one sheet. "See your interview kit" in Stage C and "See it" after three practised answers both go there. "Back to your hub" closes the hub panel. | `src/app/main.js` → `STAGES`, `go`; new `renderKit` beside `renderHistory` |

| 13 | **Impact-statement composer.** New `XYZ` module (between `XYZ-COMPOSER:BEGIN/END` markers). `prefill` cleans a story into the three boxes; `compose` writes one sentence: strong past-tense verb, number folded into the action, result carried as a participle or "so" clause, 28-word cap, no semicolons or comma splices. `check` returns plain-language issues for any bullet. `xyzPrefill`/`xyzAssemble` in `storyToBullet` now call it. | new `src/content/xyz.js`, imported by `src/content/resume.js` |
| 14 | **One draft in the story picker.** The `RESUME.bulletFrom` variants and their notes no longer render under the builder. Coach versions appear only after "Ask the coach for another version". Live checks sit under the bullet. Adding from the builder now sets `usedInResume` on the story (it did not before). `bulletFrom` itself is untouched; the importer still uses it. | `src/content/resume.js` → `storyToBullet`, `showVariants` |
| 15 | **"Before you send it" was always failing.** `runChecks` returns `passed`; `renderChecks` read `pass`. It also passed a doc without `sections` or `fileName`, so every bullet check failed on any resume. `resumeObject` now supplies both, and failing checks show their help line. | `src/content/resume.js` → `renderChecks`, `resumeObject` |
| 16 | **Extra checks:** each bullet runs through `XYZ.check` (first three shown), a summary prompt, more than six bullets on one job. `fits_one_page` is skipped at ten or more years of experience. | `src/content/resume.js` → new `extraChecks` |
| 17 | **Headline and summary drafts.** "Draft it for me" under Summary fills an empty headline and writes a two-to-three-sentence summary from the jobs, strengths, strongest numbered result and target role. It asks before replacing a summary the person wrote. Nothing in it goes beyond what the person entered. | `src/content/resume.js` → `draftHeadline`, `draftSummary`, `wireResume` |
| 18 | **Skills that add something.** Tools named in stories or bullets (PointClickCare, POS, forklift…) come first. A strength whose every meaningful word already appears in a bullet is dropped, unless that leaves fewer than six. Cap of 12. | `src/content/resume.js` → `resumeSkills`, `resumeObject` |
| 19 | **Printed resume uses its stylesheet.** `PRINT_CSS` was written for `.resume__*` classes; `resumeHTML` writes `h1`, `.contact`, `.job-h`. Added rules for that markup (dates float right so Word keeps them aligned) and a `.resume` wrapper on print and Word output. Summary always prints, including for families whose `sectionOrder` leaves it out. PDF title is now `First_Last_Resume`. | `src/content/resume.js` → `PRINT_CSS`, `resumeHTML`, new `resumePrintHTML` |
| 20 | **One guidance block per screen.** `guidanceNote` now emits a slot; `mountCoach` fills it with a single strip whose first card is the persona note ("Where you are starting from") and whose remaining cards are the reels. The strip holds on the persona note until the person moves on. "How to practise" is a collapsed disclosure. | `src/app/coach.js` → `reelCard`; `src/app/main.js` → `guidanceNote`, new `coachStrip`/`mountCoach`; `src/content/coverletter.js` → `renderPractice` |
| 21 | **Tense and length follow Anastasia's rulings.** A bullet pulled into a job the person still holds opens in present tense (Lead, Manage); a past job stays past (`compose(boxes, family, { tense })`, set from `job.to` in `storyToBullet`). The composer aims for 28 words; `XYZ.check` and `bullets_short_enough` warn only past 35. "our" stays flagged as first person. Percent ranges ("87% - 92%"), "~$16 million" and "1,600+" are read as numbers. | new `src/content/xyz.js`; `src/content/resume.js` → `storyToBullet`, `CHECKS` |

**Still open in the app itself**
- The pass bar in `tools/abcs-bullet-rules.mjs` holds five bullets written in the pattern Anastasia approved. Her own resume is reference material and stays out of the repo.
- The cover letter still pastes story sentences in as typed ("hasnt", "doesnt"). The claim guard is untouched, so `coverletter.test.mjs` in the source repo is unaffected, but the letter would benefit from the same `phrase()` clean-up the composer uses.
- The parser behind `RESUME.bulletFrom` still wants a first-person strip for the importer.

## Testing Career ABCs

```
node tools/abcs-harness.mjs --label mychange   # plays A -> B -> C for four people
node tools/xyz-composer.test.mjs               # composer unit test, reads the shipped HTML
```

The harness writes `tools/harness-output/<label>/`: one text file per person with every story, draft bullet, resume, check and cover letter, the printed resume HTML, and `SCORECARD.txt`. It seeds `yns.abcs.v1` before the bundle boots (so onboarding never opens and nothing saves over the seed), blocks outside network, catches the print popup and counts real PDF pages. Needs Playwright (`npm i -g playwright`).
