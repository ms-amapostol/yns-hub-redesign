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

**Still open in the app itself**
- The generated bullet alternatives under the XYZ builder still come from the old parser and can read badly on first-person text. The builder is the default now, so this is less exposed, but the parser wants a first-person strip too.
