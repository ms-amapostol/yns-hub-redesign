# Funnel events — handoff for Delante

**Status:** built in `js/hub.js` (build v22). **Nothing is sent anywhere until you
define `window.YNS_TRACK`.** Until then the events stay in the page.

## How it works

Every event goes through one function, `YNS.track(event, props)`. It never
throws, and for each event it does three things:

1. Pushes `{ event, props, at }` onto `window.ynsEvents`. `at` is an ISO
   timestamp. The list keeps the last 200 events.
2. Calls `window.YNS_TRACK(event, props)` if that function exists. This is your
   hook. If it throws, the hub ignores the error and carries on.
3. Dispatches `new CustomEvent("yns:track", { detail: { event, props, at } })`
   on `window`, for code that prefers to listen for an event.

It makes no network calls of its own.

**Privacy rule:** props never carry names, emails or anything the person typed.
They carry slugs, door keys, intake option keys, numbers and booleans only.
String values are trimmed to 80 characters as a backstop.

## The events

Door keys: `know`, `explore`, `get`, `mind`, `plan`. Activity slugs are the keys
of `ACTS` in `js/hub.js`, for example `why`, `floor`, `abcs_a`, `cyoa`.

| Event | Props | What it means | Where it fires |
|---|---|---|---|
| `intake_done` | `clarity`, `reason`, `level`, `door` | The person answered the three questions. `door` is the door their answers point to. Also fires after "Retake the three questions". | `YNS.next()` on the last question |
| `intake_skipped` | none | The person chose "I'd rather just look around". | `YNS.skip()` |
| `door_open` | `door`, `recommended` (boolean) | The main door panel changed. `recommended` is true when it's the door the answers point to (Door 1 when there are no answers). Fires once per change, including the first door after the intake. | `setDoor()`: the intake, the door cards, "Your answers pointed to…" links, and `YNS.open()` when it switches door |
| `activity_start` | `slug`, `door`, `kind` (`"hub"` or `"app"`) | An activity was opened to be done. `hub` means it plays inside the hub panel. `app` means a framed page: the three quizzes or Career ABCs. Includes "Do it again" and "Bring it in". "See my results" doesn't count. | `openActivity()`, `reopen()`, the Career ABCs upload button |
| `activity_done` | `slug`, `minutes_on_card` | The activity was finished. `minutes_on_card` is the time since `activity_start`, to one decimal place. | Hub activities: the finish hook. Framed apps: the app's `run` message, or the close after a new run. Career ABCs: the close after a stage newly counts as done. |
| `activity_closed_early` | `slug` | The panel closed before the activity was finished. | `YNS.activityClosed()` (hub activities), `YNS.closeApp()` (framed apps) |
| `seven_days_pick` | `slug` | The person picked a "Seven days" step, which goes onto their Planner. "Skip for now" sends nothing. | `finish()` in `js/mock-runtime.js`; `YNS.pickSeven()` for the framed apps |
| `checkin_shown` | `kind` (`"week"`, `"month"` or `"save"`) | A pop-up appeared. `week`: a Planner step is 7+ days old. `month`: Still True? is due. `save`: the once-per-visit "Save your progress, free". | `popup()` inside `afterFinish()` |
| `checkin_action` | `kind`, `action` | What the person did with the pop-up. Week: `did_it`, `still_on_it`, `change_it`. Month: `check_in_now`, `later`. Save: `save_it`, `not_now`. Any kind: `dismiss` (× or Escape). | The pop-up buttons, `YNS.closePopup()` |
| `signup_open` | `from` (`"top_bar"`, `"save_popup"` or `"other"`) | The sign-up panel opened. | `YNS.signup(from)` |
| `course_click` | `from` (an activity slug, or `"all_doors"`) | The person clicked "Take a look at the course". A slug means the card at the end of a money activity. `all_doors` means the card shown once all five doors are done. Fires before the new tab opens. | `onclick` on the course card link (`wixCard()`) |
| `planner_open` | none | The Planner panel opened. Repaints while it's open (ticking, editing, deleting) don't count. | `YNS.planner()` |
| `portfolio_open` | none | The Portfolio panel opened. Repaints (adding a place, the zip code) don't count. | `YNS.profile()` |
| `portfolio_pdf` | none | The person pressed "Save as PDF", which opens the print dialog. | `YNS.portfolio()` |
| `settings_open` | none | The person opened Settings. | `YNS.settings()` |
| `reset` | none | The person confirmed "Start over" in Settings. Everything on the device is cleared. | `YNS.confirmReset()` |

## Plugging it in

Define the hook before or after `js/hub.js` loads, since the hub looks for it
each time an event fires. Two examples:

```html
<script>
  /* GA4: gtag is already on the page */
  window.YNS_TRACK = function (event, props) {
    gtag("event", event, props);
  };
</script>
```

```html
<script>
  /* Supabase: an `events` table with columns event text, props jsonb, at timestamptz */
  window.YNS_TRACK = function (event, props) {
    supabase.from("events").insert({ event: event, props: props, at: new Date().toISOString() })
      .then(function (r) { if (r.error) console.warn("yns event", r.error.message); });
  };
</script>
```

To do both, call both inside the one function. To look at events while
testing, open the console and read `window.ynsEvents`, or run:

```js
window.addEventListener("yns:track", function (e) { console.log(e.detail); });
```

## Related

- `Quiz.init("hub", { chrome: false, track: false })` in `index.html` no longer
  logs a stray `start` event for an activity called "hub". The `track: false`
  option is new in `vendor/quiz-shared.js`. The quiz pages themselves still log
  their own `start`.
- `yns-ga.js` (your file, loaded by `apps/career-abcs_v2.html`) is still
  missing from this build, so that page shows a 404 for it. This hook doesn't
  need it.
