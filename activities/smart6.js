/* =====================================================================
   Your Six Months — one SMART goal, with dates on it.

   Door 5 · Make the plan. Module 6 (Building Your Legacy), app-ised.
   Source scripts: Module 4 #8 The Power of SMART Goals, #9 Applying
   SMART Goals; Module 6 Strategic Planning: Begin with the End in Mind.
   The shape is the class's: pick one thing from the five-year vision,
   ask what has to be true in six months, then break the six months
   into months.

   SMART is asked as five plain questions, each screen labelled with its
   letter so the framework is learnable rather than invisible. The result
   screen shows the five parts back as a checked goal, and says which
   part is thin when one is. The class's own instruction to work
   backwards from the finish line is what the month-by-month screen does.

   Outcome: "I have one goal for six months, and I know the first step
   and the date."

   Design notes:

   * SMART is never named on screen. Each letter is a question a person
     would ask anyway: what, how you'll know, whether it's doable, why it
     matters, when. The acronym is jargon and the spec says no jargon in
     a title.

   * The goal is prefilled from what the profile already knows: the top
     category, the route from Three Doors, the why. Someone who has done
     nothing else still gets a working version, because every prefill
     has a plain fallback.

   * Half the value is the first step, so it gets its own screen and its
     own fact, and it feeds the Seven Days ending directly.
   ===================================================================== */
