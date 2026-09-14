# New fact keys — one migration

Add to `fact_keys`. Half-lives follow the existing convention: free text never expires, closed vocabulary expires on a timer.

| Key | Type | Written by | Half-life | Conditionable |
|---|---|---|---|---|
| `mindset_lean` | string enum: growth · mixed · fixed | Bounce Back | 270d | yes |
| `setback_story` | string (free) | Bounce Back | never | no |
| `setback_response` | string enum: pushed · pivoted · asked · paused · froze | Bounce Back | 270d | yes |
| `setback_reframe` | string (free) | Bounce Back | never | no |
| `hard_week_signal` | string enum: avoid · tired · doubt · snap · hide | The Week It's Hard | 365d | yes |
| `hard_week_person` | string enum: yes · maybe · no | The Week It's Hard | 180d | yes |
| `able_problem` / `able_options` / `able_step` | string (free) | The Week It's Hard | 30d | no |
| `able_pick` | string enum: first · second · third · none | The Week It's Hard | 30d | yes |
| `hard_week_plan` | string (free) | The Week It's Hard | never | no |
| `money_in` | number | Money, Plainly | 180d | yes |
| `money_fixed` | number | Money, Plainly | 180d | yes |
| `money_gap` | string enum: room · tight · short · unsure | Money, Plainly | 180d | yes |
| `vision_line` | string (free) | Your Six Months | never | no |
| `smart_goal` | string (free) | Your Six Months | never | no |
| `smart_measure` | string (free) | Your Six Months | never | no |
| `smart_confidence` | string enum: likely · stretch · big · small | Your Six Months | 180d | yes |
| `smart_why` | string (free) | Your Six Months | never | no |
| `smart_first_step` | string (free) | Your Six Months | 7d | no |
| `smart_months` | string (free) | Your Six Months | 180d | no |

Notes for Delante
- `money101` reads `floor_monthly` on rung 1 of its `fixed` slot and skips the buildup with a learn card. That is the only cross-activity read that changes structure; everything else is quote-back only.
- `smart6` reads `route_preference` and `why_statement` for prefill and quote-back. Both have plain fallbacks.
- `bounce` reads `why_statement` on its close card only.
- `grit` rung 1 reads its own `setback_response` to ask "same as last time?" — the one deliberate re-ask, framed as a comparison, per the spec's reflection rule.
- Every file passed `YNSActivity.define()` under a stub with the expected slot counts. They have NOT been run against the live runtime. Run `YNSActivity.validate()` and the readability and referents scripts before shipping.
