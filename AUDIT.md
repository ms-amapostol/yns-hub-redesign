# Your Next Step hub — audit

## Update, build v21 (September 16, 2026)

**Verdict: every mechanical problem from the v20 audit is fixed and re-tested, and the app is ready for real people.** All 26 activities play to a result with no errors: 104 of 104 runs, covering two intake variants, each on desktop and on a 390px phone. No High issues remain in function, consistency or accessibility. What's left is copy. It's listed at the end of this update for Anastasia to decide on.

### Anastasia's rulings, and how each was built

| Ruling | What the app does now |
|---|---|
| **No founder photo or story in the app** | Recorded as decided. S6 is closed. |
| **Fix The Floor** | The crash was a one-word naming bug: the results code hid its own number formatter. It's fixed. The hub now loads the real wage file, so the pay shown is BLS via CareerOneStop. That label only appears when the real data is in use. The yearly figure is now correctly described as after tax. |
| **Fix Three Doors** | On phones each route is a stacked card with Yes/No underneath. The "fastest route" is sorted by months instead of text length. |
| **Check-ins as on-screen pop-ups** | **Weekly:** a Planner step picked seven or more days ago gets a pop-up asking how it went: I did it / Still on it / Change it. "Still on it" and × snooze it for a week. **Monthly:** 28 days after Your Six Months, if Still True? hasn't been done in the last month, a pop-up offers it. The demo bar has "Skip ahead a week" and "Skip ahead a month" so reviewers can see both. Email reminders are listed as a planned perk of a free account. The spec for Matt is in `docs/signup-handoff.md`. |
| **The course is an invitation, with no obligation** | Every mention now says it's an optional paid course, with videos and more structure, and that there's no obligation to join. The false "we don't sell anything" lines are gone. |
| **Encourage a free account to save progress** | The top bar reads "Sign in or join free". After the first finished activity, a small pop-up appears once per visit: "Save your progress, free." The sign-up panel leads with "free", says every activity is free either way, and the button reads "Make my free account". |
| **Career ABCs: verify experience instead of asking again** | The hub passes its answer (`?lvl=`). Career ABCs still shows its experience question, with the hub's answer already selected and the line "From your answers on the hub: … Still right? Change it if not." |

### Status of the v20 findings

