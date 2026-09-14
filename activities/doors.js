/* =====================================================================
   Three Doors — the routes in, side by side.

   Outcome: "I know the three realistic routes into this field, and which
   one fits my life."

   Gated on top_category, and genuinely so: a comparison of routes into
   nothing is a table of abstractions. The gate reason is printed on the
   card, because the reason is also the pitch.

   The output is the table, not a score. People leave with something to
   look at — which is why the mechanic is `compare` rather than a series
   of questions about routes.

   Everything in ROUTES is editorial, in the same spirit as
   data/crosswalk.json: written by a person, reviewable by a person, and
   deliberately vague where the real answer varies by state. A confident
   wrong number here is worse than an honest range.
   ===================================================================== */
(function () {
"use strict";

/* Per-category route sets. `time`/`cost` are ranges on purpose: these
   vary enormously by state and provider, and a precise figure would be
   a precise lie. */
var ROUTES = {
  trades: [
    { k: "apprenticeship", t: "Apprenticeship", s: "You earn while you learn, on a real site",
      time: "3–5 years", cost: "They pay you", entry: "An application and a basic math and reading test", risk: "Low" },
    { k: "certificate", t: "Trade school certificate", s: "A community college or a private provider",
      time: "6–18 months", cost: "$3k–15k", entry: "Mostly open to anyone", risk: "Medium" },
    { k: "lateral", t: "Start as a helper and work up", s: "Start on the tools, learn on the job",
      time: "1–3 years", cost: "None", entry: "Turn up and be reliable", risk: "Low" }
  ],
  health: [
    { k: "certificate", t: "Certificate program", s: "Nursing assistant, taking blood, medical assistant",
      time: "4–12 months", cost: "$1k–6k", entry: "A high school diploma", risk: "Low" },
    { k: "degree", t: "Associate or bachelor's", s: "Nursing, scanning and imaging, and similar roles",
      time: "2–4 years", cost: "$10k–60k", entry: "A few classes first, and places are limited", risk: "Medium" },
    { k: "lateral", t: "Support role first", s: "Get inside the building first, then train with their help",
      time: "6 months–2 years", cost: "Often paid for by the employer", entry: "Entry-level hiring", risk: "Low" }
  ],
  tech: [
    { k: "self_taught", t: "Self-taught + portfolio", s: "Build things in public until they speak for you",
      time: "6–24 months", cost: "Near zero", entry: "Nothing formal needed", risk: "High, because it rests entirely on you keeping at it" },
    { k: "certificate", t: "Bootcamp or certification", s: "Intense, structured and expensive",
      time: "3–9 months", cost: "$5k–20k", entry: "A short test", risk: "Medium, and it varies a lot by provider" },
    { k: "lateral", t: "Sideways from where you are", s: "Support, operations or data where you already work",
      time: "6–18 months", cost: "None", entry: "Apply internally", risk: "Low" }
  ],
  edu: [
    { k: "certificate", t: "Teaching assistant, or teaching English", s: "The fastest way into the room",
      time: "1–6 months", cost: "$500–3k", entry: "A background check", risk: "Low" },
    { k: "degree", t: "The teaching license route", s: "A degree, then the license",
      time: "1–4 years", cost: "$10k–50k", entry: "You need a degree", risk: "Medium" },
    { k: "lateral", t: "Corporate training", s: "Teach other people what you already do",
      time: "3–12 months", cost: "Low", entry: "What you already know how to do", risk: "Low" }
  ],
  biz: [
    { k: "lateral", t: "Sideways where you already work", s: "Operations, coordinating projects, leading a team",
      time: "6–18 months", cost: "None", entry: "Apply internally", risk: "Low" },
    { k: "certificate", t: "A recognized certification", s: "Project management, process improvement, bookkeeping",
      time: "3–9 months", cost: "$500–4k", entry: "Some ask for hours of experience first", risk: "Medium" },
    { k: "degree", t: "Business degree", s: "The traditional route, and the slowest one",
      time: "2–4 years", cost: "$15k–70k", entry: "Normal admissions", risk: "Medium" }
  ],
  social: [
    { k: "certificate", t: "Community health worker training", s: "Short and practical, often run by a hospital or a charity",
      time: "3–9 months", cost: "$0–3k", entry: "A high school diploma, and some are free", risk: "Low" },
    { k: "lateral", t: "Support role first", s: "Case aide, outreach or residential support, then train with their help",
      time: "6 months–2 years", cost: "None", entry: "They hire entry level all year round", risk: "Low" },
    { k: "degree", t: "Social work degree", s: "A social work degree, plus a license if you want to do clinical work",
      time: "2–6 years", cost: "$15k–70k", entry: "Normal admissions, though the master's needs a bachelor's first", risk: "Medium" }
  ],
  gov: [
    { k: "lateral", t: "Apply straight in", s: "Government hires from outside all the time and posts the jobs openly",
      time: "2–9 months of process", cost: "None", entry: "An application, and sometimes an exam", risk: "Low" },
    { k: "certificate", t: "A specialist certificate", s: "Planning, buying, compliance, permits",
      time: "3–12 months", cost: "$500–5k", entry: "Some ask for hours of experience first", risk: "Medium" },
    { k: "degree", t: "A public administration degree", s: "The usual route into policy and management jobs",
      time: "2–4 years", cost: "$12k–60k", entry: "Normal admissions", risk: "Medium" }
  ],
  creative: [
    { k: "self_taught", t: "Portfolio first", s: "Build the work in the open until it speaks for you",
      time: "6–24 months", cost: "Near zero", entry: "No formal requirement; the work is the credential", risk: "High, because it rests entirely on you keeping at it" },
    { k: "lateral", t: "Start nearby, then move across", s: "Coordinator, production assistant, in-house marketing",
      time: "6–18 months", cost: "None", entry: "They hire at entry level", risk: "Low" },
    { k: "certificate", t: "A focused short course", s: "One tool or one craft, learned properly",
      time: "2–9 months", cost: "$300–6k", entry: "Usually open to anyone", risk: "Medium" }
  ],
  finance: [
    { k: "certificate", t: "Bookkeeping or accounting certificate", s: "The fastest proper way in",
      time: "3–12 months", cost: "$500–5k", entry: "Usually open to anyone", risk: "Low" },
    { k: "lateral", t: "Operations, then finance", s: "Invoices, billing or payroll, inside a company that has a finance team",
      time: "6–24 months", cost: "None", entry: "They hire at entry level", risk: "Low" },
    { k: "degree", t: "Accounting or finance degree", s: "What you need to become a licensed accountant, and for most analyst jobs",
      time: "2–4 years", cost: "$15k–70k", entry: "Normal admissions", risk: "Medium" }
  ]
};

/* The blockers, shared by both rungs so the two cannot drift.

   "I am not sure what the next step is" was missing from the first
   version, and it is one of the most common true answers there is. Its
   absence forced anybody in that position into "nothing really, I just
   haven't started", which reads as a confession of laziness when the
   real problem is that nobody has ever shown them the first move. */
var BLOCKERS = [
  { k: "money",      t: "The money",             fact: "money",
    s: "The cost of it, or the pay cut while you do it.",   echo: "money is what's stopping me" },
  { k: "time",       t: "The time",              fact: "time",
    s: "There's nowhere in the week to put it.",            echo: "time is what's stopping me" },
  { k: "unclear",    t: "I don't know what the first step is", fact: "unclear",
    s: "You're willing enough, but nobody has ever laid out the order it goes in.", echo: "I don't know the first step" },
  { k: "entry",      t: "Getting accepted",      fact: "entry",
    s: "You're not sure you'd get in.",                     echo: "getting accepted is what's stopping me" },
  { k: "confidence", t: "Whether I could do it", fact: "confidence",
    s: "The worry is finishing it, rather than getting in.",                        echo: "whether I could do it is what's stopping me" },
  { k: "none",       t: "Nothing really. I just haven't started", fact: "none",
    s: "Which is its own kind of answer.",                  echo: "nothing is stopping me except starting" }
];

/* Any category still without its own set gets the generic four. Better an
   honest general answer than a confident specific wrong one. */
var GENERIC = [
  { k: "certificate", t: "A short qualification", s: "A community college or an accredited provider",
    time: "3–18 months", cost: "$500–8k", entry: "Usually open to anyone", risk: "Low" },
  { k: "degree", t: "A degree", s: "The one most job ads assume you have",
    time: "2–4 years", cost: "$10k–60k", entry: "Normal admissions", risk: "Medium" },
  { k: "lateral", t: "A sideways move", s: "The nearest job to it where you already work",
    time: "6–18 months", cost: "None", entry: "Apply internally", risk: "Low" },
  { k: "self_taught", t: "Teach yourself and show the work", s: "A portfolio, volunteering, a track record people can see",
    time: "6–24 months", cost: "Near zero", entry: "Nothing formal needed", risk: "High" }
];

function routesFor(cat) { return ROUTES[cat] || GENERIC; }

function escHTML(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function lower(t) {
  /* Route names are written as headings ("Trade school certificate") and
     get dropped mid-sentence, so only the first letter comes down. */
  t = String(t || "");
  return t.charAt(0).toLowerCase() + t.slice(1);
}

/* The route they marked "yes" first, from the answers already given in
   THIS run. This is what lets the next screen name the thing they picked
   on the last one. */
function firstYes(v) {
  var picks = (v && v.extra && v.extra.routes_picks) || {};
  var list = routesFor(v && v.derived && v.derived.top_category);
  for (var i = 0; i < list.length; i++) {
    if (picks[list[i].k] === "yes") return list[i];
  }
  return null;
}

function catName(cat) {
  var T = window.YNSTaxonomy;
  return (T && T.label(cat)) || "this field";
}

YNSActivity.define({
  slug: "doors",
  title: "Three Doors",

  slots: [

    /* ---------------------------------------------------------------
       1. The table. The whole point of the activity.
       --------------------------------------------------------------- */
    {
      id: "routes",
      axes: [],
      ladder: [
        {
          asks: "route_preference",
          mechanic: "compare",
          eyebrow: "The routes",
          title: "There is more than one way in.",
          scene: [
            "Almost everyone assumes the door they know about is the only door. Usually it is the slowest and most expensive one.",
            "Here are the realistic routes into the work you keep pointing at. Mark the ones you could see yourself doing, rather than the ones you think you should want."
          ],
          prompt: "Yes means \"I could start this within a year.\" No means \"not with my life as it stands.\"",
          rowHeader: "Route",
          cta: "That's my read",
          columns: [
            { k: "time",  t: "How long" },
            { k: "cost",  t: "What it costs" },
            { k: "entry", t: "To get in" },
            { k: "risk",  t: "Risk" }
          ],
          routes: routesFor(null)
        },
        {
          needs: { fact: "top_category" },
          asks: "route_preference",
          mechanic: "compare",
          eyebrow: "The routes",
          title: "There is more than one way in.",
          scene: [
            "Almost everyone assumes the door they know about is the only door. Usually it is the slowest and most expensive one.",
            "These are the realistic routes into the field your answers keep pointing at. Mark the ones you could see yourself doing, rather than the ones you think you should want."
          ],
          prompt: "Yes means \"I could start this within a year.\" No means \"not with my life as it stands.\"",
          provenance: "These are the routes into the field your other answers keep pointing at.",
          rowHeader: "Route",
          cta: "That's my read",
          columns: [
            { k: "time",  t: "How long" },
            { k: "cost",  t: "What it costs" },
            { k: "entry", t: "To get in" },
            { k: "risk",  t: "Risk" }
          ],
          routes: function (v) { return routesFor(v && v.derived && v.derived.top_category); }
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. What is in the way.

       The copy is built at render time from what they have just done,
       because a generic "assume you picked the route you would most
       want" is exactly the sort of thing that makes an activity feel
       like it is not listening. It names their field, and it names the
       route they marked, because they marked it thirty seconds ago.
       --------------------------------------------------------------- */
    {
      id: "blocker",
      axes: [],
      ladder: [
        {
          asks: "route_blocker",
          mechanic: "choice",
          eyebrow: "The obstacle",

          title: function (v) {
            var picked = firstYes(v);
            return picked
              ? "So what is stopping you from starting?"
              : "So what is stopping you?";
          },

          scene: function (v) {
            var name = catName(v.derived.top_category);
            var picked = firstYes(v);
            var out = [];

            /* Say what we think we know, in their words, and give them
               room to disagree with it. A product that tells somebody
               what they want had better be easy to correct. */
            out.push("Your answers keep pointing at <b>" + escHTML(name) + "</b>.");

            if (picked) {
              out.push("You just marked <b>" + escHTML(picked.t) + "</b> as something you could " +
                "start inside a year. So the question is no longer which route to take. It's what has " +
                "been keeping you from that one.");
            } else {
              out.push("None of those routes looked like something you could start inside a " +
                "year, which is worth taking at face value. So the more useful question is what " +
                "would have to move first.");
            }
            return out;
          },

          prompt: "Whichever one is true. Nobody else sees this.",
          options: BLOCKERS
        },
        {
          needs: { fact: "constraints_assumed" },
          asks: "route_blocker",
          mechanic: "choice",
          eyebrow: "The obstacle",
          provenance: "Asked this way because you have already sorted your constraints once.",

          title: function (v) {
            var picked = firstYes(v);
            return picked
              ? "Is it the same thing standing in the way?"
              : "Is it the same thing as last time?";
          },

          scene: function (v) {
            var name = catName(v.derived.top_category);
            var assumed = (v.facts.constraints_assumed || []).length;
            var out = ["Your answers keep pointing at <b>" + escHTML(name) + "</b>, and you have " +
                       "already sorted your constraints into what is fixed and what is worth questioning" +
                       (assumed ? ", with " + assumed + " on the worth-questioning side" : "") + "."];
            var picked2 = firstYes(v);
            out.push(picked2
              ? "So here is the narrower question. Of everything standing between you and the <b>" +
                escHTML(lower(picked2.t)) + "</b> route, which one is doing the real work?"
              : "So here is the narrower question. Of everything standing between you and the " +
                "route you would take, which one is doing the real work?");
            return out;
          },

          prompt: "Whichever one is true. Nobody else sees this.",
          options: BLOCKERS
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var picks = r.extra.routes_picks || {};
    var esc = r.esc;
    var cat = r.ctx.derived.top_category;
    var routes = routesFor(cat);
    var byKey = {};
    routes.forEach(function (x) { byKey[x.k] = x; });

    var yes = Object.keys(picks).filter(function (k) { return picks[k] === "yes"; }).map(function (k) { return byKey[k]; }).filter(Boolean);
    var no = Object.keys(picks).filter(function (k) { return picks[k] === "no"; }).map(function (k) { return byKey[k]; }).filter(Boolean);
    var blocker = r.state.answers.blocker || r.ctx.facts.route_blocker || "";
    var BLOCKER_WORDS = {
      money: "the money", time: "the time", entry: "getting accepted",
      confidence: "whether you could do it", none: "nothing except starting",
      unclear: "not knowing what the first step is"
    };

    /* Marking one route "no" is NOT the same as closing all of them, and
       the first version could not tell the difference: any run with no
       yeses was reported as "you closed all of them", including one
       where somebody marked a single route and left the rest alone. */
    var total = r.extra.routes_rowCount || routes.length;
    var marked = yes.length + no.length;
    var unmarked = Math.max(0, total - marked);

    var lead, reading;
    if (yes.length) {
      lead = yes.length === 1 ? "One door is open." : yes.length + " doors are open.";
      reading = "That's the useful part, because which route fits the life you're living " +
        "matters far more than which one looks best on paper.";
    } else if (unmarked) {
      lead = no.length === 1
        ? "You ruled one out."
        : "You ruled " + no.length + " out.";
      reading = "You left " + (unmarked === 1 ? "the other one" : "the other " + unmarked) +
        " unmarked, so take this as one route ruled out rather than a verdict on the whole " +
        "field. Ruling one out on purpose still helps, because it stops being a nagging maybe. " +
        "Come back and mark the rest whenever you want.";
    } else {
      lead = "You closed all of them.";
      reading = "Sit with that for a minute. It means one of two things. Either the field is " +
        "out of reach right now, and the honest next step is a different field. Or the routes " +
        "as written don't match what you'd be willing to do. The second one is much easier to " +
        "fix.";
    }

    var fastest = yes.slice().sort(function (a, b) { return a.time.length - b.time.length; })[0];

    return "<h1>" + esc(lead) + "</h1>" +
      '<p class="ya-result-lead">' + reading + "</p>" +

      (yes.length
        ? '<div class="ya-readout"><h3>What you said you could start</h3>' +
          yes.map(function (x) {
            return "<p><b>" + esc(x.t) + "</b>. " + esc(x.time) + ", " + esc(x.cost).toLowerCase() +
              ". " + esc(x.s) + "</p>";
          }).join("") +
          (fastest ? "<p>The shortest distance between here and being in the room is <b>" +
            esc(fastest.t) + "</b>.</p>" : "") +
          "</div>"
        : "") +

      (no.length
        ? '<div class="ya-readout"><h3>What you ruled out</h3><p>' +
          no.map(function (x) { return esc(x.t); }).join(" · ") +
          ". Worth writing down, because a route you have deliberately ruled out stops being a " +
          "nagging maybe, and stops other people talking you into it.</p></div>"
        : "") +

      (BLOCKER_WORDS[blocker]
        ? '<div class="ya-quote">You said the thing in the way is <b>' + esc(BLOCKER_WORDS[blocker]) +
          "</b>. Everything below is aimed at that and nothing else.</div>"
        : "") +

      '<p class="ya-note"><b>Read the numbers as orientation, not as quotes.</b> These are typical ' +
      "ranges for " + esc(catName(cat)) + ", and we wrote them. The pay figures elsewhere in " +
      "this product come from published government data. These don't. Cost and length vary a " +
      "lot by state and by provider. Funding you qualify for can bring the cost down to " +
      "nothing. The only figure worth acting on is the one you get from the provider you'd " +
      "actually use.</p>";
  },

  actions: function (state, ctx) {
    var b = state.answers.blocker || (ctx && ctx.facts.route_blocker) || "";
    if (b === "money") {
      return [
        "Find out whether the route you'd pick has funding, a grant, or an employer who pays for it",
        "Price the cheapest legitimate version of it, not the first one you found",
        "Work out your monthly floor so the pay-cut question has a real number in it"
      ];
    }
    if (b === "unclear") {
      return [
        "Pick the shortest route above and find the one page that says how to apply",
        "Write down the first three things that would have to happen, in order",
        "Ask one person who has done it what they did first"
      ];
    }
    if (b === "entry") {
      return [
        "Find the real entry requirements on the provider's own page",
        "Email one admissions or apprenticeship contact and ask what they look for",
        "Find one person who got in without the thing you think you're missing"
      ];
    }
    if (b === "none") {
      return [
        "Do the first ten minutes of it today. The form, the email, the enquiry",
        "Put a date in the calendar for the application, not for thinking about it",
        "Tell one person you're doing it, out loud"
      ];
    }
    return [
      "Spend twenty minutes on the provider's own website rather than on opinions about it",
      "Find one person who took the route you'd pick and ask how it really went",
      "Write down what would have to change for the blocker to move"
    ];
  }
});

})();
