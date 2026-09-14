# YNS hub avatar — Nano Banana, the short version

**Three prompts. Three images. Then a five-second script slices them into the 15 files the mock expects.**

Nano Banana is good at contact sheets, so instead of 15 separate portraits you ask for one sheet per body type with the five skin tones in a row. Same character five times, tone shifting left to right. That also fixes the consistency problem for free, because all five come out of one generation.

File names the mock looks for: `avatars/<body>-<tone>.png`, body = `f` `m` `n`, tone = `1`–`5`. Any missing file falls back to the built-in cartoon.

---

## Prompt 1 of 3 (feminine)

> A single image containing five flat cartoon portraits in a horizontal row, evenly spaced, each in its own circle. Friendly modern-app illustration style, like emoji people with more character. All five are the SAME person, same pose, same expression, same clothes, same hairstyle. Head and shoulders, three-quarter view, calm warm half-smile, age reads early twenties. Feminine presentation: shoulder-length hair pulled back loosely with a few strands out, soft jawline. Plain crewneck top in bright blue #0057E1 with a tiny gold #E1CC00 square pin at the collar. Each portrait sits on a solid circle in warm light grey #E8E6E6. Left to right, only the skin tone and hair color change: light skin #F7D7C4 with dark blonde hair; medium-light #E8B894 with brown hair; medium #C68B5C with dark brown hair; medium-dark #9A5F3A with black hair; dark #5C3A21 with black hair. Natural hair texture appropriate to each tone. Simple geometric shapes, soft rounded edges, minimal shading, no outlines, no gradients, no text, no glasses, no jewelry other than the pin. Wide image, 2560×512, transparent background outside the circles.

## Prompt 2 of 3 (masculine)

> Same as above, masculine presentation: short cropped hair, slightly squarer jaw, thicker eyebrows, short neat sideburns. Everything else identical, including the five tones left to right.

## Prompt 3 of 3 (either / neither)

> Same as above, androgynous presentation that reads as neither clearly male nor female: medium-short textured hair swept to one side, balanced jaw, medium eyebrows. Everything else identical, including the five tones left to right.

If prompt 2 or 3 drifts in style, attach the prompt-1 output as a reference image and add "match this sheet's style exactly."

---

## Slicing the sheets (one command)

Save them as `f.png`, `m.png`, `n.png`, then:

```bash
pip install pillow
python3 -c "
from PIL import Image
for b in 'fmn':
    im=Image.open(f'{b}.png'); w=im.width//5
    for i in range(5): im.crop((i*w,0,(i+1)*w,im.height)).save(f'avatars/{b}-{i+1}.png')
"
```

Delante can do this, or send me the three sheets and I'll slice and hand back the folder.

---

## If even three is too many

One prompt: ask for a 3×5 grid (rows = feminine / masculine / either-neither, columns = the five tones) in a 2560×1536 image. Quality drops a little because each face is smaller, and style drift between rows is more likely, so I'd try the three-sheet version first. The slicing script changes to a two-loop crop.

---

## Reference: the full per-image version (only if the sheets don't work)

Everything below is the long way, kept for fallback.

### Style lock

> Flat cartoon portrait in a friendly modern-app illustration style, similar in spirit to emoji people but with more character. Head and shoulders, three-quarter view, centered, looking slightly toward the viewer with a calm, warm half-smile. Simple geometric shapes, soft rounded edges, minimal shading, no outlines, no gradients, no texture. Plain crewneck top in bright blue #0057E1 with a tiny gold #E1CC00 square pin at the collar. Solid background circle in warm light grey #E8E6E6 on a transparent canvas. Square, 1024×1024. No text, no logo, no accessories, no jewelry, no glasses. Age reads early twenties.

Generate the first image, then use it as the reference for every other one with "keep the exact framing, style, top, pin, and background; change only the things named below."

---

## The three body types

| Code | Add to the style lock |
|---|---|
| `f` | Feminine presentation. Shoulder-length hair pulled back loosely with a few strands out, soft jawline, slightly larger eyes. Natural hair texture appropriate to the skin tone. |
| `m` | Masculine presentation. Short cropped hair, slightly squarer jaw, thicker eyebrows, short neat sideburns. Natural hair texture appropriate to the skin tone. |
| `n` | Androgynous presentation, read as neither clearly male nor female. Medium-short textured hair swept to one side, balanced jaw, medium eyebrows. Natural hair texture appropriate to the skin tone. |

## The five skin tones (emoji modifier order)

| Code | Add to the style lock | Hair |
|---|---|---|
| `1` | Light skin, close to #F7D7C4, with a faint warm blush on the cheeks. | Dark blonde or light brown |
| `2` | Medium-light skin, close to #E8B894. | Brown |
| `3` | Medium skin, close to #C68B5C. | Dark brown, wavy |
| `4` | Medium-dark skin, close to #9A5F3A. | Black, coily or braided back |
| `5` | Dark skin, close to #5C3A21, with a subtle warm highlight on the forehead. | Black, short coils |

Hair color is a suggestion for coherence. If a combination reads as a stereotype rather than a person, change it. The test is: would Michaela pick this and think "close enough, that's me."

---

## Generation order (18 prompts, 15 keepers)

1. **Master:** style lock + `f` + tone `3`. Iterate until the style is right. This is the reference for everything else.
2. **Body variants at tone 3:** `m-3`, `n-3` as edits of the master. Now you have three references.
3. **Tone sweep:** for each body reference, four edits changing only skin tone and hair per the tone table. That's `f-1 f-2 f-4 f-5`, `m-1 m-2 m-4 m-5`, `n-1 n-2 n-4 n-5`.

Sample full prompt for `m-4`:

> [style lock] Masculine presentation. Short cropped hair, slightly squarer jaw, thicker eyebrows, short neat sideburns. Medium-dark skin, close to #9A5F3A. Black coily hair, cropped short. Keep the exact framing, style, blue top, gold pin and grey background circle from the reference image; change only the face, skin tone and hair.

---

## Optional: door-complete celebration

One edit of any image, used as an overlay state when a door is finished:

> Same image. Add a thin gold #E1CC00 ring just inside the edge of the grey background circle. Nothing else changes.

The mock already draws this ring in CSS at stage 6, so this is only needed if you want it baked into the art.

---

## Speech bubble copy rules (for the real build)

The bubble rotates through facts the profile actually holds. Each fact key gets one fixed lead-in; the quote after it is the person's own words, never ours.

| Fact key | Lead-in |
|---|---|
| `why_statement` | The reason I'm doing this: |
| `why_who` | This is mostly for: |
| `strengths` | Something I'm good at: |
| `top_category` | Work that fits me: |
| `value_ranking` | What I'd pay for in a job: |
| `floor_monthly` | My number: |
| `route_preference` | My route in: |
| `setback_response` | The last time it went wrong: |
| `hard_week_plan` | My plan for the hard week: |
| `money_gap` | Money, plainly: |
| `smart_goal` | My next six months: |
| `premortem_risk` | What might trip me up: |

Empty state: *"I don't know much about you yet. Finish one activity and I'll start saying it back to you."*
Rotation: every 4 seconds, newest fact shown first after an activity completes, dots underneath so it reads as a carousel rather than a random pop-up.