| Area | Fixed | Partly | Open |
|---|---|---|---|
| Function (F1–F12) | F1–F8, F10, F12 | F11 (the × on in-app panels is 44px on phones; a few small links remain) | — |
| Consistency (C1–C11) | C1–C8, C10, C11 | C9 (guarded; the signed-in path couldn't be tested without Supabase) | — |
| Accessibility (A1–A10) | A1–A8, A10 | A9 (a few control names) | Intake radios have no arrow-key support |
| Copy: honesty (3A–3C) | All High items, plus 3A #66–71, #82–85, #90; 3B #92, #100, #104; 3C #106–109, #113, #114, #116–118 | — | See "Still to decide" below |
| Copy: voice (1A–1G) | #38–40, #58–61, plus fixes on lines edited this round | — | See "Still to decide" below |

**New in v21, also tested:**
- Every one of the 26 activities ends with a "Seven days" pick. The three quizzes and the three Career ABCs stages now offer it too.
- Links inside results open the right activity in the hub (`YNS.open`), so nothing leaves the page or hits a 404.
- The activity panel and the hub panels take keyboard focus, keep it, close with Escape, and hand focus back to the card that opened them.
- Closing a finished results screen counts as finished.
- "It's changed" on an "Already know this one" card brings the question back.
- Capped money fields say "Up to $X here".
- Solve It and The Week It's Hard read each other's answers.
- Two Conversations shows the message the person wrote.
- Career ABCs no longer scrolls sideways on a phone.
- The quiz results no longer show made-up match percentages.

**Low items still open:**

| Item | Detail |
|---|---|
| N9 | Escape doesn't reach inside the six framed apps (the × still works). |
| N13 | Career ABCs keeps its first experience answer if the hub answers change later. |
| Missing file | `yns-ga.js` (404), which is Delante's analytics file. |
| Missing endpoint | `/api/coach-status` (404), which is live-only. |
| Tracking noise | `Quiz.init("hub")` logs a stray "start" event once Supabase is on. |
| Funnel events | Not built yet (S12). |

### Still to decide: copy (Anastasia)

**A. Honesty and advice, with some risk. Do these first.**
1. **Money screens that give instructions.** They should describe instead:
   - compound, retire, invest (3B #93–99)
   - budget0 "the one habit that separates…" (#101)
2. **Numbers to settle:**
   - one long-run return figure (7% vs 9%, #72)
   - "match is dollar-for-dollar" (#76)
   - the 25× pension rule (#77)
   - Roth rules (#78–80)
   - "25–31% comes out" vs "often 15–30%, default 20%" (#81)
   - 2026 savings rates (#86, #88)
3. **One privacy sentence for both places** (#110, #112).
4. **About 20 unsourced "most people / almost nobody" lines** (#91).

**B. Quick swaps to approve in one go.**
- "Genuinely", "honestly" and "straightforward" (in the quiz files and activities)
- UK spellings to US
- The remaining "not X / rather than" lines, in titles first:
  - The Floor card "The number you need, not the number you want."
  - "A budget is not a list…"
  - "A pension is a promise, not a pot."
- "The class" and "Module N, videos 6 and 10" references
- "SMART" and "ABLE" on screen

**C. Your judgement.**
1. How far to soften lines that assume a hard week or being stuck. Examples: "A plan for the week you want to quit", "There will be a week you want to quit", "Stuck? Start with one of these".
2. Whether the "Experienced" description keeps "…just not sure it's the right thing".
3. The Career ABCs model answers say "she": switch to "they", or name each speaker.

The full v20 findings follow, unchanged, for reference.

---

# v20 audit (September 16, 2026)

September 16, 2026 · review build `yns-hub-redesign` · report only, no files changed

**Verdict: the hub fits the strategy, and a short list of trust breakers stands between it and a real person.** The shape is right. Michaela's words are in the intake, "know yourself first" is the default door, everything is free with nothing to pay first, and every in-hub activity ends in one small step. The trust breakers:

- the money door's anchor activity (The Floor) crashes and shows made-up pay figures
- Three Doors can't be finished on a phone
- Career ABCs asks the experience question a second time
- the site promises check-ins it can't send
- two money screens say "we don't sell anything" beside a link to the paid course

Every one of these is a small fix.

**How this was checked.** The checklist in `docs/audit-prompt-for-cowork.md` was run section by section:

- **Copy:** every user-facing string was read against the voice and honesty standard.
- **Function:** all 26 activities were played headless in Chromium from a fresh state, twice, with two different sets of intake answers.
- **Scripted checks:** Portfolio PDF, deleting a Planner line, the 53 money fields, and a 390px phone view.
- **Accessibility:** keyboard and axe-core passes.
- **Strategy:** a new Section 0 scores the app against `YNS_Marketing_Strategy` (May 2026) and `YNS_Website_Brief_Delante`.
- **Re-checked:** every High finding was confirmed in the code a second time.

**Counts.** 26 activities play, 24 reach a clean result, and no script errors appeared anywhere. The report holds:

- 118 copy findings (9 High), plus about 55 low-priority "not X / rather than" lines
- 12 function findings (2 High)
- 11 consistency findings (2 High)
- 10 accessibility findings (1 High)

| Severity | What it means |
|---|---|
| **High** | A first-time user on a phone at 11pm would be hurt, misled or blocked. |
| **Medium** | Clearly breaks the standard. |
| **Low** | Polish. |

---

## 0. Does the app meet the strategy?

| # | Strategy goal (source) | Verdict | What the app does | Gap and fix |
|---|---|---|---|---|
| S1 | **The North Star:** "You don't need to have it all figured out. You just need your next step. And you're not alone." (Strategy §1) | Mostly | The hero says "Wherever you're starting from… we'll take it one piece at a time". The intake opens with "pick someone to walk with you". A next-step sentence is built from the person's answers. | The line itself never appears, and "not alone" is only implied. Hero lead: **"You don't need to have it all figured out. Pick a place to start, and we'll take it one step at a time, together."** |
| S2 | **Built for "Activated Michaela":** retail or service work, no degree or an unused one, feels quiet shame (§2) | Met | The intake options are in her words ("Same shifts, same paycheck, costs going up. Something in me clicked"). A trade certificate counts as a credential, and no copy treats a missing degree as a deficit. The examples come from retail, care and warehouse work. | About 21 lines still assume the person feels stuck or behind (1A), and one intake option is titled "Genuinely experienced" (1D #38). |
| S3 | **Avoid what repels her:** pressure, six-figure talk, shame-based urgency, resume tips without emotional context (§2) | Met | None of the pressure language turned up. Career ABCs starts from the person's own stories before any resume advice. | One line shames people on low pay: `budget0.js:170` (3B #101). |
| S4 | **Pillar 2, Know yourself first,** "our biggest differentiator" (§3) | Met in structure | "Still figuring it out" and "I'd rather just look around" both start at Door 1. Doors 2 and 3 read what Door 1 learned. | "I know what I want" plus "stuck" is routed to Get the job and told "You said you need a job soon" (F4). Choosing another door wipes the reason (F5). |
| S5 | **Pillar 1, Action first:** the smallest step you can take today (§3) | Mostly | Each of the 20 in-hub activities ends with a "Seven days" pick, and the pick lands in the Planner. | The three quizzes and the three Career ABCs stages give no pick (C3). The Week It's Hard saves "[name]" placeholders into the plan (F7). |
| S6 | **Pillar 3, founder story, "Add a face"** (the strategy's #1 website fix; the brief's new homepage section) | **Not met** | The hub and Career ABCs have no founder presence. This is also open item 6 in the Career ABCs build handoff. | Add a small "Why I built this" card, with photo and two sentences in Anastasia's voice. Put it on the hub under the character, or on the Door 1 intro. **Anastasia writes the copy.** |
| S7 | **The curriculum, app-ised:** M1 Why · M2 options · M3 resume · M4 mindset · M5 money · M6 six-month plan (§2 table) | Covered, with breaks | All six modules have activities: Door 1, Three Doors, Career ABCs, Door 4 (mindset and money), Your Six Months. | M2: Three Doors fails on phones (F2) and can name the wrong route as fastest (3A #69). M3: Career ABCs asks the experience question again (C2). M4: Solve It and The Week It's Hard overlap (C5). **M5: The Floor crashes (C1) and shows placeholder pay (3A #66–68), and the money screens slip into advice (3B).** M6: "SMART" is shown to users (1G #55). |
| S8 | **A warm middle step:** free first, no pricing before trust (§7; brief hero CTA) | Met | Everything works without an account ("Everything is free without one"), and "Not now" is always there. The course is promoted in only two places: after the money activities and after all five doors. No pricing appears anywhere. | The course card doesn't say the course is paid (3C #117). |
| S9 | **Trust:** nothing that looks fake or unmaintained (brief: "credibility killer") | **Not met** | See the gap column. | Four things break trust:<ul><li>"We don't sell anything" sits next to "See the course" (3C #108).</li><li>Check-ins and emails are promised but not built (3C #106–107).</li><li>"Signed in" shows when nobody is signed in (3C #109).</li><li>A developer's placeholder note is visible to users (3A #67).</li></ul> |
| S10 | **Where she is at 11pm:** on her phone (§2) | Mostly | Intake, hub, Planner, Portfolio, sign-up and nine activity screens have no sideways scroll at 390px. None of the 53 money fields lost focus while typing. | Three Doors can't be completed on a phone (F2). Career ABCs overflows when opened on its own (F3). Some tap targets are small (F11). Screen readers lose focus in every activity panel (A1). |
| S11 | **No "Partners" or B2B signals** (brief, URGENT) | Met | The word never appears. The future partner programme is explained plainly, with an unticked consent box. | Its promise conflicts with `yns-profile.js` ("We only ever use your address to send you your results"). One statement is needed in both places, matching the privacy policy (3C #110). |
| S12 | **Measure the funnel:** Content → Trust → Website → Free Step → Sign Up (§9) | **Not yet** | The quizzes send events through Supabase. | The hub itself records nothing: no intake completion, door picks, activity starts or finishes, Seven days picks, sign-up opens, or course clicks. `apps/yns-ga.js` is referenced but missing (404). Suggested events: `intake_done`, `door_open`, `activity_start`, `activity_done`, `seven_days_pick`, `signup_open`, `course_click`. |
| S13 | **Gender-neutral, second-person voice** (standing rule; the strategy's "she" is internal shorthand) | Met | No user-facing gendered pronoun refers to the reader. | Nine unused model answers in Career ABCs say "she"; fix them before they're wired in (1B #22). |

**What the strategy asks for that isn't in the app yet, in priority order:**
1. Fix the trust breakers in S9.
2. Add the founder card (S6).
3. Add the funnel events (S12), so Month 2–3 conversion can actually be measured.

---
## 1. Voice

### 1A. Assumes the person feels stuck, lost, behind, in crisis, or unhappy

| # | File:line | Current text | Proposed | Sev |
|---|---|---|---|---|
| 1 | js/hub.js:37; apps/quiz-shared.js:146; vendor/quiz-shared.js:146 | "Five years or more. You're good at what you do, you're just not sure it's the right thing." | "Five years or more. You're good at what you do." | Medium |
| 2 | js/hub.js:99 (hub card tag) | "A plan for the week you want to quit." | "A plan for a hard week, written on a good one." | Medium |
| 3 | activities/why.js:291-293 | "A few years, and you haven't moved yet. For most people that's not about wanting it enough. Usually nobody has ever handed them a first step…" | "A few years. Often that means nobody has handed you a first step small enough to take, and that's what the bottom of this page is for." | Medium |
| 4 | activities/conversations.js:255-256 | "…The worst realistic outcome is silence, and silence is where you are standing right now." | "The worst realistic outcome is no reply, which leaves you exactly where you are today." | Medium |
| 5 | activities/money101.js:251 (shown even when the person picked "It doesn't cover it") | "Move $20 somewhere you won't touch it, today, as a test" | When `gap==="short"`: "Circle the one bill you'd call about first". Otherwise keep. | Medium |
| 6 | index.html:53 | "Be honest. Most people who land here are somewhere in the middle, and that's completely normal." | "Most people are somewhere in the middle, and that's completely normal." | Low |
| 7 | index.html:59 | "Something usually shifts before someone opens a page like this. Whatever it was, it counts." | "Whatever brought you here, it counts." | Low |
| 8 | index.html:97 | "…the next step is smaller than it looks." | "Wherever you're starting from, we'll take it one piece at a time…" | Low |
| 9 | activities/why.js:139 (example chip) | "Because I'm 24 and still working the same register." | "Because I want work that uses more of what I can do." | Low |
| 10 | activities/why.js:223, 315-318 | "…for the week you can't remember why you started." | "…for any week you want a reminder of why you started." | Low |
| 11 | activities/hours168.js:115 | "Pick the one you resent most." | "Pick the one you'd most like back." | Low |
| 12 | activities/hours168.js:61 | "…rather than scrolling and feeling guilty." | "The kind that actually restores you." | Low |
| 13 | activities/bounce.js:44 | "There will be a week you want to quit." | "Most changes have a hard week. Plan for it now." | Low |
| 14 | activities/bounce.js:47 | "On the hard week you won't be able to." | "On a hard week, that gets harder." | Low |
| 15 | activities/bounce.js:96 | "…and it's very hard to keep going when nobody is." | Delete this clause. The person may have just said they have nobody. | Low |
| 16 | activities/doors.js:247-248 | "So what is stopping you from starting?" | "Is anything in the way of starting?" | Low |
| 17 | activities/able.js:50 | "Every problem has a way through it." (the examples include "My hours got cut and rent is due") | "Most problems have more than one way through." | Low |
| 18 | activities/budget0.js:60 | "…the month you stop being one flat tyre away from a crisis." | "…the start of a cushion for the next surprise bill." | Low |
| 19 | apps/career-abcs_v2.html:2374 (tip card) | "Behind is an invented timeline" | "There's no deadline for starting" | Low |
| 20 | apps/career-abcs_v2.html:11552 | "Stuck? Start with one of these" | "Need an idea? Start with one of these" | Low |
| 21 | apps/prototype-1-choose-your-own-adventure.html:175 | "…the version of you lying here is not the version who took a career quiz on…" | "…you're a year and a half on from the night you took a career quiz on…" | Low |

Checked and fine: the intake option "I feel stuck and I'm done standing still" (hub.js:21), which the person picks. Also fine: routing copy that repeats back only what the person picked (hub.js:224-228), and the grit.js "fixed" option.

### 1B. she/her/he/his for the user

No user-directed gendered pronouns in the hub, the activities or the prototypes. The ones in `hub.js` (lines 86, 346, 971) are in code comments.

| # | File:line | Current text | Proposed | Sev |
|---|---|---|---|---|
| 22 | apps/career-abcs_v2.html:8276, 8282, 8288, 8294, 8300, 8306, 8312, 8318, 8324 (MODEL_ANSWERS `whatChanged`) | "…spends the rest of the answer on what **she** was actually doing and why **she** is available now." (the answerer is unnamed) | Use "they" or "the answer", or give each model answer a named speaker. I found no code that reads `MODEL_ANSWERS`, so this is latent. Fix it before it's wired in. | Low |

Named example characters are fine and not flagged: Deion, Marisol, Kwame, Tanisha, Luis, Bao, Priya, Omar, Renata, Malik, Yelena, Curtis, Rashid, Naomi, Grace, Aisha, Wei and Jaime (lines 1268-1953), plus Dana Whitfield, Renata Cruz and Tomas Ellery (13621-13726).

### 1C. Contrasting constructions ("not X but Y", "X, not Y", "isn't A; it's B", "rather than" reframes)

These carry more weight because they sit in titles or on hub cards:

| # | File:line | Current text | Proposed | Sev |
|---|---|---|---|---|
| 23 | js/hub.js:97 (hub card tag) | "The number you need, not the number you want." | "What your month costs to run." | Medium |
| 24 | activities/floor.js:229 (title) | "What a job pays on day one is not what it pays" | "Pay usually grows the longer you do the job" | Medium |
| 25 | activities/budget0.js:96 (title) | "A budget is not a list of what you spent." | "A budget is a plan for where the money goes." | Medium |
| 26 | activities/retire.js:187 (title) | "A pension is a promise, not a pot." | "A pension is a monthly payment, promised for life." | Low |
| 27 | activities/floor.js:320-321 | "It isn't a target and it isn't an ambition. It is the line under which a job does not work…" | "It's the line below which a job doesn't work, however much you like it." | Low |
| 28 | activities/hours168.js:214 | "A job change doesn't add hours, it moves them." | "A job change moves your hours around." | Low |
| 29 | activities/interests.js:170 | "Not what you're qualified for. Not what pays well. Just what you'd actually like doing…" | "Just what you'd like doing on an ordinary Tuesday. Pay and training come later." | Low |
| 30 | activities/proof.js:220 | "Not a personality result and not a guess. N things that happened…" | "N things that happened, with you as the reason." | Low |
| 31 | activities/why.js:141 | "Why does that matter? Not to anyone else. To you." | "Why does that matter to you?" | Low |
| 32 | activities/why.js:202 | "\"Happier\" isn't checkable. \"I don't think about work on Sunday\" is." | "Pick something you could check, like \"I don't think about work on Sunday.\"" | Low |
| 33 | activities/constraints.js:85 | "\"Worth questioning\" doesn't mean it's false. It means you haven't checked." | "\"Worth questioning\" means you haven't checked it yet." | Low |
| 34 | activities/able.js:163 | "Not the best one. Not the cleverest one. The one you could begin…" | "Pick the one you could begin without anything else happening first." | Low |
| 35 | activities/doors.js:387 | "Read the numbers as orientation, not as quotes." | "Use these numbers as a rough guide." (keep the rest of the note) | Low |
| 36 | activities/conversations.js:252 (heading) | "Two, not one" | "Why two conversations" | Low |
| 37 | apps/prototype-3-budget-allocation.html:470 | "That's not a budget, that's a conviction." | "That's a clear answer." | Low |

The same pattern in body copy, all **Low**. The fix is the same each time: state the positive half on its own.
- activities/why.js:242 "This isn't a test."; 250 "…not another year of noticing it."; 294 "this was never really about the job"; 324-326 "…rather than whether it is the best job available."
- activities/proof.js:59 "rather than the symptom"; 242 "raw material rather than a result"
- activities/hours168.js:37 "…not what you'd like to."; 58 "rather than time you owed"; 118 "rather than the ones around it"; 120 "isn't so much too full as the wrong shape"
- activities/constraints.js:114, 180 "Design around these rather than arguing with them", 188, 224
- activities/interests.js:174, 281, 289 "a shortlist rather than an answer"
- activities/doors.js:188/209 "rather than the ones you think you should want"; 263 "the question is no longer which route… It's what…"; 348; 400 "not the first one you found"; 421; 426
- activities/floor.js:42; 243 "not our guess"; 256 "This is not one lucky job."; 295 "your cushion, not the pay"; 343
- activities/conversations.js:74, 103-104
- activities/premortem.js:110 "You didn't fail at the work."; 116; 149; 215; 221; 289 "Picturing it going wrong is not the same as expecting it to"
- activities/stilltrue.js:140, 207 "a real result rather than an empty one", 210, 227 "a change, not an erasure"
- activities/grit.js:48 "Most people think bouncing back is a personality trait. It works more like a habit."; 131; 250 "a smaller step, not more willpower"
- activities/able.js:191 "Not the whole solution."
- activities/budget0.js:99 "Zero doesn't mean broke."; 101; 199 "zero left, not for zero spent"; 271 "That's not a problem, it's a decision…"; 288
- activities/compound.js:74 "Not what you wish you could."; 167
- activities/money101.js:214 "a habit, not a spreadsheet"
- activities/smart6.js:61 "six SMART goals, not one"; 148; 380; 384
- activities/taxes.js:82 "sounds nice and is actually your own money…"
- js/hub.js:219 "rather than the default"; 478 "rather than once"; 1191 "worth knowing rather than hiding"
- apps/quiz-shared.js and vendor/quiz-shared.js:124 "rather than around it"; 130 "the record, not the impression"
- apps/prototype-1…:174 "not because you're anxious. Because you're ready."; 237; 245 "your stomach, not your spreadsheet"
- apps/prototype-2…:217 "Not networking. Talking."; 232 "Not annoying. Difficult."; 264 "the cause, not the incident"
- apps/prototype-3…:211; 245
- apps/career-abcs_v2.html:15656, 16086, 16098 ("rather than")

### 1D. genuinely / honestly / straightforward

| # | File:line | Current text | Proposed | Sev |
|---|---|---|---|---|
| 38 | js/hub.js:36 (intake option title); js/hub.js:841 (Portfolio row); apps/quiz-shared.js:145; vendor/quiz-shared.js:145 | "Genuinely experienced" | "Experienced" | Medium |
| 39 | js/hub.js:11 | "…and honestly I'm not sure where to even look." | "…and I'm not sure where to look." | Low |
| 40 | js/hub.js:227 | "That's the most honest thing anyone says here…" | "A lot of people say this, and it's exactly what this door is for." | Low |
| 41 | activities/hours168.js:148 | "Honestly, most of it's negotiable for the right thing" | "Most of it's negotiable for the right thing" | Low |
| 42 | activities/conversations.js:79 | "Genuinely nobody, and I don't know where to look" | "Nobody yet, and I don't know where to look" | Low |
| 43 | activities/interests.js:209 | "Right now, honestly." | "Right now." | Low |
| 44 | activities/able.js:211 | "Honestly." | "The day you'd really do it." | Low |
| 45 | activities/taxes.js:96 | "Honestly." | "Your best guess." | Low |
| 46 | activities/budget0.js:179 | "Nothing yet, honestly" | "Nothing yet" | Low |
| 47 | activities/premortem.js:186 | "Honestly, neither. It would end it" | "Neither. It would end it" | Low |
| 48 | activities/smart6.js:215 | "Honestly, too big" | "Too big" | Low |
| 49 | activities/money101.js:191 | "I honestly don't know" | "I don't know" | Low |
| 50 | apps/prototype-2-day-in-the-life.html:232 | "…one stretch that's genuinely difficult." | "…one stretch that's really hard." | Low |
| 51 | apps/prototype-3-budget-allocation.html:215 | "Getting genuinely, provably good at one hard thing." | "Getting provably good at one hard thing." | Low |
| 52 | apps/career-abcs_v2.html:2324, 16761 | "…and it is genuinely good." | "…and it works well." | Low |
| 53 | apps/career-abcs_v2.html:6357, 6524, 7807 | "genuinely could not take" / "genuinely did not work out" / "genuinely cover" | Delete "genuinely". | Low |
| 54 | apps/career-abcs_v2.html:7883 | "A straightforward check on the physical side of the job." | "A simple check on the physical side of the job." | Low |

No change needed at apps/career-abcs_v2.html:1584 ("straightforward to manage") or at the "Say/Answer honestly" instructions (7261, 7673, 7896, 15675). In those places the word carries meaning. The "honestly" lines in the weak model answers (8274-8316) are there on purpose.

### 1E. Talks about the user in the third person

No findings. Every user-facing "the person" in the scanned files refers to someone else, such as a customer, a patient or a contact. "Michaela" and "the user" never appear in user-facing text.

### 1F. "lead gen", "partners", "advertising" visible to users

No findings. "partner" appears only in code comments (hub.js:512, 527, 544) and as "My partner" in the Your Why "who is it for" tags. The partner program shows up in plain words in the sign-up panel; see Honesty item 67.

### 1G. Plain words, jargon in titles, shame, US English

| # | File:line | Current text | Proposed | Sev |
|---|---|---|---|---|
| 55 | activities/smart6.js:269 (title); 313 (aside title); 403 (heading); js/hub.js:68 (door blurb); js/hub.js:101 (card tag) | "Now write month one as a SMART goal." / "SMART, in one line each" / "Month one, as a SMART goal" / "one SMART goal" | "Now write month one so you can check it." / "Five checks for a goal" / "Month one, written to check" / "one clear goal, with dates". The file's own header says SMART is never named on screen. | Medium |
| 56 | Unexplained "the class" and "Module N": activities/grit.js:72, 196, 201, 255; bounce.js:48, 123, 165; able.js:58; budget0.js:97; money101.js:78, 81, 208, 214; taxes.js:49, 61, 66, 121, 125; invest.js:35, 41, 59, 204, 214; interests.js:256; smart6.js:115, 146, 209, 306, 408 | "The class says…", "Module 4, videos 6 and 10", "the ABLE framework from Module 4" | A first-time hub user hasn't taken a class. Use "a common rule of thumb", or say "the Your Next Step course" once per activity and drop the module and video numbers. | Medium |
| 57 | js/hub.js:91; activities/bounce.js:48 | "The ABLE method." / "the class's ABLE method" | "Four steps: look, list ideas, pick one, start." (the screens can keep the A/B/L/E letters) | Low |
| 58 | activities/stilltrue.js:77-78 | Raw keys shown to users: "What was blocking you was **entry**" / "**unclear**", "You said you would not give up **own time**" | Map the keys to words, e.g. "getting accepted", "not knowing the first step", "the one thing that's mine". | Low |
| 59 | js/hub.js:1133 | Rail label "Work" (holds the experience answer) | "Experience" | Low |
| 60 | js/hub.js:1182 | "Level, so far" (shown when the categories are tied) | "A tie, so far" | Low |
| 61 | activities/stilltrue.js:176 | "a diagnosis, a a layoff" | "a diagnosis, a layoff" | Low |
| 62 | activities/conversations.js:65 | "Almost everyone is wrong, once you widen it by one step." | "Widen it by one step and there's usually someone." | Low |
| 63 | apps/prototype-3-budget-allocation.html:440 | "…so you're not willing to give any of it up yet" | "…so all of these matter to you right now" | Low |
| 64 | apps/yns-profile.js:320, 433-434 (error text; appears only once Supabase is configured) | "Supabase → Authentication → Providers → …", "Turn it off in Supabase (Authentication → Providers → Email)" | "Sign-in isn't working right now. Try the emailed link instead." | Low |
| 65 | British words in a US product | proof.js:90 "mum"; interests.js:60 "sat at a desk", 82 "Talk someone round", 88 "organised", 214 and 257 "licence(s)"; floor.js:61 "Service charge … board", 63 "fuel"; hours168.js:49 and budget0.js:35 "the shop"; able.js:136 "daft"; budget0.js:60, 76 "tyre", 103 "behaviour"; retire.js:42 and taxes.js (8×) "payslip", retire.js:171 "enrolment", 190 and 216 "cheque", 215 "unionised"; compound.js:134 "maths"; conversations.js:104 "favour"; invest.js:109 "commonest"; smart6.js:346 "sit the entrance test", 348 "enrol"; prototype-2:252 "realise"; prototype-3:205 "favours", 211 "optimising"; quiz-shared.js (both copies):61, 76, 168-170, 186, 187, 205 "programme(s)" | mom, sitting, talk someone into it, organized, license(s), HOA fees / room and board, gas, the grocery run, silly, tire, behavior, pay stub, enrollment, check, union, math, favor, most common, take the entrance test, enroll, realize, favors, optimizing, program(s) | Low |


---

Scripts used in this section and the next stayed in the audit scratch folder, not in the repo.

## 2. Consistency

### C1 · High · The Floor's result screen crashes
- **Where:** `activities/floor.js:285`
- **Current code:** `var esc = r.esc, money = r.money;`
- **Cause:** The runtime passes no `money` (`js/mock-runtime.js:535`: `{ esc, extra, ctx, state, Quiz, DB }`). The local variable is therefore `undefined`, and it hides the file's own `function money()` at `floor.js:439`.
- **What the user sees:** On both fresh and seeded runs, the result screen shows **"Done."** followed by *"results() threw: money is not a function"*. The person never sees their floor. The line that says where the pay numbers come from (`Quiz.salaryNote()`) never renders either.
- **Fix:** `var esc = r.esc, fmt = r.money || money;` and use `fmt(...)` at lines 313, 320 and 321. Or simply drop `, money = r.money`.

### C2 · High · Career ABCs asks for your level a second time
- **Where:** `apps/career-abcs_v2.html:1989`
- **Current text:** `question: "How much working experience do you have?"` with the options "I'm just starting out / I've been working a few years, doing the work myself / I have several years behind me / I have several years, and I manage people".
- **Verified:** Answer the hub intake (level = `early`), open Door 3 and then "A · What you've already done". The app shows "Question 1 of 3: How much working experience do you have?"
- **Cause:** The hub opens ABCs without `?lvl=`. See `js/hub.js:458` and `:1061`, `openApp(slug, ABCS_URL+"#"+a.app, a.name)`, which do not go through `withLevel()`. The ABCs `frontDoor()` (line 3527) never reads the URL. The runtime's rule that drops a known rung can't cross into the iframe. `docs/one-direction.md` already lists this under "Still to do".
- **Fix:**
  - In the hub, use `withLevel(ABCS_URL)+"#"+a.app` in both places.
  - In ABCs, when `?lvl=` is present, remove the `stage` step from `INTAKE` and set `answers.stage` from the map `{early:"starting_out", some:"early_ic", experienced:"experienced_ic", leader:"people_leader"}` before `derivePersona`.
  - The "Upload" path at `hub.js:1057` needs the same change.

### C3 · Medium · Six of the 26 cards never offer a "Seven days" pick
- **Where:** The Story, A Day In The Life, Spend Your 100, and ABCs A, B and C.
- **Current behaviour:** The Seven days block only exists in `js/mock-runtime.js:547` (`<div class="am-seven"><h3>Seven days</h3>…`), so only the 20 in-hub activities show it. A search for "seven days", "this week" and `steps_open` in the four `apps/` pages finds nothing. Finishing these six adds nothing to the Planner.
- **Why it matters:** The Planner's empty state (`hub.js:727`) promises "Every activity ends by asking for one thing to do this week".
- **Fix:** In `YNS.closeApp` (`hub.js:431`), when `absorbRun()` or `syncAbcs()` reports a newly finished run, show the same Seven days panel from the hub. Take three actions per app from a new `ACTS[slug].seven` array and push them to `steps_open` the same way `finish()` does.

### C4 · Medium · Links on result screens leave the hub and hit 404s
- **What happens:** These are plain `<a href>` links. Clicking one navigates the whole page away, and because nothing persists, the session is lost.

| File:line | Current | Result |
|---|---|---|
| `activities/proof.js:243` | `<a href="career-abcs_v2.html">Career ABCs</a>` | 404 from the hub root (verified) |
| `activities/floor.js:309` | `<a href="activity.html?a=floor">Run it again</a>` | no such page in this build |
| `activities/floor.js:317` | `<a href="activity.html?a=stilltrue">say so here</a>` | no such page |
| `activities/floor.js:334` | `<a href="prototype-1-choose-your-own-adventure.html">Story</a>` | 404 from the hub root |

- **Fix:** Add `YNS.open(slug)` to the hub, reusing the card click logic from `hub.js:1061`. Then render these as `<button class="lnk" onclick="YNSMock.close();YNS.open('abcs_a')">Career ABCs</button>`, and likewise for `floor`, `stilltrue` and `cyoa`.

### C5 · Medium · Solve It and The Week It's Hard ask the same three questions, so whichever comes second is hollow
- **Where:** `able.js:72` (`able_problem`), `:131` (`able_options`) and `:186` (`able_step`) repeat `bounce.js:118`, `:142` and `:181`.
- **Verified:** With The Week It's Hard's answers on file, Solve It shows only 4 screens.
  - The Assess, Brainstorm and Execute screens are dropped.
  - The List screen still asks "Which one could you actually start soonest?" and offers "The first one I wrote", but no list is on screen.
  - The result shows only the A section.
- **Fix:** Pick one of two options.
  - (a) Give each of Solve It's A, B and E slots a `learn` fallback rung, e.g. `needs:{fact:"able_options"}`, titled "You listed these in The Week It's Hard", that lists the stored items. Have `results` fall back to `ctx.facts.able_options` and `able_step`.
  - (b) Replace the four ABLE slots in `bounce.js` with one learn card that links to Solve It.

### C6 · Medium · `money_in` is asked in two places, and the "update it there" advice leads nowhere
- **Where:** `money_in` has `asks` in both `budget0.js:119` and `money101.js:100`.
- **Rule coverage:** The drop rule does cover this. The seeded run confirmed that both skip the question.
- **Problem 1:** The advice to update the number elsewhere is a dead end.
  - `budget0.js:145` says *"If that's changed, Money, Plainly is the place to update it."* But Money, Plainly silently skips its income question when `money_in` is known (seeded run confirmed).
  - `money101.js:158` says *"If that number has changed, The Floor takes six minutes to redo."* But The Floor drops its build-up when `floor_monthly` is known (seeded run: first screen is "How many of those months could you cover?").
  - The only real way to update either number is deleting a Planner line.
- **Problem 2:** `budget0.js:146` says *"You told Money, Plainly what comes in, so this doesn't ask again."* That is wrong when Every Dollar a Job wrote the figure itself.
- **Fix:**
  - Add a second button, "It's changed", to these learn cards. It clears the fact and re-resolves the slot. In the runtime, `YNSMock.redo(slotId)` would delete `facts[rung.asks]` and splice the asking rung back in.
  - Reword the provenance line to "You've told us what comes in already, so this doesn't ask again."

### C7 · Low · Money, Plainly skips its income question without saying so
- **Where:** `money101.js:97-117`. The income slot has only the asking rung, so a known `money_in` removes the screen with no card.
- **Why it matters:** Every Dollar a Job (`budget0.js:137`) and Money, Plainly's own fixed-costs slot (`money101.js:150`) both show an "Already know this one" card.
- **Fix:** Add `{ needs:{fact:"money_in"}, mechanic:"learn", eyebrow:"Already know this one", title:"We've got what comes in.", provenance:"You've told us this already, so this doesn't ask again.", cta:"Use it" }`.

### C8 · Low · What Kind of Work drops its training paragraph on a second run
- **Where:** `interests.js:254`
- **Current code:** `var appetite = r.state.answers.appetite || "";`
- **What happens:** When `training_appetite` is known, the slot is dropped and the "What you said about training" block disappears (seeded run confirmed).
- **Fix:** `var appetite = r.state.answers.appetite || r.ctx.facts.training_appetite || "";`

### C9 · Medium (hidden in this build, live when signed in) · The Story and A Day In The Life can rename the wrong screen
- **Where:** `apps/prototype-1-choose-your-own-adventure.html:487` (`const b = BEATS[BEATS.length-1];`) and `apps/prototype-2-day-in-the-life.html:468` (`const m = MOMENTS[MOMENTS.length-1];`).
- **Cause:** `applyPriorLevel()` assumes the last screen is the level question. With `?lvl=`, that screen was already removed at lines 313 and 299. If `Quiz.priorLevel()` also returns a value (a signed-in user with a stored level), the last story chapter gets retitled **"Still standing in the same place?"** and the level-confirmation scene, while keeping the chapter's own options.
- **Not reproduced here:** Supabase was blocked.
- **Fix:** Add `if (PRESET_LEVEL) return;` as the first line of both functions. Or look the step up by `id==="level"` / `type==="level"` and return if it's missing.

### C10 · Low · Counts agree on 26, but Two Conversations shows up twice
- **Verified live:**
  - The demo bar says "All 26 play here" (`index.html:24`).
  - The rail heading says "All 26 activities" (`index.html:125`).
  - There are 26 unique cards. After `demoFill`, the caption reads "26 of 26".
- **The catch:** Two Conversations sits in both Door 2 and Door 3 (`hub.js:58` and `:62`). The doors therefore hold 4+6+4+10+3 = **27** cards, and the "All 26 activities" list renders **27 rows** with Two Conversations twice.
- **Fix:** Under the rail heading add "Two Conversations sits in two doors." Or render the second row as "Two Conversations (also in Explore)".
- **Stale leftovers:**
  - `index.html:90` has `<span class="pct" id="avatarPct">0 of 17</span>`. It is hidden (`display:none`) and never updated, so delete it.
  - `README.md:9` still says "Plays **13 activities**".

### C11 · Low · Some numbers on result screens have no source
- **The Match:**
  - `retire.js:261` says `'Your match is worth ' + money(m.end - m.endAlone) + " over " + m.years + " years."`. The 7% assumption appears only on the calculator screen.
    - Fix: append `" at an assumed 7% a year. An assumption, not a promise."`
  - `retire.js:263` says "Limits for 2026 are $24,500 for workplace plans and $7,500 for IRAs." No source is given.
    - Fix: append "(IRS 2026 limits)".
- **Money, Plainly:** `money101.js:226` and `:239` fill "Has to go out" from `floor_monthly` when The Floor was done, and don't say so.
  - Fix: when `!r.extra.fixed_total && !f.money_fixed && f.floor_monthly`, add `<p class="ya-fine">From The Floor.</p>`.

### Where each of the six facts is asked and read

| Fact | Asked | Read | Covered by "drop a known rung"? |
|---|---|---|---|
| `level` | Hub intake Q3 (`hub.js:31-40`, written at `:1241`). The Story (`prototype-1:298`), A Day In The Life (`prototype-2:286`) and Spend Your 100 (`prototype-3:366`) ask only when no `?lvl=` is passed. **ABCs `career-abcs_v2.html:1989` asks every time (C2).** | `interests.js:128`, `floor.js:165,289`, `stilltrue.js:67,70`, `hub.js:606,866,878`, quiz `rolesFor` | No in-hub activity asks it. The quizzes skip via `Quiz.presetLevel()`, which works. **ABCs is not covered.** Skipping the intake → the first quiz asks, and `absorbRun` picks the answer up (`hub.js:421`). |
| `why_statement` | `why.js:162` only | `bounce.js:241`, `conversations.js:127`, `smart6.js:242,364`, `stilltrue.js:76`, `hub.js:619,854,995` | Yes. `smart6` asks `smart_why` (why *this goal*) only when no why is on file, which is a different question. |
| `top_category` | Asked nowhere. Resolved in `hub.js:317` from evidence (`interests.js:320`, the quizzes via `absorbRun`). The direct write at `interests.js:323` runs only outside the hub. | `doors.js`, `conversations.js`, `floor.js`, `premortem.js`, `smart6.js:143`, `stilltrue.js:71`, `hub.js` | n/a. ABCs' free-text "What you want next" (`career-abcs:11530`) is nearby but different; it could be prefilled from this. |
| `money_in` | `budget0.js:119`, `money101.js:100` (**asked in two places**) | `budget0.js:142,168,203,254`, `money101.js:178,225`, `hub.js:655,1005` | Yes, whichever runs second skips it. Update paths are dead ends (C6). |
| `floor_monthly` | `floor.js:37` only | `money101.js:150-179,226`, `stilltrue.js:66,75`, `hub.js:654,879,999` | Yes, silently. Result screen crashes (C1). |
| `training_appetite` | `interests.js:202` only | `hub.js:662,873`. Three Doors does not read it yet (known open item). | Yes. Results lose the paragraph (C8). |

No other `asks`, `factsFrom`, `onStep` or `setFact` writes any of the six. The only place the drop rule doesn't reach is across the iframe boundary.

### What passed (Section 2)

| Check | Result |
|---|---|
| All 20 in-hub activities reach a result screen (fresh and seeded) | Pass for 19. The Floor fails (C1). |
| Each of the 20 offers 3 Seven days picks, closes the modal, lands on the hub, and adds the line to the Planner with its source | Pass |
| Every card shows minutes (27 of 27 cards, `N min`) | Pass |
| Demo bar, rail heading and unique card count all say 26 | Pass (see C10 for the duplicate) |
| Wage figures in What Kind of Work and the three quizzes name BLS via CareerOneStop | Pass |
| The 7% in What Money Does Over Time and Every Dollar a Job is labelled an assumption; Where Your Paycheck Goes says "rule of thumb"; Three Doors says "we wrote them" | Pass |
| The three quizzes drop their level question when `?lvl=` is passed, and have a "back to hub" button | Pass |
| Your Why's five whys drop when a why is on file | Pass (seeded run: 3 screens) |

---

## 3. Honesty

### 3A. Wrong or invented numbers shown as fact

| # | File:line | Current text | Problem | Proposed | Sev |
|---|---|---|---|---|---|
| 66 | activities/floor.js:147-149 and 170-175 | "The published midpoint is $X" + "Half the people in that job earn less than this and half earn more." | (a) In the hub, `Quiz.init()` never runs, so `Quiz.rolesFor` falls back to the invented placeholder table (vendor/quiz-shared.js:165-220). The "published" figure is made up. (b) With real data, `guessRole` averages the two ends of the band. For "some" that band is the 25th percentile to the median, so X is not a median and the "half earn less" sentence is false. | Label: "Our estimate, from a national pay band (BLS via CareerOneStop), is". Note: "This is the middle of the band for people a few years in. It isn't the median and it isn't a starting salary." Also load the real data in the hub (call `Quiz.init` or feed it `YNS_ROLES`). | High |
| 67 | activities/floor.js:325-331 with vendor/quiz-shared.js:639-642 | Role pay under "Against [field] at your level", then "Salary ranges are placeholder bands for the prototype… They will be replaced with real BLS figures… before this ships." | Same cause: invented pay bands, plus a developer note and a promise shown to users. | Use the real `data/roles.json` bands with the standard BLS/CareerOneStop note. Remove the placeholder path from anything users can see. | High |
| 68 | activities/floor.js:319-320 | "About $X a year **before tax**, just to stand still." | The floor is money spent each month, which is after tax. A job that pays X before tax won't cover it, so this understates what someone needs to earn. | "That's about $X a year after tax. Before tax, a job needs to pay more than that. How much more depends on your state and benefits." | High |
| 69 | activities/doors.js:359, 370-371 | "The shortest distance between here and being in the room is **[route]**." | The routes are sorted by the character length of the `time` string, so for trades the apprenticeship ("3–5 years") beats the certificate ("6–18 months"). The fastest route can be named wrong. | Sort on a numeric `minMonths` field, or drop the sentence. | High |
| 70 | activities/floor.js:231-232 | "Almost every job here pays a lot more once you've been doing it a while. Same job, same place, same person." | The bands compare different workers at different percentiles, not one person over time. | "For the same job, people with more experience are usually paid a lot more." | Medium |
| 71 | activities/floor.js:243, 256-258 | "A jump of N%. These are published government figures, not our guess." / "pay climbs by a median of N%…" | The percentiles come from BLS. The jump and the median climb are our own calculation from the lowest to the highest band. | "…The pay figures are from BLS via CareerOneStop. The jump is our calculation from them." | Medium |
| 72 | activities/compound.js:80 vs activities/invest.js:59, 158 | "7% is a common long-run assumption for a broad stock market fund" vs "Long-run US stock market average" at 9%, "around 9–10% a year" | Two different "long-run" figures for the same thing. | Pick one default. Label it "before inflation, based on past returns, an assumption", and explain the difference if both stay. | Medium |
| 73 | activities/compound.js:53 | "Ten years of waiting costs more than ten years of bigger payments can make up." | False in general, since larger payments can close the gap. | "Waiting ten years means you'd need much bigger payments to catch up." | Medium |
| 74 | activities/budget0.js:72-73 | "[savings + surprise fund] … kept up for twenty years at a 7% average return, that is roughly $X" | The surprise fund and savings usually sit in a savings account, not an investment earning 7%. | "If this were invested and averaged 7% a year (an assumption, not a promise; a savings account usually earns less), in twenty years it would be about $X." | Medium |
| 75 | activities/invest.js:149 | "The top two rows are what not taking risk guarantees." | Savings and CD rates change over 20 years, so nothing is guaranteed. | "The top two rows show what those rates would give if they held. Your balance there doesn't drop, but the rate can change." | Medium |
| 76 | activities/retire.js:77 (compute) and 71-72 | "What they match, up to" treated as a dollar-for-dollar match | Many plans match 50¢ per dollar, so the match value can be overstated by 2×. | Add "Assumes they match dollar for dollar. Many plans match half." Or add an input for the match rate. | Medium |
| 77 | activities/retire.js:206 | "A pot big enough to pay that out would need to be somewhere around $[yearly×25]." | An unlabeled 4%-withdrawal assumption. | "…about $X, using a common rule of thumb of 25 years of payments. That's an assumption." | Medium |
| 78 | activities/retire.js:45, 113, 169 | "nothing is taxed when it comes out" / "Not the growth either." / "not even decades of growth" | Only true for qualified withdrawals (age 59½ and the 5-year rule). The results screen (263) hints at this but these screens don't. | Add "…if you take it out after 59½ and the account is at least five years old." | Medium |
| 79 | activities/retire.js:169 | "It's yours, not your employer's, so it follows you between jobs." | Suggests a 401(k) isn't yours. Your own 401(k) contributions are always yours. | "You open it yourself, so it isn't tied to any job." | Medium |
| 80 | activities/retire.js:242 | "No plan at work, or no job right now" → "A Roth IRA is the one you can open yourself, whenever." | You can only contribute in a year with earned income. For "no job right now" this is wrong. | "An IRA is an account you can open yourself. You can put money in for any year you had earned income." | Medium |
| 81 | activities/taxes.js:49, 66, 121; activities/money101.js:81, 84 | "25–31% of gross pay comes out", default 25%, "take off about a quarter" | For a single filer on $40k in 2026 (standard deduction $16,100), federal tax plus FICA is roughly 13–14%. Even with state tax it is often under 20% before any benefits you choose. Medium-high confidence that the rule overstates the cut for this audience. It is labelled as a rule of thumb. | "Often 15–30%, depending on your state and the benefits you pick." Set the default to 20%. | Medium |
| 82 | apps/prototype-1-choose-your-own-adventure.html:437-439 | "…so we've weighted toward paths with real earning ceilings." / "…toward paths with room to breathe." | `state.money` is saved but never used in `Quiz.score`. The claim is false. | Delete the sentence, or actually apply the weight. | Medium |
| 83 | apps/prototype-3-budget-allocation.html:187, 193 | "…it just means we'll rule out paths with low ceilings…" / "this rules out most shift-based and on-site work, whatever else you say." | Cosine scoring rules nothing out. | "…we'll lean toward paths with higher ceilings." / "Worth knowing: a lot of shift-based and on-site work won't give you this." | Medium |
| 84 | activities/interests.js:272; js/hub.js:676; apps/quiz-shared.js:680-682 | "Pay is a national band for where you are now…" / "narrowed to the experience level stated above" | The mapping from percentile to experience level is our assumption and should say so. On the PDF (hub.js:676) no level is stated above, and `f.level` falls back to "early" without saying so. | "…national pay band from BLS via CareerOneStop. We match your experience to a slice of the range, which is our estimate." On the PDF, print the level. | Medium |
| 85 | js/hub.js:867-869, 895 (Portfolio panel) | Pay bands "$Xk–$Yk" with "from N activities"; "from the same public source as the pay figures" | No source is named anywhere in the panel. | Add under the roles: "National pay bands, BLS via CareerOneStop." Name the source in the links note: "CareerOneStop, from the US Department of Labor". | Medium |
| 86 | activities/invest.js:41 | "the same $1,000 earns around $50 in a year" (5%) | Looks high for 2026 (my estimate of high-yield rates is roughly 3.5–4.3%, medium confidence). It also conflicts with the calculator default of 4% (line 155). | "…around $35–$45 in a year at 2026 rates." | Low |
| 87 | activities/invest.js:183 | "the bottom two can fall" | The bonds/money-market row, which is third, can also fall. | "the bottom three can fall" | Low |
| 88 | activities/invest.js:159 | Individual stocks "Same average" at 9% | Most single stocks trail the index average, so drawing an equal bar is misleading. | "Some do far better, many do worse, some go to zero." Default the rate below the index. | Low |
| 89 | activities/retire.js:91, 127-145 | "After N years at 7%" | Not called an assumption on these screens. | "at an assumed 7% a year" | Low |
| 90 | apps/prototype-1/2/3 (lines 421, the "% match to the shape of your day" line, 476) | "N% match to the story you told" | `pctScaler` stretches scores onto 50–100, so the number isn't a match percentage. | Drop the percentage and keep "Best match / Strong fit / Worth exploring". | Low |
| 91 | Unsourced "most people / almost nobody" claims: why.js:220-221; proof.js:61; hours168.js:206; floor.js:43; doors.js:187; conversations.js:233; premortem.js:268; grit.js:248, 250; stilltrue.js:237; budget0.js:230, 269, 275; compound.js:49, 51; smart6.js:393; taxes.js:79; money101.js:233; invest.js:76; js/hub.js:1079 | e.g. "most people never get one", "which almost nobody does", "It cannot be taught" | Presented as fact with no source. | Soften to "many people…" or cut. | Low |

### 3B. Advice, and naming or recommending a product or employer

| # | File:line | Current text | Proposed | Sev |
|---|---|---|---|---|
| 92 | activities/interests.js:256 | "…a job with tuition benefits is the cheapest degree there is, and Starbucks, Walmart and Target all run one." | "Some employers, including some large retail and food chains, help pay for school. Check the benefits page of any job you look at." | High |
| 93 | activities/retire.js:256 under heading "Your next move" (264) | "…which most people never do. The next move is a Roth IRA alongside it…" | Heading: "Where you are". Text: "You're taking the full match. Some people also open an IRA alongside it. The screens above show how the two compare." (The "most people never do" claim is unsourced, and I believe it's wrong, with medium confidence.) | High |
| 94 | activities/compound.js:102 | "**Pay off high-interest debt first.** A card at 24% beats any return you're likely to earn, so clearing it is the better move." | "**High-interest debt usually costs more than investing earns.** A card at 24% costs more each year than a 7% return would earn, which is why many people clear it first." | Medium |
| 95 | activities/compound.js:103 | "…that's the first place money should go. A match is an immediate return nothing else competes with." | "**A retirement match adds money on top of yours.** It's an immediate return that's hard for anything else to beat." | Medium |
| 96 | activities/compound.js:130, 152, 154; actions 180, 186 | "Find out the percentage they match and put in at least that much." / "That's almost always right… the better investment." / "Put in at least enough to get the full match" / "Put anything spare at the highest rate one" | Describe instead: "Many people put in at least enough to get the full match." / "Clearing high-interest debt is a common first step." Actions: "Find out what your job matches". | Medium |
| 97 | activities/retire.js:66 | "Put in less than the match and you are turning down pay." | "If you put in less than the match, the unmatched part is money your employer doesn't add." | Medium |
| 98 | activities/retire.js:255; action 270; 240 | "…put in at least that much, and stop there if money is tight. Everything else on this page can wait." / "Raise your contribution to at least that" / "Then the next question is whether to add a Roth." | "…Many people put in at least that much before anything else on this page." / "Find out how much it takes to get the full match" / "Next, you could compare an IRA." | Medium |
| 99 | activities/invest.js:36, 54, 132, 197, 199, 203 | "Right for money you need this month. Wrong for…" / "where a lot of people should stop for a while" / "the right one for most people" / "That is the answer" / "Money with a date goes to the safe end." / "That's the textbook answer" | "Usually used for money you need soon." / "Many people stop here for a while." / "A common answer." / "Most guides put money you need within a year at the safe end, because…" | Medium |
| 100 | activities/money101.js:214 | "…the first job is getting it to zero, usually starting with the minimum payments or the car." | Cutting minimum payments leads to fees and credit damage. Use "…the first job is getting it to zero. The Floor and Every Dollar a Job help you see which line can move." | Medium |
| 101 | activities/budget0.js:170 | "This is the one habit that separates people whose money situation improves from people whose doesn't, and it has almost nothing to do with how much they earn." | Unsourced, and shaming for someone on low pay. Use "Deciding what you keep before you spend is a habit many budgets start with." | Medium |
| 102 | activities/doors.js:353-356 | "…the honest next step is a different field." | "…one option is to look at a different field." | Low |
| 103 | activities/premortem.js:292 | "…nothing on it is a reason not to go." | "…and now you know what to plan for." | Low |
| 104 | js/mock-runtime.js:478 (default `match` calculator, not currently used by any activity) | "No match means no free money on this one. A Roth IRA is the one you open yourself." | "No match here. An IRA is an account you can open on your own." | Low |
| 105 | activities/invest.js:220 | "Look up one high-yield savings account and compare the rate" | "Find out what rate your savings account pays, and what high-yield accounts pay in general" | Low |

### 3C. Promises the site can't keep, and false statements about the product

| # | File:line | Current text | Problem | Proposed | Sev |
|---|---|---|---|---|---|
| 106 | js/hub.js:1153; activities/smart6.js:408 | "All done here. Still True? will check in with you in a month." / "Still True? will ask you about this in a month." | Nothing is scheduled, and signed out there's no way to reach the person. | "Come back to Still True? in a month and check in." | High |
| 107 | js/hub.js:479 (sign-up perks) | "**Check-ins.** Still True? emails you when something you planned is due, so the plan gets kept." | No email job exists in this build. | Remove it until it's built, or say "Coming soon: …". | High |
| 108 | activities/compound.js:104; activities/retire.js:265 | "**We don't sell anything.** This site has no product to recommend and no fee attached to what you do next." / "…and we sell nothing." | False. The site sells the course ($9.99/month and up, per the project's website brief), and these same result screens show "See the course ↗" (hub.js:500-502, `wix:true`). | "We don't recommend any provider, fund or product. Your Next Step does offer a paid course, which is separate from this free activity." | High |
| 109 | js/hub.js:1134 | Chip reads "Signed in · [level]" when nobody is signed in | Tells a signed-out user their work is saved to an account. | "Your answers · [level]" (show "Signed in" only when that's true). | Medium |
| 110 | js/hub.js:480, 485 | "When we start working with schools, programs and employers, you'll be first to hear about ones that match…" | A promise about a partner program that doesn't exist yet. It also contradicts apps/yns-profile.js:288, "We only ever use your address to send you your results." | Keep only if it matches the privacy policy, and use one consistent statement in both places. For example: "If we ever work with schools or employers, we'll ask you first." | Medium |
| 111 | js/hub.js:478 | "**The coach.** The AI coach inside Career ABCs works with you the whole way through, rather than once." | The coach has a daily cap ("The AI coach is resting for today…", career-abcs_v2.html:2324). "The whole way through" can't be promised. | "**The coach.** Your coach sessions in Career ABCs remember your work." (only if that's true) | Medium |
| 112 | apps/yns-profile.js:288 | "We only ever use your address to send you your results." | The email-results capture is switched off (`if (false) Quiz.wireEmailForm` in all three prototypes). This appears only once Supabase is configured. | "We use your address to sign you in and save your work." | Medium |
| 113 | activities/why.js:223 | "Yours is at the top of your profile." | Shown whether or not the person is signed in. The results screen (315-319) handles this correctly, but this learn card doesn't. | "Keep it where you'll see it. With an account, it sits at the top of your profile." | Medium |
| 114 | activities/stilltrue.js:227-228 | "The old answer stays in your history with its date…" | In this build there's no database (`onComplete` returns early), so nothing is kept. | "With an account, the old answer stays in your history with its date." | Medium |
| 115 | activities/conversations.js:235-237 | "Any of them will hand you a name inside an hour." | Can't be promised. | "Any of them can usually point you to someone." | Medium |
| 116 | apps/prototype-1:450; prototype-2 (cta block); prototype-3:484 | "Your result is saved." | Saved only in this browser. | "Your result is saved in this browser." | Low |
| 117 | js/hub.js:500; activities/invest.js:214; taxes.js:125; grit.js:201 | "Want the full version of this, with the videos and the AI coach?…" / "The full version of Module 5…" | Promotes the course without saying it's paid. | Add "(paid)" or "part of the paid course". | Low |
| 118 | js/mock-runtime.js:547 | "It goes on your hub until you tick it off." | It goes into the Planner. | "It goes in your Planner until you tick it off." | Low |

### 3D. Are the money figures current for 2026?

- **Verified, correct:** the 401(k)/403(b) employee limit of $24,500 (retire.js:78, 95, 118, 167, 263), the IRA limit of $7,500 (retire.js:118, 128, 149, 170, 258, 263), and the 10% early-withdrawal penalty before 59½ (retire.js:168, 263).
- **Tax brackets:** retire.js:119 says "Most early-career pay lands in the 12% or 22% bracket" with a 37% maximum. That fits the 2026 federal brackets (10/12/22/24/32/35/37). High confidence, no change.
- **Not stated anywhere in the scanned files:** the standard deduction, HSA limits, Roth income phase-out amounts, minimum wage and the Social Security wage base. retire.js:170 says only "high earners get phased out", which is fine.
- **Questionable figures:** the 25–31% "comes out" rule (item 81, medium-high confidence that it's too high for this audience) and the HYSA illustration of $50 per $1,000 (item 86, medium confidence that it's high for 2026). Plain savings at "$5 a year per $1,000" (invest.js:35) and a credit card "at 24%" / "20-something percent" (compound.js:102, 154) look plausible for 2026 (medium confidence). The long-run stock figures (7% and 9–10%) are both defensible as nominal historical figures, but they conflict (item 72).

### Copy finding counts

| Category | High | Medium | Low | Total |
|---|---|---|---|---|
| 1A Assumes stuck, behind or in crisis | 0 | 5 | 16 | 21 |
| 1B Gendered pronoun for the user | 0 | 0 | 1 | 1 |
| 1C Contrast constructions (table) | 0 | 3 | 12 | 15 |
| 1C Contrast constructions (bulleted list, Low) | 0 | 0 | ~55 instances | ~55 |
| 1D genuinely / honestly / straightforward | 0 | 1 | 16 | 17 |
| 1E Third person about the user | 0 | 0 | 0 | 0 |
| 1F lead gen / partners / advertising | 0 | 0 | 0 | 0 |
| 1G Plain words, jargon, shame, US English | 0 | 2 | 9 | 11 |
| 3A Wrong or unlabeled numbers | 4 | 16 | 6 | 26 |
| 3B Advice, or naming a product or employer | 2 | 8 | 4 | 14 |
| 3C Promises and false product statements | 3 | 7 | 3 | 13 |
| **Total (numbered findings)** | **9** | **42** | **67** | **118** |

The bulleted Low contrast instances in 1C are counted separately (about 55) and are not included in the 118. Several numbered rows cover more than one line; the file:line column lists every place each one appears.

---

## 4. Function

**Method.** The app was driven with Playwright and Chromium, served over local http with all outside network blocked. Page and console errors were recorded on the hub and inside every iframe. No repo file was changed.

**Counts.** The five doors hold 27 card slots. Two Conversations appears in Door 2 and in Door 3, so there are **26 unique activities**. That matches the demo bar ("All 26") and the rail heading ("All 26 activities").

- 20 activities play inside the hub.
- 3 are quiz iframes.
- 3 are Career ABCs stages.

**Script errors.** No page or console errors appeared anywhere, including inside the iframes. The only failed requests were:

- the blocked fonts
- `apps/yns-ga.js` (404)
- `/api/coach-status` (404)

### Failures

### F1. The Floor: results screen shows an error instead of results. Severity: High
**Steps to reproduce**
1. Answer the intake.
2. Open Door 4 and play The Floor to the end.
3. The results screen reads "Done. results() threw: money is not a function".

This happened in both variants, and again after deleting and replaying the activity.

**Cause.** `activities/floor.js:285` has `var esc = r.esc, money = r.money;`. That local `var` hides the file's own `money()` helper (line 439). The mock runtime (`js/mock-runtime.js`, `renderResults`, line 535) never passes `r.money`, so `money` is undefined.

**Fix.** In `floor.js`, write `var fmt = r.money || money;` and use `fmt(...)` inside `results`. A different name is needed because a local `var money` would still hide the helper. Alternatively, add `money` to the object built in `renderResults`.


### F2. Three Doors on a phone: the Yes/No buttons are off-screen and Next stays disabled. Severity: High
**Steps to reproduce**
1. Use a 390×844 touch viewport.
2. Answer the intake with "rough idea" and "work that fits".
3. Open Three Doors.

The route table is a sideways-scrolling box (`.am-table`: scrollWidth 515, clientWidth 318). The Yes/No buttons are at x=454–543 on a 390px screen. Nothing on screen shows that the table scrolls sideways. The Next button stays disabled until every row has an answer, so the person looks stuck.

**Cause.** `js/mock-runtime.js`, `M.compare` (lines 517–521) puts the Yes/No column last in a wide table.

**Fix.** On narrow screens, show each route as a stacked card with Yes/No underneath. At minimum, move the Yes/No column first and add a visible "swipe" hint.


### F3. Career ABCs opened directly at 390px scrolls sideways. Severity: Medium
This covers the live app, not the hub iframe.

**Steps to reproduce**
1. Open `apps/career-abcs_v2.html` (also `#a`, `#b`, `#c`) at 390px.
2. `document.documentElement.scrollWidth` is 869.

The overflow comes from the top bar:

- `.appbar-act` ("Coach off", "Your data") ends at x=559.
- `#yns-account-bar .yns-bar--inline` ("← Back ⌂ Home" plus the dots) ends at x=869.

A phone shows the page cut off on the right. Inside the hub iframe (342px wide), the overflow is only 5px (347 vs 342).

**Fix.** Let the app bar wrap (`flex-wrap: wrap`), or hide or stack the inline `yns-bar` below about 480px.


### F4. "Why this door" wrongly says "You said you need a job soon". Severity: Medium
**Steps to reproduce**
1. Answer "I know what I want", then "I feel stuck" (or "work that fits"), then any stage.
2. You land in Get the job, and the box says "You said you need a job soon…". The person never said that.

**Cause.** `js/hub.js`, `route()` (line 205) sends clear+stuck and clear+fit to `get`. `routeReason()` (line 226) has only one `get` sentence, and it assumes `reason==="job"`.

**Fix.** Give `routeReason` its own sentence for clear+stuck and clear+fit, for example "You said you know what you want, so we'll build the thing you'll actually send."

The full 18-combination routing table is in `func/money.json` under `routing`. Every other combination matches the rules in `hub-redesign-notes.md`.

### F5. Picking another door makes the hub say you never answered the questions. Severity: Medium
**Steps to reproduce**
1. Answer the intake. It says "Your starting door · Door 3", with a personal reason.
2. Tap Door 4 in "The other four doors".
3. The panel now says "A good place to start · Door 4 — Why this door: You haven't answered the questions yet…".

**Cause.** `js/hub.js`, `renderGrid` click handler (line 1123) sets `state.skipped=true`. It also permanently replaces the recommended door.

**Fix.** Don't touch `skipped`. Show "You picked this one" when `state.door !== route(state.a)`, and keep a way back to the recommended door.


### F6. Two Conversations: the result never shows the person's own message or name. Severity: Medium
**Steps to reproduce**
1. Play Two Conversations and fill every blank with distinctive words.
2. The result shows only fixed text and the chosen question. None of the typed words appear, and "See my results" shows none either.

The same happened in both variants.

**Cause.** `activities/conversations.js`, `results` (lines 205–256) reads `draft_blanks` only to decide the headline.

**Fix.** Quote `r.extra.draft_text` (the runtime already keeps the assembled message) in a `ya-quote` block, with a copy button.


### F7. The Week It's Hard: the saved note keeps "[name]", "[ten minutes of ___]" and "[day]". Severity: Medium
**Steps to reproduce**
1. Finish Solve It. This stores `able_step`.
2. Play The Week It's Hard.
3. Its "first ten minutes" screen is skipped, and the prefilled note still says "Text [name]. … [ten minutes of ___] … until [day]".
4. If the person saves without editing, those placeholders show on the result, in the Planner ("If it gets hard") and in the hub bubble.

**Cause.** In `activities/bounce.js`, the prefill (lines 211–219) reads only `ex.able_e_text` and never falls back to `facts.able_step`. The name and the day are never asked.

**Fix.** Use `ex.able_e_text || ctx.facts.able_step`. Change "Text [name]" to "Text the person you picked", or ask for the name. Before saving, block or warn if the text still contains `[`.


### F8. A number above a field's cap stays on screen, but the total quietly uses the cap. Severity: Low
**Steps to reproduce**
1. In The Floor, type 999999 in Rent. The field shows 999999, but the total uses the 8,000 cap ($9,335).
2. In What Money Does Over Time, type 999999 monthly. The readout says "from $5000 a month" while the field says 999999.

The same happens in Where Your Paycheck Goes, The Match and Where Money Can Live.

**Cause.** `js/mock-runtime.js`: `typeAmount` (line 178) and `calcType` (line 500) cap the value silently.

**Fix.** Show "up to $X" under the field once capped, and write the capped value back into the field on blur.


### F9. Reopening an activity closed halfway silently skips the questions already answered. Severity: Low
**Steps to reproduce**
1. Close Your Why after two answers. Reopening gives 6 steps instead of 8.
2. Close The Floor after its first two screens. Reopening starts at "What do you think this job pays?", with no costs screen and no explanation.

The card is correctly not marked done (see check 3 below).

**Cause.** In `mock-runtime.js`, `pick` and `submitText` write facts as each answer comes in. On the next `play()`, `resolve()` then drops those questions.

**Fix.** Either say "Picking up where you left off" and let Back revisit the dropped screens, or have `close()` clear the facts written during an unfinished run.

### F10. "Signed in · …" appears when nobody is signed in. Severity: Low
After the intake, the header shows "Signed in · Just starting out" right next to the "Sign in" link.

**Cause.** `js/hub.js:1134`.

**Fix.** Show "Not signed in · Just starting out", or just the level.

### F11. Planner and Portfolio Edit/Delete/Remove links, and the rail "Set aside" links, are small on a phone. Severity: Low
These are about 24–58 × 19 px. The larger buttons and the X can all be reached.

**Fix.** Give `.lnk` a minimum height of 44px, or add padding.

### F12. Smaller issues. Severity: Low
- **No message after closing an in-hub activity early.** Closing with the X shows no "nothing lost" toast, although the iframe apps do show one. `YNSMock.close` never tells the hub.
- **Leftover weekly step.** Deleting a "Further out" line from Your Six Months clears both of its dated lines and resets the activity, but that activity's weekly step stays in the Planner.
- **Possible broken "Do it again" link (not reproduced).** In `hub.js`, `reopen()` (line 459) builds `…html&fresh=1` with no `?` when no level is known. I could not trigger it: finishing a quiz after skipping the intake sets the level first, so the link came out right.
- **Missing files.** `apps/career-abcs_v2.html:692` loads `yns-ga.js`, which is not in the repo (404). Line 2161 calls `/api/coach-status`, which also returns 404.
- **No "Seven days" in the quizzes.** The three quiz iframes have no "Seven days" pick, so nothing from them reaches the Planner. This is a consistency point (Section 2), not a crash.

---

### What passed

#### 1. Every activity, fresh state

Variant A answers: first character, "still figuring it out", "in a program", "just starting out". This opens at Door 1. Choices were always the first option. Each row checks: it opens, every screen advances, the result contains the person's typed words, the "Seven days" pick appears in the Planner, and "See my results" reopens the results.

**Column key**
- **Own words:** the result contains the person's typed words. "n/a" means the activity has no free text.
- **Planner pick:** the "Seven days" pick appears in the Planner.
- **Reopen:** "See my results" reopens the results without asking the questions again.

| Activity | Opens | Advances (screens) | Own words in result | Planner pick | Reopen |
|---|---|---|---|---|---|
| Your Why | ✓ | ✓ (8) | ✓ | ✓ | ✓ |
| Proof | ✓ | ✓ (6) | ✓ | ✓ | ✓ |
| 168 Hours | ✓ | ✓ (3) | n/a | ✓ | ✓ |
| Fixed or Assumed | ✓ | ✓ (11) | n/a | ✓ | ✓ |
| What Kind of Work | ✓ | ✓ (7) | n/a | ✓ | ✓ |
| The Story (iframe) | ✓ | ✓ (6 taps, to results) | n/a | n/a (no "Seven days") | ✓ results; "Do it again" starts fresh |
| A Day In The Life (iframe) | ✓ | ✓ (6) | n/a | n/a | ✓ results; "Do it again" starts fresh |
| Spend Your 100 (iframe) | ✓ | ✓ (2) | n/a | n/a | ✓ results; "Do it again" starts fresh |
| Three Doors | ✓ | ✓ (2) (desktop only, see F2) | n/a | ✓ | ✓ |
| Two Conversations | ✓ | ✓ (3) | **✗ (F6)** | ✓ | ✓ (no typed words) |
| A · What you've already done | ✓ | ✓ (story banked, card marked done) | story shown on reopen | n/a | ✓ |
| B · Put it on paper | ✓ | **Not driven to completion** (opens at #b and renders, no errors) | not tested | n/a | not tested |
| C · Say it out loud | ✓ | **Not driven to completion** (opens at #c and renders, no errors) | not tested | n/a | not tested |
| Bounce Back | ✓ | ✓ (6) | ✓ | ✓ | ✓ |
| Solve It | ✓ | ✓ (10) | ✓ | ✓ | ✓ |
| The Floor | ✓ | ✓ (6) | **✗ result errors (F1)** | ✓ | reopens to the same error |
| Money, Plainly | ✓ | ✓ (6) | typed numbers ✓ | ✓ | ✓ |
| Every Dollar a Job | ✓ | ✓ (5) | typed numbers ✓ | ✓ | ✓ |
| What Money Does Over Time | ✓ | ✓ (4) | typed numbers ✓ | ✓ | ✓ |
| Where Your Paycheck Goes | ✓ | ✓ (4) | typed numbers ✓ | ✓ | ✓ |
| The Match | ✓ | ✓ (6) | typed numbers ✓ | ✓ | ✓ |
| Where Money Can Live | ✓ | ✓ (9) | n/a | ✓ | ✓ |
| The Week It's Hard | ✓ | ✓ (6) | ✓ (but see F7) | ✓ | ✓ |
| Your Six Months | ✓ | ✓ (8) | ✓ | ✓ | ✓ |
| What Might Trip You Up | ✓ | ✓ (5) | n/a | ✓ | ✓ |
| Still True? | ✓ | ✓ (3) | ✓ | ✓ | ✓ |

Every finished card stayed marked done after "See my results" was opened and closed.

#### 2. Different intake answers

Variant B answers: second character and tone 4, "I know what I want", "head or money isn't there", "genuinely experienced". Choices were always the second option. All results match variant A: every activity advanced, the own-words results were the same, the Planner and reopen passed, and there were no errors.

- **Routing.** Variant B lands on Door 4, with a sentence that uses its own stage.
- **Routing table.** All 18 clarity × reason combinations follow the documented rules, except for the wording in F4.
- **Level changes wage bands.** "Just starting out" shows bands like Nursing Assistant $34k–$37k. "Running things already" shows manager bands ($95k–$221k).
- **Quizzes skip the level question when it is known.** With a level, The Story takes 6 taps. After skipping the intake it takes 7, including the level question. That level is then picked up and reused on the next open.
- **Changing answers.** "Change my answers" after progress re-routes to Door 5, updates the level (the quiz URL becomes `?lvl=leader`) and keeps finished work.
- **Not checked for level effects.** Prefilled text in the in-hub activities is driven by earlier activities, not by the intake, so I had no intake-driven prefill to compare.

#### 3. Closing an activity halfway with the header X
The card was **not** marked done in any of these cases:

- Your Why, after 3 screens
- The Floor, after 2 screens
- The Story, after 3 chapters (the "Nothing lost" toast appears, and reopening offers "Pick up where I left off")
- Career ABCs A, opened and closed with no story

#### 4. Finishing The Story, then "See my results"
- "Back to your hub" closes the panel and marks the card done.
- "See my results" opens the results page (the "Back to your hub" button is present and there are no question buttons).
- The direction rail updates ("1 signal: The Story").

#### 5. Portfolio
- I added Riverside Community College (school) and Mercy Health Clinic (company), then set Riverside to Applied. The panel stayed open, the dropdown kept its value and the data updated.
- "Save as PDF" opened no popup and called `window.print()` once.
- `page.pdf` in print mode produced 1 page. `pdftotext` page 1 contains "Riverside Community College · School · Applied" and "Mercy Health Clinic · Company · Looking into it", and no text leaked from the panel behind it. Output: `func/portfolio.pdf`, `func/portfolio-p1.txt`.

#### 6. Deleting a Planner line
Tested on The Floor, Your Why, Money, Plainly, Solve It, and a dated line from Your Six Months.

- The warning names the activity ("Delete this, and start The Floor again?").
- The line disappears and the card is no longer done.
- The facts that activity owns are cleared. For The Floor these are `floor_monthly`, `runway_months` and `floor_gap`.
- Replaying starts at the same first screen, with the same number of steps as the first run.

#### 7. Money fields
I typed character by character into all 53 fields across 7 activities: The Floor, Money, Plainly (2 screens), Every Dollar a Job (income and budget), and the calculators (What Money Does Over Time, Where Your Paycheck Goes, and 2 in The Match), plus the Where Money Can Live calculator.

- After every keystroke, the typed field still had focus (0 losses).
- The total or readout updated live. The sum shown matched the fields added up.
- The +/− buttons still work after typing.
- The only readouts that did not change were fields where I typed the value already in them.
- Exception: F8.

#### 8. 390px screen
No sideways scrolling and nothing off-screen in:

- all four intake screens
- the hub, top bar and demo bar
- nine activity screens (buildup, budget, calc, rate, hours, sort, compose ×2, compare) and their results screens
- the Planner, including inline editing
- the Portfolio, with a 70-character place name
- the sign-up panel
- the iframe panels for Spend Your 100 and The Story

**Exceptions:**
- Three Doors: inner table (F2)
- Career ABCs: F3
- small link targets: F11

---

### What automation could not cover
- **Career ABCs B and C.** I did not produce a resume, cover letter or practice answer, so "done" for B and C, and Door 3's ready state, are **untested**. Stage A was driven to a banked story.
- **Print dialog.** `window.print` was replaced with a stub, and the PDF came from `page.pdf` using the print stylesheet. The real dialog on a phone was not exercised.
- **Real phones.** Touch was emulated in Chromium only; no Safari/iOS check.
- **Budget spreadsheet export.** The CSV export button in Every Dollar a Job was not clicked.
- **Quiz answers.** Only the first and second options were exercised.

### Also noticed (outside the five sections)
- Hub card minutes don't match what the activity says on its own first screen:

| Activity | Card says | First screen says |
|---|---|---|
| Your Why | 2 min | "Five minutes" |
| The Week It's Hard | 5 min | "Eight minutes" |
| Your Six Months | 12 min | "Fifteen minutes" |
| The Match | 6 min | "Ten minutes" |

  Fix: pick one number for each and use it in both places.
- `smart6.js:154` pre-fills from a route called `sideways`, but Three Doors saves it as `lateral`, so that route never pre-fills.
- `README.md:9` still says "13 activities", and `index.html:90` still has a hidden "0 of 17".

---

## 5. Accessibility (quick)

### A1 · High · Activity panels don't take focus, don't keep it, and don't close with Escape
- **Where:** `index.html:144` (`<div id="actModal" role="dialog" aria-modal="true"></div>`), `js/mock-runtime.js:65-83` and `:100`.
- **Verified:**
  - After pressing Enter on a card, focus stays on the card behind the overlay.
  - The next 12 presses of Tab all land on hub cards *behind* the modal.
  - Escape does nothing.
  - After each "Next", focus drops to `<body>`, because `host.innerHTML=h` repaints the panel. A screen reader user hears nothing about the new question.
  - The Planner, Portfolio and account panels (`hub.js:733`, `:920`, `:472`) behave the same way.
  - The iframe panel does move focus into the app.
- **Fix:**
  - When a panel opens, set `document.querySelector(".wrap").inert = true` and turn it off when the panel closes.
  - At the end of `shell()` and `renderResults()`, give the `h2`/`h1` `tabindex="-1"` and focus it.
  - Add a keydown handler: Escape calls `YNSMock.close()` or `YNS.closeList()`.
  - On close, return focus to the card that opened the panel.

### A2 · Medium · The panel has no accessible name
- **What axe reports:** `aria-dialog-name` (serious) on every activity, results, Planner, Portfolio and account screen.
- **Fix:** Render the heading with `id="amTitle"` and set `aria-labelledby="amTitle"` on `#actModal`.

### A3 · Medium · The focus ring is too faint, and on some controls it's missing
- **Where:** `css/hub.css:15` (`--focus:0 0 0 3px rgba(0,87,225,.34)`) and `:27` (`:focus-visible{outline:none;box-shadow:var(--focus)}`).
- **Contrast:** The ring comes out as #A8C6F5 on white, **1.74:1**. It is 1.68:1 on the page background and 1.71:1 on card grey. The minimum is 3:1.
- **Where it disappears entirely (verified):**
  - Door cards: `.dcard` at `hub.css:131` sets its own `box-shadow`.
  - Skin-tone swatches: `.ptone` at `hub.css:171`.
  - The selected character: `hub.css:170`.
- **Fix:** `:focus-visible{outline:3px solid var(--yns-blue);outline-offset:2px}`. An outline doesn't clash with the components' box-shadows.

### A4 · Medium · Form fields without labels
- **`#amText`** (`mock-runtime.js:144`): the question is a `<p class="am-prompt">`, not a label.
  - axe reports it as critical where there is no placeholder: Solve It "Now say it as a question…", Bounce Back "Say it the second way", The Week It's Hard "Write the note to future you", and Your Six Months "Now work backwards from month six".
  - Everywhere else the placeholder is the only name, and it disappears once the box is prefilled or typed in.
- **`#amRange`** (`mock-runtime.js:209`): The Floor's wage-guess slider has no label (axe critical).
- **Collect textarea** (`mock-runtime.js:243`): `<label class="am-note">…</label>` has no `for`.
- **Portfolio:** `#plType` select (`hub.js:909`, axe critical), `#plName` (placeholder only), and the place-status `<select>` (`hub.js:905`) have no labels.
- **Fix:**
  - Give the prompt, or the `h2` when there's no prompt, an `id`, and add `aria-labelledby` to the textarea and the slider.
  - `<label for="amText">`.
  - `aria-label="Type of place"`, `aria-label="Name of the place"`, and `aria-label="Status of <name>"`.

### A5 · Medium · Screen readers can't tell which choice is selected
- **Where:**
  - Rate buttons Yes / Maybe / No (`mock-runtime.js:338`)
  - Three Doors Yes / No (`:520`)
  - Still True? "Still true / Not any more" (`:310`)
  - Tag chips (`:147`)
- **Problem:** The chosen state is only a CSS class (`on`). The repeated "Yes" and "No" buttons also don't say which route they belong to.
- **Fix:** Add `aria-pressed="true|false"`, and `aria-label="Yes, ' + x.t + '"` (likewise for the others). Or wrap each row in `role="radiogroup"` with `aria-label` set to the item text.

### A6 · Medium · The speech bubble keeps interrupting screen readers
- **Where:** `index.html:99` (`<div class="bubble" id="bubble" aria-live="polite">`). It changes every 4.2 s, indefinitely (`hub.js:1021`).
- **Fix:** Remove `aria-live` from the bubble. Announce a new line once, through a visually hidden `role="status"` element, when an activity finishes.

### A7 · Low · Activity cards don't say they're buttons
- **Where:** `hub.js:1062` (`el.style.cursor="pointer"; el.tabIndex=0;`). Screen readers read the card as plain text, and it contains buttons of its own.
- **Fix:** `el.setAttribute("role","button"); el.setAttribute("aria-label", a.name+", "+a.min+" minutes")`. Or make the `h3` text a `<button>` and drop `tabIndex` on the card.

### A8 · Low · Intake loses focus after each pick
- **Where:** Picking a character, tone or option re-renders the whole group (`hub.js:240`, `:248`, `:266`), and focus drops to `<body>` (verified).
- **After "Next":** Focus is also on `<body>`, so the next Tab starts at the logo and goes through 7 top-bar and demo-bar stops before reaching the options.
- **Radios:** `role="radio"` buttons have no arrow-key support.
- **Fix:**
  - After re-rendering, refocus `host.querySelector('[aria-checked="true"]')`.
  - In `showQ()`, focus the new question's `h2` (`tabindex="-1"`).
  - Longer term, use native `<input type="radio">`.

### A9 · Low · Controls with vague names
- **Character options** (`hub.js:239`): `aria-label` is "Character option 1/2/3", even though `BODIES[].t` already has "Feminine / Masculine / Either / neither".
  - Fix: `'Character: '+o.t`.
- **Day buttons** in 168 Hours (`mock-runtime.js:265`): named only "−" and "+".
  - Fix: `aria-label="One fewer day for '+esc(row.t)+'"` and the matching "One more day" label.
- **Money and calculator steppers** (`mock-runtime.js:166,168,444,446`): `aria-label="less"` / `"more"` without the row name.
  - Fix: `aria-label="Less for '+esc(row.t)+'"`.
- **Planner tick box** (`hub.js:721`): `aria-label="Done"`.
  - Fix: `aria-label="Mark done: '+s.text+'"`.
- **Three Doors table** (`mock-runtime.js:519`): the last column header `<th></th>` is empty (axe minor).
  - Fix: `<th><span class="sr-only">Could you start this?</span></th>`.

### A10 · Low · Page structure
- `index.html:89`: `<div class="art" id="avatarArt" aria-label="Your character">`. `aria-label` isn't allowed on a div with no role (axe serious), so screen readers ignore it.
  - Fix: add `role="img"`.
- There is no `<main>` landmark (axe moderate).
  - Fix: wrap `.intake` and `.hub__main` in `<main>`.
- The footer links "Your data", "Privacy" and "Terms" (`index.html:137-140`) are `href="#"`.

### What passed (Section 5)

| Check | Result |
|---|---|
| Intake: every control reachable by Tab and usable with Enter/Space (character, tone, 3 questions, Next/Back, "I'd rather just look around") | Pass |
| One activity (What Kind of Work) finished by keyboard alone, including the Seven days pick with Enter, back on the hub | Pass |
| Nowhere does focus get stuck | Pass (the problem is the reverse, see A1) |
| Images: logo `alt="Your Next Step"`; banners, avatar portraits and preview `alt=""` (decorative, with captions next to them); cartoon SVG `aria-hidden` | Pass |
| Buttons with visible text or a name: panel close buttons "Close" / "Back to your hub", collect "Remove", intake radios | Pass (vague names in A9) |
| Account screen fields wrapped in `<label>` | Pass |
| Text contrast : ink on page 13.0; muted #5B6478 on page 4.77, on white 5.93, on card grey 5.48, on tint 5.29, on done-green 5.28; white on blue button 6.09; link/ghost blue 6.57 on white, 5.29 on page; demo-strip gold 5.78; success green 4.73 | Pass (all ≥ 4.5) |
| axe on intake screens | Clean |
| Career ABCs start screens: focus moves to the first button, visible 2px solid outline, Enter works throughout | Pass |
| Career ABCs story builder ("Add your first story"): focus goes to the first field, Tab stays inside the dialog (8 stops), Escape closes it and returns focus to the button that opened it; all fields labelled; axe only `heading-order` (moderate) | Pass |

Notes on the Career ABCs checks:
- The axe `color-contrast` warning on the ABCs "Coach off" / "Your data" chips is a false positive. Their real background is the blue app bar (#0057E1), not the grey axe measured.
- The ABCs inputs use the same faint 0.34-alpha focus ring as the hub (A3 applies there too).
- After the start screens close, focus lands on `<body>` (minor).

---

## 6. What was left alone

The audit changed no files. It also didn't review or propose rewrites for the activities' content beyond the voice and honesty standard, the weights table in `interests.js`, or the `FIT` map. `apps/career-abcs_v2.html` had its own quality pass on September 15 (see `docs/career-abcs-integration.md`, rows 13–21). Here it was only read, searched and played.

---

## Ten things to fix, in the order a first-time user on a phone at 11pm would feel them

1. **The Floor crashes and shows made-up pay.** It's the core money activity, and the result screen says "results() threw". Fix the one-word bug and load the real wage file. (C1, F1, 3A #66–68)
2. **Three Doors can't be finished on a phone.** The Yes/No buttons sit off the right edge. Stack the routes as cards on narrow screens. (F2)
3. **Stop promising check-ins that don't exist.** "Still True? will check in with you" and "emails you" need to go until they're built. (3C #106–107)
4. **Say plainly that the course is paid.** Remove "we don't sell anything" from two money screens. (3C #108, #117)
5. **Stop asking experience twice.** Pass the hub's answer into Career ABCs. (C2)
6. **Money screens should only describe the options.** Rewrite "put in at least that much", "the next move is a Roth IRA" and "starting with the minimum payments", and drop the employer names. (3B)
7. **Make the "why this door" sentence true.** Also keep the person's answers when they pick a different door. (F4, F5)
8. **Give every activity a "Seven days" step.** Six cards currently send nothing to the Planner, and The Week It's Hard saves "[name]" placeholders. (C3, F7)
9. **Fix focus in the activity panels.** Focus should move into the panel, Escape should close it, and focus should return to the card, so keyboard and screen-reader users can follow. (A1–A4)
10. **Add the founder card and simple analytics.** These are the two strategy goals the app doesn't touch yet. (S6, S12)
