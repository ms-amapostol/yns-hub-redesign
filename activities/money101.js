/* =====================================================================
   Money, Plainly — paycheck, rent, the gap. No jargon.

   Door 4 · Mindset and money. Module 5 (Money Mindset), app-ised.
   Source scripts: Budgeting 101 (zero-based budget), Gross vs. Net
   Income. The $40,000 example and the 25–31% deduction range are the
   class's own figures and are attributed to it on screen. Credit and
   retirement are covered by the class and are out of scope here; they
   are a second activity.

   Outcome: "I know what's actually mine to decide on each month."

   Design notes:

   * The Floor already establishes `floor_monthly` (what you need). This
     activity is the other half: what comes in, what's fixed, and what is
     left. It reads the floor if it exists and never re-asks it.

   * `buildup` for the fixed costs, because tapping tiles is how people
     actually add up rent and a car payment in their head. Scores nothing.

   * Every number on screen comes from the person. There are no
     benchmarks, averages or "you should be saving X" claims anywhere,
     because we cannot source them for this person's life.

   * Money is where shame lives for this audience. Every hard screen says
     what is private and is followed by something to do.
   ===================================================================== */
(function () {
"use strict";

function money(n) {
  n = Math.round(n || 0);
  return "$" + n.toLocaleString("en-US");
}

YNSActivity.define({
  slug: "money101",
  title: "Money, Plainly",

  slots: [

    /* ---------------------------------------------------------------
       1. Frame.
       --------------------------------------------------------------- */
    {
      id: "frame",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Eight minutes",
          title: "Three numbers, and you already know all of them.",
          lead: "What comes in. What has to go out. What's left. Most budgeting advice skips to step nine. This is steps one to three.",
          body: [
            "Rough figures are fine. You can fix them later. Nothing here is shared, and nothing gets judged.",
            "If you did The Floor, we'll use that number instead of asking again."
          ],
          cta: "Okay"
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. Gross vs net, before asking for income, so "after tax" means
       something. The class's example, attributed.
       --------------------------------------------------------------- */
    {
      id: "grossnet",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Worth knowing first",
          title: "The number you were quoted and the number that lands are different.",
          lead: "Gross is what a job says it pays. Net is what actually reaches your account after taxes, insurance and any retirement money come out. You live on net.",
          example: {
            label: "The class's example",
            fromLabel: "Gross", from: "$40,000 a year, about $3,333 a month",
            toLabel: "Net", to: "about $2,500 a month",
            note: "That's with roughly 25% taken out. The class says deductions usually run 25\u201331%."
          },
          points: [
            "<b>Hourly?</b> Multiply your rate by your usual hours in a month, then take off about a quarter. That's your rough net.",
            "<b>The next screen asks for net.</b> If you only know gross, use the quarter-off rule."
          ],
          cta: "Got it"
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. What comes in. Per month, after tax, the number that lands.
       --------------------------------------------------------------- */
    {
      id: "income",
      axes: [],
      ladder: [
        {
          asks: "money_in",
          mechanic: "buildup",
          eyebrow: "What comes in",
          title: "About how much lands in your account in a month?",
          scene: [
            "After tax. The amount you can actually spend. If it changes week to week, use a normal month."
          ],
          totalLabel: "a month, after tax",
          rows: [
            { k: "job",   t: "Main job",         s: "Your regular paycheck, added up for a month.", start: 0, step: 100, max: 15000 },
            { k: "side",  t: "Anything else",    s: "Second job, gig work, side money.",           start: 0, step: 50,  max: 10000 },
            { k: "help",  t: "Help from family", s: "Only if it's regular. Counts as income.",      start: 0, step: 50,  max: 5000 }
          ],
          minTotal: 1,
          cta: "That's about right",
          factsFrom: function (sum) { return { money_in: sum }; }
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. What has to go out. Rung 1 reads floor_monthly and skips this
       with a learn card instead of re-asking.
       --------------------------------------------------------------- */
    {
      id: "fixed",
      axes: [],
      ladder: [
        {
          asks: "money_fixed",
          mechanic: "buildup",
          eyebrow: "What has to go out",
          title: "What's spoken for before you decide anything?",
          scene: [
            "The bills that happen whether you like it or not. Skip anything that doesn't apply to you."
          ],
          totalLabel: "a month, fixed",
          rows: [
            { k: "rent",   t: "Rent or your share of it", s: "Or mortgage. Zero is a real answer if you live at home.", start: 0, step: 50, max: 6000 },
            { k: "car",    t: "Car, gas, transit",        s: "Payment, insurance, gas, or the bus pass.",             start: 0, step: 25, max: 3000 },
            { k: "phone",  t: "Phone",                    s: "",                                                       start: 0, step: 10, max: 400 },
            { k: "debt",   t: "Minimum payments",         s: "Cards, loans, buy-now-pay-later. Minimums only.",       start: 0, step: 25, max: 5000 },
            { k: "food",   t: "Groceries",                s: "A rough month. Eating out goes in the next screen.",    start: 0, step: 25, max: 2000 },
            { k: "other",  t: "Other fixed things",       s: "Childcare, medicine, a subscription you can't drop.",   start: 0, step: 25, max: 5000 }
          ],
          minTotal: 0,
          cta: "That's the fixed stuff",
          factsFrom: function (sum) { return { money_fixed: sum }; }
        },
        {
          needs: { fact: "floor_monthly" },
          mechanic: "learn",
          eyebrow: "Already know this one",
          title: "You told The Floor what you need each month.",
          lead: function (v) {
            var f = v && v.facts && v.facts.floor_monthly;
            return f ? "You said " + money(f) + " a month keeps the lights on. We'll use that." : "We'll use the number you gave The Floor.";
          },
          body: ["If that number has changed, The Floor takes six minutes to redo. Otherwise, keep going."],
          provenance: "You already set your floor in The Floor, so this skips the fixed-costs screen.",
          cta: "Use it"
        }
      ]
    },

    /* ---------------------------------------------------------------
       4. The gap, named. Closed vocabulary. This is the only hard screen
       and it says what is private.
       --------------------------------------------------------------- */
    {
      id: "gap",
      axes: [],
      ladder: [
        {
          asks: "money_gap",
          mechanic: "choice",
          eyebrow: "The gap",
          title: function (v) {
            var i = v && (v.extra && v.extra.income_total || v.facts && v.facts.money_in);
            var f = v && (v.extra && v.extra.fixed_total || v.facts && v.facts.money_fixed || v.facts && v.facts.floor_monthly);
            if (i && f) { var left = i - f; return left >= 0 ? "That leaves about " + money(left) + " a month." : "That's about " + money(-left) + " short a month."; }
            return "So where does that leave you most months?";
          },
          scene: [
            "This is the number that matters, and it's the one nobody talks about. It stays private. Pick what most months feel like."
          ],
          prompt: "Most months.",
          options: [
            { k: "room",  t: "There's room",            s: "Something is left, and I mostly decide where it goes.", echo: "there's some room" },
            { k: "tight", t: "It's tight but it works", s: "It clears, barely. One surprise and it doesn't.",       echo: "it's tight" },
            { k: "short", t: "It doesn't cover it",     s: "Most months I'm borrowing from next month.",            echo: "it's short" },
            { k: "unsure",t: "I honestly don't know",   s: "A very common answer. Now you have the numbers to find out.", echo: "you're not sure yet" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       5. One idea. Mechanism only, no outcome claims.
       --------------------------------------------------------------- */
    {
      id: "idea",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Worth knowing",
          title: "Give every dollar a job. That's the whole budget.",
          lead: "The class teaches a zero-based budget: what comes in, minus everything you've assigned a purpose, equals zero. The money that's left after fixed costs is the part you're actually deciding about.",
          points: [
            "<b>Name it before the month starts.</b> Fun money, a buffer, a payment. Money with no job gets spent on whatever is loudest.",
            "<b>Pay yourself something first, even $20.</b> The amount matters less than the habit of it existing.",
            "<b>One surprise a month is normal.</b> A plan with no room for one is a plan that breaks in week two."
          ],
          note: "Managing money is mostly managing your behavior around money. That line is from the class, and it's the reason a budget is a habit, not a spreadsheet. If your number is negative, the first job is getting it to zero, usually starting with the minimum payments or the car.",
          cta: "Got it"
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    var f = r.ctx.facts;
    var income = r.extra.income_total || f.money_in || 0;
    var fixed  = r.extra.fixed_total  || f.money_fixed || f.floor_monthly || 0;
    var left   = income - fixed;
    var gap    = r.state.answers.gap || "";

    var READ = {
      room:  "Some of it is yours to decide. That's the number to give a job before next month starts.",
      tight: "It works until something breaks. The move is a small buffer, built slowly, so one surprise stops being a crisis.",
      short: "It doesn't cover it, and you were able to say so. Most people never get that far. The first plan is getting to zero, one bill at a time, and it's usually smaller than it looks.",
      unsure:"You didn't know, and now you have three numbers. Watch one normal month against them and you'll know."
    };

    return "<h1>Your three numbers.</h1>" +
      '<div class="ya-readout"><h3>Comes in</h3><p>' + money(income) + " a month</p></div>" +
      '<div class="ya-readout"><h3>Has to go out</h3><p>' + money(fixed) + " a month</p></div>" +
      '<div class="ya-quote">' + (left >= 0 ? money(left) + " a month is yours to decide on." : money(-left) + " a month short.") + "</div>" +
      (READ[gap] ? '<p class="ya-result-lead">' + esc(READ[gap]) + "</p>" : "") +
      '<p class="ya-result-lead">These are rough and that\u2019s fine. Rough numbers you know beat exact numbers you avoid.</p>';
  },

  actions: function (state) {
    var gap = (state && state.answers && state.answers.gap) || "";
    return [
      gap === "short" ? "Write down every minimum payment and its due date on one page"
        : gap === "unsure" ? "Track one normal week of spending, just by writing it down"
        : "Give next month's leftover a name before the month starts",
      "Move $20 somewhere you won't touch it, today, as a test",
      "Do The Floor if you haven't, so this number has a floor under it"
    ];
  }
});

})();
