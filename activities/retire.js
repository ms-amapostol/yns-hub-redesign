/* =====================================================================
   The Match — 401k, 403b, Roth and pensions, with the maths shown.

   Door 4 · Mindset and money. Module 5, "All Things Retirement".

   Outcome: "I know which account does what, what my employer's match is
   worth, what the tax difference between a 401k and a Roth actually
   costs me, and what a pension is."

   Nothing here recommends a provider or a product. Figures are 2026 IRS
   limits, labelled and dated, and the activity says to check the plan
   documents rather than trusting a website.
   ===================================================================== */
(function () {
"use strict";

function money(n) { return "$" + Math.round(n || 0).toLocaleString("en-US"); }

/* Compounding helper: annual contribution, added at the start of each
   year, growing at a fixed rate. */
function grow(annual, years, rate) {
  var bal = 0;
  for (var i = 0; i < years; i++) bal = (bal + annual) * (1 + rate / 100);
  return bal;
}

YNSActivity.define({
  slug: "retire",
  title: "The Match",

  slots: [

    /* 1. What it is, and why it comes out of a paycheck. */
    {
      id: "frame",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Ten minutes",
          title: "Retirement is a pot, and there are three ways people fill it.",
          lead: "You don\u2019t need a plan for retirement today. You do need to know what the deduction on your payslip is buying, and which of these you have access to.",
          points: [
            "<b>A 401k or 403b</b> comes through work. Money goes in before tax, and some employers add money on top.",
            "<b>A Roth IRA</b> you open yourself. Money goes in after tax, and nothing is taxed when it comes out.",
            "<b>A pension</b> is a promise from an employer to pay you a set amount every month for life."
          ],
          note: "The one thing that matters more than any of it: the earlier money goes in, the more of the final number is growth rather than your own money.",
          cta: "Start with the free money"
        }
      ]
    },

    /* 2. The match. 401k/403b only, said explicitly. */
    {
      id: "match",
      axes: [],
      ladder: [
        {
          asks: "match_pay",
          mechanic: "calc",
          eyebrow: "401k and 403b only",
          title: "The match is the closest thing to free money you will be offered.",
          scene: [
            "This screen is about workplace plans only: a <b>401k</b> if you work somewhere for-profit, a <b>403b</b> if you work for a non-profit, a school or a hospital. A Roth IRA you open yourself has no match, and neither does a pension.",
            "If your employer matches, they add their money to yours. Put in less than the match and you are turning down pay."
          ],
          prompt: "Your pay, what you put in, and what they match.",
          inputs: [
            { k: "pay",   t: "Your pay before tax",       prefix: "$", start: 40000, step: 1000, max: 250000, s: "A year." },
            { k: "yours", t: "What you put in",           prefix: "", suffix: "%", start: 3, step: 1, max: 25, s: "Out of each paycheck, before tax." },
            { k: "match", t: "What they match, up to",    prefix: "", suffix: "%", start: 3, step: 1, max: 15, s: "Ask HR or check the benefits page. Zero is a real answer." },
            { k: "years", t: "For how many years",        prefix: "", start: 30, step: 5, max: 45, s: "" }
          ],
          compute: function (v) {
            var yours = (v.pay || 0) * (v.yours || 0) / 100;
            var theirs = (v.pay || 0) * Math.min(v.yours || 0, v.match || 0) / 100;
            var cap = 24500; /* 2026 employee limit */
            return {
              yours: yours, theirs: theirs, total: yours + theirs,
              over: yours > cap,
              end: grow(yours + theirs, v.years || 0, 7),
              endAlone: grow(yours, v.years || 0, 7),
              years: v.years || 0
            };
          },
          render: function (r) {
            return '<div class="calc-big">' + money(r.total) + ' a year</div>'
              + '<p class="calc-sub">' + money(r.yours) + " from you" + (r.theirs ? " and " + money(r.theirs) + " from them" : ", and nothing from them") + "</p>"
              + '<div class="tx-rows">'
              + "<div><span>After " + r.years + " years at 7%</span><b>" + money(r.end) + "</b></div>"
              + "<div><span>Without the match</span><b>" + money(r.endAlone) + "</b></div>"
              + '<div class="tx-net"><span>What the match is worth</span><b>' + money(r.end - r.endAlone) + "</b></div>"
              + "</div>"
              + (r.over ? '<p class="calc-late">That is above the 2026 employee limit of $24,500 a year.</p>' : "");
          },
          cta: "Got it"
        }
      ]
    },

    /* 3. Traditional versus Roth, with the tax shown on both ends. */
    {
      id: "roth",
      axes: [],
      ladder: [
        {
          mechanic: "calc",
          eyebrow: "The tax question",
          title: "Taxed now, or taxed later?",
          scene: [
            "A <b>401k or 403b</b> takes money before tax. Your taxable income drops this year, the whole amount goes in and grows, and every dollar is taxed on the way out.",
            "A <b>Roth IRA</b> takes money after tax. You pay tax now, so less goes in, and nothing is taxed on the way out. Not the growth either.",
            "Same money, two different deals. Here is what each is worth."
          ],
          prompt: "Put in what you could save a year, and see both.",
          inputs: [
            { k: "annual", t: "What you\u2019d put in a year", prefix: "$", start: 3000, step: 500, max: 24500, s: "Roth IRAs cap at $7,500 a year in 2026. Workplace plans cap at $24,500." },
            { k: "now",    t: "Your tax rate now",           prefix: "", suffix: "%", start: 12, step: 1, max: 37, s: "Most early-career pay lands in the 12% or 22% bracket." },
            { k: "later",  t: "Your tax rate in retirement",  prefix: "", suffix: "%", start: 12, step: 1, max: 37, s: "Nobody knows. That is the honest answer, and it is why people hold both." },
            { k: "years",  t: "Years of growing",             prefix: "", start: 30, step: 5, max: 45, s: "" }
          ],
          compute: function (v) {
            var yrs = v.years || 0, a = v.annual || 0;
            var trad = grow(a, yrs, 7);
            var rothIn = a * (1 - (v.now || 0) / 100);
            var roth = grow(rothIn, yrs, 7);
            var overRoth = a > 7500;
            return {
              annual: a, rothIn: rothIn, overRoth: overRoth,
              trad: trad, tradNet: trad * (1 - (v.later || 0) / 100),
              roth: roth, years: yrs, now: v.now || 0, later: v.later || 0
            };
          },
          render: function (r) {
            var better = r.tradNet >= r.roth ? "the 401k" : "the Roth";
            var gap = Math.abs(r.tradNet - r.roth);
            return '<div class="tx-rows">'
              + "<div><span><b>401k / 403b</b> \u00b7 goes in whole</span><b>" + money(r.annual) + " a year</b></div>"
              + "<div><span>Grows to, after " + r.years + " years</span><b>" + money(r.trad) + "</b></div>"
              + "<div><span>Minus " + r.later + "% tax on the way out</span><b>" + money(r.tradNet) + "</b></div>"
              + "</div>"
              + '<div class="tx-rows" style="margin-top:10px">'
              + "<div><span><b>Roth IRA</b> \u00b7 taxed at " + r.now + "% first</span><b>" + money(r.rothIn) + " a year</b></div>"
              + "<div><span>Grows to, after " + r.years + " years</span><b>" + money(r.roth) + "</b></div>"
              + "<div><span>Tax on the way out</span><b>none</b></div>"
              + "</div>"
              + '<p class="calc-late">On these numbers ' + better + " ends up ahead by " + money(gap) + ". Change the retirement rate and watch it flip: that is the whole bet.</p>"
              + (r.overRoth ? '<p class="calc-late">Above $7,500 a year the extra can\u2019t go in a Roth IRA. It would go in the workplace plan.</p>' : "");
          },
          cta: "That\u2019s the trade"
        }
      ]
    },

    /* 4. Pros, cons and the rules that bite. */
    {
      id: "prosCons",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "The fine print that matters",
          title: "What each one is good and bad at.",
          lead: "Most people end up holding more than one. You can pay into a workplace plan and a Roth IRA in the same year.",
          points: [
            "<b>401k / 403b, good:</b> the match, a high limit ($24,500 in 2026), it lowers this year\u2019s tax bill, and it comes out of pay before you see it.",
            "<b>401k / 403b, bad:</b> every dollar is taxed on the way out, you pick from the plan\u2019s menu, and taking it out before 59\u00bd usually costs <b>a 10% penalty on top of the tax</b>.",
            "<b>Roth IRA, good:</b> nothing is taxed coming out, not even decades of growth. It\u2019s yours, not your employer\u2019s, so it follows you between jobs. You can withdraw <b>what you put in</b> at any time without penalty.",
            "<b>Roth IRA, bad:</b> no match, a much lower limit of <b>$7,500 a year in 2026</b>, no tax break today, and high earners get phased out.",
            "<b>You can open a Roth at any time</b>, at any age, as long as you earned income that year. It is not tied to a job or an enrolment window."
          ],
          note: "2026 figures from the IRS. Limits change most years, so check the current number before you set anything up.",
          cta: "And pensions?"
        }
      ]
    },

    /* 5. Pensions, which the module names but never explains. */
    {
      id: "pension",
      axes: [],
      ladder: [
        {
          mechanic: "calc",
          eyebrow: "The third kind",
          title: "A pension is a promise, not a pot.",
          scene: [
            "With a 401k you carry the risk: you choose what it\u2019s invested in, and what you retire with depends on how the market did.",
            "With a pension the employer carries it. They promise a monthly cheque for life, usually worked out as <b>years worked \u00d7 a percentage \u00d7 your final salary</b>. If the market has a bad decade, that is their problem."
          ],
          prompt: "Most public pensions use 1.5% to 2.5% per year worked.",
          inputs: [
            { k: "years",  t: "Years you\u2019d work there", prefix: "", start: 25, step: 5, max: 45, s: "" },
            { k: "salary", t: "Your final salary",          prefix: "$", start: 60000, step: 5000, max: 250000, s: "Usually an average of your best few years." },
            { k: "factor", t: "The plan\u2019s percentage",  prefix: "", suffix: "%", start: 2, step: 1, max: 3, s: "Per year worked. It is in the plan documents." }
          ],
          compute: function (v) {
            var pct = (v.years || 0) * (v.factor || 0);
            var yearly = (v.salary || 0) * pct / 100;
            return { pct: pct, yearly: yearly, monthly: yearly / 12, years: v.years || 0 };
          },
          render: function (r) {
            return '<div class="calc-big">' + money(r.monthly) + ' a month</div>'
              + '<p class="calc-sub">for life, after ' + r.years + " years \u00b7 " + money(r.yearly) + " a year, or " + r.pct + "% of your final salary</p>"
              + '<p class="calc-late">A pot big enough to pay that out would need to be somewhere around ' + money(r.yearly * 25) + '. That is what the promise is worth.</p>';
          },
          cta: "Who offers those?"
        },
        {
          mechanic: "learn",
          eyebrow: "Pensions, in full",
          title: "Who still has them, and what the catch is.",
          points: [
            "<b>Where they still exist:</b> state and local government, teaching and school districts, police and fire, the military, many hospitals and universities, and some unionised trades and large manufacturers.",
            "<b>Good:</b> a cheque for life that doesn\u2019t run out, no investment decisions to make, and the employer carries the market risk. Some include a survivor benefit for a spouse.",
            "<b>Bad:</b> <b>vesting</b>. Leave before you\u2019re vested, often five years, and you may walk away with little or nothing. The amount is tied to staying, which makes leaving expensive.",
            "<b>Also worth knowing:</b> a pension is usually taxed as income when it pays out, some don\u2019t rise with inflation, and a few public workers don\u2019t pay into Social Security, so the pension is most of the picture."
          ],
          note: "If a job offers one, ask two questions at the offer stage: how many years until I\u2019m vested, and what is the percentage per year worked.",
          cta: "Last question"
        }
      ]
    },

    /* 6. Where they actually are. */
    {
      id: "intent",
      axes: [],
      ladder: [
        {
          asks: "retire_status",
          mechanic: "choice",
          eyebrow: "Last one",
          title: "Where are you with this right now?",
          scene: ["The honest answer is the useful one."],
          prompt: "Closest to true.",
          options: [
            { k: "match_unused", t: "There\u2019s a match at work I\u2019m not taking",  s: "The highest-value thing on this page, and it\u2019s usually one form.", echo: "a match you\u2019re not taking" },
            { k: "match_used",   t: "I\u2019m taking the full match",                 s: "Then the next question is whether to add a Roth.", echo: "taking the match" },
            { k: "pension",      t: "My job has a pension",                        s: "Then vesting is the number to find out.", echo: "a pension" },
            { k: "none",         t: "No plan at work, or no job right now",        s: "A Roth IRA is the one you can open yourself, whenever.", echo: "nothing at work yet" }
          ]
        }
      ]
    }
  ],

  results: function (r) {
    var esc = r.esc;
    var m = r.extra.match_result || {};
    var ro = r.extra.roth_result || {};
    var st = r.state.answers.intent || "";
    var S = {
      match_unused: "You said there\u2019s a match you\u2019re not taking. Find the percentage they match, put in at least that much, and stop there if money is tight. Everything else on this page can wait.",
      match_used:   "You\u2019re taking the full match, which most people never do. The next move is a Roth IRA alongside it, so some of your retirement money is untaxed on the way out and some is untaxed going in.",
      pension:      "You have a pension. Ask how many years until you\u2019re vested and what the percentage per year worked is. Those two numbers decide what staying is worth.",
      none:         "Nothing at work yet. A Roth IRA doesn\u2019t need an employer: any year you have earned income, you can put in up to $7,500."
    };
    return "<h1>Three ways to fill the pot.</h1>" +
      (m.end ? '<div class="ya-quote">Your match is worth ' + money(m.end - m.endAlone) + " over " + m.years + " years if the account grows 7% a year. That rate is an assumption.</div>" : "") +
      (ro.trad ? '<div class="ya-readout"><h3>Taxed now or later</h3><p>On your numbers, the 401k lands at ' + money(ro.tradNet) + " after tax and the Roth at " + money(ro.roth) + ". The gap is " + money(Math.abs(ro.tradNet - ro.roth)) + ", and it flips entirely on what tax rate you retire into, which nobody knows. That is why plenty of people hold both.</p></div>" : "") +
      '<div class="ya-readout"><h3>The rules that bite</h3><p>Money out of a 401k or 403b before 59\u00bd usually costs a <b>10% penalty on top of the income tax</b>. A Roth is gentler: what you put in can come out at any time, though the growth has its own rules. IRS limits for 2026 are $24,500 for workplace plans and $7,500 for IRAs.</p></div>' +
      (S[st] ? '<div class="ya-readout"><h3>Your next move</h3><p>' + esc(S[st]) + "</p></div>" : "") +
      '<div class="ya-readout"><h3>What this is not</h3><p>This explains how the accounts work. It doesn\u2019t recommend a provider, a fund or an amount. Your plan documents and HR have the final word.</p></div>';
  },

  actions: function (state) {
    var st = (state && state.answers && state.answers.intent) || "";
    if (st === "match_unused") return ["Find out what percentage your job matches", "Raise your contribution to at least that", "Check what it did to your take-home next payday"];
    if (st === "pension") return ["Find out how many years until you\u2019re vested", "Find the percentage per year worked in the plan documents", "Ask whether you also pay into Social Security"];
    return ["Find out whether your job offers a plan, and whether it matches", "Look up what a Roth IRA would take to open", "Write down one amount you could put in this year"];
  }
});

})();
