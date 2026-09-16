# Signup screen — handoff for Matt

**Status:** the screen exists in the review build as a mock. `YNS.signup()` in
`js/hub.js` renders it; the "Make my free account" button is disabled on purpose.
This doc is what it needs from Supabase.

## The screen

Opens from "Sign in or join free" in the top bar, and from one small "Save your
progress, free" pop-up that appears once per visit, after the person finishes
their first activity. Never on arrival, never more than once unprompted. The
headline reads "That's your next step. Save it, free." when a next-step sentence
exists, and "Save your progress with a free account." otherwise.

Four perks, in this order: it saves · the coach (an account perk) · check-ins
that follow you · first to hear. The check-ins perk says weekly check-ins already show on the page
(on-screen pop-ups, built in `js/hub.js`, `afterFinish`), that an account brings
them back on any device, and that email reminders are on the way. **Email
reminders are a future build:** when they ship, send the same two check-ins the
page shows (a Planner step 7+ days old; Still True? 28 days after Your Six
Months), using `steps_open[].at`, `nudgedAt`, `smart_set_at` and `stilltrue_at`.
Then email, password, one unticked consent box, and the terms line.

## Consent — approved wording, do not edit without Anastasia

Approved September 16, 2026 (build v22).

Checkbox label (starts unticked):
> Yes, tell me when there's an opportunity that fits. I can turn this off any time.

Perk copy it sits under ("First to hear"):
> When we start working with schools, programs and employers, you can choose to
> hear about ones that match what you've told us. We ask you first, every time,
> and you can turn it off any time.

Terms line (the privacy sentence):
> By making an account you agree to the terms and the privacy policy. We use
> your email to sign you in and save your work. If we ever work with schools,
> programs or employers, we'll ask you first, every time.

Coach perk:
> The AI coach in Career ABCs, with a free account: help with your stories, your
> resume and your interview answers.

**Three things that make this hold up as consent:** the box starts unticked,
it is separate from the terms agreement, and the privacy policy has to say the
same thing in plain words.

**Wix edit needed:** the privacy policy on yournextstepai.com must carry the same
privacy sentence, word for word: "We use your email to sign you in and save your
work. If we ever work with schools, programs or employers, we'll ask you first,
every time." The profile screen (`apps/yns-profile.js`) uses the same sentence.

## What to store

| Field | Type | Notes |
|---|---|---|
| `email`, password | Supabase auth | standard |
| `partner_optin` | boolean | the checkbox. Default false. Must be changeable from the account page |
| `partner_optin_at` | timestamp | when it was ticked, for the record |
| `org` | text, nullable | from `?org=` on the URL if present (OMD cohort tagging, later) |
| `level`, `enrolled`, intake answers | from `state.a` / `state.facts` | so the profile survives the browser |
| `facts` | jsonb | the whole facts object: direction evidence, plan, places, steps_open, budget |

`facts.places` is the list of schools/programs/companies the person is looking
at, with a status each. Aggregated across accounts it is the partner list.

## What the account unlocks, and where

| Perk | Where it's wired |
|---|---|
| Saving | `src/shell/storage.js` in Career ABCs has a `remoteDriver` stub; the hub keeps everything in `state` and `facts` |
| The coach | `netlify/functions/coach.mjs`: check the Supabase JWT, swap the global daily cap for a per-user one |
| Check-ins | Still True? writes `steps_open` with dates; an email job reads them |
| First to hear | `partner_optin` — nothing sends anything yet. There are no partners |

## Tracking

Opening this screen fires `signup_open` with `from` (`top_bar` or
`save_popup`). See `docs/analytics-events.md`. Nothing is sent until the live
site defines `window.YNS_TRACK`.

## Not in this build

Password reset, magic links, social sign-in, the account settings page. The
mock shows the words and the order; the plumbing is yours.
