/* =====================================================================
   What Money Does Over Time — compound interest, made concrete.

   Door 4 · Mindset and money. Module 5.

   Outcome: "I've seen what a small monthly amount turns into, and I know
   what the difference between starting now and starting later costs."

   Design notes:

   * The activity is the calculator. Explaining compounding in words
     moves nobody; watching $50 a month become a five-figure number, and
     then watching that number shrink when you start ten years later, is
     the whole lesson in about fifteen seconds.

   * Every figure is typed. The amounts people care about are specific.

   * The default is $25, not $500. For this audience a default of $500 is
     a door closing. $25 is a fortnight of one subscription.

   * Nothing here recommends an investment, a product, or a provider.
     The rate is labelled as an assumption and the copy says plainly that
     real returns move around and can be negative. This teaches the
     mechanism and stops there, which is the honest limit of what a
     career site should do.
   ===================================================================== */
(function () {
"use strict";

function money(n) { return "$" + Math.round(n || 0).toLocaleString("en-US"); }

YNSActivity.define({
  slug: "compound",
  title: "What Money Does Over Time",

  slots: [

    /* ---------------------------------------------------------------
       1. The idea, in the smallest number of words that works.
       --------------------------------------------------------------- */
    {
      id: "frame",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Six minutes",
          title: "Money left alone earns money. Then that earns money too.",
          lead: "That second part is compounding, and it\u2019s the reason a small amount started early beats a big amount started late.",
          points: [
            "<b>Year one is boring.</b> Nothing much happens and most people stop here.",
            "<b>Year fifteen is not boring.</b> By then more of the total is growth than is money you put in.",
            "<b>The thing you can\u2019t buy back is time.</b> Ten years of waiting costs more than ten years of bigger payments can make up."
          ],
          note: "The next screen is a calculator. Put your own numbers in it.",
          cta: "Show me"
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. The calculator.
       --------------------------------------------------------------- */
    {
      id: "calc",
      axes: [],
      ladder: [
        {
          asks: "compound_monthly",
          mechanic: "calc",
          eyebrow: "Your numbers",
          title: "Put in what you could actually spare.",
          scene: [
            "Not what you wish you could. Something small and real beats something big and imaginary, which is the entire point of the exercise."
          ],
          prompt: "Change any of these and watch the bottom number move.",
          inputs: [
            { k: "monthly", t: "Every month",        prefix: "$", start: 25, step: 25,  max: 5000, s: "Start small. You can always raise it." },
            { k: "years",   t: "For how many years", prefix: "",  start: 20, step: 5,   max: 50,   s: "Compounding needs time more than it needs money." },
            { k: "rate",    t: "Assumed yearly return", prefix: "", suffix: "%", start: 7, step: 1, max: 15, s: "7% is a common long-run assumption for a broad stock market fund, before inflation. It is an assumption, not a promise." }
          ],
          cta: "I\u2019ve seen enough"
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. The one honest caution, before the result screen, so nobody
       walks away thinking this is advice.
       --------------------------------------------------------------- */
    {
      id: "truth",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Worth being straight about",
          title: "Real money doesn\u2019t move in a smooth line.",
          lead: "A calculator draws a tidy curve. Actual markets go up and down, and some years they go down a lot.",
          points: [
            "<b>The number you just saw is a model.</b> It shows what could happen if the assumptions hold.",
            "<b>Pay off high-interest debt first.</b> A card at 24% beats any return you\u2019re likely to earn, so clearing it is the better move.",
            "<b>If your job offers a retirement match, that\u2019s the first place money should go.</b> A match is an immediate return nothing else competes with.",
            "<b>We don\u2019t recommend any provider, fund or account.</b> Your Next Step does offer an optional paid course, with videos and more structure. Joining is always up to you."
          ],
          cta: "Understood"
        }
      ]
    },

    /* ---------------------------------------------------------------
       4. What they'll actually do, if anything. "Not yet" is allowed and
       is the right answer for someone with no buffer.
       --------------------------------------------------------------- */
    {
      id: "intent",
      axes: [],
      ladder: [
        {
          asks: "compound_intent",
          mechanic: "choice",
          eyebrow: "Last one",
          title: "Where are you with this right now?",
          scene: [
            "No wrong answer, and the honest one is the useful one."
          ],
          prompt: "Closest to true.",
          options: [
            { k: "match",   t: "My job has a retirement match I\u2019m not using",
              s: "That\u2019s the highest-value thing on this whole page.", echo: "there\u2019s a match you\u2019re not using" },
            { k: "start",   t: "I could start something small",
              s: "Even $20 a month, mostly to build the habit.", echo: "you could start small" },
            { k: "debt",    t: "I\u2019ve got debt to clear first",
              s: "Usually the right call, and the maths agrees with you.", echo: "debt comes first" },
            { k: "nothing", t: "There\u2019s nothing spare right now",
              s: "Then this was for later, and later is fine. Knowing it exists is the point.", echo: "nothing spare yet" }
          ]
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    var v = r.extra.calc_values || {};
    var monthly = v.monthly || 0, years = v.years || 0, rate = v.rate || 0;
    var totals = r.extra.calc_result || {};
    var intent = r.state.answers.intent || "";

    var INTENT = {
      match:   "You said there\u2019s a match at work you\u2019re not using. That\u2019s the single highest-value thing on this page, and it\u2019s usually a form and ten minutes. Find out the percentage they match and put in at least that much.",
      start:   "You said you could start something small. The amount matters far less than starting, because the thing you can never buy back is the years.",
      debt:    "You said debt comes first. That\u2019s almost always right. A card at 20-something percent costs more than any likely return earns, so clearing it is the better investment.",
      nothing: "You said there\u2019s nothing spare, and that\u2019s an honest answer that plenty of people are giving. The Floor and Every Dollar a Job are the two that change it, and this one will still be here."
    };

    return "<h1>That\u2019s what time does.</h1>" +
      (totals.end
        ? '<div class="ya-quote">' + money(monthly) + " a month for " + years + " years \u2192 " + money(totals.end) +
          "<br><span style=\"font-size:.85rem\">" + money(totals.paid) + " of that is money you put in. " +
          money(totals.growth) + " is growth.</span></div>"
        : "") +
      (totals.late
        ? '<div class="ya-readout"><h3>What waiting costs</h3><p>Starting the same amount ten years later lands at ' +
          money(totals.late) + " instead. The gap is <b>" + money(totals.end - totals.late) +
          "</b>, and it was bought with time rather than money.</p></div>"
        : "") +
      '<div class="ya-readout"><h3>The assumption</h3><p>This uses ' + rate +
      "% a year, compounded monthly. Real returns move around and some years are negative. It\u2019s a model of how compounding works, not a prediction and not advice.</p></div>" +
      (INTENT[intent] ? '<div class="ya-readout"><h3>Where you are with it</h3><p>' + esc(INTENT[intent]) + "</p></div>" : "");
  },

  actions: function (state) {
    var intent = (state && state.answers && state.answers.intent) || "";
    if (intent === "match") {
      return [
        "Find out whether your job matches retirement contributions, and by how much",
        "Ask HR or check the benefits page for the form",
        "Put in at least enough to get the full match"
      ];
    }
    if (intent === "debt") {
      return [
        "Write down every debt with its interest rate, highest first",
        "Put anything spare at the highest rate one",
        "Come back to this when the top one is cleared"
      ];
    }
    return [
      "Work out one amount you could move out on payday without noticing",
      "Find out whether your job offers a retirement match",
      "Do Every Dollar a Job so the amount has somewhere to come from"
    ];
  }
});

})();
