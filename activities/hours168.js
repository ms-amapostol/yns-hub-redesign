/* =====================================================================
   168 Hours — where the week actually goes.

   Outcome: "I know what my week is really made of, and what I would
   have to give up to change it."

   Same family as Spend Your 100, completely different question. That one
   asks what you would pay for in the abstract; this one shows you what
   you are already paying, in the only currency nobody can print more of.

   The result screen is the payload: "you gave commuting nine hours and
   the thing you love two" is a sentence people remember.

   Not gated. It works cold and it is one of the better first activities
   for someone who cannot name what is wrong yet.
   ===================================================================== */
(function () {
"use strict";

/* Which rows are daily and which are weekly is a content judgement, not
   a technical one, and it is the whole point of the two units.

   Daily: things with a rhythm you could describe per night or per day.
   Nobody knows their weekly sleep total; everybody knows they get about
   seven hours. Same for a commute, the school run, the washing up.

   Weekly: things that happen in episodes rather than every day. "Two
   hours a day seeing people you like" is a strange thing to ask; "six
   hours a week" is not.

   `daily.days` is the default day count. `adjustable` adds a stepper for
   the rows where it genuinely varies — a hybrid commute is the obvious
   one, and paid work is the other, since a four-on-four-off shift and a
   Monday-to-Friday desk job are the same weekly total by very different
   routes. */
var ROWS = [
  { k: "sleep",    t: "Sleeping",              s: "Whatever you really average, not what you'd like to.",
    daily: { days: 7 }, max: 12, step: 0.5, a: {} },

  { k: "work",     t: "Working",               s: "Including the parts you do at home.",
    daily: { days: 5, adjustable: true }, max: 16, step: 0.5, a: { order: 1 } },

  { k: "commute",  t: "Getting to and from it", s: "Door to door and both ways, even if it's only fifteen minutes each way.",
    daily: { days: 5, adjustable: true }, max: 5, step: 0.25, a: { order: 1 } },

  { k: "care",     t: "Looking after people",  s: "Children, parents, anyone who needs you.",
    daily: { days: 7 }, max: 14, step: 0.5, a: { people: 3 } },

  { k: "chores",   t: "Keeping life running",  s: "Cooking, cleaning, paperwork, the shop.",
    daily: { days: 7 }, max: 8, step: 0.25, a: { order: 2, hands: 1 } },

  { k: "making",   t: "Making or fixing something", s: "A project, a repair, a craft, a build.",
    max: 40, a: { making: 3, hands: 2 } },

  { k: "learning", t: "Learning something",    s: "A course, a book, a tutorial, practice.",
    max: 40, a: { analysis: 3 } },

  { k: "people",   t: "Being with people you like", s: "Time you chose, rather than time you owed.",
    max: 50, a: { people: 3 } },

  { k: "rest",     t: "Actually resting",      s: "The kind that actually restores you, rather than scrolling and feeling guilty.",
    max: 50, a: {} }
];

var LABEL = {};
ROWS.forEach(function (r) { LABEL[r.k] = r.t.toLowerCase(); });

YNSActivity.define({
  slug: "hours168",
  title: "168 Hours",

  slots: [

    /* ---------------------------------------------------------------
       1. The week. Scored, because how someone spends unclaimed time is
       genuinely diagnostic — but scored proportionally, so a person with
       a 60-hour job is not read as more "order"-driven than a person
       with a 30-hour one.
       --------------------------------------------------------------- */
    {
      id: "week",
      axes: ["order", "people", "making", "hands", "analysis"],
      ladder: [
        {
          mechanic: "hours",
          eyebrow: "One week",
          title: "There are 168 hours in a week.",
          scene: [
            "Everybody gets the same number, and what separates one life from another is where those hours go.",
            "Rough is fine. Nobody knows this exactly, and the estimate is usually more revealing than the truth would be."
          ],
          prompt: "The first few are per day, because that's how you know them. We'll do the multiplying.",
          total: 168,
          cta: "That's my week",
          rows: ROWS
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. The drain. A closed vocabulary, so other activities can read it.
       --------------------------------------------------------------- */
    {
      id: "drain",
      axes: [],
      ladder: [
        {
          asks: "time_drain",
          mechanic: "choice",
          eyebrow: "The leak",
          title: "Which of those would you take back first?",
          scene: [
            "Say someone handed you back five hours a week, taken from one of these. You don't get to choose where they go. Which would you take them from?"
          ],
          prompt: "Pick the one you resent most.",
          options: [
            { k: "commute", t: "The commute",          fact: "commute", s: "Time that's neither work nor life.",        echo: "the commute takes the most" },
            { k: "work",    t: "The job itself",        fact: "work",    s: "The hours inside the job, rather than the ones around it.",  echo: "the job itself takes the most" },
            { k: "chores",  t: "Keeping life running",  fact: "chores",  s: "The admin that never finishes.",             echo: "keeping life running takes the most" },
            { k: "none",    t: "Nothing. The problem is what's missing", fact: "none", s: "The week isn't so much too full as the wrong shape.", echo: "my week is the wrong shape" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. What they would defend. The mirror of the drain, and the more
       useful of the two for anything downstream.
       --------------------------------------------------------------- */
    {
      id: "protected",
      axes: [],
      ladder: [
        {
          asks: "time_protected",
          mechanic: "choice",
          eyebrow: "The line",
          title: "And what would you not give up?",
          scene: [
            "A new job will ask for something. Better to know in advance what the answer is."
          ],
          prompt: "The one you would say no to a good offer over.",
          options: [
            { k: "evenings", t: "Evenings with the people I live with", fact: "evenings", echo: "I won't give up my evenings" },
            { k: "weekends", t: "Weekends, both of the days",           fact: "weekends", echo: "I won't give up my weekends" },
            { k: "sleep",    t: "Sleep. I've tried the other way",      fact: "sleep",    echo: "I won't give up sleep" },
            { k: "own_time", t: "The one thing I do that's mine",       fact: "own_time", echo: "I won't give up my own time" },
            { k: "flexible", t: "Honestly, most of it's negotiable for the right thing", fact: "flexible", echo: "most of it is up for grabs for the right job" }
          ]
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var alloc = r.extra.week_allocation || r.state.allocation || {};
    var esc = r.esc;

    var used = 0;
    Object.keys(alloc).forEach(function (k) { used += alloc[k] || 0; });
    var unaccounted = Math.max(0, 168 - used);

    /* Per-day answers produce fractional weekly totals — a 45-minute
       commute is 3.75 hours a week — so anything shown as prose gets
       rounded. "You left 38.7 hours unaccounted for" reads like a
       spreadsheet, not like a sentence about someone's life. */
    var h = function (n) { return Math.round(n); };

    var work = (alloc.work || 0) + (alloc.commute || 0);
    var obligation = work + (alloc.care || 0) + (alloc.chores || 0);
    var yours = (alloc.making || 0) + (alloc.learning || 0) + (alloc.people || 0) + (alloc.rest || 0);
    var awake = Math.max(1, 168 - (alloc.sleep || 0));

    /* The two lines people actually remember. */
    var pctObligation = Math.round(obligation / awake * 100);
    var pctYours = Math.round(yours / awake * 100);

    var biggest = Object.keys(alloc)
      .filter(function (k) { return k !== "sleep"; })
      .sort(function (a, b) { return (alloc[b] || 0) - (alloc[a] || 0); })[0];

    var smallest = ["making", "learning", "people", "rest"]
      .sort(function (a, b) { return (alloc[a] || 0) - (alloc[b] || 0); })[0];

    /* var() rather than literals: the light ramp is unreadable on a dark
       card, and the "unaccounted for" grey is a light grey. */
    var stack = '<div class="ya-stack" role="img" aria-label="How your waking week divides">' +
      '<i style="width:' + (obligation / awake * 100) + '%;background:var(--ya-stack-1)"></i>' +
      '<i style="width:' + (yours / awake * 100) + '%;background:var(--ya-stack-5)"></i>' +
      '<i style="width:' + (Math.max(0, awake - obligation - yours) / awake * 100) + '%;background:var(--yns-line)"></i>' +
      "</div>";

    return "<h1>" + pctObligation + "% of your waking week is spoken for.</h1>" +
      '<p class="ya-result-lead">Work, getting there, looking after people, keeping the place running. ' +
      "The other " + pctYours + "% covers making, learning, the people you chose and actual rest.</p>" +
      stack +

      '<div class="ya-readout"><h3>The two numbers that matter</h3>' +
      "<p>Your biggest single claim on the week, after sleep, is <b>" +
      esc(LABEL[biggest] || "work") + "</b>, at about " + h(alloc[biggest] || 0) + " hours a week.</p>" +
      "<p>The smallest thing you kept for yourself is <b>" + esc(LABEL[smallest] || "rest") +
      "</b>, at " + h(alloc[smallest] || 0) + " hours. " +
      ((alloc[smallest] || 0) <= 2
        ? "That is under twenty minutes a day. Worth asking whether that is a choice or a consequence."
        : "Small, but it exists, which is more than most people manage.") + "</p>" +
      (unaccounted > 12
        ? "<p>You also left about " + h(unaccounted) + " hours unaccounted for. That happens to everyone. It is usually " +
          "the part of the week nobody can quite describe afterwards, and it's often where the answer is.</p>"
        : "") +
      "</div>" +

      '<div class="ya-readout"><h3>What this is for</h3>' +
      "<p>A job change doesn't add hours, it moves them. Anything you look at from here is a " +
      "trade against this shape. You now know which parts you'd defend and which you'd hand " +
      "over without much of a fight.</p></div>";
  },

  actions: function (state, ctx) {
    var drain = state.answers.drain || (ctx && ctx.facts.time_drain) || "";
    if (drain === "commute") {
      return [
        "Work out what your commute costs you in hours a year. The number is usually shocking",
        "Find one role in your field that's closer, or not on-site, and read what it pays",
        "Try one week of tracking the real door-to-door time rather than the estimate"
      ];
    }
    return [
      "Take one hour back this week and give it to the thing that got the fewest",
      "Tell one person which part of the week you'd defend, so it isn't only in your head",
      "Look at one job posting and work out what it would do to this shape"
    ];
  }
});

})();
