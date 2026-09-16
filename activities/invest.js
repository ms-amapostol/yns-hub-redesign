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
    },
    /* The whole point, in one screen: the same money, five places, and
       what the gap looks like after time. Risk is named next to every
       number so nobody reads the biggest one as a recommendation. */
    {
      id: "compare",
      axes: [],
      ladder: [
        {
          mechanic: "calc",
          eyebrow: "See the difference",
          title: "Same money. Five places. Watch what time does.",
          scene: [
            "Put in what you could set aside in a year, then move the years and the rates. The rates filled in are ordinary long-run figures rather than promises, and they are yours to change.",
            "The gap at the bottom is what taking risk has historically paid. The top two rows are what not taking risk guarantees."
          ],
          prompt: "Your numbers.",
          inputs: [
            { k: "annual", t: "What you\u2019d put in a year", prefix: "$", start: 1200, step: 300, max: 50000, s: "$1,200 is $100 a month." },
            { k: "years",  t: "For how many years",            prefix: "", start: 20, step: 5, max: 30, s: "Moves in fives, up to 30." },
            { k: "hysa",   t: "Savings account rate",          prefix: "", suffix: "%", start: 4, step: 1, max: 6, s: "High-yield savings. Moves with the market." },
            { k: "cd",     t: "CD rate",                       prefix: "", suffix: "%", start: 4, step: 1, max: 7, s: "Locked for a term." },
            { k: "bond",   t: "Bonds and money market",        prefix: "", suffix: "%", start: 5, step: 1, max: 8, s: "Steadier than stocks, lower ceiling." },
            { k: "etf",    t: "Index fund or ETF",             prefix: "", suffix: "%", start: 9, step: 1, max: 12, s: "Long-run US stock market average, before inflation." },
            { k: "stock",  t: "Individual stocks",             prefix: "", suffix: "%", start: 9, step: 1, max: 15, s: "Same average, far wider spread. Some go to zero." }
          ],
          compute: function (v) {
            var yrs = Math.max(0, Math.min(30, v.years || 0));
            function g(rate) { var b = 0; for (var i = 0; i < yrs; i++) b = (b + (v.annual || 0)) * (1 + rate / 100); return b; }
            var rows = [
              { t: "Savings account",     risk: "No risk to what you put in", r: v.hysa,  end: g(v.hysa || 0) },
              { t: "CD",                  risk: "No risk, locked up",         r: v.cd,    end: g(v.cd || 0) },
              { t: "Bonds, money market", risk: "Low risk",                   r: v.bond,  end: g(v.bond || 0) },
              { t: "Index fund or ETF",   risk: "Real risk, spread wide",     r: v.etf,   end: g(v.etf || 0) },
              { t: "Individual stocks",   risk: "Highest risk",               r: v.stock, end: g(v.stock || 0) }
            ];
            return { rows: rows, paid: (v.annual || 0) * yrs, years: yrs };
          },
          render: function (r) {
            var max = Math.max.apply(null, r.rows.map(function (x) { return x.end; })) || 1;
            var m = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
            return '<p class="calc-sub">You would have put in ' + m(r.paid) + " over " + r.years + " years.</p>" +
              '<div class="iv-rows">' + r.rows.map(function (x) {
                return '<div class="iv-row"><div class="iv-t"><b>' + x.t + "</b><span>" + x.risk + " \u00b7 " + (x.r || 0) + "%</span></div>" +
                  '<div class="iv-bar"><i style="width:' + Math.round(x.end / max * 100) + '%"></i></div>' +
                  '<div class="iv-n">' + m(x.end) + "</div></div>";
              }).join("") + "</div>" +
              '<p class="calc-late">The gap between the bottom row and the top row is ' + m(r.rows[4].end - r.rows[0].end) +
              ". That gap is the reward for risk, and the risk is real: the bottom two can fall, and a single company can go to nothing. The top two cannot fall, which is exactly what you are paying for.</p>";
          },
          cta: "That\u2019s the picture"
        }
      ]
    },
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
      "Module 5 of the optional paid Your Next Step course goes deeper on all five, with videos.</p>";
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
