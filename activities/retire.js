/* =====================================================================
   The Match — 401k, 403b, Roth and pensions, with the math shown.

   Door 4 · Mindset and money. Module 5, "All Things Retirement".

   Outcome: "I know which account does what, what my employer's match is
   worth, what the tax difference between a 401k and a Roth actually
   costs me, and what a pension is."

   Nothing here recommends a provider or a product. Figures are 2026 IRS
   limits, labeled and dated, and the activity says to check the plan
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
          title: "Retirement is a pot, and here are three common ways to fill it.",
          lead: "You don\u2019t need a plan for retirement today. You do need to know what the deduction on your pay stub is buying, and which of these you have access to.",
          points: [
            "<b>A 401k or 403b</b> comes through work. Money goes in before tax, and some employers add money on top.",
            "<b>A Roth IRA</b> you open yourself. Money goes in after tax, and nothing is taxed when it comes out, if you take it out after 59\u00bd and the account is at least five years old.",
            "<b>A pension</b> is a promise from an employer to pay you a set amount every month for life."
          ],
          note: "One thing to keep in mind: the earlier money goes in, the more years it has to grow.",
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
          title: "An employer match adds money on top of what you put in.",
          scene: [
            "This screen is about workplace plans only: a <b>401k</b> if you work somewhere for-profit, a <b>403b</b> if you work for a non-profit, a school or a hospital. A Roth IRA you open yourself has no match, and neither does a pension.",
            "If your employer matches, they add their money to yours. If you put in less than the match, the unmatched part is money your employer doesn\u2019t add.",
            "This assumes they match dollar for dollar. Many plans match half. The growth below uses 7% a year, based on past stock market returns before inflation. That\u2019s an assumption."
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
              + "<div><span>After " + r.years + " years at an assumed 7%</span><b>" + money(r.end) + "</b></div>"
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
            "A <b>Roth IRA</b> takes money after tax. You pay tax now, so less goes in, and nothing is taxed on the way out, growth included, if you take it out after 59\u00bd and the account is at least five years old.",
            "Same money, two different deals. Here is what each is worth."
          ],
          prompt: "Put in what you could save a year, and see both.",
          inputs: [
            { k: "annual", t: "What you\u2019d put in a year", prefix: "$", start: 3000, step: 500, max: 24500, s: "Roth IRAs cap at $7,500 a year in 2026. Workplace plans cap at $24,500." },
            { k: "now",    t: "Your tax rate now",           prefix: "", suffix: "%", start: 12, step: 1, max: 37, s: "12% and 22% are two of the federal brackets. The IRS site lists which income goes in each." },
            { k: "later",  t: "Your tax rate in retirement",  prefix: "", suffix: "%", start: 12, step: 1, max: 37, s: "Nobody knows yet, so some people hold both to spread the bet." },
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
              + (r.overRoth ? '<p class="calc-late">Above $7,500 a year the extra can\u2019t go in a Roth IRA. Only a workplace plan takes that much.</p>' : "");
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
          lead: "You can hold more than one. For example, you can pay into a workplace plan and a Roth IRA in the same year.",
          points: [
            "<b>401k / 403b, good:</b> the match, a high limit ($24,500 in 2026), it lowers this year\u2019s tax bill, and it comes out of pay before you see it.",
            "<b>401k / 403b, bad:</b> every dollar is taxed on the way out, you pick from the plan\u2019s menu, and taking it out before 59\u00bd usually costs <b>a 10% penalty on top of the tax</b>.",
            "<b>Roth IRA, good:</b> nothing is taxed coming out, growth included, if you take it out after 59\u00bd and the account is at least five years old. You open it yourself, so it isn\u2019t tied to any job. You can withdraw <b>what you put in</b> at any time without penalty.",
            "<b>Roth IRA, bad:</b> no match, a much lower limit of <b>$7,500 a year in 2026</b>, no tax break today, and high earners get phased out.",
            "<b>You can open a Roth at any time</b>, at any age, as long as you earned income that year. There\u2019s no enrollment window."
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
          title: "A pension is a monthly payment, promised for life.",
          scene: [
            "With a 401k you carry the risk: you choose what it\u2019s invested in, and what you retire with depends on how the market did.",
            "With a pension the employer carries it. They promise a monthly check for life, usually worked out as <b>years worked \u00d7 a percentage \u00d7 your final salary</b>. If the market has a bad decade, that is their problem."
          ],
          prompt: "The plan documents list the percentage per year worked. The 2% below is only an example.",
          inputs: [
            { k: "years",  t: "Years you\u2019d work there", prefix: "", start: 25, step: 5, max: 45, s: "" },
            { k: "salary", t: "Your final salary",          prefix: "$", start: 60000, step: 5000, max: 250000, s: "Some plans use an average of your best few years. Check yours." },
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
              + '<p class="calc-late">A pot big enough to pay that out would need to be about ' + money(r.yearly * 25) + ', using a common rule of thumb of 25 years of payments. That\u2019s an assumption.</p>';
          },
          cta: "Who offers those?"
        },
        {
          mechanic: "learn",
          eyebrow: "Pensions, in full",
          title: "Who still has them, and what the catch is.",
          points: [
            "<b>Where you might find them:</b> state and local government, teaching and school districts, police and fire, the military, and some hospitals, universities, union trades and manufacturers.",
            "<b>Good:</b> a check for life that doesn\u2019t run out, no investment decisions to make, and the employer carries the market risk. Some include a survivor benefit for a spouse.",
            "<b>Bad:</b> <b>vesting</b>. Leave before you\u2019re vested and you may walk away with little or nothing. Ask how many years vesting takes. The amount grows with the years you stay, so leaving early can cost you.",
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
            { k: "match_unused", t: "There\u2019s a match at work I\u2019m not taking",  s: "A match adds money on top of yours. HR can tell you what signing up takes.", echo: "a match you\u2019re not taking" },
            { k: "match_used",   t: "I\u2019m taking the full match",                 s: "Next, you could compare an IRA.", echo: "taking the match" },
            { k: "pension",      t: "My job has a pension",                        s: "Then vesting is the number to find out.", echo: "a pension" },
            { k: "none",         t: "No plan at work, or no job right now",        s: "An IRA is an account you can open yourself. You can put money in for any year you had earned income.", echo: "nothing at work yet" }
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
      match_unused: "You said there\u2019s a match you\u2019re not taking. One option to look at is putting in at least enough to get the full match. HR or the benefits page can tell you the percentage.",
      match_used:   "You\u2019re taking the full match. Some people also open an IRA alongside it. The screens above show how the two compare.",
      pension:      "You have a pension. Two numbers decide what staying is worth: the years until you\u2019re vested, and the percentage per year worked. HR and the plan documents have both.",
      none:         "Nothing at work yet. An IRA doesn\u2019t need an employer. You can put money in for any year you had earned income, up to $7,500 in 2026."
    };
    return "<h1>Three ways to fill the pot.</h1>" +
      (m.end ? '<div class="ya-quote">Your match is worth ' + money(m.end - m.endAlone) + " over " + m.years + " years if the account grows 7% a year. That rate is an assumption. This also assumes they match dollar for dollar, and many plans match half.</div>" : "") +
      (ro.trad ? '<div class="ya-readout"><h3>Taxed now or later</h3><p>On your numbers, the 401k lands at ' + money(ro.tradNet) + " after tax and the Roth at " + money(ro.roth) + ". The gap is " + money(Math.abs(ro.tradNet - ro.roth)) + ", and it flips entirely on what tax rate you retire into, which nobody knows yet. Some people hold both for that reason.</p></div>" : "") +
      '<div class="ya-readout"><h3>The rules that bite</h3><p>Money out of a 401k or 403b before 59\u00bd usually costs a <b>10% penalty on top of the income tax</b>. A Roth is gentler: what you put in can come out at any time. The growth comes out tax-free if you take it out after 59\u00bd and the account is at least five years old. IRS limits for 2026 are $24,500 for workplace plans and $7,500 for IRAs.</p></div>' +
      (S[st] ? '<div class="ya-readout"><h3>Where you are</h3><p>' + esc(S[st]) + "</p></div>" : "") +
      '<div class="ya-readout"><h3>What this covers</h3><p>This explains how the accounts work. It doesn\u2019t recommend a provider, a fund or an amount. Your plan documents and HR have the final word.</p></div>';
  },

  actions: function (state) {
    var st = (state && state.answers && state.answers.intent) || "";
    if (st === "match_unused") return ["Find out what your job matches", "Find out how much it takes to get the full match", "Check what a change would do to your take-home pay"];
    if (st === "pension") return ["Find out how many years until you\u2019re vested", "Find the percentage per year worked in the plan documents", "Ask whether you also pay into Social Security"];
    return ["Find out whether your job offers a plan, and whether it matches", "Find out what it takes to open an IRA", "Write down what you could put in this year, if anything"];
  }
});

})();
