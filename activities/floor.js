/* =====================================================================
   The Floor — what you actually need, not what you want.

   Outcome: "I know the floor: the number I need, not the number I want."

   Turns the wage data from a result into an input. Everything else in
   the product tells people what a job pays; this is the only one that
   asks what they need it to pay, and then puts the two side by side.

   Three mechanics, no multiple choice:
     buildup    add up the real monthly cost of your life
     estimate   guess what a role pays, then see the published percentile
     choice     the one judgement call — what the gap means

   Every figure revealed is a published percentile selected from
   data/roles.json, never computed. That is both accurate and the
   CareerOneStop licence term.
   ===================================================================== */
(function () {
"use strict";

YNSActivity.define({
  slug: "floor",
  title: "The Floor",

  slots: [

    /* ---------------------------------------------------------------
       1. The build-up. Scores nothing — it establishes a fact, which is
       a more useful job than a score.
       --------------------------------------------------------------- */
    {
      id: "buildup",
      axes: [],
      ladder: [
        {
          asks: "floor_monthly",
          mechanic: "buildup",
          eyebrow: "The number",
          title: "What does your month cost?",
          scene: [
            "Think of the month where you pay what has to be paid and nothing breaks, rather than your ideal one.",
            "Most people have never added this up, so most people negotiate against a number they guessed."
          ],
          prompt: "Nudge each one until it looks about right.",
          totalLabel: "a month, to keep the lights on",
          cta: "That's my floor",
          minTotal: 1,
          /* Every row starts at ZERO.

             The first draft pre-filled these with plausible amounts, which
             summed to about $2,450 before anyone had touched anything.
             That is not a starting position, it is a conclusion: it
             anchors the number, and it lets someone press straight through
             to a "floor" that is really our guess about their life.

             Building it up from nothing is also the point of the exercise
             — the value is in going line by line, not in arriving at a
             total. Zero costs a few more taps and makes the number theirs. */
          rows: [
            { k: "housing",   t: "Rent or mortgage",         s: "Plus anything that comes with it. Service charge, lot rent, board", start: 0, step: 100, max: 8000 },
            { k: "food",      t: "Food",                     s: "Groceries, and the meals you don't cook", start: 0, step: 50,  max: 3000 },
            { k: "transport", t: "Getting around",           s: "Car payment, fuel, insurance, fares",     start: 0, step: 50,  max: 2000 },
            { k: "care",      t: "People who depend on you", s: "Childcare, elder care, money you send home", start: 0, step: 100, max: 5000 },
            { k: "debt",      t: "Debt payments",            s: "The minimums you can't skip",             start: 0, step: 50,  max: 4000 },
            { k: "health",    t: "Health",                   s: "Premiums, prescriptions, the regular costs", start: 0, step: 50, max: 2000 },
            { k: "other",     t: "Everything else",          s: "Phone, bills, and the things you'll remember later", start: 0, step: 50, max: 3000 }
          ],
          factsFrom: function (sum) { return { floor_monthly: sum }; }
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. Runway. Only worth asking once the floor exists, so it is a
       rung-1 slot with a rung-0 fallback that asks it cold.
       --------------------------------------------------------------- */
    {
      id: "runway",
      axes: [],
      ladder: [
        {
          asks: "runway_months",
          mechanic: "choice",
          eyebrow: "The other number",
          title: "How long could you hold out?",
          scene: [
            "If your income stopped tomorrow, how long before it got serious? Count savings, help from people, anything you could sell.",
            "This is the number that decides whether a change is a leap or a series of steps."
          ],
          prompt: "Whichever is closest.",
          options: [
            { k: "none", t: "Not even a month",    s: "This month's money pays this month's bills.", fact: 0, echo: "nothing saved up" },
            { k: "thin", t: "A month or two",      s: "There's a cushion, but it's a thin one.",           fact: 2, echo: "a month or two saved" },
            { k: "some", t: "Three to six months", s: "Enough to retrain part-time, or take a cut for a while.", fact: 4, echo: "three to six months saved" },
            { k: "lots", t: "More than six months", s: "You've got real room to move.",              fact: 9, echo: "more than six months saved" }
          ]
        },
        {
          needs: { fact: "floor_monthly" },
          asks: "runway_months",
          mechanic: "choice",
          eyebrow: "The other number",
          title: "How many of those months could you cover?",
          scene: [
            "You just said your month costs about what it costs. If the income stopped tomorrow, how many of those months could you pay for out of what you already have?"
          ],
          prompt: "Whichever is closest.",
          provenance: "Asked this way because you just worked out your monthly floor.",
          options: [
            { k: "none", t: "Less than one",      s: "This month's money pays this month's bills.", fact: 0, echo: "nothing saved up" },
            { k: "thin", t: "One or two of them", s: "There's a cushion, but it's a thin one.",           fact: 2, echo: "a month or two saved" },
            { k: "some", t: "Three to six",       s: "Enough to retrain part-time, or take a cut for a while.", fact: 4, echo: "three to six months saved" },
            { k: "lots", t: "More than six",      s: "You've got real room to move.",               fact: 9, echo: "more than six months saved" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. Guess the wage, then see the published figure.

       Deliberately after the floor: guessing a salary in the abstract is
       trivia, guessing it right after working out what you need is a
       decision.

       The job is named on screen while they guess. Asking "what do you
       think it pays?" without saying what "it" is, and then telling
       somebody they were out by 40%, is the sort of thing that makes a
       product feel like it is playing a trick on you.
       --------------------------------------------------------------- */
    {
      id: "guess",
      axes: [],
      ladder: [
        {
          mechanic: "estimate",
          eyebrow: "A quick test",
          title: "What do you think this job pays?",
          scene: [
            "Here's a job most people have an opinion about and almost nobody has a figure for.",
            "Slide to your guess for what someone a few years into it earns in a year, before tax."
          ],
          subject: function () { return guessRole("trades", "some").title + ", a few years in"; },
          prompt: "Most people are out by more than they expect.",
          min: 20000, max: 160000, step: 1000,
          truthLabel: "The published midpoint is",
          truth: function () { return guessRole("trades", "some").mid; },
          note: "Half the people in that job earn less than this and half earn more. It's not a starting salary."
        },
        {
          needs: { fact: "top_category" },
          mechanic: "estimate",
          eyebrow: "A quick test",
          title: "What do you think this job pays?",
          scene: function (v) {
            var name = catName(v && v.derived && v.derived.top_category);
            return [
              "Your answers keep pointing at " + escHTML(name) + ", so let's use a real job from it.",
              "Slide to your guess for what someone a few years into it earns in a year, before tax."
            ];
          },
          subject: function (v) {
            var d = v && v.derived;
            return guessRole(d && d.top_category, (d && d.level) || "some").title + ", a few years in";
          },
          provenance: "Using a job from the field your other answers keep pointing at.",
          prompt: "Most people are out by more than they expect.",
          min: 20000, max: 200000, step: 1000,
          truthLabel: "The published midpoint is",
          truth: function () {
            var c = YNSActivity.context();
            return guessRole(c.derived.top_category, c.derived.level || "some").mid;
          },
          note: "Half the people in that job earn less than this and half earn more. It's not a starting salary."
        }
      ]
    },

    /* ---------------------------------------------------------------
       4. The judgement call. The only slot here that scores, because
       what someone does about a gap says something about them.
       --------------------------------------------------------------- */
    {
      id: "gap",
      axes: ["order", "analysis", "leading"],
      ladder: [
        {
          asks: "floor_gap",
          mechanic: "choice",
          eyebrow: "The decision",
          title: "So what does that mean for you?",
          scene: [
            "You have a floor and you have a going rate. One of three things is true, and each one points somewhere different."
          ],
          prompt: "Which is closest?",
          options: [
            { k: "clears", t: "It clears my floor with room to spare",
              s: "Something other than money is in the way.",
              fact: "clears", echo: "the pay clears what I need", a: { analysis: 2, order: 1 } },
            { k: "tight",  t: "It clears it, barely",
              s: "It works, but nothing can go wrong.",
              fact: "tight", echo: "the pay only just covers it", a: { order: 3 } },
            { k: "short",  t: "It doesn't clear it",
              s: "Not at that level, anyway. Better to know that now than in year two.",
              fact: "short", echo: "the pay doesn't cover what I need yet", a: { leading: 2, analysis: 1 } }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       5. The one thing worth taking away from a screen full of wages.

       The first version led with "+64%" and then spent four sentences on
       how we picked our percentile bands. The point was the last line.

       Now it opens with the point, proves it with one real job's real
       numbers, and leaves the method as small print at the bottom where
       anybody who wants to check it can.
       --------------------------------------------------------------- */
    {
      id: "learn_percentile",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Worth knowing",
          title: "What a job pays on day one is not what it pays",

          lead: "Almost every job here pays a lot more once you've been doing it a while. " +
                "Same job, same place, same person.",

          example: function (v) {
            var e = payExample(v && v.derived && v.derived.top_category);
            if (!e) return null;
            return {
              label: e.title,
              fromLabel: "Starting out",
              from: money(e.low),
              toLabel: "Once experienced",
              to: money(e.high),
              note: "A jump of " + e.pct + "%. These are published government figures, not our guess."
            };
          },

          points: [
            "<b>Starting out</b>, you're near the bottom of that job's range.",
            "<b>A few years in</b>, you're around the middle.",
            "<b>Once you're experienced</b>, you're near the top."
          ],

          note: function () {
            var g = growth();
            return g
              ? "This is not one lucky job. Across the " + g.occupations + " jobs we can track " +
                "at more than one level, pay climbs by a median of " + g.median_pct + "%. The " +
                "smallest jump is " + g.min_pct + "%. The biggest is " + g.max_pct + "%."
              : "Every range here is a slice of one job's published pay, matched to where you " +
                "are standing today.";
          },

          cta: "Got it"
        }
      ]
    }

  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    /* The buildup slot is DROPPED for anyone who already has a floor on
       file — that is the resolver working as designed. Results has to
       cope with it, or the headline reads "$0 a month" for exactly the
       people who have used this product the most. */
    var fromThisRun = r.extra.buildup_number;
    var monthly = fromThisRun || r.ctx.facts.floor_monthly || r.ctx.stale.floor_monthly || 0;
    var recalled = !fromThisRun && !!monthly;
    /* Droppable on a re-run, so fall back to the stored fact. Both the
       answer and the fact are now the same key ("clears" | "tight" |
       "short"), which is why this is one lookup rather than a
       words-to-key translation table. */
    var gap = r.state.answers.gap || r.ctx.facts.floor_gap || "";
    var annual = Math.round(monthly * 12);
    var esc = r.esc, money = r.money;

    var ctx = r.ctx;
    var cat = ctx.derived.top_category;
    var level = ctx.derived.level || "some";
    var roles = (r.Quiz && cat) ? r.Quiz.rolesFor(cat, level) : [];

    var VERDICT = {
      clears: "Something other than money is in the way. That's good news, and also a harder " +
              "problem, because it means the thing stopping you hasn't been named yet.",
      tight:  "It works, with nothing spare. So the thing to protect is your cushion, not the " +
              "pay. Enough slack that one bad month doesn't undo the whole thing.",
      short:  "At that level it doesn't clear yet, and knowing today is worth a great deal more " +
              "than finding out in year two. It turns the question from <em>should I</em> into " +
              "<em>what would have to change</em>."
    };
    var verdict = VERDICT[gap] ||
      "You haven't said yet what that number means against what the work pays. That's the one " +
      "call nobody else can make for you, and it decides whether the floor is useful or just " +
      "sits there.";

    if (!monthly) {
      return "<h1>No number yet.</h1>" +
        '<p class="ya-result-lead">We did not get as far as a figure this time, and nothing ' +
        'you entered is lost. <a href="activity.html?a=floor">Run it again</a> when you have ' +
        "two minutes and the build-up will pick up from there.</p>";
    }

    return "<h1>" + money(monthly) + " a month.</h1>" +
      (recalled
        ? '<p class="ya-note">That is the floor you worked out last time, so we did not make you ' +
          "add it up again. If your life has changed, " +
          '<a href="activity.html?a=stilltrue">say so here</a>.</p>'
        : "") +
      '<p class="ya-result-lead">That\'s your floor. About ' + money(annual) +
      " a year before tax, just to stand still. It isn't a target and it isn't an ambition. " +
      "It is the line under which a job does not work, no matter how much you like it.</p>" +

      '<div class="ya-readout"><h3>What that changes</h3><p>' + verdict + "</p></div>" +

      (roles.length
        ? '<div class="ya-readout"><h3>Against ' +
          esc((r.Quiz.CATS[cat] || {}).name || "your field") + " at your level</h3>" +
          '<ul class="ya-roles">' + roles.slice(0, 3).map(function (x) {
            return "<li><span>" + esc(x[0]) + '</span><span class="pay">' + esc(x[1]) + "</span></li>";
          }).join("") + "</ul>" +
          (r.Quiz.salaryNote ? r.Quiz.salaryNote() : "") + "</div>"
        : '<div class="ya-readout"><h3>Next, the other half</h3><p>You now have the number. ' +
          "What you don't have yet is a field to hold it against, which is what the shorter " +
          '<a href="prototype-1-choose-your-own-adventure.html">Story</a> is for, and it takes five minutes.</p></div>');
  },

  actions: function (state, ctx) {
    var gap = state.answers.gap || (ctx && ctx.facts.floor_gap) || "";
    if (gap === "short") {
      return [
        "Find one role in this field that does clear your floor, and read what it asks for",
        "Work out the single biggest line in your month, and whether it's fixed",
        "Look up what the training costs. The number, not the impression"
      ];
    }
    return [
      "Check one real job posting against your floor before you get attached to it",
      "Write your floor down somewhere you'll see it when someone asks your expectations",
      "Find out what the same job pays two levels up from entry"
    ];
  }
});

/* The derived wage-growth stat, or null if the wage data has not loaded
   (in which case the learn card falls back to a version that makes no
   numeric claim at all, rather than one with a placeholder in it). */
function growth() {
  try {
    var d = window.Quiz && Quiz.wageData && Quiz.wageData();
    return (d && d.wage_growth && d.wage_growth.median_pct) ? d.wage_growth : null;
  } catch (e) { return null; }
}

/* The job we ask them to guess about, and its midpoint, from one lookup.

   These used to be worked out separately: the note named an electrician
   and the figure came from whatever role happened to sit first in the
   data. One reorder of roles.json and the question and the answer would
   have been about different jobs, with nothing to catch it.

   The band is parsed back out of the string quiz-shared renders rather
   than recomputed, so the figure shown is always one the licence permits
   us to display. */
function guessRole(cat, level, fallback) {
  var out = { title: "A skilled trade", mid: fallback || 58000 };
  try {
    var list = window.Quiz && Quiz.rolesFor(cat || "trades", level || "some");
    if (!list || !list.length) return out;
    out.title = list[0][0] || out.title;

    var band = list[0][1] || "";
    var nums = band.match(/\d+(?:\.\d+)?/g);
    if (!nums || !nums.length) return out;
    var mult = band.indexOf("k") >= 0 ? 1000 : 1;
    var lo = parseFloat(nums[0]) * mult;
    var hi = nums[1] ? parseFloat(nums[1]) * mult : lo;
    out.mid = Math.round((lo + hi) / 2);
    return out;
  } catch (e) { return out; }
}

/* One real job we can show at two levels, with its published bottom and
   top figures. A concrete pair of numbers for a job somebody has heard
   of does more than a median ever will.

   Prefers the person's own field, falls back to the trades, and returns
   null if the wage data has not loaded, in which case the card simply
   drops the example rather than inventing one. */
function payExample(cat) {
  try {
    var d = window.Quiz && Quiz.wageData && Quiz.wageData();
    if (!d || !d.categories) return null;

    var order = [cat, "trades", "health", "biz"].filter(Boolean);
    for (var i = 0; i < order.length; i++) {
      var c = d.categories[order[i]];
      if (!c) continue;

      var bySoc = {};
      ["early", "some", "experienced", "leader"].forEach(function (lvl) {
        (c[lvl] || []).forEach(function (r) {
          (bySoc[r.soc] = bySoc[r.soc] || []).push(r);
        });
      });

      /* The widest spread we can show honestly, so the example is the
         clearest one available rather than whichever came first. */
      var best = null;
      Object.keys(bySoc).forEach(function (soc) {
        var rows = bySoc[soc];
        if (rows.length < 2) return;
        var low = Math.min.apply(null, rows.map(function (r) { return r.low; }));
        var high = Math.max.apply(null, rows.map(function (r) { return r.high; }));
        if (low <= 0) return;
        var pct = Math.round((high - low) / low * 100);
        if (!best || pct > best.pct) {
          best = { title: rows[0].title, low: low, high: high, pct: pct };
        }
      });
      if (best) return best;
    }
    return null;
  } catch (e) { return null; }
}

/* The same short form quiz-shared.js uses for every other wage in the
   product. Two full figures side by side is a lot of digits, and mixing
   two money formats in one activity looks like a mistake. */
function money(n) {
  return "$" + Math.round(n / 1000) + "k";
}

function catName(cat) {
  var T = window.YNSTaxonomy;
  return (T && cat && T.label(cat)) || "that field";
}

function escHTML(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

})();
