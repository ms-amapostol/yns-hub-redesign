/* =====================================================================
   The Match — retirement, and the one thing to do about it this year.

   Door 4 · Mindset and money. Module 5, "All Things Retirement".

   Outcome: "I know what a 401k, a 403b, a pension and a Roth IRA are,
   and I know whether my job gives me free money I'm not taking."

   Design notes:

   * Everything in this activity points at the match, because for
     someone early in work the employer match is the single highest-
     return decision available and most people don't know it exists.
     The calculator shows what the match is worth in dollars, using the
     class's own $40,000 example as the default.

   * The plan types are explained in the class's own terms: 401k for the
     private sector, 403b for nonprofits and education, pensions where
     the employer carries the risk, Roth IRA on your own.

   * Describe, never recommend a provider. The "do this" at the end is
     "find out whether there's a match and take it", which is the one
     piece of money advice that has no reasonable counter-argument.
   ===================================================================== */
(function () {
"use strict";

function money(n) { return "$" + Math.round(n || 0).toLocaleString("en-US"); }

YNSActivity.define({
  slug: "retire",
  title: "The Match",

  slots: [
    {
      id: "frame",
      axes: [],
      ladder: [{
        mechanic: "learn",
        eyebrow: "Six minutes",
        title: "Retirement is far off. The match is not.",
        lead: "Some jobs add money to your retirement account for every dollar you put in. That\u2019s a raise most people never claim.",
        points: [
          "<b>A 401k</b> is the retirement plan at most for-profit employers. You put in a percentage of your pay before tax; many employers add a match.",
          "<b>A 403b</b> is the same thing at nonprofits, schools and hospitals.",
          "<b>A pension</b> is the older model: the employer promises a set amount every month after you retire, and carries the risk of making sure it\u2019s there.",
          "<b>A Roth IRA</b> is one you open yourself, with money you\u2019ve already paid tax on. It grows, and you don\u2019t pay tax when you take it out."
        ],
        note: "The class\u2019s rule holds for all four: the sooner you start, the more the years do the work.",
        cta: "Show me the match"
      }]
    },
    {
      id: "calc",
      axes: [],
      ladder: [{
        asks: "match_pct",
        mechanic: "calc",
        eyebrow: "What the match is worth",
        title: "Put in your pay and see the free money.",
        scene: [
          "The class\u2019s example: $40,000 a year, contributing 3%, matched at 3%. Change any of it to your own numbers."
        ],
        prompt: "Three numbers. Watch the bottom one.",
        inputs: [
          { k: "salary", t: "Your pay, before tax, per year", prefix: "$", start: 40000, step: 1000, max: 250000, s: "The number on the offer, not the number that lands." },
          { k: "you",    t: "What you put in",                prefix: "",  suffix: "%", start: 3, step: 1, max: 20, s: "A percentage of pay. Comes out before tax, so it costs less than it looks." },
          { k: "match",  t: "What your employer matches",     prefix: "",  suffix: "%", start: 3, step: 1, max: 10, s: "Ask HR, or look at the benefits page. Zero is a real answer." }
        ],
        mode: "match",
        cta: "I see it"
      }]
    },
    {
      id: "penalty",
      axes: [],
      ladder: [{
        mechanic: "learn",
        eyebrow: "Two things to know",
        title: "It\u2019s tax-free going in, and locked until you\u2019re older.",
        lead: "Both of those are the point.",
        points: [
          "<b>Before tax.</b> The class\u2019s example: $40,000 pay, 5% into a 401k is $2,000, and you\u2019re taxed on $38,000. So $2,000 saved costs you less than $2,000 in take-home.",
          "<b>Locked.</b> Take it out early and there\u2019s a 10% penalty on top of the tax. That\u2019s deliberate. It\u2019s the money that stays put.",
          "<b>Taxed later.</b> A 401k or 403b is taxed when you take it out in retirement. A Roth is the other way round: taxed now, free later."
        ],
        cta: "Got it"
      }]
    },
    {
      id: "status",
      axes: [],
      ladder: [{
        asks: "retire_status",
        mechanic: "choice",
        eyebrow: "Where you are",
        title: "Which is closest to true right now?",
        prompt: "Honestly.",
        options: [
          { k: "unknown", t: "I don\u2019t know if my job has a plan or a match", s: "The most common answer, and the first one to fix. It\u2019s one question to HR.", echo: "you don\u2019t know yet" },
          { k: "not_in",  t: "There\u2019s a plan and I\u2019m not in it",       s: "Then there may be free money on the table right now.", echo: "there\u2019s a plan you\u2019re not in" },
          { k: "under",   t: "I\u2019m in it, below the full match",         s: "Every percent up to the match is an instant return.", echo: "you\u2019re below the match" },
          { k: "full",    t: "I\u2019m in it, getting the full match",       s: "Then you\u2019ve done the highest-value thing already.", echo: "you\u2019ve got the full match" },
          { k: "none",    t: "No plan where I work",                        s: "Then a Roth IRA is the one you open yourself.", echo: "no plan at work" }
        ]
      }]
    }
  ],

  results: function (r) {
    var esc = r.esc;
    var v = r.extra.calc_values || {};
    var res = r.extra.calc_result || {};
    var status = r.state.answers.status || r.ctx.facts.retire_status || "";

    var STATUS = {
      unknown: "You don\u2019t know whether there\u2019s a match. That\u2019s one message to HR or one look at the benefits page, and it might be the best-paid ten minutes of the year.",
      not_in:  "There\u2019s a plan and you\u2019re not in it. If there\u2019s a match, every month outside it is money your employer offered and you left behind. Enrolling is a form.",
      under:   "You\u2019re in, below the full match. Each percent you add up to the match is matched, which is a 100% return on that percent before it even grows.",
      full:    "You\u2019ve got the full match. That\u2019s the highest-value move done. What Money Does Over Time shows what it becomes; the next lever is a Roth IRA on the side, when there\u2019s room.",
      none:    "No plan at work. Then the one you can open yourself is a Roth IRA: after-tax money in, no tax on the way out, and the same years doing the same work."
    };

    return "<h1>That\u2019s the match.</h1>" +
      (res.matchYear != null
        ? '<div class="ya-quote">' + money(res.matchYear) + " a year from your employer, for " + money(res.youYear) + " from you.</div>" +
          '<div class="ya-readout"><h3>Over ten years, at the same numbers</h3><p>About ' + money(res.tenYear) +
          " in the account, roughly half of which you never earned. That uses the same 7% assumption as the compounding activity, and it\u2019s an assumption rather than a promise.</p></div>"
        : "") +
      '<div class="ya-readout"><h3>The four, in one line each</h3><p>' +
      "<b>401k</b> \u00b7 private-sector plan, before tax, often matched.<br>" +
      "<b>403b</b> \u00b7 the same at nonprofits, schools, hospitals.<br>" +
      "<b>Pension</b> \u00b7 a promised monthly amount; the employer carries the risk.<br>" +
      "<b>Roth IRA</b> \u00b7 yours, opened yourself, taxed now and free later.</p></div>" +
      (STATUS[status] ? '<div class="ya-readout"><h3>Where you are with it</h3><p>' + esc(STATUS[status]) + "</p></div>" : "") +
      '<p class="ya-result-lead">Nothing here recommends a provider or a fund. It says one thing: if there\u2019s a match, take it. The full Module 5 goes into the rest, with the videos.</p>';
  },

  actions: function (state) {
    var s = (state && state.answers && state.answers.status) || "";
    if (s === "unknown") return ["Ask HR one question: is there a retirement plan, and is there a match?", "Find the benefits page and read the one paragraph about retirement", "Write down the match percentage where you\u2019ll see it"];
    if (s === "not_in")  return ["Find the enrolment form and fill it in this week", "Set your contribution to at least the match", "Check your next payslip to confirm it started"];
    if (s === "under")   return ["Raise your contribution to the full match", "Check the payslip after to confirm", "Do Every Dollar a Job so the extra has somewhere to come from"];
    if (s === "none")    return ["Look up what a Roth IRA is at one provider, just to see the form", "Decide an amount you wouldn\u2019t miss, even $25", "Do What Money Does Over Time with that number"];
    return ["Look at your last payslip and find the retirement line", "Note what percentage you\u2019re at", "Read the one paragraph on the benefits page about Roth options"];
  }
});

})();
