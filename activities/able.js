/* =====================================================================
   Solve It — one problem, the ABLE way.

   Door 4 · Mindset and money. Module 4, video 12: "Developing a
   Solutions-First Mindset", plus "Using the ABLE Framework in Everyday
   Challenges".

   Outcome: "I've taken one real problem apart and I know the first ten
   minutes of solving it."

   ABLE was already inside The Week It's Hard, which is the wrong home
   for it. That activity is about the week you want to quit; this one is
   about any problem, on any day, and most people meet it with something
   ordinary rather than a crisis. It deserves its own door card.

   Design notes:

   * The method is the class's: Assess, Brainstorm, List, Execute. The
     screens are named with the letters so the framework is learnable,
     not just usable once.

   * Brainstorm asks for three and accepts one. Demanding three good
     ideas from someone who is stuck is how you get zero.

   * The output is ten minutes of work with a day attached, because a
     solution nobody starts is the same as no solution.
   ===================================================================== */
(function () {
"use strict";

var DAYS = ["Today", "Tomorrow", "This weekend", "Monday"];

YNSActivity.define({
  slug: "able",
  title: "Solve It",

  slots: [

    /* ---------------------------------------------------------------
       1. The belief underneath the method. Short, because the work is
       the point and nobody came here for a lecture.
       --------------------------------------------------------------- */
    {
      id: "frame",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Seven minutes",
          title: "Every problem has a way through it.",
          lead: "The useful move is swapping \u201cwhy is this happening to me\u201d for \u201chow do I solve this\u201d. Same problem, completely different next ten minutes.",
          points: [
            "<b>A</b> \u00b7 Assess. What is actually the problem, said plainly.",
            "<b>B</b> \u00b7 Brainstorm. More than one way exists. Always.",
            "<b>L</b> \u00b7 List. Put them in order of what you could actually start.",
            "<b>E</b> \u00b7 Execute. Do ten minutes of the top one, then adjust."
          ],
          note: "This is the ABLE framework from Module 4. You'll walk one real problem through it, and it works on anything from a broken car to a stalled application.",
          cta: "Let's take one apart"
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. A · Assess
       --------------------------------------------------------------- */
    {
      id: "a",
      axes: [],
      ladder: [
        {
          asks: "able_problem",
          mechanic: "text",
          eyebrow: "A \u00b7 Assess",
          title: "What\u2019s one problem that\u2019s in your way right now?",
          scene: [
            "A real one, from this week. Small counts. The method works the same on a small problem, and a small one is a better place to learn it."
          ],
          prompt: "Say it in one line, plainly.",
          placeholder: "The problem is\u2026",
          rows: 3,
          maxLength: 300,
          cta: "That\u2019s the problem",
          examples: [
            "I can't get to the 6am shift because the bus doesn't run that early.",
            "The certificate costs $900 and I have $200.",
            "I keep saying I'll apply and then I don't.",
            "My hours got cut and rent is due in two weeks."
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. The reframe. One screen, and the one that does the work: the
       same problem said two ways.
       --------------------------------------------------------------- */
    {
      id: "reframe",
      axes: [],
      ladder: [
        {
          asks: "able_reframe",
          mechanic: "text",
          eyebrow: "Still A",
          title: "Now say it as a question that has an answer.",
          scene: function (v) {
            var pr = v && v.extra && v.extra.a_text;
            return [
              pr ? "\u201c" + pr + "\u201d" : "",
              "\u201cWhy is this happening to me\u201d has no answer you can act on. \u201cHow do I get to work by 6\u201d does. Rewrite yours as a how question."
            ].filter(Boolean);
          },
          prompt: "Start with \u201cHow do I\u2026\u201d",
          prefill: function () { return "How do I "; },
          rows: 3,
          maxLength: 300,
          cta: "That\u2019s the question"
        }
      ]
    },

    /* ---------------------------------------------------------------
       4. B · Brainstorm. Three asked for, one accepted.
       --------------------------------------------------------------- */
    {
      id: "b",
      axes: [],
      ladder: [
        {
          asks: "able_options",
          mechanic: "collect",
          eyebrow: "B \u00b7 Brainstorm",
          title: "Three ways it could go. Bad ones welcome.",
          scene: [
            "The first idea is rarely the best one, and it's never the only one. Write three, even if two are daft. Daft ideas are what shake the good one loose.",
            "One is enough to carry on with."
          ],
          prompt: "Add them one at a time.",
          placeholder: "I could\u2026",
          itemLabel: "One way it could go",
          count: 3,
          min: 1,
          cta: "That\u2019ll do",
          ctaFull: "That\u2019s my three"
        }
      ]
    },

    /* ---------------------------------------------------------------
       5. L · List. Ordering is the whole step, so it gets its own
       screen rather than being folded into the brainstorm.
       --------------------------------------------------------------- */
    {
      id: "l",
      axes: [],
      ladder: [
        {
          mechanic: "choice",
          eyebrow: "L \u00b7 List",
          title: "Which one could you actually start soonest?",
          scene: [
            "Not the best one. Not the cleverest one. The one you could begin without anything else having to happen first.",
            "That is usually the right one, because a started solution beats a perfect plan."
          ],
          prompt: "The one you could start.",
          options: [
            { k: "first",  t: "The first one I wrote",  s: "Often the obvious one, and obvious is fine.", echo: "your first idea" },
            { k: "second", t: "The second one",         s: "", echo: "your second idea" },
            { k: "third",  t: "The third one",          s: "The one you nearly didn\u2019t write down.", echo: "your third idea" },
            { k: "help",   t: "None of them on my own",  s: "Then the answer is a person, and that\u2019s a real answer.", echo: "you need someone" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       6. E · Execute. Ten minutes and a day, because a solution without
       a start time is a wish.
       --------------------------------------------------------------- */
    {
      id: "e",
      axes: [],
      ladder: [
        {
          asks: "able_step",
          mechanic: "text",
          eyebrow: "E \u00b7 Execute",
          title: "What are the first ten minutes?",
          scene: [
            "Not the whole solution. The first ten minutes of it. One phone call, one search, one message, one form."
          ],
          prompt: "Ten minutes, and nothing bigger.",
          placeholder: "I\u2019ll\u2026",
          rows: 3,
          maxLength: 220,
          cta: "That\u2019s the start"
        }
      ]
    },
    {
      id: "when",
      axes: [],
      ladder: [
        {
          asks: "able_when",
          mechanic: "choice",
          eyebrow: "Last one",
          title: "When?",
          scene: ["Pick the one you'd actually do. A day you know you'll miss is worse than a later day you'll keep."],
          prompt: "Honestly.",
          options: DAYS.map(function (d) { return { k: d.toLowerCase().replace(/\s/g, "_"), t: d, echo: d.toLowerCase() }; })
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    var problem = r.extra.a_text || r.ctx.facts.able_problem || "";
    var question = r.extra.reframe_text || "";
    var items = r.extra.b_items || [];
    var pick = r.state.answers.l || "";
    var step = r.extra.e_text || "";
    var when = r.extra.when_label || "";

    var PICK = { first: 0, second: 1, third: 2 };
    var chosen = PICK[pick] != null && items[PICK[pick]] ? items[PICK[pick]].text : null;

    return "<h1>That\u2019s one problem, taken apart.</h1>" +
      (problem ? '<div class="ya-readout"><h3>A \u00b7 what it is</h3><p>' + esc(problem) + "</p></div>" : "") +
      (question ? '<div class="ya-quote">' + esc(question) + "</div>" : "") +
      (items.length
        ? '<div class="ya-readout"><h3>B \u00b7 the ways through it</h3><p>' +
          items.map(function (i, n) { return (n + 1) + ". " + esc(i.text); }).join("<br>") + "</p></div>"
        : "") +
      (chosen
        ? '<div class="ya-readout"><h3>L \u00b7 the one you can start</h3><p>' + esc(chosen) + "</p></div>"
        : pick === "help"
        ? '<div class="ya-readout"><h3>L \u00b7 the one you can start</h3><p>You said none of them on your own. That is a real answer and it names the next move: one person, one ask. Two Conversations is built for exactly that.</p></div>'
        : "") +
      (step
        ? '<div class="ya-readout"><h3>E \u00b7 the first ten minutes</h3><p>' + esc(step) + (when ? " \u00b7 <b>" + esc(when) + "</b>" : "") + "</p></div>"
        : "") +
      '<p class="ya-result-lead">That\u2019s the whole method. Assess, brainstorm, list, execute. ' +
      "It works the same on the next one, and the one after that, which is the point of learning it on a small problem.</p>";
  },

  actions: function (state) {
    var when = (state && state.extra && state.extra.when_label) || "this week";
    var step = (state && state.extra && state.extra.e_text) || "";
    return [
      step ? step + " \u00b7 " + when : "Do the first ten minutes " + when.toLowerCase(),
      "Tell one person what you decided to try",
      "Run the same four steps on a second problem and see how much faster it goes"
    ];
  }
});

})();
