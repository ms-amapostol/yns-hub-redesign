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

/* A line with a number in it can be judged. A line with a when in it
   gets started. Everything else is a wish, and saying so is more useful
   than accepting it. */
function monthCheck(months) {
  if (!months) return "";
  var lines = String(months).split("\n")
    .map(function (l) { return l.trim(); })
    .filter(function (l) { return l && /:/.test(l) && l.split(":")[1].trim(); });
  if (!lines.length) return "";
  var WHEN = /(by |before |week|month|friday|monday|tuesday|wednesday|thursday|saturday|sunday|\b\d{1,2}(st|nd|rd|th)\b|end of)/i;
  var rows = lines.map(function (l) {
    var body = l.split(":").slice(1).join(":");
    var hasNum = /\d/.test(body);
    var hasWhen = WHEN.test(body);
    var flag = hasNum && hasWhen ? "ready"
      : !hasNum && !hasWhen ? "needs a number and a by-when"
      : !hasNum ? "needs a number"
      : "needs a by-when";
    return "<p><b>" + l.split(":")[0] + "</b> \u2014 " + (flag === "ready" ? "ready" : flag) + "</p>";
  });
  var ready = rows.filter(function (r) { return /ready/.test(r); }).length;
  return '<div class="ya-readout"><h3>The other months, checked</h3>' + rows.join("") +
    "<p>" + (ready === rows.length
      ? "Every line has a number and a when. That is six SMART goals, not one."
      : ready + " of " + rows.length + " are ready. The rest will still work, they just cannot be judged at the end of the month, which is the part that keeps a plan honest.") +
    "</p></div>";
}

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
            var ROUTE = { degree: "enrolled in a program", apprenticeship: "started an apprenticeship", certificate: "finished a certificate", lateral: "moved into a role closer to the work" };
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
       6. Month one, written as a SMART goal rather than described as
       one. The class teaches the framework; this is where someone
       actually produces one. Assembled from four blanks so nobody has to
       hold five criteria in their head while writing a sentence.
       --------------------------------------------------------------- */
    {
      id: "month1",
      axes: [],
      ladder: [
        {
          asks: "smart_month1",
          asksText: true,
          mechanic: "compose",
          eyebrow: "T \u00b7 Time-bound",
          title: "Now write month one as a SMART goal.",
          scene: [
            "The six-month goal is the destination. Month one is the first goal you will actually hit, so it is worth writing properly.",
            "Fill in the four blanks and the sentence writes itself. Every part of SMART is in it: what, how much, how you\u2019ll check, and by when."
          ],
          prompt: "Fill these in and watch the sentence build.",
          cta: "That\u2019s month one",
          blanks: [
            { k: "action", t: "What you\u2019ll have done",       placeholder: "called three training providers" },
            { k: "number", t: "How many, or how much",         placeholder: "three" },
            { k: "check",  t: "How you\u2019ll know it\u2019s done", placeholder: "I have their costs written down" },
            { k: "by",     t: "By when",                       placeholder: "the last Friday of the month" }
          ],
          template:
            "By {by}, I will have {action}.\n" +
            "How much: {number}.\n" +
            "I\u2019ll know it\u2019s done because {check}."
        }
      ]
    },

    /* ---------------------------------------------------------------
       7. The rest of the months, each to the same shape as month one.
       The class works backwards from the finish line; the scaffold does
       that for them, and the results screen checks each line for a
       number and a when rather than accepting a wish.
       --------------------------------------------------------------- */
    {
      id: "months",
      axes: [],
      ladder: [
        {
          asks: "smart_months",
          mechanic: "text",
          eyebrow: "The other five",
          title: "Now work backwards from month six.",
          scene: [
            "The class does this with a home library: month six is three more books, month five is three before that. Yours can be exactly that plain.",
            "Write each month the way you wrote month one. The five letters are what turn a line into something you can actually finish."
          ],
          prompt: "One line per month. Leave any of them blank for now.",
          /* The acronym belongs here, on the screen where it gets used,
             rather than on the results screen where it is too late to
             act on. */
          aside: {
            title: "SMART, in one line each",
            points: [
              "<b>S</b> \u00b7 Specific. The thing itself. \u201clook into schools\u201d is an area; \u201ccall three medical assistant programs\u201d is a thing.",
              "<b>M</b> \u00b7 Measurable. Put a number in it. Three calls. $300. Two shifts.",
              "<b>A</b> \u00b7 Achievable. Something that fits the month you are actually going to have.",
              "<b>R</b> \u00b7 Relevant. It has to move the six-month goal, or it does not belong on the list.",
              "<b>T</b> \u00b7 Time-bound. A by-when inside the month. \u201cby the 10th\u201d beats \u201cthis month\u201d."
            ],
            note: "A line with a number and a by-when can be judged at the end of the month. That is the whole difference."
          },
          prefill: function (ctx) {
            var b = (ctx && ctx.extra && ctx.extra.month1_blanks) || {};
            /* "by by the last Friday" is what you get if you prepend a
               word the person already typed. */
            var by = (b.by || "").trim();
            if (by && !/^(by|before|on|from|during|end of)\b/i.test(by)) by = "by " + by;
            var first = b.action
              ? b.action + (b.number ? " (" + b.number + ")" : "") + (by ? ", " + by : "")
              : "";
            return "Month 1: " + first + "\n" +
                   "Month 2: \n" +
                   "Month 3: \n" +
                   "Month 4: \n" +
                   "Month 5: \n" +
                   "Month 6: ";
          },
          rows: 8,
          maxLength: 900,
          cta: "That\u2019s the six months",
          optional: true,
          skipLabel: "I\u2019ll do the rest later",
          examples: [
            "Month 2: sit the entrance test, book it by the 10th",
            "Month 3: save $300 toward the fee, $75 a week",
            "Month 4: enrol, deposit paid by the 15th"
          ]
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    /* A slot whose fact is already known gets dropped on a second run, so
       `extra` is empty and everything would read as missing. Fall back to
       what is on file. */
    var f = r.ctx.facts;
    var goal    = r.extra.what_text    || f.smart_goal   || "";
    var measure = r.extra.measure_text || f.smart_measure|| "";
    var why     = r.extra.why_text     || f.smart_why    || f.why_statement || "";
    var first   = r.extra.month1_text  || f.smart_month1 || "";
    var conf    = r.state.answers.doable || f.smart_confidence || "";
    var vision  = r.extra.vision_text  || f.vision_line  || "";
    var months  = r.extra.months_text  || f.smart_months || "";

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
      { L:"A", t:"Achievable",  v:conf,    hint:"Right size for the life you actually have." },
      { L:"R", t:"Relevant",    v:why,     hint:"Tied to why you're doing any of this." },
      { L:"T", t:"Time-bound",  v:first,   hint:"Month one needs a by-when, not just a direction." }
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
      (first
        ? '<div class="ya-readout"><h3>Month one, as a SMART goal</h3><p style="white-space:pre-line">' + esc(first) + "</p></div>"
        : "") +
      monthCheck(months) +
      check +
      (CONF[conf] ? '<p class="ya-result-lead">' + esc(CONF[conf]) + "</p>" : "") +
      '<p class="ya-result-lead">When the six months are up, the class says to rinse and repeat: pick the next six-month piece of the same five-year picture. In a month, you\u2019ll see a reminder here to check in with Still True? Say what changed. Plans that get checked are the ones that happen.</p>';
  },

  /* Each month line gets the same two questions asked of it: is there a
     number in it, and is there a when. Flagged rather than corrected,
     because it is their plan. */
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
