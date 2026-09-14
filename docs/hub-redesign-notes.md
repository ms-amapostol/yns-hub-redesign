# apps.yournextstepai.com — hub redesign notes

Companion to `yns-hub-redesign.html`. September 2026. Mock only, nothing deployed.

---

## What changed and why

| Today | Proposed | Why |
|---|---|---|
| Lands on a headline and a grid of 13 cards | Lands on three questions, then a single recommended door | The page has a goal now: get Michaela to the right first step. A grid asks her to already know. |
| Four filter buttons (Explore / Narrow / Prepare / Check in) | Five doors, each a stage of her journey | Filters describe activities. Doors describe her. |
| Progress = a done list | Progress = a picture of her that fills in, one piece per activity | The reward is seeing herself come into focus, which is the brand thesis made visible. |
| Same copy for everyone | The "why this door" line rewrites itself from her answers | She should feel the page read what she said. |

Everything else is kept on purpose: the brand tokens, Space Grotesk 400 headings, the blue-deep section-heading rhythm, the sticky rail on wide screens, the warm grey page, the existing 13 live activities and their exact names and taglines.

---

## The three questions

| Question | Options | Stored as |
|---|---|---|
| Do you know what you want yet? | Still figuring it out / I have a rough idea / I know what I want | `clarity`: none · rough · clear |
| What brought you here right now? | Stuck and done standing still / Want work that fits me / Need a job, soon / Know the direction, head or money isn't there / Ready to commit to a plan | `reason`: stuck · fit · job · mindset · plan |
| Where are you with work? | Never had a job / A few part-time or short jobs / In a job now / Years in, thinking of switching | `stage`: never · some · now · switch |

Skip is a quiet text link, never a button competing with Next. Same rule as Career ABCs intake.

---

## Routing rules (ordered, first match wins)

```
reason == job                       → Door 3  Get the job
reason == plan  and clarity == clear → Door 5  Make the plan
reason == mindset                    → Door 4  Mindset and money
clarity == none                      → Door 1  Get to know you
clarity == rough                     → Door 2  Explore what's out there
clarity == clear                     → Door 3  Get the job
skipped                              → Door 1, with a note that answering will point her somewhere better
```

`stage` never changes the door. It changes the sentence in the "why this door" box and, later, which Career ABCs persona she lands on. That keeps the door count at five and the logic arguable in one screen.

Two edge cases worth a decision:
- `clarity == none` + `reason == job`: she needs work and doesn't know what she wants. Rule sends her to Door 3 because the deadline wins. Door 1 is one tap away.
- `clarity == rough` + `reason == plan`: she wants a plan for something she hasn't chosen. Rule sends her to Door 2. Door 5's first activity could say "pick the field first" and link back.

---

## The five doors and what's in them

| Door | Activities (live) | Activities (proposed, marked Coming soon in mock) |
|---|---|---|
| 1 Get to know you | Your Why · Proof · 168 Hours · Fixed or Assumed | — |
| 2 Explore what's out there | The Story · A Day In The Life · Spend Your 100 · Three Doors · Two Conversations | — |
| 3 Get the job | Career ABCs · Two Conversations | — |
| 4 Mindset and money | The Floor | Bounce Back · The Week It's Hard · Money, Plainly |
| 5 Make the plan | What Might Trip You Up · Still True? | Your Six Months (SMART goal) |

Door 4 is Module 4 + Module 5 of the curriculum, app-ised. Door 5 is Module 6. Those four proposed activities are the build backlog this redesign creates.

Two Conversations appears in two doors on purpose. An activity can belong to more than one door; the door is a lens, not a folder.

---

## The avatar

**Mechanic in the mock:** a 12×12 pixel mosaic of a head and shoulders, 17 tiles, one per activity. Untaken tiles are a pale blue ghost; taken tiles resolve to their real colour. Completing every activity in a door turns that door's tiles gold on the staircase in the rail. Percent badge and caption change at 0 / 1–3 / 4–8 / 9–16 / 17.

**For production, swap the mosaic for real art.** Options, cheapest first:

1. **Keep the pixel mosaic, hand-drawn.** On brand (it's the logo's staircase pixels), no photography, no representation problem, no image generation. One SVG. My pick for v1.
2. **Six illustrated stages of one character, resolving from sketch to full colour.** Warmer, better for TikTok screenshots. Needs Nano Banana and a decision about who the character looks like.
3. **Her own photo, unblurring.** Highest emotional payoff, highest friction (upload, consent, storage). Phase 2 at the earliest.

### Nano Banana prompts for option 2

Generate the final stage first, then ask for the earlier stages as edits of it so the character stays consistent.

**Stage 6 (complete) — generate this first**
> Flat vector illustration, portrait of a young woman in her early twenties, head and shoulders, three-quarter view, gentle confident half-smile, natural hair pulled back, plain crewneck top in bright blue #0057E1. Background is a solid circle in warm light grey #E8E6E6. Style: clean geometric shapes, minimal shading, no outlines, in the spirit of a modern app illustration. Colour palette limited to #0057E1, #2859B6, #14203A, #E1CC00, warm skin tones, white. No text, no logo, square 1024×1024, centred.

**Stage 5**
> Edit: keep the exact same character, pose and framing. Remove the gold accent and simplify the top to a flat mid blue #2859B6. Slightly reduce facial detail: eyes and mouth become simple shapes, no highlights.

**Stage 4**
> Edit: same character and framing. Render the figure as a coloured paper-cut silhouette with only three tones: skin, hair, top. No facial features. Background unchanged.

**Stage 3**
> Edit: same silhouette and framing. Fill the figure with a coarse pixel mosaic, about 12 blocks across, using #DCE5F7 and #EEF2FB only, with roughly half the blocks in the correct final colour so the shape is recognisable as a person.

**Stage 2**
> Edit: same framing. Pixel mosaic silhouette, all blocks in #DCE5F7 and #EEF2FB, no final colours. Very faint, barely a person.

**Stage 1 (empty)**
> Edit: same framing. Only the warm grey circle background with a single faint dotted outline where the head and shoulders will be, in #D5DAE3.

**If you want the male variant too** (so the hub can offer a choice or randomise), rerun Stage 6 with "young man in his early twenties, short natural hair, plain crewneck top" and repeat the edit chain.

**Prompts for a Door-complete moment** (optional, for a celebration state)
> Edit Stage 6: add a small gold #E1CC00 pixel-staircase pin on the collar, five ascending blocks. Nothing else changes.

### Wiring the stages
17 activities, 6 stages. Stage = `1 + floor(done / 17 * 5)`, so stage 6 lands on the 17th. If activities are added later the formula still holds.

---

## Open decisions for Anastasia

1. Routing edge cases above (none+job, rough+plan).
2. Avatar option 1, 2 or 3 for v1.
3. Do the three questions replace the existing welcome tour, or sit after it? (Recommend replace. Two onboarding steps is one too many.)
4. Names for the four proposed activities. The mock's names are placeholders.
5. Does the hub remember answers server-side (Supabase profile) or locally like today? Server-side is what makes "Change my answers" meaningful across devices, and it's also the education-intent lead signal the team wanted.
