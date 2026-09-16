/* =====================================================================
   Still True? — the check-in that can lower the number.

   Outcome: "I know what's changed since last time, and whether my
   direction still holds."

   The only activity in the `reflect` purpose, and the only one whose
   content IS the person. It cannot exist for a signed-out first-timer —
   not because it is withheld, but because a diff against nothing is a
   blank page. That is a natural prerequisite, and the reason is printed
   on the card.

   Two things this deliberately does that are unusual:

   * It shows stale facts first. A fact past its half-life is still
     stored and still shown — it just stopped being trusted for ladder
     resolution. This is where it surfaces, which is the whole point of
     having a half-life rather than an expiry.

   * It writes a `reflection`, not just facts. Reflections are
     append-only — no update, no delete, in the client or in RLS — so the
     history stays truthful even when the person changes their mind.
     A reflection is an event; a fact is state. Both get written here.

   And it is allowed to make things worse. Confidence weighs agreement
   between activities and decays with age; a check-in that says "no, none
   of that is true any more" should pull the number down. A meter that
   only rises is a progress bar wearing a lab coat.
   ===================================================================== */
(function () {
"use strict";

var LEVEL_WORDS = {
  early: "just starting out", some: "a couple of years in",
  experienced: "experienced", leader: "running things already"
};

var VALUE_WORDS = {
  pay: "pay ceiling", flex: "flexibility and time", impact: "impact on people",
  stable: "stability", growth: "growth", craft: "craft and mastery"
};

/* Plain words for the stored keys, taken from the option text in
   168 Hours (time_protected) and Three Doors (route_blocker). */
var PROTECT_WORDS = {
  evenings: "your evenings with the people you live with",
  weekends: "your weekends",
  sleep: "sleep",
  own_time: "the one thing you do that\u2019s yours"
};

var BLOCKER_WORDS = {
  money: "the money",
  time: "the time",
  unclear: "not knowing what the first step is",
  entry: "getting accepted",
  confidence: "whether you could do it"
};

function plain(k) { return String(k).replace(/_/g, " "); }

function when(days) {
  if (days == null) return "";
  if (days < 1) return "today";
  if (days < 14) return Math.round(days) + " days ago";
  if (days < 60) return Math.round(days / 7) + " weeks ago";
  return Math.round(days / 30) + " months ago";
}

/* Build the comparison rows from whatever this person actually has.
   Stale facts come first — they are the ones most likely to have moved,
   and surfacing them is the reason half-lives exist. */
function buildRows(ctx) {
  var T = window.YNSTaxonomy;
  var rows = [];
  var seen = {};

  function add(key, label, value) {
    if (!value || seen[key]) return;
    seen[key] = 1;
    rows.push({ key: key, label: label, then: value, when: when(ctx.factAge[key]) });
  }

  /* Stale first. */
  if (ctx.stale.floor_monthly) add("floor_monthly", "Your monthly floor was", "$" + Math.round(ctx.stale.floor_monthly).toLocaleString("en-US"));
  if (ctx.stale.level) add("level", "You said you were", LEVEL_WORDS[ctx.stale.level] || ctx.stale.level);

  /* Then current. */
  if (ctx.derived.level) add("level", "You said you were", LEVEL_WORDS[ctx.derived.level] || ctx.derived.level);
  if (ctx.derived.top_category) {
    add("top_category", "Your answers kept pointing at",
      (T && T.label(ctx.derived.top_category)) || ctx.derived.top_category);
  }
  if (ctx.facts.floor_monthly) add("floor_monthly", "Your monthly floor was", "$" + Math.round(ctx.facts.floor_monthly).toLocaleString("en-US"));
  if (ctx.facts.why_statement) add("why_statement", "You said your reason was", String(ctx.facts.why_statement));
  var tp = ctx.facts.time_protected;
  if (tp === "flexible") add("time_protected", "You said your time was", "mostly up for grabs, for the right job");
  else if (tp) add("time_protected", "You said you would not give up", PROTECT_WORDS[tp] || plain(tp));
  var rb = ctx.facts.route_blocker;
  if (rb && rb !== "none") add("route_blocker", "What was blocking you was", BLOCKER_WORDS[rb] || plain(rb));
  /* Open steps, not the retired next_action scalar. Two at most: this is
     a check-in, and a wall of your own unfinished tasks is a different
     and much worse screen. */
  var open = Array.isArray(ctx.facts.steps_open) ? ctx.facts.steps_open : [];
  open.slice(0, 2).forEach(function (st, i) {
    if (st && st.text) add("step_" + i, "You said you'd", String(st.text));
  });
  if (!open.length && ctx.facts.next_action) {
    add("next_action", "You said you'd", String(ctx.facts.next_action));
  }

  var sig = ctx.signals;
  if (sig && sig.allocation) {
    var top = Object.keys(sig.allocation).sort(function (a, b) { return sig.allocation[b] - sig.allocation[a]; })[0];
    if (top && VALUE_WORDS[top]) add("value_top", "Most of your hundred went on", VALUE_WORDS[top]);
  }

  return rows.slice(0, 7);
}

YNSActivity.define({
  slug: "stilltrue",
  title: "Still True?",

  slots: [

    /* ---------------------------------------------------------------
       1. The diff.
       --------------------------------------------------------------- */
    {
      id: "review",
      axes: [],
      ladder: [
        {
          mechanic: "diff",
          eyebrow: "Check-in",
          title: "Here's what we think we know.",
          scene: [
            "This is everything you have told us, in your words, with the date attached. Some of it is months old.",
            "Go through and say what still holds. Nothing here is precious, and the point of writing things down is being able to find out you were wrong."
          ],
          prompt: "Still true, or not any more?",
          cta: "That's my update",
          rows: buildRows
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. Did anything actually happen? The question that separates a
       check-in from a mood.
       --------------------------------------------------------------- */
    {
      id: "action",
      axes: [],
      ladder: [
        {
          mechanic: "choice",
          eyebrow: "Since last time",
          title: "Did you do anything about it?",
          scene: [
            "No judgment attached to any of these. \"Nothing\" is a common answer, and it still tells us something. Usually about the size of the step rather than about you."
          ],
          prompt: "Whichever is closest to the truth.",
          options: [
            { k: "researched", t: "I looked into it properly", s: "Reading, research, working out the real numbers.", echo: "I looked into it" },
            { k: "talked",     t: "I talked to someone",       s: "The one that moves things most.",                  echo: "I talked to someone" },
            { k: "applied",    t: "I applied for something",   s: "A job, a course, a place.",                        echo: "I applied for something" },
            { k: "trained",    t: "I started training",        s: "Actually enrolled, and started.",                  echo: "I started training" },
            { k: "nothing",    t: "Nothing, really",           s: "Which usually means the first step was too big.",  echo: "nothing has happened yet" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. What changed in the life around it. Free text, because the
       reasons people's direction moves are never in a dropdown.
       --------------------------------------------------------------- */
    {
      id: "circumstances",
      axes: [],
      ladder: [
        {
          /* Deliberately NO `asks`. A slot that declares a fact key gets
             dropped once that key is known — which for a 270-day
             half-life would mean this activity stops asking what has
             changed for nine months, in the one activity whose entire
             job is asking what has changed.

             The fact still gets written: onComplete puts it in the
             reflection's structured payload, and the reflections trigger
             projects it into facts. Same destination, no drop rule. */
          mechanic: "text",
          eyebrow: "The context",
          title: "Has anything changed around you?",
          scene: [
            "A move, a birth, a diagnosis, a layoff, a relationship, a bill. The things that decide what is possible, and that no quiz ever asks about."
          ],
          prompt: "Anything you think is worth us knowing, or skip this one.",
          placeholder: "Since last time…",
          rows: 4,
          maxLength: 800,
          cta: "Save the update",
          optional: true
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var changed = r.extra.review_changedRows || [];
    var diff = r.extra.review_diff || {};
    var action = r.state.answers.action || "";
    var note = r.extra.circumstances_text || "";
    var esc = r.esc;

    var reviewed = Object.keys(diff).length;
    var conf = r.ctx.derived.confidence || 0;

    var lead = !reviewed
      ? "Nothing marked."
      : changed.length === 0
      ? "All of it still holds."
      : changed.length + (changed.length === 1 ? " thing has moved." : " things have moved.");

    var reading = changed.length === 0 && reviewed
      ? "That's a real result rather than an empty one. A direction that survives a few months " +
        "without you touching it is worth more than one you've only just written down."
      : changed.length
      ? "Good, those are marked out of date now rather than quietly wrong, so nothing here will " +
        "keep steering you with them."
      : "Nothing marked either way, so nothing on your profile has changed. Come back when " +
        "something has shifted.";

    var ACTION_WORDS = {
      researched: "you looked into it properly", talked: "you talked to someone",
      applied: "you applied for something", trained: "you started training",
      nothing: "nothing"
    };

    return "<h1>" + esc(lead) + "</h1>" +
      '<p class="ya-result-lead">' + reading + "</p>" +

      (changed.length
        ? '<div class="ya-readout"><h3>What you said is no longer true</h3>' +
          changed.map(function (c) { return "<p>" + esc(c.label) + " <b>" + esc(c.then) + "</b></p>"; }).join("") +
          "<p>With an account, the old answer stays in your history with its date.</p></div>"
        : "") +

      '<div class="ya-readout"><h3>What happened since</h3><p>' +
      (action === "nothing"
        ? "Nothing yet, and that is a common answer here. Usually it means the first step was " +
          "too big rather than anything about how serious you were, which is why the thing at " +
          "the bottom of this page is small on purpose."
        : ACTION_WORDS[action]
        ? "You said <b>" + esc(ACTION_WORDS[action]) + "</b>. That's more than most people manage " +
          "between one check-in and the next, and it's the part that builds on itself."
        : "You skipped that one, which is fine. The check-in still stands.") + "</p></div>" +

      (note ? '<div class="ya-quote">' + esc(note) + "</div>" : "") +

      (conf
        ? '<div class="ya-readout"><h3>About that confidence number</h3>' +
          "<p>Your profile confidence sits at <b>" + conf + "%</b>. It can go down, and this " +
          "activity is one of the things that can push it down. If an update contradicts what " +
          "came before, it means we know you less well than we thought. The number should say so " +
          "instead of flattering us.</p></div>"
        : "");
  },

  /* Write the reflection. Separate from results() because results() is a
     pure render and must stay safe to call twice; this must not be. */
  onComplete: function (r) {
    if (!r.DB || !r.DB.saveReflection) return;

    var changed = r.extra.review_changedRows || [];
    var structured = {};

    /* The answer IS the vocabulary key now, so there is no display-string
       lookup table to fall out of sync with the options above it. */
    var VALID = ["researched", "talked", "applied", "trained", "nothing"];
    var act = r.state.answers.action;
    if (VALID.indexOf(act) >= 0) structured.actions_taken = [act];

    var note = r.extra.circumstances_text;
    if (note) structured.circumstances = note;

    /* A category the person says no longer fits is a rule-out, which is
       permanent until explicitly corrected — the strongest single signal
       this product collects. */
    changed.forEach(function (c) {
      if (c.key === "top_category" && r.ctx.derived.top_category) {
        structured.ruled_out = (structured.ruled_out || []).concat([r.ctx.derived.top_category]);
      }
    });

    r.DB.saveReflection({
      kind: "checkin",
      prompt_key: "stilltrue_v1",
      prompt_text: "Here's what we think we know. Still true, or not any more?",
      response: note || null,
      structured: structured,
      activity: "stilltrue"
    });
  },

  actions: function (state) {
    if (state.answers.action === "nothing") {
      return [
        "Do the smallest possible version of the step you didn't take. Ten minutes of it",
        "Work out why the last step didn't happen. Was it time, nerve, or the wrong step?",
        "Pick a smaller one and put a date on it"
      ];
    }
    return [
      "Do the next thing in the same direction while the momentum is there",
      "Tell the person who knows you're doing this what happened",
      "Book the next check-in now, while you remember"
    ];
  }
});

})();
