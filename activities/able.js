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

   * The method is the course's: Assess, Brainstorm, List, Execute. The
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

/* The Week It's Hard asks the same three things (able_problem,
   able_options, able_step), so whichever of the two runs second finds
   them on file and drops the question. These helpers let this activity
   show what was stored instead of going quiet about it. */
function escHTML(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* able_options arrives in two shapes: a list of {moment} from this
   activity's collect screen, or one block of text, a line per idea,
   from The Week It's Hard. */
function optionList(val) {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map(function (x) {
      return String((x && (x.moment || x.text)) || (typeof x === "string" ? x : "")).trim();
    }).filter(Boolean);
  }
  return String(val).split(/\n+/).map(function (l) {
    return l.replace(/^\s*(?:\d+[.)]|[-*\u2022])\s*/, "").trim();
  }).filter(Boolean);
}

/* Where a stored answer came from, said only as precisely as we know. */
function fromWhere(v) {
  var done = (v && v.facts && v.facts.activities_completed) || [];
  return done.indexOf("bounce") >= 0 ? "in The Week It\u2019s Hard" : "earlier";
}

function storedItems(v) {
  var own = (v && v.extra && v.extra.b_items) || [];
  if (own.length) return own.map(function (i) { return i.text; });
  return optionList(v && v.facts && v.facts.able_options);
}

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
          title: "You can look for a way through this.",
          lead: "One move that can help: swap \u201cwhy is this happening to me\u201d for \u201chow do I solve this\u201d. The problem stays the same, and your next ten minutes can look very different.",
          points: [
            "<b>A</b> \u00b7 Assess. What is actually the problem, said plainly.",
            "<b>B</b> \u00b7 Brainstorm. Look for more than one way.",
            "<b>L</b> \u00b7 List. Put them in order of what you could actually start.",
            "<b>E</b> \u00b7 Execute. Do ten minutes of the top one, then adjust."
          ],
          note: "Those four letters spell ABLE: Assess, Brainstorm, List, Execute. You'll walk one real problem through it, and you can try it on anything from a broken car to a stalled application.",
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
            "A real one, from this week. Small counts. A small problem is a good place to practice the method."
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
        },
        {
          needs: { fact: "able_problem" },
          mechanic: "learn",
          eyebrow: "A \u00b7 Assess",
          title: function (v) { return "You named this problem " + fromWhere(v) + "."; },
          provenance: "You've told us this already, so this doesn't ask again.",
          lead: function (v) { return "\u201c" + ((v && v.facts && v.facts.able_problem) || "") + "\u201d"; },
          body: ["We'll take this one apart here, one step at a time."],
          cta: "Use this one"
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
            var pr = (v && v.extra && v.extra.a_text) || (v && v.facts && v.facts.able_problem);
            return [
              pr ? "\u201c" + escHTML(pr) + "\u201d" : "",
              "\u201cWhy is this happening to me\u201d can be hard to act on. \u201cHow do I get to work by 6\u201d does. Rewrite yours as a how question."
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
            "Your first idea might have company. Write three, even if two are silly. A silly idea can help you find a good one.",
            "One is enough to carry on with."
          ],
          prompt: "Add them one at a time.",
          placeholder: "I could\u2026",
          itemLabel: "One way it could go",
          count: 3,
          min: 1,
          cta: "That\u2019ll do",
          ctaFull: "That\u2019s my three"
        },
        {
          needs: { fact: "able_options" },
          mechanic: "learn",
          eyebrow: "B \u00b7 Brainstorm",
          title: function (v) { return "You listed these " + fromWhere(v) + "."; },
          provenance: "You've told us this already, so this doesn't ask again.",
          points: function (v) {
            return storedItems(v).map(function (t, n) { return (n + 1) + ". " + escHTML(t); });
          },
          body: ["These are the ways through it you already wrote. Next, you'll pick the one you could start."],
          cta: "Use these"
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
          scene: function (v) {
            var items = storedItems(v);
            return (items.length
              ? ["Your list:<br>" + items.map(function (t, n) { return (n + 1) + ". " + escHTML(t); }).join("<br>")]
              : []).concat([
              "Pick the one you could begin without anything else having to happen first.",
              "Starting that one first can help you get moving."
            ]);
          },
          prompt: "The one you could start.",
          options: [
            { k: "first",  t: "The first one I wrote",  s: "Maybe the obvious one, and obvious is fine.", echo: "your first idea" },
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
            "Just the first ten minutes. One phone call, one search, one message, one form."
          ],
          prompt: "Ten minutes, and nothing bigger.",
          placeholder: "I\u2019ll\u2026",
          rows: 3,
          maxLength: 220,
          cta: "That\u2019s the start"
        },
        {
          needs: { fact: "able_step" },
          mechanic: "learn",
          eyebrow: "E \u00b7 Execute",
          title: function (v) { return "You picked a first step " + fromWhere(v) + "."; },
          provenance: "You've told us this already, so this doesn't ask again.",
          lead: function (v) { return "\u201c" + ((v && v.facts && v.facts.able_step) || "") + "\u201d"; },
          body: ["Next, pick the day you'll do it."],
          cta: "Use this step"
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
          scene: ["Pick the one you'd actually do. Choose a day you know you can keep, even if it's later."],
          prompt: "Your best guess.",
          options: DAYS.map(function (d) { return { k: d.toLowerCase().replace(/\s/g, "_"), t: d, echo: d.toLowerCase() }; })
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    var problem = r.extra.a_text || r.ctx.facts.able_problem || "";
    var question = r.extra.reframe_text || r.ctx.facts.able_reframe || "";
    var items = (r.extra.b_items && r.extra.b_items.length)
      ? r.extra.b_items
      : optionList(r.ctx.facts.able_options).map(function (t) { return { text: t }; });
    var pick = r.state.answers.l || "";
    var step = r.extra.e_text || r.ctx.facts.able_step || "";
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
      "You can use it on the next one, and the one after that. That\u2019s why it helps to learn it on a small problem.</p>";
  },

  actions: function (state, ctx) {
    var when = (state && state.extra && state.extra.when_label) || "this week";
    var step = (state && state.extra && state.extra.e_text) || (ctx && ctx.facts && ctx.facts.able_step) || "";
    return [
      step ? step + " \u00b7 " + when : "Do the first ten minutes " + when.toLowerCase(),
      "Tell one person what you decided to try",
      "Run the same four steps on a second problem and see how it goes"
    ];
  }
});

})();
