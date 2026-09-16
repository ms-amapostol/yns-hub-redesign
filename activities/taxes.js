/* =====================================================================
   Where Your Paycheck Goes — taxes, at the level that matters.

   Door 4 · Mindset and money. Module 5, "All about the Benjamins" and
   "Gross vs. Net Income".

   Outcome: "I can read a payslip. I know what each line taking money
   out is for, and I know what the W-4 does."

   Design notes:

   * A paycheck has four kinds of line coming out. Naming them is the
     whole lesson. This is not a tax course; it's the four-minute version
     that turns a confusing stub into a readable one.

   * The calculator uses the class's own rule of thumb: 25\u201331% comes
     out, which for $40,000 gross lands around $2,500 a month net. It
     says so, and it does not pretend to compute anyone's actual tax.
     Actual withholding depends on state, filing status and the W-4, and
     the activity says that plainly rather than faking precision.

   * The one action is checking the W-4, because it's the one thing on
     the whole stub the person controls.
   ===================================================================== */
(function () {
"use strict";

function money(n) { return "$" + Math.round(n || 0).toLocaleString("en-US"); }

YNSActivity.define({
  slug: "taxes",
  title: "Where Your Paycheck Goes",

  slots: [
    {
      id: "frame",
      axes: [],
      ladder: [{
        mechanic: "learn",
        eyebrow: "Four minutes",
        title: "Four kinds of line take money out of a paycheck.",
        lead: "Once you can name them, a payslip stops being a mystery. That\u2019s the whole lesson.",
        points: [
          "<b>Federal income tax.</b> The big one. How much depends on how much you earn and what you told them on the W-4.",
          "<b>State income tax.</b> Most states take some. A few take none.",
          "<b>Social Security and Medicare.</b> Together they\u2019re called FICA, a fixed slice of every paycheck. They fund the benefits people draw later.",
          "<b>The things you chose.</b> Health insurance, retirement contributions. Money going somewhere for you, taken out before you see it."
        ],
        note: "The class\u2019s rule of thumb: 25\u201331% of gross pay comes out across all of these. You live on what\u2019s left.",
        cta: "Show me on a real number"
      }]
    },
    {
      id: "calc",
      axes: [],
      ladder: [{
        mechanic: "calc",
        eyebrow: "Gross to net",
        title: "Put in the number on the offer.",
        scene: [
          "This uses the class\u2019s rule of thumb, not your actual tax. Real withholding depends on your state, your W-4 and your benefits. This is for getting the size right, which is what most people get wrong."
        ],
        prompt: "The yearly figure, before anything comes out.",
        inputs: [
          { k: "salary", t: "Pay before tax, per year", prefix: "$", start: 40000, step: 1000, max: 250000, s: "Hourly? Rate times hours a week times 52." },
          { k: "pct",    t: "Comes out, roughly",         prefix: "",  suffix: "%", start: 25, step: 1, max: 40, s: "The class says 25\u201331% is typical. Higher with more benefits or a higher-tax state." }
        ],
        mode: "net",
        cta: "That\u2019s the size of it"
      }]
    },
    {
      id: "w4",
      axes: [],
      ladder: [{
        mechanic: "learn",
        eyebrow: "The one thing you control",
        title: "The W-4 is the form that decides how much they hold back.",
        lead: "You fill it in when you start a job. Most people rush it and never look again.",
        points: [
          "<b>Hold back too little</b> and you owe money in April.",
          "<b>Hold back too much</b> and you get a refund, which sounds nice and is actually your own money you lent the government for free all year.",
          "<b>You can change it any time.</b> Ask HR for the form. If your life changed, a second job, a kid, a marriage, it probably should."
        ],
        cta: "Got it"
      }]
    },
    {
      id: "status",
      axes: [],
      ladder: [{
        asks: "taxes_status",
        mechanic: "choice",
        eyebrow: "Last one",
        title: "Your last payslip. Could you name every line on it?",
        prompt: "Honestly.",
        options: [
          { k: "yes",     t: "Yes, all of them",              s: "Then this was a refresher.", echo: "you can read it" },
          { k: "most",    t: "Most of them",                  s: "The ones you can\u2019t are usually the FICA pair.", echo: "most of it" },
          { k: "no",      t: "Not really, I just look at the total", s: "Most people. The next payslip is the one to read properly.", echo: "just the total" },
          { k: "none",    t: "I haven\u2019t had a payslip yet",   s: "Then you\u2019ll read your first one better than most people read their fiftieth.", echo: "no payslip yet" }
        ]
      }]
    }
  ],

  results: function (r) {
    var esc = r.esc;
    var v = r.extra.calc_values || {};
    var res = r.extra.calc_result || {};
    var status = r.state.answers.status || r.ctx.facts.taxes_status || "";
    var STATUS = {
      yes:  "You can read the whole thing. Then the only question left is whether the W-4 still fits your life.",
      most: "Most of it. The FICA pair, Social Security and Medicare, is usually the gap, and now you\u2019ve got it.",
      no:   "You look at the total. Everyone does at first. Next payslip, find the four kinds of line. It takes one minute and you\u2019ll never un-see it.",
      none: "No payslip yet. Good timing: when the first one arrives you\u2019ll know what the lines are before you\u2019ve had a chance to be confused by them."
    };
    return "<h1>That\u2019s where it goes.</h1>" +
      (res.netMonth != null
        ? '<div class="ya-quote">' + money(v.salary) + " a year on the offer \u2192 about " + money(res.netMonth) + " a month in your account.</div>" +
          '<div class="ya-readout"><h3>The gap</h3><p>Roughly ' + money(res.outYear) + " a year comes out, across federal and state tax, Social Security and Medicare, and anything you chose like insurance or retirement. That\u2019s the class\u2019s rule of thumb at " + (v.pct || 0) + "%, not your actual withholding.</p></div>"
        : "") +
      '<div class="ya-readout"><h3>The four lines</h3><p><b>Federal tax</b> \u00b7 <b>State tax</b> \u00b7 <b>FICA</b> (Social Security and Medicare) \u00b7 <b>What you chose</b> (insurance, retirement).</p></div>' +
      (STATUS[status] ? '<div class="ya-readout"><h3>Where you are with it</h3><p>' + esc(STATUS[status]) + "</p></div>" : "") +
      '<p class="ya-result-lead">This is the high-level version, which is the level that matters for negotiating and budgeting. Module 5 of the optional paid Your Next Step course has the full lesson, with video.</p>';
  },

  actions: function () {
    return [
      "Find your last payslip and name the four kinds of line",
      "Ask HR for your W-4 and check it still matches your life",
      "Redo The Floor or Money, Plainly using the net figure, not the offer"
    ];
  }
});

})();
