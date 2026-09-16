/* =====================================================================
   Every Dollar a Job — a zero-based budget you can keep.

   Door 4 · Mindset and money. Module 5, "Budgeting 101".

   Outcome: "I have a budget where income minus everything equals zero,
   and a spreadsheet of it I can actually maintain."

   Design notes:

   * Zero-based is the course's method and it is the right one to teach,
     because it answers the question people actually have, which is not
     "where did it go" but "what am I allowed to spend".

   * Every figure is typed. Nobody drags a slider to $1,247.

   * The export is the point. A budget that lives inside a website is a
     budget nobody updates. This one leaves as a CSV that opens in Excel,
     Numbers or Sheets, with the formulas people need already in it.

   * It reads Money, Plainly and The Floor if they exist, so anyone who
     has done those starts with their own numbers rather than zeroes.
   ===================================================================== */
(function () {
"use strict";

function money(n) { return "$" + Math.round(n || 0).toLocaleString("en-US"); }

/* The categories. Ordered the way a month actually happens: the things
   that leave whether you like it or not, then the things you choose. */
var ROWS = [
  { k: "rent",     t: "Rent or mortgage",        s: "Your share of it", group: "Have to" },
  { k: "utility",  t: "Utilities",               s: "Power, water, internet", group: "Have to" },
  { k: "phone",    t: "Phone",                   s: "", group: "Have to" },
  { k: "food",     t: "Groceries",               s: "The grocery run. Eating out goes under Fun", group: "Have to" },
  { k: "transit",  t: "Getting around",          s: "Car payment, gas, insurance, fares", group: "Have to" },
  { k: "debt",     t: "Debt payments",           s: "The minimums", group: "Have to" },
  { k: "care",     t: "People who depend on you", s: "Childcare, money you send home", group: "Have to" },
  { k: "health",   t: "Health",                  s: "Insurance, prescriptions, the dentist", group: "Have to" },

  { k: "save",     t: "Savings",                 s: "Pay yourself. Even $20 counts", group: "Choose to" },
  { k: "buffer",   t: "The surprise fund",       s: "For costs you didn't plan for", group: "Choose to" },
  { k: "fun",      t: "Fun",                     s: "Eating out, going out, the subscriptions", group: "Choose to" },
  { k: "clothes",  t: "Clothes and the rest",    s: "Haircuts, household bits", group: "Choose to" },
  { k: "extra",    t: "Extra at the debt",       s: "Anything above the minimum", group: "Choose to" },
  { k: "goal",     t: "Toward the plan",         s: "Course fees, tools, the certificate", group: "Choose to" }
];

/* What the savings line is worth, said in the only terms that move
   anybody: what it becomes, and what it protects against. Nothing here
   recommends a product; the growth figure uses the same 7% assumption as
   What Money Does Over Time and says so. */
function savingsRead(savings, income, alloc) {
  var rate = income ? Math.round(savings / income * 100) : 0;
  var buffer = alloc.buffer || 0;

  if (!savings) {
    return '<div class="ya-readout"><h3>The line worth adding</h3>' +
      "<p>Savings came out at zero this month. That\u2019s a fine place to start, and it\u2019s a line worth adding when you can. " +
      "Twenty dollars a month is $240 a year, and it can start a cushion for surprises like a flat tire.</p>" +
      "<p>Some people move $20 out of the fun line to see whether the month still works.</p></div>";
  }

  /* Twenty years at 7% a year, compounded monthly. Same assumption, and
     the same honesty about it, as the compounding activity. */
  var bal = 0, r = 0.07 / 12;
  for (var i = 0; i < 240; i++) bal = (bal + savings) * (1 + r);

  return '<div class="ya-readout"><h3>What you\u2019re keeping</h3>' +
    "<p>" + money(savings) + " a month is going to you" +
    (rate ? ", which is about " + rate + "% of what comes in" : "") + ". " +
    "If this were invested and averaged 7% a year (an assumption; a savings account may earn less), in twenty years it would be about <b>" + money(bal) + "</b>. " +
    "7% is based on past stock market returns before inflation. What Money Does Over Time lets you change the rate.</p>" +
    (buffer
      ? "<p>You also set aside " + money(buffer) + " for surprises. That line can help keep one bad week from turning into debt.</p>"
      : "<p>One thing missing: a surprise fund. Even $25 a month can start a buffer for surprises like a flat tire.</p>") +
    "</div>";
}

YNSActivity.define({
  slug: "budget0",
  title: "Every Dollar a Job",

  slots: [

    /* ---------------------------------------------------------------
       1. The idea, in one screen.
       --------------------------------------------------------------- */
    {
      id: "frame",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Twelve minutes",
          title: "A budget is a plan for where the money goes.",
          lead: "You make it in advance. This kind is called zero-based: what comes in, minus everything you\u2019ve given a job, equals zero.",
          points: [
            "<b>Zero means every dollar has a job.</b> Savings is a job. Fun is a job.",
            "<b>Money with no job can get spent without you noticing.</b> Planning before the month starts helps you decide first.",
            "<b>You\u2019ll take it with you.</b> At the end there\u2019s a spreadsheet to download, so this can become a habit."
          ],
          note: "Managing money is mostly managing your behavior around money. If you\u2019ve done Money, Plainly or The Floor, your numbers are already filled in.",
          cta: "Let\u2019s build it"
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. What comes in. Separate from the spending screen on purpose:
       the number you are dividing up should be looked at on its own
       first.
       --------------------------------------------------------------- */
    {
      id: "income",
      axes: [],
      ladder: [
        {
          asks: "money_in",
          mechanic: "buildup",
          eyebrow: "What comes in",
          title: "Start with the money that actually lands.",
          scene: [
            "After tax, in a normal month. If it moves around, use a month you\u2019d call ordinary."
          ],
          totalLabel: "a month, to give jobs to",
          rows: [
            { k: "job",  t: "Main job",         s: "Your regular pay, for a month", start: 0, step: 100, max: 20000 },
            { k: "side", t: "Anything else",    s: "Second job, gig work, side money", start: 0, step: 50, max: 10000 },
            { k: "help", t: "Regular help",     s: "Only if it arrives every month", start: 0, step: 50, max: 5000 }
          ],
          minTotal: 1,
          cta: "That\u2019s what I\u2019ve got",
          factsFrom: function (sum) { return { money_in: sum }; }
        },
        {
          needs: { fact: "money_in" },
          mechanic: "learn",
          eyebrow: "Already know this one",
          title: "We\u2019ve got your income from last time.",
          lead: function (v) {
            var n = v && v.facts && v.facts.money_in;
            return n ? money(n) + " a month, after tax." : "";
          },
          body: ["If it still looks right, straight on to giving it jobs."],
          provenance: "You\u2019ve told us what comes in already, so this doesn\u2019t ask again.",
          cta: "Use it",
          alt: { label: "It\u2019s changed", clears: "money_in" }
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. Pay yourself first. Asked before the budget screen rather than
       left as one row among fourteen, because a savings line that
       competes with everything else loses every time. Asked as a
       decision, with the smallest option a real one.
       --------------------------------------------------------------- */
    {
      id: "first",
      axes: [],
      ladder: [
        {
          asks: "save_target",
          mechanic: "choice",
          eyebrow: "Before anything else",
          title: "Decide what you keep, before you decide what you spend.",
          scene: function (v) {
            var inc = v && v.facts && v.facts.money_in;
            return [
              "Deciding what you keep before you spend is a habit many budgets start with.",
              inc ? "Of the " + money(inc) + " coming in, how much goes to you first?" : "How much goes to you first?"
            ];
          },
          prompt: "Pick something you would actually keep to.",
          options: [
            { k: "twenty",  t: "$20 a month",  s: "Small on purpose, so it's easy to keep up.", echo: "$20 a month" },
            { k: "five",    t: "5% of what comes in", s: "Scales with you, so a raise raises it without another decision.", echo: "5%" },
            { k: "ten",     t: "10% of what comes in", s: "A bigger goal. It can be a stretch on a tight month.", echo: "10%" },
            { k: "none",    t: "Nothing yet", s: "A real answer. The budget still works, and this comes back later.", echo: "nothing yet" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       4. The budget itself.
       --------------------------------------------------------------- */
    {
      id: "plan",
      axes: [],
      ladder: [
        {
          asks: "budget_plan",
          mechanic: "budget",
          eyebrow: "Give every dollar a job",
          title: "Now hand it out until there\u2019s nothing left.",
          scene: [
            "Work down the list. The first group happens whether you like it or not. The second group is where you actually have choices.",
            "You\u2019re aiming for zero dollars left without a job."
          ],
          prompt: "Type the amounts. The number at the top tells you what\u2019s still unassigned.",
          rows: ROWS,
          incomeFrom: "money_in",
          /* The savings line arrives already filled in from the decision
             two screens ago, so it is there before anything competes
             with it. Everything else starts at zero. */
          seedFrom: "save_seed",
          cta: "That\u2019s my month"
        }
      ]
    },

    /* ---------------------------------------------------------------
       4. The one habit that makes it stick.
       --------------------------------------------------------------- */
    {
      id: "habit",
      axes: [],
      ladder: [
        {
          asks: "budget_habit",
          mechanic: "choice",
          eyebrow: "Making it stick",
          title: "When will you look at this again?",
          scene: [
            "A budget written once is a document. Checking it on a set day can help it become a habit."
          ],
          prompt: "Pick the one you\u2019d actually keep.",
          options: [
            { k: "weekly",  t: "Once a week, same day",   s: "About ten minutes each time.", echo: "weekly" },
            { k: "payday",  t: "Every payday",            s: "Tied to something that already happens.", echo: "every payday" },
            { k: "monthly", t: "Once a month",            s: "Right before the month starts.", echo: "monthly" },
            { k: "unsure",  t: "Probably not often", s: "Then set one reminder and let that be enough.", echo: "when you can" }
          ]
        }
      ]
    }
  ],

  /* The savings decision becomes the seed for the budget screen. Done in
     onComplete's sibling rather than in the choice itself because the
     amount depends on income, which the choice does not carry. */
  onStep: function (r) {
    if (r.slot !== "first") return;
    var income = r.facts.money_in || 0;
    var pick = r.answer;
    var v = pick === "twenty" ? 20 : pick === "five" ? Math.round(income * 0.05) : pick === "ten" ? Math.round(income * 0.10) : 0;
    r.setFact("save_seed", { k: "save", v: v });
  },

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    var income = r.extra.plan_income || r.ctx.facts.money_in || 0;
    var alloc = r.extra.plan_alloc || {};
    var assigned = 0;
    Object.keys(alloc).forEach(function (k) { assigned += alloc[k] || 0; });
    var left = income - assigned;
    var habit = r.state.answers.habit || "";

    var must = 0, choose = 0;
    ROWS.forEach(function (row) {
      if (row.group === "Have to") must += alloc[row.k] || 0;
      else choose += alloc[row.k] || 0;
    });
    var savings = (alloc.save || 0) + (alloc.buffer || 0);

    var read = Math.abs(left) < 1
      ? "Every dollar has a job. That\u2019s a zero-based budget."
      : left > 0
      ? money(left) + " is still unassigned. That\u2019s a decision you haven\u2019t made yet. Money without a job can be easy to spend without noticing."
      : money(-left) + " more is assigned than comes in. Good to know now, well before the 28th. For the month to work, something would need to come down, and the second group is a good place to look.";

    var HABIT = {
      weekly:  "Once a week is a steady rhythm. A phone reminder with the day and the time can help it stick.",
      payday:  "Tying it to payday means the reminder comes built in.",
      monthly: "Once a month, right before the month starts, gives you a fresh plan each time.",
      unsure:  "That\u2019s a fair answer. One reminder, once a month, is a real plan."
    };

    return "<h1>Your month, decided in advance.</h1>" +
      '<div class="ya-quote">' + money(income) + " in \u00b7 " + money(assigned) + " assigned \u00b7 " +
      (Math.abs(left) < 1 ? "zero left" : money(Math.abs(left)) + (left > 0 ? " still to assign" : " over")) + "</div>" +
      '<p class="ya-result-lead">' + read + "</p>" +

      '<div class="ya-readout"><h3>The shape of it</h3>' +
      "<p>" + money(must) + " goes out whether you like it or not. " + money(choose) + " is yours to decide on." +
      (savings ? " Of that, " + money(savings) + " is going to you." : "") + "</p></div>" +

      savingsRead(savings, income, alloc) +

      (HABIT[habit] ? '<div class="ya-readout"><h3>Keeping it</h3><p>' + esc(HABIT[habit]) + "</p></div>" : "") +

      '<div class="ya-readout"><h3>Take it with you</h3>' +
      "<p>The download below opens in Excel, Numbers or Google Sheets. It has your categories, your amounts, a column for what you actually spent, and the difference worked out for you. Next month, you can update it and keep going.</p>" +
      '<p><button class="btn btn-ghost" onclick="YNSMock.exportBudget()">Download the spreadsheet</button></p></div>';
  },

  actions: function (state) {
    var habit = (state && state.answers && state.answers.habit) || "";
    return [
      "Download the spreadsheet and put it somewhere you\u2019ll find it",
      habit === "weekly" ? "Put a ten-minute budget check in your phone, same day every week"
        : habit === "payday" ? "Set the reminder for your next payday"
        : "Set one reminder for the day before the month starts",
      "Pick the day your savings amount moves, if you set one"
    ];
  }
});

})();
