/* =====================================================================
   Where Your Paycheck Goes — taxes, at the level that matters.

   Door 4 · Mindset and money. Module 5, "All about the Benjamins" and
   "Gross vs. Net Income".

   Outcome: "I can read a pay stub. I know what each line taking money
   out is for, and I know what the W-4 does."

   Design notes:

   * A paycheck has four kinds of line coming out. Naming them is the
     whole lesson. This is the four-minute version
     that turns a confusing stub into a readable one.

   * The calculator uses a common rule of thumb: often 15\u201330% comes
     out, default 20%, which for $40,000 gross lands around $2,670 a month net. It
     says so, and it does not pretend to compute anyone's actual tax.
     Actual withholding depends on state, filing status and the W-4, and
     the activity says that plainly.

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
        lead: "Once you can name them, a pay stub can get much easier to read. That\u2019s the whole lesson.",
        points: [
          "<b>Federal income tax.</b> The big one. How much depends on how much you earn and what you told them on the W-4.",
          "<b>State income tax.</b> Most states take some. A few take none.",
          "<b>Social Security and Medicare.</b> Together they\u2019re called FICA, a fixed slice of every paycheck. They fund the benefits people draw later.",
          "<b>The things you chose.</b> Health insurance, retirement contributions. Money going somewhere for you, taken out before you see it."
        ],
        note: "A common rule of thumb: often 15\u201330% of gross pay comes out across all of these, depending on your state and the benefits you pick. You live on what\u2019s left.",
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
          "This uses a common rule of thumb, so your actual tax will be different. Real withholding depends on your state, your W-4 and your benefits. This is for getting the size about right."
        ],
        prompt: "The yearly figure, before anything comes out.",
        inputs: [
          { k: "salary", t: "Pay before tax, per year", prefix: "$", start: 40000, step: 1000, max: 250000, s: "Hourly? Rate times hours a week times 52." },
          { k: "pct",    t: "Comes out, roughly",         prefix: "",  suffix: "%", start: 20, step: 1, max: 40, s: "Often 15\u201330%, depending on your state and the benefits you pick." }
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
        lead: "You fill it in when you start a job. It\u2019s worth filling in slowly, and checking again later.",
        points: [
          "<b>Hold back too little</b> and you owe money in April.",
          "<b>Hold back too much</b> and you get a refund, which is your own money, lent to the government for free all year.",
          "<b>You can change it any time.</b> HR has the form. It\u2019s worth a look when life changes: a second job, a kid, a marriage."
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
        title: "Your last pay stub. Could you name every line on it?",
        prompt: "Your best guess.",
        options: [
          { k: "yes",     t: "Yes, all of them",              s: "Then this was a refresher.", echo: "you can read it" },
          { k: "most",    t: "Most of them",                  s: "If one is unclear, check the FICA pair.", echo: "most of it" },
          { k: "no",      t: "Not really, I just look at the total", s: "Your next pay stub is a good one to read line by line.", echo: "just the total" },
          { k: "none",    t: "I haven\u2019t had a pay stub yet",   s: "Then you\u2019ll know what to look for on your very first one.", echo: "no pay stub yet" }
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
      most: "Most of it. If the FICA pair, Social Security and Medicare, was the gap, now you\u2019ve got it.",
      no:   "You look at the total. On your next pay stub, try finding the four kinds of line. The more stubs you read, the quicker it can get.",
      none: "No pay stub yet. Good timing: when the first one arrives you\u2019ll know what the lines are before you\u2019ve had a chance to be confused by them."
    };
    return "<h1>That\u2019s where it goes.</h1>" +
      (res.netMonth != null
        ? '<div class="ya-quote">' + money(v.salary) + " a year on the offer \u2192 about " + money(res.netMonth) + " a month in your account.</div>" +
          '<div class="ya-readout"><h3>The gap</h3><p>Roughly ' + money(res.outYear) + " a year comes out, across federal and state tax, Social Security and Medicare, and anything you chose like insurance or retirement. That\u2019s a common rule of thumb at " + (v.pct || 0) + "%. Your actual withholding will be different.</p></div>"
        : "") +
      '<div class="ya-readout"><h3>The four lines</h3><p><b>Federal tax</b> \u00b7 <b>State tax</b> \u00b7 <b>FICA</b> (Social Security and Medicare) \u00b7 <b>What you chose</b> (insurance, retirement).</p></div>' +
      (STATUS[status] ? '<div class="ya-readout"><h3>Where you are with it</h3><p>' + esc(STATUS[status]) + "</p></div>" : "") +
      '<p class="ya-result-lead">This is the high-level version, meant for negotiating and budgeting. The optional paid Your Next Step course has the full lesson, with video.</p>';
  },

  actions: function () {
    return [
      "Find your last pay stub and name the four kinds of line",
      "Ask HR for your W-4 and see whether it still matches your life",
      "Redo The Floor or Money, Plainly using the net figure"
    ];
  }
});

})();
