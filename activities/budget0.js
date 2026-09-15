/* =====================================================================
   Every Dollar a Job — a zero-based budget you can keep.

   Door 4 · Mindset and money. Module 5, "Budgeting 101".

   Outcome: "I have a budget where income minus everything equals zero,
   and a spreadsheet of it I can actually maintain."

   Design notes:

   * Zero-based is the class's method and it is the right one to teach,
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
  { k: "food",     t: "Groceries",               s: "The shop, not eating out", group: "Have to" },
  { k: "transit",  t: "Getting around",          s: "Car payment, gas, insurance, fares", group: "Have to" },
  { k: "debt",     t: "Debt payments",           s: "The minimums", group: "Have to" },
  { k: "care",     t: "People who depend on you", s: "Childcare, money you send home", group: "Have to" },
  { k: "health",   t: "Health",                  s: "Insurance, prescriptions, the dentist", group: "Have to" },

  { k: "save",     t: "Savings",                 s: "Pay yourself. Even $20 counts", group: "Choose to" },
  { k: "buffer",   t: "The surprise fund",       s: "Because there is one most months", group: "Choose to" },
  { k: "fun",      t: "Fun",                     s: "Eating out, going out, the subscriptions", group: "Choose to" },
  { k: "clothes",  t: "Clothes and the rest",    s: "Haircuts, household bits", group: "Choose to" },
  { k: "extra",    t: "Extra at the debt",       s: "Anything above the minimum", group: "Choose to" },
  { k: "goal",     t: "Toward the plan",         s: "Course fees, tools, the certificate", group: "Choose to" }
];

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
          title: "A budget is not a list of what you spent.",
          lead: "It\u2019s a decision, made in advance, about where the money goes. The class calls it zero-based: what comes in, minus everything you\u2019ve given a job, equals zero.",
          points: [
            "<b>Zero doesn\u2019t mean broke.</b> It means nothing is unassigned. Savings is a job. Fun is a job.",
            "<b>Money with no job gets spent on whatever is loudest.</b> That\u2019s the whole reason to do this before the month rather than after.",
            "<b>You\u2019ll take it with you.</b> At the end there\u2019s a spreadsheet to download, so this can be a habit rather than a one-off."
          ],
          note: "Managing money is mostly managing your behaviour around money. If you\u2019ve done Money, Plainly or The Floor, your numbers are already filled in.",
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
            "After tax, in a normal month. If it moves around, use a month you\u2019d call ordinary rather than your best one."
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
          body: ["If that\u2019s changed, Money, Plainly is the place to update it. Otherwise, straight on to giving it jobs."],
          provenance: "You told Money, Plainly what comes in, so this doesn\u2019t ask again.",
          cta: "Use it"
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. The budget itself.
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
            "Work down the list. The first group happens whether you like it or not. The second group is where you actually have choices, and it\u2019s the part most budgets forget to include.",
            "You\u2019re aiming for zero left, not for zero spent."
          ],
          prompt: "Type the amounts. The number at the top tells you what\u2019s still unassigned.",
          rows: ROWS,
          incomeFrom: "money_in",
          seedFrom: { rent: "floor_rent" },
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
            "A budget written once is a document. A budget looked at weekly is a habit, and the habit is the thing that changes the number in your account."
          ],
          prompt: "Pick the one you\u2019d actually keep.",
          options: [
            { k: "weekly",  t: "Once a week, same day",   s: "Ten minutes. The most common answer that works.", echo: "weekly" },
            { k: "payday",  t: "Every payday",            s: "Tied to something that already happens.", echo: "every payday" },
            { k: "monthly", t: "Once a month",            s: "Before the month starts, not after it ends.", echo: "monthly" },
            { k: "unsure",  t: "I\u2019ll be honest, probably not often", s: "Then set one reminder and let that be enough.", echo: "when you can" }
          ]
        }
      ]
    }
  ],

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
      ? "Every dollar has a job. That\u2019s a zero-based budget, and most people never get one."
      : left > 0
      ? money(left) + " is still unassigned. That\u2019s not a problem, it\u2019s a decision you haven\u2019t made yet. Unassigned money is the money that disappears."
      : money(-left) + " more is assigned than comes in. Worth knowing now rather than on the 28th. Something in the second group has to come down.";

    var HABIT = {
      weekly:  "Once a week is the answer that works for most people. Put it in the phone with the day and the time.",
      payday:  "Tying it to payday is clever, because payday already happens without you remembering it.",
      monthly: "Once a month works as long as it\u2019s before the month rather than after it.",
      unsure:  "Honest, and more useful than a promise you won\u2019t keep. One reminder, once a month, is a real plan."
    };

    return "<h1>Your month, decided in advance.</h1>" +
      '<div class="ya-quote">' + money(income) + " in \u00b7 " + money(assigned) + " assigned \u00b7 " +
      (Math.abs(left) < 1 ? "zero left" : money(Math.abs(left)) + (left > 0 ? " still to assign" : " over")) + "</div>" +
      '<p class="ya-result-lead">' + read + "</p>" +

      '<div class="ya-readout"><h3>The shape of it</h3>' +
      "<p>" + money(must) + " goes out whether you like it or not. " + money(choose) + " is yours to decide on." +
      (savings ? " Of that, " + money(savings) + " is going to you rather than to someone else." : "") + "</p></div>" +

      (HABIT[habit] ? '<div class="ya-readout"><h3>Keeping it</h3><p>' + esc(HABIT[habit]) + "</p></div>" : "") +

      '<div class="ya-readout"><h3>Take it with you</h3>' +
      "<p>The download below opens in Excel, Numbers or Google Sheets. It has your categories, your amounts, a column for what you actually spent, and the difference worked out for you. Update it next month rather than starting again.</p>" +
      '<p><button class="btn btn-ghost" onclick="YNSMock.exportBudget()">Download the spreadsheet</button></p></div>';
  },

  actions: function (state) {
    var habit = (state && state.answers && state.answers.habit) || "";
    return [
      "Download the spreadsheet and put it somewhere you\u2019ll find it",
      habit === "weekly" ? "Put a ten-minute budget check in your phone, same day every week"
        : habit === "payday" ? "Set the reminder for your next payday"
        : "Set one reminder for the day before the month starts",
      "Move the savings amount out of your spending account the day you get paid"
    ];
  }
});

})();
