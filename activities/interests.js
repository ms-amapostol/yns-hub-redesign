/* =====================================================================
   What Kind of Work — a short interest profiler.

   Door 2 · Explore what's out there. Sits between the three story-based
   quizzes and Three Doors: those ask what life you want, this asks what
   you would actually enjoy doing all day.

   Outcome: "I know the two or three kinds of work that fit what I like
   doing, and I've seen real roles and real pay inside them."

   Design notes worth keeping:

   * The instrument underneath is RIASEC — the six interest areas the
     O*NET Interest Profiler uses. Thirty items, five per area, rated
     like / maybe / no. That is the short-form shape, and it is enough
     to separate six dimensions without a sixty-item sitting.

   * The items are written here, from scratch, in the language of
     someone who has worked retail rather than someone reading a
     careers handbook. "Work out why a machine stopped working" rather
     than "Diagnose mechanical faults." O*NET's own item wording is not
     reused. The framework is public; the phrasing is ours.

   * Nothing asks about jobs. Every item is a thing you would be doing
     on a Tuesday. People are far better at answering "would I like
     doing that" than "am I a creative person."

   * Scores are never shown as a personality type. The result is a
     shortlist of work, with real roles and real wage bands, because a
     type with nothing attached to it is a horoscope.

   * The last question is about appetite for training, which comes
     straight from the course. It changes what the result recommends, and
     it hands Three Doors something to work with.
   ===================================================================== */
