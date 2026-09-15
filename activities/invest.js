/* =====================================================================
   Where Money Can Live — five places, from safest to riskiest.

   Door 4 · Mindset and money. Module 5, "Opportunities to Grow Your
   Wealth".

   Outcome: "I can name the five places money can sit, I know which end
   of the risk line each one is on, and I know where money I'll need soon
   should go."

   Design notes:

   * One screen per place, in order of risk, with the class's own
     example where it has one (the $1,000 in a plain savings account
     versus an HYSA). Each screen is three lines. The whole thing is
     five minutes.

   * The decision at the end is the one that actually matters for this
     audience: where does money you'll need within a year go. The answer
     is the safe end, and getting that one right protects people from
     the most common mistake, which is putting the rent money somewhere
     that can drop.

   * Describe, never recommend. No provider, no product, no "you should".
     The rate figures are the class's illustrations and are labelled as
     illustrations.
   ===================================================================== */
(function () {
"use strict";

var PLACES = [
  { k: "savings", t: "A plain savings account", risk: 0,
    lead: "Where most people\u2019s money already sits.",
    body: [
      "Safe, instant, and it earns almost nothing. The class\u2019s example: $1,000 in a typical savings account earns about $5 in a year.",
      "Right for money you need this month. Wrong for money you won\u2019t touch for a year, because it quietly loses ground to prices going up."
    ] },
  { k: "hysa", t: "A high-yield savings account", risk: 1,
    lead: "Same safety, better rate.",
    body: [
      "An HYSA is a savings account that pays a real rate. The class\u2019s example: the same $1,000 earns around $50 in a year instead of $5. The rate moves with the market, so that figure is an illustration rather than a promise.",
      "Still instant, still safe. This is the usual home for a surprise fund."
    ] },
  { k: "cd", t: "A certificate of deposit", risk: 1,
    lead: "Lock it up for a while, get a bit more.",
    body: [
      "A CD holds your money for a set time, six months, a year, five years, and pays a slightly higher rate for the wait. Longer lock, higher rate.",
      "The catch is the lock. Take it out early and there\u2019s a penalty. Right for money you know you won\u2019t need until a date you can name."
    ] },
  { k: "market_low", t: "Money market funds and bonds", risk: 2,
    lead: "The low end of investing.",
    body: [
      "These sit in the market but at the calm end. Returns are modest, often a little above an HYSA, and the chance of losing money is small.",
      "This is where \u201cinvesting\u201d starts. It is also where a lot of people should stop for a while, and that\u2019s fine."
    ] },
  { k: "stocks", t: "Stocks, ETFs and mutual funds", risk: 3,
    lead: "The high end: more growth, real risk.",
    body: [
      "Over long stretches the stock market has returned more than anything else on this list, and in any given year it can drop hard. The class puts the long-run figure around 9\u201310% a year, with the honest caveat that you can lose money, including all of it in a single company.",
      "ETFs and mutual funds hold many companies at once, so one bad company doesn\u2019t sink you. That spreading is what people mean by diversified, and it\u2019s the difference between investing and betting."
    ] }
];

YNSActivity.define({
  slug: "invest",
  title: "Where Money Can Live",

  slots: [
    {
      id: "frame",
      axes: [],
      ladder: [{
        mechanic: "learn",
        eyebrow: "Five minutes",
        title: "Money can sit in five kinds of place.",
        lead: "They run from \u201ccan\u2019t lose it, barely grows\u201d to \u201ccan grow a lot, can also drop\u201d. Knowing which is which is most of what people mean by financial literacy.",
        points: [
          "<b>Safe end:</b> a plain savings account, a high-yield savings account, a CD.",
          "<b>Middle:</b> money market funds and bonds.",
          "<b>Growth end:</b> stocks, ETFs, mutual funds."
        ],
        note: "Nothing here recommends a product or a company. It describes the five places and what each is for.",
        cta: "Walk me through them"
      }]
    }
  ].concat(PLACES.map(function (p, i) {
    return {
      id: p.k,
      axes: [],
      ladder: [{
        mechanic: "learn",
        eyebrow: (i + 1) + " of 5 \u00b7 " + ["Safest", "Safe", "Safe", "Middle", "Growth end"][i],
        title: p.t,
        lead: p.lead,
        body: p.body,
        cta: i === 4 ? "Got it" : "Next one"
      }]
    };
  })).concat([
    {
      id: "decide",
      axes: [],
      ladder: [{
        asks: "invest_soon",
        mechanic: "choice",
        eyebrow: "The one decision",
        title: "Money you\u2019ll need within a year. Where does it go?",
        scene: [
          "Rent money, the car repair fund, the course fee due in March. This is the question that protects people from the commonest mistake."
        ],
        prompt: "Pick one.",
        options: [
          { k: "safe",   t: "The safe end. Savings, HYSA, maybe a short CD", s: "It has to be there when the date arrives.", echo: "the safe end" },
          { k: "middle", t: "The middle. A money market fund", s: "Probably fine, and a little more return.", echo: "the middle" },
          { k: "growth", t: "The growth end. Stocks or an ETF", s: "It might grow more by then.", echo: "the growth end" }
        ]
      }]
    },
    {
      id: "horizon",
      axes: [],
      ladder: [{
        asks: "invest_horizon",
        mechanic: "choice",
        eyebrow: "And the other way round",
        title: "Money you won\u2019t touch for ten years or more?",
        scene: ["Retirement money, or a long-off goal. Same five places, different answer."],
        prompt: "Pick one.",
        options: [
          { k: "safe",   t: "Keep it safe anyway", s: "Nothing wrong with sleeping well.", echo: "keep it safe" },
          { k: "growth", t: "The growth end, spread across many companies", s: "Time is what makes the ups and downs even out.", echo: "growth, spread out" },
          { k: "unsure", t: "I\u2019d want to learn more first", s: "The honest answer, and the right one for most people at this point.", echo: "learn more first" }
        ]
      }]
    }
  ]),

  results: function (r) {
    var esc = r.esc;
    var soon = r.state.answers.decide || r.ctx.facts.invest_soon || "";
    var far = r.state.answers.horizon || r.ctx.facts.invest_horizon || "";

    var SOON = {
      safe:   "You put next year\u2019s money at the safe end. That is the answer, and the reason is the date: the rent doesn\u2019t care whether the market had a bad month.",
      middle: "You put next year\u2019s money in the middle. Usually fine, and the safe end is the textbook answer because a money market fund can still dip in a bad stretch, and the rent has a date on it.",
      growth: "You put next year\u2019s money at the growth end. That\u2019s the common mistake, and it\u2019s worth knowing why: the market can drop 20% in a year, and if that year is the one the course fee is due, the fee is still due. Money with a date goes to the safe end."
    };
    var FAR = {
      safe:   "For ten-year money you\u2019d still keep it safe. Nothing wrong with that. The trade is real, though: over that stretch the safe end tends to lose to prices rising, and the growth end tends to beat them. Worth revisiting once there\u2019s a buffer.",
      growth: "For ten-year money you\u2019d go to the growth end, spread across many companies. That\u2019s the textbook answer, because time is what evens out the drops. What Money Does Over Time shows what that looks like in numbers.",
      unsure: "For ten-year money you\u2019d want to learn more first. That\u2019s the honest answer and the responsible one. The full lesson on this, with video, is in Module 5."
    };

    return "<h1>Five places, and you know which is which.</h1>" +
      '<div class="ya-readout"><h3>Safe end</h3><p>Savings \u00b7 high-yield savings \u00b7 CDs. For money with a date on it.</p></div>' +
      '<div class="ya-readout"><h3>Middle</h3><p>Money market funds \u00b7 bonds. Modest returns, small risk.</p></div>' +
      '<div class="ya-readout"><h3>Growth end</h3><p>Stocks \u00b7 ETFs \u00b7 mutual funds. Higher over long stretches, can drop hard in any one year. Spreading across many companies is what makes it investing rather than betting.</p></div>' +
      (SOON[soon] ? '<div class="ya-readout"><h3>Money you need within a year</h3><p>' + esc(SOON[soon]) + "</p></div>" : "") +
      (FAR[far] ? '<div class="ya-readout"><h3>Money you won\u2019t touch for ten years</h3><p>' + esc(FAR[far]) + "</p></div>" : "") +
      '<p class="ya-result-lead">None of this is advice about what to buy. It\u2019s the map. ' +
      "The full version of Module 5, with the videos and the coach, goes deeper on all five.</p>";
  },

  actions: function () {
    return [
      "Find out what rate your current savings account actually pays",
      "Look up one high-yield savings account and compare the rate",
      "Decide which of your money has a date on it, and which doesn\u2019t"
    ];
  }
});

})();
