/* =====================================================================
   Fixed or Assumed — sorting what is actually immovable.

   Outcome: "I know which of my constraints are fixed and which I've just
   never questioned."

   The quiet one. Most people's "impossible" is a mix of two very
   different things — a genuine constraint and an assumption they
   inherited and never tested — and they are stored in the same place in
   the head, which is why the whole pile feels immovable.

   The mechanic is a two-pile card sort: one card, two buttons. Not a
   swipe, because a swipe cannot be done with a keyboard and this has to
   work for everyone.

   Deliberately NOT gated. It works cold, on a first visit, for someone
   who has done nothing else — and it is probably the most useful thing
   here for a person who arrives convinced they have no options.
   ===================================================================== */
(function () {
"use strict";

/* The cards. Each one scores the sorting decision itself: `aA` when it
   lands in Fixed, `aB` when it lands in Worth questioning. Someone who
   treats most things as negotiable is telling us something real about
   how they will approach a change. */
var CARDS = [
  { k: "location",   t: "I have to stay where I am",
    s: "Family, a lease, a school, someone who can't move.",
    aA: { order: 2 }, aB: { leading: 2 } },
  { k: "hours",      t: "I need these exact hours",
    s: "School pickup, a second job, someone who needs you at a fixed time.",
    aA: { order: 2 }, aB: { leading: 1, people: 1 } },
  { k: "money_now",  t: "I can't take a pay cut, even for a bit",
    s: "The number has to hold from day one.",
    aA: { order: 2 }, aB: { analysis: 2 } },
  { k: "quals",      t: "I don't have the qualifications",
    s: "The postings all ask for something you haven't got.",
    aA: { order: 1, analysis: 1 }, aB: { making: 2 } },
  { k: "age",        t: "I'm the wrong age for this",
    s: "Too late to start, or too young to be taken seriously.",
    aA: { order: 2 }, aB: { leading: 2 } },
  { k: "experience", t: "Nobody will hire me without experience",
    s: "And you can't get experience without being hired.",
    aA: { order: 1, people: 1 }, aB: { making: 1, leading: 1 } },
  { k: "transport",  t: "I can't reliably get there",
    s: "No car, bad transit, a commute that doesn't work.",
    aA: { hands: 1, order: 1 }, aB: { analysis: 2 } },
  { k: "confidence", t: "I'm not the kind of person who does that",
    s: "This one is about how you see yourself.",
    aA: { order: 2 }, aB: { people: 1, leading: 1 } },
  { k: "time",       t: "I haven't got time to retrain",
    s: "Between work and everyone else, there's nothing left.",
    aA: { order: 2 }, aB: { analysis: 1, making: 1 } },
  { k: "people",     t: "The people around me wouldn't get it",
    s: "Family, a partner, the person whose opinion lands hardest.",
    aA: { people: 2 }, aB: { leading: 2 } }
];

YNSActivity.define({
  slug: "constraints",
  title: "Fixed or Assumed",

  slots: [

    /* ---------------------------------------------------------------
       1. The sort itself.
       --------------------------------------------------------------- */
    {
      id: "sort",
      axes: ["order", "leading", "people", "analysis", "making", "hands"],
      ladder: [
        {
          mechanic: "sort",
          eyebrow: "Ten cards",
          title: "Which of these are true?",
          scene: [
            "You may carry a list of reasons a change isn't possible. Some of them are real. They're facts about your life that everything else rests on.",
            "Some of them may be things you were told once, or worked out years ago, and haven't looked at since.",
            "When they're all mixed together, the whole pile can feel stuck. We'll take them one card at a time."
          ],
          prompt: "Go with your gut. Nobody else sees this, and it helps to count a real constraint as real.",
          pileA: "That's fixed",
          pileB: "Worth questioning",
          pileHint: "\"Worth questioning\" means you haven't checked it yet.",
          cards: CARDS,
          /* The two constraint facts are registered in fact_keys and were
             going unwritten — so Three Doors' deeper rung, which is keyed
             on constraints_assumed, could never fire. A slot that sorts
             into piles has no single `asks`, hence the explicit map. */
          factsFrom: function (piles) {
            return {
              constraints_fixed: piles.a || [],
              constraints_assumed: piles.b || []
            };
          }
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. The one they pick to test. This is where the activity stops
       being a sort and becomes a decision.
       --------------------------------------------------------------- */
    {
      id: "pick",
      axes: [],
      ladder: [
        {
          mechanic: "choice",
          eyebrow: "One of them",
          title: "Pick the one you'd least like to be wrong about.",
          scene: [
            "Go for the one where finding out you were wrong would change the most."
          ],
          prompt: "Which is it?",
          options: [
            { k: "money",  t: "The money one",
              s: "Whether the number really has to hold from day one.", echo: "I'll check the money one", a: {} },
            { k: "quals",  t: "The qualification one",
              s: "Whether the postings mean it, or are just asking.", echo: "I'll check the qualifications one", a: {} },
            { k: "time",   t: "The time one",
              s: "Whether there's nothing left in the week.", echo: "I'll check the time one", a: {} },
            { k: "self",   t: "The one about me",
              s: "Whether you're not that kind of person.", echo: "I'll check what I believe about myself", a: {} },
            { k: "people", t: "The one about other people",
              s: "Whether they'd really react the way you expect.", echo: "I'll check how people would really react", a: {} }
          ]
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var piles = r.extra.sort_sortPiles || { a: [], b: [] };
    var esc = r.esc;
    var byKey = {};
    CARDS.forEach(function (c) { byKey[c.k] = c; });

    var fixed = (piles.a || []).map(function (k) { return byKey[k]; }).filter(Boolean);
    var open = (piles.b || []).map(function (k) { return byKey[k]; }).filter(Boolean);
    var picked = r.state.answers.pick || "";
    var PICK_WORDS = {
      money: "the money", quals: "the qualifications", time: "the time",
      self: "the story you tell about yourself", people: "how other people would react"
    };

    /* The honest reading of each shape, rather than a compliment. */
    var lead;
    if (!open.length) {
      lead = "All ten went in the fixed pile.";
    } else if (!fixed.length) {
      lead = "You kept all of them open.";
    } else {
      lead = fixed.length + " fixed, " + open.length + " worth questioning.";
    }

    var reading =
      !open.length
        ? "That might be exactly right. Some lives really are that constrained, and pretending " +
          "otherwise wouldn't help you. It can also happen when checking has stopped feeling worth the effort. " +
          "You only need to take on the one you pick below."
      : !fixed.length
        ? "It's worth checking how much room you really have. A plan can miss something that is still there in six months. If one of these is holding everything else up, finding out now can save you a surprise later."
      : "That second pile is the useful one. Those things might all be true. An unchecked reason can stop you too, and looking at it closely can show you whether it moves.";

    return "<h1>" + esc(lead) + "</h1>" +
      '<p class="ya-result-lead">' + reading + "</p>" +

      (fixed.length
        ? '<div class="ya-readout"><h3>What you said is fixed</h3><p>' +
          fixed.map(function (c) { return esc(c.t); }).join(" · ") + "</p>" +
          "<p>Design around these. A plan that respects them can be easier to stick with.</p></div>"
        : "") +

      (open.length
        ? '<div class="ya-readout"><h3>What you said is worth questioning</h3><p>' +
          open.map(function (c) { return esc(c.t); }).join(" · ") + "</p>" +
          "<p>Many of these can be checked: with a number, a real requirement, or one conversation.</p></div>"
        : "") +

      (PICK_WORDS[picked]
        ? '<div class="ya-quote">The one you\u2019d least like to be wrong about is <b>' +
          esc(PICK_WORDS[picked]) + "</b>. That's a good one to check first, and you don't have to decide anything yet.</div>"
        : "");
  },

  actions: function (state) {
    var picked = state.answers.pick || "";
    if (picked === "quals") {
      return [
        "Read five real postings and count how many require the qualification",
        "Find one person doing the job who doesn't have it, and ask how",
        "Look up whether there's a shorter route in than the one you assumed"
      ];
    }
    if (picked === "money") {
      return [
        "Work out your real monthly floor, so the money question has a number in it",
        "Find one role in this field that clears that number today",
        "Check what a part-time or evening version of the training costs"
      ];
    }
    if (picked === "people") {
      return [
        "Tell one person you trust what you are thinking about, and watch what happens",
        "Write down what you expect them to say, so you can compare it afterwards",
        "Find one person who has already made this change and ask how it landed at home"
      ];
    }
    return [
      "Spend twenty minutes finding the actual answer to the one you picked",
      "Ask one person who would know",
      "Write down what would have to change for it to move"
    ];
  }
});

})();