(function () {
"use strict";

/* ---------------------------------------------------------------------
   The six interest areas, in plain words. These labels are what the
   person sees; the letters are only used in the code.
   ------------------------------------------------------------------ */
var AREA = {
  R: { t: "Working with your hands",  s: "Building, fixing, machines, being on your feet, outdoors" },
  I: { t: "Working things out",       s: "Finding the cause, spotting patterns, research, numbers" },
  A: { t: "Making things",            s: "Design, writing, photos, music, how something looks and feels" },
  S: { t: "Working with people",      s: "Helping, teaching, caring, calming a room down" },
  E: { t: "Getting things moving",    s: "Persuading, leading, selling, running the thing" },
  C: { t: "Keeping things straight",  s: "Order, records, schedules, getting it exactly right" }
};

/* ---------------------------------------------------------------------
   Thirty items, five per area. Concrete, everyday, no job titles.
   `a` is the area it scores.
   ------------------------------------------------------------------ */
var ITEMS = [
  /* R */
  { k: "r1", a: "R", t: "Work out why something stopped working, and fix it" },
  { k: "r2", a: "R", t: "Put a piece of furniture together from the box" },
  { k: "r3", a: "R", t: "Be on your feet and moving most of the day" },
  { k: "r4", a: "R", t: "Use tools or machinery you had to be trained on" },
  { k: "r5", a: "R", t: "Work outside, in most weather" },
  /* I */
  { k: "i1", a: "I", t: "Dig into why the numbers came out the way they did" },
  { k: "i2", a: "I", t: "Be the person who figures out what actually caused a problem" },
  { k: "i3", a: "I", t: "Read up on something until you properly understand it" },
  { k: "i4", a: "I", t: "Spot a pattern nobody else had noticed" },
  { k: "i5", a: "I", t: "Test an idea to see whether it holds up" },
  /* A */
  { k: "a1", a: "A", t: "Make something look right, and care that it does" },
  { k: "a2", a: "A", t: "Write something other people will read" },
  { k: "a3", a: "A", t: "Take the photos or make the video" },
  { k: "a4", a: "A", t: "Come up with the idea nobody asked for" },
  { k: "a5", a: "A", t: "Work on something with no single correct answer" },
  /* S */
  { k: "s1", a: "S", t: "Help someone who is having a hard day" },
  { k: "s2", a: "S", t: "Show a new person how the job is done" },
  { k: "s3", a: "S", t: "Look after someone who needs looking after" },
  { k: "s4", a: "S", t: "Be the calm one when a situation gets tense" },
  { k: "s5", a: "S", t: "Spend most of the day talking with people" },
  /* E */
  { k: "e1", a: "E", t: "Talk someone into seeing it your way" },
  { k: "e2", a: "E", t: "Be the one who decides what the team does next" },
  { k: "e3", a: "E", t: "Sell something you actually believe in" },
  { k: "e4", a: "E", t: "Start something of your own and run it" },
  { k: "e5", a: "E", t: "Speak up in a room full of people" },
  /* C */
  { k: "c1", a: "C", t: "Get a messy system organized and keep it that way" },
  { k: "c2", a: "C", t: "Keep records that have to be exactly right" },
  { k: "c3", a: "C", t: "Work to a clear checklist and know you've done it properly" },
  { k: "c4", a: "C", t: "Handle money, invoices or schedules for other people" },
  { k: "c5", a: "C", t: "Catch the mistake before it goes out the door" }
];

/* Five screens of six. Mixed on purpose, so nobody can guess what a
   screen is measuring and answer the way they think they should. */
var BATCH = [
  ["r1", "s1", "c1", "a1", "e1", "i1"],
  ["i2", "e2", "r2", "s2", "c2", "a2"],
  ["a3", "c3", "s3", "i3", "r3", "e3"],
  ["e4", "r4", "i4", "c4", "a4", "s4"],
  ["s5", "a5", "e5", "c5", "i5", "r5"]
];

/* ---------------------------------------------------------------------
   Interest areas to the nine YNS categories. Weights rather than a
   one-to-one map, because real work is a blend: nursing is people and
   hands and working things out, all three.
   ------------------------------------------------------------------ */
var FIT = {
  health:   { S: 3, R: 2, I: 2, C: 1 },
  social:   { S: 3, E: 1, A: 1 },
  edu:      { S: 3, A: 1, E: 1, I: 1 },
  gov:      { S: 2, C: 2, R: 1, E: 1 },
  creative: { A: 3, E: 1, I: 1 },
  trades:   { R: 3, C: 1, I: 1 },
  biz:      { E: 3, C: 2, S: 1 },
  tech:     { I: 3, C: 2, R: 1, A: 1 },
  finance:  { C: 3, I: 2, E: 1 }
};

function catLabel(k) {
  var T = window.YNSTaxonomy;
  return (T && T.label(k)) || k;
}

/* Level to read wage bands at, from anything already on file. */
function levelFor(facts) {
  var l = facts && facts.level;
  if (l === "leader") return "leader";
  if (l === "experienced") return "experienced";
  if (l === "some") return "some";
  return "early";
}

function money(n) { return "$" + Math.round(n / 1000) + "k"; }

/* Roles for a category, from the wage file if it has loaded, quietly
   skipped if it has not. Nothing here fabricates a salary. */
function roleLines(cat, level) {
  var data = window.YNS_ROLES;
  try {
    var band = data.categories[cat][level] || data.categories[cat].early;
    return (band || []).slice(0, 3).map(function (r) {
      return r.title + " \u00b7 " + money(r.low) + "\u2013" + money(r.high);
    });
  } catch (e) { return []; }
}

YNSActivity.define({
  slug: "interests",

  title: "What Kind of Work",

  slots: [

    /* ---------------------------------------------------------------
       1. Frame it. Say what this is and, more importantly, what it is
       not, because most people have been handed a personality quiz
       before and learned to distrust them.
       --------------------------------------------------------------- */
    {
      id: "frame",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Six minutes",
          title: "Thirty small questions about what you'd enjoy doing.",
          lead: "Just what you'd like doing on an ordinary Tuesday. Pay and training come later.",
          points: [
            "<b>Every question is a thing you'd be doing</b>, never a job title. People are much better at answering \u201cwould I like that\u201d than \u201cam I a creative person\u201d.",
            "<b>Three answers: yes, maybe, no.</b> Go fast. Your first reaction is the honest one.",
            "<b>You'll get a shortlist, with real roles and real pay.</b> Something concrete to look at next."
          ],
          note: "The six interest areas underneath are the ones used by O*NET, the US Department of Labor's careers database. The questions are ours, written plainly.",
          cta: "Let's go"
        }
      ]
    },

    /* ---------------------------------------------------------------
       2–6. The thirty items, six at a time.
       --------------------------------------------------------------- */
    RATE(0, "Would you like doing this?", [
      "Go with your gut. There's no right answer and nobody sees this."
    ]),
    RATE(1, "Keep going. Same question.", null),
    RATE(2, "You're halfway.", null),
    RATE(3, "Two screens left.", null),
    RATE(4, "Last six.", null),

    /* ---------------------------------------------------------------
       7. Appetite for training. Straight out of the course, and the thing
       that decides whether a shortlist is useful or just interesting.
       --------------------------------------------------------------- */
    {
      id: "appetite",
      axes: [],
      ladder: [
        {
          asks: "training_appetite",
          mechanic: "choice",
          eyebrow: "One more",
          title: "How much training are you up for right now?",
          scene: [
            "This changes what we show you. Plenty of good work needs none at all, and some of the best-paid needs a year or two. Both answers are fine, and you can change this later."
          ],
          prompt: "Right now.",
          options: [
            { k: "none",   t: "None. I need to be earning",
              s: "Start now, learn on the job, use tuition benefits later if you want them.", echo: "no training right now" },
            { k: "short",  t: "Something short. A few weeks or months",
              s: "A certificate, a license, a short course.", echo: "a short course" },
            { k: "medium", t: "A year or two, if it's worth it",
              s: "An apprenticeship, a trade program, an associate degree.", echo: "a year or two of training" },
            { k: "long",   t: "I'd go the whole way",
              s: "A full degree, if the path needs one.", echo: "the full route" }
          ]
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    var answers = r.extra.rate_all || {};
    var level = levelFor(r.ctx.facts);

    /* Score the six areas. yes = 2, maybe = 1, no = 0. */
    var area = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    var answered = 0;
    ITEMS.forEach(function (it) {
      var v = answers[it.k];
      if (v == null) return;
      answered++;
      area[it.a] += v === "yes" ? 2 : v === "maybe" ? 1 : 0;
    });

    var ranked = Object.keys(area).sort(function (a, b) { return area[b] - area[a]; });
    var top = ranked.slice(0, 3);

    /* Categories, scored against the area profile. */
    var cats = Object.keys(FIT).map(function (c) {
      var s = 0, w = FIT[c];
      Object.keys(w).forEach(function (k) { s += w[k] * area[k]; });
      return { k: c, score: s };
    }).sort(function (a, b) { return b.score - a.score; });

    var best = cats.slice(0, 3);
    var flat = area[ranked[0]] - area[ranked[5]] <= 4;

    var appetite = r.state.answers.appetite || r.ctx.facts.training_appetite || "";
    var APPETITE = {
      none:   "You said no training right now, so the roles above are ones you can start from where you are. Some large employers, including retail and food chains, help pay for school, which can cut what a degree costs you. A job's benefits page usually says whether it does.",
      short:  "You said something short. That's where certificates and licenses live, and in several of these fields a few weeks of training is the whole difference in pay.",
      medium: "You said a year or two. That opens apprenticeships, trade programs and associate degrees, which is where a lot of the best pay-to-training ratios sit.",
      long:   "You said you'd go the whole way. Worth checking which of these actually needs a four-year degree, because a few of them don't, and the ones that don't will get you earning sooner."
    };

    var out = "<h1>Here's what fits what you like doing.</h1>";

    out += '<p class="ya-result-lead">You answered ' + answered + " of " + ITEMS.length +
      " questions. The three kinds of work below came out on top, in order.</p>";

    best.forEach(function (c, i) {
      var lines = roleLines(c.k, level);
      out += '<div class="ya-readout"><h3>' + (i + 1) + ". " + esc(catLabel(c.k)) + "</h3>" +
        (lines.length
          ? "<p>" + lines.map(function (l) { return esc(l); }).join("<br>") + "</p>" +
            '<p class="ya-fine">Pay is a national band for where you are now, from the US Bureau of Labor Statistics via CareerOneStop. We match your experience to a slice of the range, which is our estimate. It moves a lot by state.</p>'
          : "<p>Real roles and pay for this one load from the wage file.</p>") +
        "</div>";
    });

    out += '<div class="ya-readout"><h3>What you leaned toward</h3><p>' +
      top.map(function (a) { return "<b>" + esc(AREA[a].t) + "</b>. " + esc(AREA[a].s); }).join("<br>") +
      "</p>" +
      (flat
        ? "<p>Your answers were fairly even across all six. That often means you'd be content in more places than you think, and the thing to weigh is the life around the job. A Day In The Life is the better activity for that.</p>"
        : "<p>Those are the three you said yes to most often. Hold any job you're considering against them.</p>") +
      "</div>";

    if (APPETITE[appetite]) {
      out += '<div class="ya-readout"><h3>What you said about training</h3><p>' + APPETITE[appetite] + "</p></div>";
    }

    out += '<p class="ya-result-lead">This is a shortlist to explore. ' +
      "Three Doors takes the top one and lays out every realistic route in, with what each costs and how long it takes.</p>";

    return out;
  },

  /* The whole instrument lands in one place rather than as thirty facts.
     `top_category` is the key other activities already read, so Three
     Doors, Two Conversations and Career ABCs all benefit from this
     without knowing it exists. */
  onComplete: function (r) {
    var answers = r.extra.rate_all || {};
    var area = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    ITEMS.forEach(function (it) {
      var v = answers[it.k];
      if (v) area[it.a] += v === "yes" ? 2 : v === "maybe" ? 1 : 0;
    });
    var ranked = Object.keys(area).sort(function (a, b) { return area[b] - area[a]; });
    var cats = Object.keys(FIT).map(function (c) {
      var s = 0, w = FIT[c];
      Object.keys(w).forEach(function (k) { s += w[k] * area[k]; });
      return { k: c, score: s };
    }).sort(function (a, b) { return b.score - a.score; });

    r.setFact("interest_code", ranked.slice(0, 3).join(""));
    r.setFact("interest_top", AREA[ranked[0]].t + ", then " + AREA[ranked[1]].t.toLowerCase() + ".");
    /* Evidence, not a verdict. The hub adds this to whatever the other
       activities have said and resolves one direction from all of it, so
       finishing this refines the picture rather than overwriting it. */
    var ranked = cats.map(function (c) { return c.k; });
    if (window.YNSHub && window.YNSHub.addEvidence) {
      window.YNSHub.addEvidence("interests", ranked);
    } else {
      r.setFact("category_ranking", ranked);
      if (cats[0].score > cats[1].score) r.setFact("top_category", cats[0].k);
    }
  },

  actions: function (state) {
    var appetite = (state && state.answers && state.answers.appetite) || "";
    return [
      "Do Three Doors and see the routes into the one at the top",
      appetite === "none"
        ? "Look up which employers near you pay for training"
        : "Find one program near you for the field at the top, and note what it costs",
      "Say the top one out loud to someone and watch their reaction"
    ];
  }
});

/* One rating screen. Declared as a function because five of them differ
   only by which six items they hold. */
function RATE(n, title, scene) {
  return {
    id: "rate" + n,
    axes: [],
    ladder: [
      {
        mechanic: "rate",
        eyebrow: "Questions " + (n * 6 + 1) + "\u2013" + (n * 6 + 6) + " of 30",
        title: title,
        scene: scene,
        items: BATCH[n].map(function (k) {
          var it = ITEMS.filter(function (x) { return x.k === k; })[0];
          return { k: it.k, t: it.t };
        }),
        options: [
          { k: "yes",   t: "Yes" },
          { k: "maybe", t: "Maybe" },
          { k: "no",    t: "No" }
        ],
        cta: n === 4 ? "See what fits" : "Next six"
      }
    ]
  };
}

})();
