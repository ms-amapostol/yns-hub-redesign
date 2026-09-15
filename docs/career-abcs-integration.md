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