(function () {
"use strict";

function inSixMonths() {
  try {
    var d = new Date(); d.setMonth(d.getMonth() + 6);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch (e) { return "six months from today"; }
}

YNSActivity.define({
  slug: "smart6",
  title: "Your Six Months",

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
          eyebrow: "Fifteen minutes",
          title: "Six months is long enough to change something real.",
          lead: function () { return "Today plus six months is " + inSixMonths() + ". This activity decides what will be different by then."; },
          body: [
            "One goal. Small enough that you can picture the day it's done. Big enough to matter.",
            "Five questions, then the first step. The first step is the part that makes the rest true."
          ],
          cta: "Let's plan it"
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. The end in mind. One line of the five-year picture, so the
       six-month goal has something to point at. The class's Module 1
       vision board is the source if they did it; otherwise one sentence.
       --------------------------------------------------------------- */
    {
      id: "vision",
      axes: [],
      ladder: [
        {
          asks: "vision_line",
          mechanic: "text",
          eyebrow: "Begin with the end in mind",
          title: "Five years from now, what's one thing that's true about your life?",
          scene: [
            "The class starts every plan here: picture the end, then work backward. One line is enough. If you made a vision board, pick one thing off it."
          ],
          prompt: "Five years from now\u2026",
          placeholder: "Five years from now, I\u2026",
          rows: 3, maxLength: 300, cta: "That's the picture",
          examples: [
            "Five years from now I'm a licensed electrician with my own truck.",
            "Five years from now I work somewhere I'm not on my feet all day and I'm home for dinner.",
            "Five years from now I've got a degree, paid for by the job I'm in."
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. What. Prefilled from the profile where it can be.
       --------------------------------------------------------------- */
    {
      id: "what",
      axes: [],
      ladder: [
        {
          asks: "smart_goal",
          mechanic: "text",
          eyebrow: "S \u00b7 Specific",
          title: "So what has to be true in six months to get closer to that?",
          scene: function (v) {
            var vis = v && v.extra && v.extra.vision_text;
            var cat = v && v.derived && v.derived.top_category_label;
            return [
              (vis ? "\u201c" + vis + "\u201d That's the five-year picture. " : "") +
              "The class's question is: what needs to happen in the next six months to move closer? " +
              (cat ? "You've been circling " + cat + ", if that helps. " : "") +
              "Say it as something that will have happened. \u201cI've enrolled,\u201d rather than \u201cI'll look into enrolling.\u201d"
            ];
          },
          prompt: "One sentence. Past tense.",
          prefill: function (ctx) {
            var f = (ctx && ctx.facts) || {};
            var ROUTE = { degree: "enrolled in a program", apprenticeship: "started an apprenticeship", certificate: "finished a certificate", sideways: "moved into a role closer to the work" };
            if (f.route_preference && ROUTE[f.route_preference]) return "By then I've " + ROUTE[f.route_preference] + " in ";
            return "By then I've ";
          },
          placeholder: "By then I've\u2026",
          rows: 3,
          maxLength: 300,
          cta: "That's the goal",
          examples: [
            "By then I've finished the medical assistant certificate and applied to three clinics.",
            "By then I've moved off the sales floor into the stockroom lead role.",
            "By then I've saved $1,200 and signed up for the electrical pre-apprenticeship.",
            "By then I've had real conversations with five people who do the work I'm considering."
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. How you'll know. Measurable, without the word.
       --------------------------------------------------------------- */
    {
      id: "measure",
      axes: [],
      ladder: [
        {
          asks: "smart_measure",
          mechanic: "text",
          eyebrow: "M \u00b7 Measurable",
          title: "On the last day, what could someone else check?",
          scene: [
            "A thing you could point at. A certificate, a start date, a number in an account, an email that says yes. \u201cFeeling more confident\u201d is real, and nobody can check it."
          ],
          prompt: "The thing you'd point at.",
          placeholder: "You could check that\u2026",
          rows: 3,
          maxLength: 300,
          cta: "That's the proof"
        }
      ]
    },

    /* ---------------------------------------------------------------
       4. Is it doable. Closed vocabulary, honest, no pressure.
       --------------------------------------------------------------- */
    {
      id: "doable",
      axes: [],
      ladder: [
        {
          asks: "smart_confidence",
          mechanic: "choice",
          eyebrow: "A \u00b7 Achievable",
          title: "With the life you actually have, how likely is this in six months?",
          scene: [
            "Your hours, your money, your people. The class's example: if you've got a C, aiming for a B+ first beats aiming for an A. Shrinking a goal is a good move."
          ],
          prompt: "Your gut.",
          options: [
            { k: "likely",  t: "Likely, if I actually start",   s: "The size is right. The risk is the first week.", echo: "the size is right" },
            { k: "stretch", t: "A stretch, but possible",       s: "It'll take most of what I've got.", echo: "it's a stretch" },
            { k: "big",     t: "Honestly, too big",             s: "Say so now and cut it in half. That's the whole point of asking.", echo: "it's too big" },
            { k: "small",   t: "Too small. I could do more",    s: "Rare answer. Make it slightly bigger, not twice as big.", echo: "it's too small" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       5. Why it matters. Quote the why if we have it; otherwise ask.
       --------------------------------------------------------------- */
    {
      id: "why",
      axes: [],
      ladder: [
        {
          asks: "smart_why",
          mechanic: "text",
          eyebrow: "R \u00b7 Relevant",
          title: "Why this goal, out of everything you could pick?",
          scene: ["One line. It's what you'll read on the week it feels pointless."],
          prompt: "Because\u2026",
          placeholder: "Because\u2026",
          rows: 3,
          maxLength: 300,
          cta: "That's why"
        },
        {
          needs: { fact: "why_statement" },
          mechanic: "learn",
          eyebrow: "R \u00b7 Relevant",
          title: "You've already written this part.",
          lead: function (v) { return "\u201c" + ((v && v.facts && v.facts.why_statement) || "") + "\u201d"; },
          body: ["That's your why, from Your Why. Hold this goal up against it. If they don't match, one of them needs changing, and it's usually the goal."],
          provenance: "You've told us your why already, so this shows it instead of asking again.",
          cta: "They match"
        }
      ]
    },

    /* ---------------------------------------------------------------
       6. The first step. The part that makes it real.
       --------------------------------------------------------------- */
    {
      id: "first",
      axes: [],
      ladder: [
        {
          asks: "smart_first_step",
          mechanic: "text",
          eyebrow: "T \u00b7 Time-bound",
          title: "When does it start, and what\u2019s the first week?",
          scene: [
            "The date is already set: six months from today. So the only thing left is the first week, and it wants to be small enough that it would be embarrassing to skip. Look up one program. Email one person. Open one account. Fifteen minutes or less."
          ],
          prompt: "This week, I will\u2026",
          placeholder: "This week, I will\u2026",
          rows: 3,
          maxLength: 200,
          cta: "That's the step"
        }
      ]
    },

    /* ---------------------------------------------------------------
       7. Month by month. The class breaks six months into six monthly
       objectives. Prefilled scaffold, optional, because the first step
       matters more than a perfect calendar.
       --------------------------------------------------------------- */
    {
      id: "months",
      axes: [],
      ladder: [
        {
          asks: "smart_months",
          mechanic: "text",
          eyebrow: "Month by month",
          title: "Rough it out, one line per month.",
          scene: [
            "The class does this with the home-library example: month 1 buy three books, month 2 three more, and so on. Yours can be that plain. Blank months are fine."
          ],
          prompt: "One line each. Change any of it.",
          prefill: function (ctx) {
            var first = (ctx && ctx.extra && ctx.extra.first_text) || "";
            return "Month 1: " + (first || "") + "\nMonth 2: \nMonth 3: \nMonth 4: \nMonth 5: \nMonth 6: done.";
          },
          rows: 8, maxLength: 900, cta: "Good enough for now", optional: true
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    var goal = r.extra.what_text || "";
    var measure = r.extra.measure_text || "";
    var why = r.extra.why_text || r.ctx.facts.why_statement || "";
    var first = r.extra.first_text || "";
    var conf = r.state.answers.doable || "";
    var vision = r.extra.vision_text || "";
    var months = r.extra.months_text || "";

    var CONF = {
      likely:  "You said the size is right. Then the only thing between you and it is the first week, and you've already written what that week holds.",
      stretch: "You said it's a stretch. Stretches are fine as long as the first step is small. Keep the goal, and keep the step tiny.",
      big:     "You said it's too big, which is the most useful thing anyone says on this screen. Come back in and cut it to the first half. A finished half beats an abandoned whole.",
      small:   "You said you could do more. Add one thing to it, not three."
    };

    /* The five parts, back as a check. Naming a thin one is more use
       than a tick for every box. */
    var parts = [
      { L:"S", t:"Specific",    v:goal,    hint:"Say the thing itself, not the area it's in." },
      { L:"M", t:"Measurable",  v:measure, hint:"Something a person could check on the last day." },
      { L:"A", t:"Achievable",  v:CONF[conf] ? r.state.answers.doable : "", hint:"Right size for the life you actually have." },
      { L:"R", t:"Relevant",    v:why,     hint:"Tied to why you're doing any of this." },
      { L:"T", t:"Time-bound",  v:inSixMonths()+(first?" \u00b7 starting this week":""), hint:"A date, and a first week." }
    ];
    var thin = parts.filter(function(p){ return !p.v; });
    var check = '<div class="ya-readout"><h3>Your goal, checked</h3>' +
      parts.map(function(p){
        return "<p><b>" + p.L + " \u00b7 " + p.t + "</b> \u2014 " + (p.v ? "done" : "still thin. " + p.hint) + "</p>";
      }).join("") +
      (thin.length
        ? "<p>" + (thin.length === 1 ? "One part" : thin.length + " parts") + " could be sharper. A goal missing its M is the one that quietly never gets judged, and a goal missing its T is the one that never starts.</p>"
        : "<p>All five parts are there. That is a SMART goal, and most people never write one down.</p>") +
      "</div>";

    return "<h1>Your six months, written down.</h1>" +
      (vision ? '<div class="ya-readout"><h3>The end in mind</h3><p>' + esc(vision) + "</p></div>" : "") +
      (goal ? '<div class="ya-quote">' + esc(goal) + "</div>" : "") +
      '<div class="ya-readout"><h3>Done by</h3><p>' + esc(inSixMonths()) + "</p></div>" +
      (measure ? '<div class="ya-readout"><h3>How you\u2019ll know</h3><p>' + esc(measure) + "</p></div>" : "") +
      (why ? '<div class="ya-readout"><h3>Why it matters</h3><p>' + esc(why) + "</p></div>" : "") +
      (first ? '<div class="ya-readout"><h3>This week</h3><p>' + esc(first) + "</p></div>" : "") +
      (months ? '<div class="ya-readout"><h3>Month by month</h3><p style="white-space:pre-line">' + esc(months) + "</p></div>" : "") +
      check +
      (CONF[conf] ? '<p class="ya-result-lead">' + esc(CONF[conf]) + "</p>" : "") +
      '<p class="ya-result-lead">When the six months are up, the class says to rinse and repeat: pick the next six-month piece of the same five-year picture. Still True? will ask you about this in a month. Say what changed. Plans that get checked are the ones that happen.</p>';
  },

  actions: function (state) {
    var first = (state && state.extra && state.extra.first_text) || "";
    return [
      first || "Do the first step you wrote, this week",
      "Put the six-month date in your phone calendar",
      "Tell one person the goal, in one sentence"
    ];
  }
});

})();
