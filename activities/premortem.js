/* =====================================================================
   What Might Trip You Up

   Outcome: "I know what I'm most worried about, which kind of problem it
   is, and the one small thing that would help most."

   The slug stays `premortem` because it is the key on every saved run.
   The NAME does not. "Pre-mortem" is management jargon, and the audience
   here is somebody worried about money and their kids, not somebody who
   has read Gary Klein. A title that needs explaining before anyone will
   click it is the wrong title.

   The rest of the rewrite is tone. The first version was accurate and
   cold: it opened by telling somebody their change had failed, labelled
   their answer a "cost", and demanded honesty in three separate places
   ("Be honest rather than brave", "the honest one, not the respectable
   one", "Which is it, honestly?").

   Demanding honesty is not how you get it. People tell you the truth
   when they feel safe, not when they feel audited. So:

   * It explains itself and asks permission before anything else. Nobody
     is walked into imagining failure without being told why first.
   * It says out loud that this is not a prediction, that choosing an
     answer does not make it likelier, and that nobody else sees it.
   * Every hard screen is followed straight away by something to do. The
     activity never ends on the wound.
   * Difficulty is normalised rather than judged. "Most people know
     straight away" does more work than "be honest".

   All the candour is still here. It is earned now instead of demanded.
   ===================================================================== */
(function () {
"use strict";

YNSActivity.define({
  slug: "premortem",
  title: "What Might Trip You Up",

  slots: [

    /* ---------------------------------------------------------------
       0. Context and consent.

       This activity used to begin by telling somebody their change had
       failed. That is a lot to spring on a person who clicked a card
       thirty seconds ago, and it is exactly where someone already low on
       confidence closes the tab.
       --------------------------------------------------------------- */
    {
      id: "intro",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Before we start",
          title: function (v) {
            var n = catName(v);
            return n
              ? "This one asks you to imagine a move into " + n + " not working out."
              : "This one asks you to imagine it not working out.";
          },

          lead: "We're not expecting it to go wrong. This is a trick people who plan hard things " +
                "use all the time, and it works for one simple reason.",

          points: [
            "We're all better at explaining something <b>after</b> it happens than at spotting it coming.",
            "So we'll pretend a year has gone by and it didn't work out.",
            "You say what happened. Then we turn that into one small thing you can do now."
          ],

          note: "Nothing you pick is a prediction, and none of it is shared with anyone. If it " +
                "starts to feel heavy, close it and come back another day.",

          cta: "Alright, I'm in"
        }
      ]
    },

    /* ---------------------------------------------------------------
       1. The cause, with its consequence shown straight afterwards.
       --------------------------------------------------------------- */
    {
      id: "cause",
      axes: ["order", "analysis", "people", "leading"],
      ladder: [
        {
          asks: "premortem_risk",
          mechanic: "chain",
          eyebrow: "A year from now",
          title: "Say it didn't work out. What happened?",
          scene: function (v) {
            var name = catName(v) || "";
            return [
              "It's a year from today. You made the change you've been thinking about" +
              (name ? ", into <b>" + escHTML(name) + "</b>" : "") +
              ", and it hasn't gone the way you hoped. You're roughly back where you started.",
              "Have a look through these and see which one feels most like the way it would " +
              "really go for you. Most people know straight away."
            ];
          },
          prompt: "Choosing one doesn't make it likelier. It just tells us where to aim.",
          cta: "Alright, so what do I do about it?",
          options: [
            { k: "money", t: "The money ran out before it worked",
              s: "The gap between leaving and earning was longer than you'd planned for.",
              fact: "money", echo: "the money running out is what worries me",
              a: { order: 3 },
              then: "You didn't fail at the work. The money ran out while you were still " +
                    "learning it. That is a common way a good decision turns into a bad year, " +
                    "and one of the easier ones to plan around.",
              cost: "It costs you the change, and some of your belief that you could make one." },

            { k: "support", t: "The people around me made it too hard",
              s: "A steady, tiring lack of support rather than anything dramatic.",
              fact: "support", echo: "not enough support at home worries me",
              a: { people: 3 },
              then: "Nobody stopped you. It was just heavier every week than it needed to be, and " +
                    "in the end the easiest thing was to stop. Almost everyone who has made a big " +
                    "change has felt some version of this.",
              cost: "You lose the change, and it can cost you something at home too." },

            { k: "stamina", t: "I ran out of steam",
              s: "You started well. Month four was quiet, and month seven was empty.",
              fact: "stamina", echo: "running out of steam worries me",
              a: { order: 2, leading: 1 },
              then: "The plan was fine. What was missing was anything to keep you going through " +
                    "the long flat middle, when nothing visible is happening and nobody's " +
                    "watching. That stretch is normal, and it can be planned for.",
              cost: "What stings is the months you did put in before it went quiet." },

            { k: "fit", t: "I got there and it wasn't what I thought",
              s: "The work turned out to be different up close.",
              fact: "fit", echo: "the work not being what I pictured worries me",
              a: { analysis: 3 },
              then: "You did everything right and ended up somewhere that didn't suit you. " +
                    "That one really hurts. It's also the cheapest on this list to avoid, because " +
                    "fifteen minutes with someone who does the job would have told you.",
              cost: "A year gone, plus the assumption that wanting something means it suits you." },

            { k: "luck", t: "Something happened that was nothing to do with me",
              s: "Illness, a layoff, someone needing you.",
              fact: "luck", echo: "something outside my control worries me",
              a: { order: 2, people: 1 },
              then: "Life happened, the way it does, and none of it would have been a reflection " +
                    "on you. This is the one you can't prevent. It's also the one where a bit of " +
                    "slack in the plan is the difference between a setback and the end of it.",
              cost: "Nothing was wrong with the plan. There just wasn't a spare one." }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. Preventable or survivable.

       The screen the feedback was about. It used to open by telling
       people they routinely get this wrong and then demand honesty. Both
       are gone. The distinction is genuinely useful, so it gets explained
       plainly and left as a question rather than set as a test.
       --------------------------------------------------------------- */
    {
      id: "kind",
      axes: [],
      ladder: [
        {
          mechanic: "choice",
          eyebrow: "Two different problems",
          title: "Is that something you could head off, or something you'd ride out?",
          scene: [
            "Some problems have a cause you can go and work on. Others will happen or they " +
            "won't, whatever you do, and the only part you control is what they cost when they " +
            "land.",
            "Worth separating, because they need different plans and it's easy to put your " +
            "energy into the wrong one. Either way there's something to do about it."
          ],
          prompt: "Whichever feels closest. You can change your mind later.",
          options: [
            { k: "preventable", t: "I could head it off, if I did something now",
              s: "There's a cause you could name and work on.",
              echo: "I could head it off" },
            { k: "survivable", t: "I couldn't stop it, but I could soften the landing",
              s: "It happens or it doesn't, and what matters is what it costs when it does.",
              echo: "I'd have to ride it out" },
            { k: "fatal", t: "Honestly, neither. It would end it",
              s: "A common answer, and a useful one, because it means a lot is resting on one thing.",
              echo: "a lot is resting on one thing" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. The counterweight. Never end on the failure.
       --------------------------------------------------------------- */
    {
      id: "guard",
      axes: [],
      ladder: [
        {
          mechanic: "choice",
          eyebrow: "The useful bit",
          title: "What's the smallest thing that would have helped?",
          scene: [
            "One small thing rather than the whole plan. Something that, looking back from that " +
            "year, you'd be glad you'd done."
          ],
          prompt: "Whichever would have mattered most.",
          options: [
            { k: "numbers", t: "Knowing the real numbers before I started",
              s: "What it costs, what it pays, how long the gap is.",
              echo: "knowing the numbers would have helped" },
            { k: "person", t: "One person in my corner who understood it",
              s: "Somebody who understood why you were doing it, which isn't the same as approval.",
              echo: "one person in my corner would have helped" },
            { k: "talk", t: "Talking to someone who'd already done it",
              s: "Fifteen minutes, before rather than after.",
              echo: "one honest conversation would have helped" },
            { k: "smaller", t: "A smaller first step, so less was riding on it",
              s: "Part-time, evenings or a trial, rather than a leap.",
              echo: "a smaller first step would have helped" },
            { k: "deadline", t: "A date to check in and be straight with myself",
              s: "A time to look at it properly instead of drifting.",
              echo: "a check-in date would have helped" }
          ]
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var kind = r.state.answers.kind || "";
    var guard = r.state.answers.guard || "";
    var cause = r.state.answers.cause || r.ctx.facts.premortem_risk || "";
    var esc = r.esc;

    var CAUSE_WORDS = {
      money: "the money running out before it works",
      support: "not enough support from the people around you",
      stamina: "running out of steam partway through",
      fit: "getting there and finding it isn't what you pictured",
      luck: "something happening that's nothing to do with you"
    };
    var GUARD_WORDS = {
      numbers: "knowing the real numbers before you start",
      person: "one person in your corner",
      talk: "one honest conversation with someone who's done it",
      smaller: "a smaller first step",
      deadline: "a date to check in and be straight with yourself"
    };

    var KIND = {
      preventable: "You said you could head it off, which is the best outcome this one has. It " +
                   "means the thing you're most worried about has a cause. A cause is something " +
                   "you can work on this month instead of carrying it around all year.",
      survivable:  "You said you'd have to ride it out. So the job is to make sure it costs you " +
                   "a setback instead of the whole thing. Some slack in the plan, a backup, and a " +
                   "smaller first step all do that. None of them are dramatic.",
      fatal:       "You said it would end the whole thing. That's a common answer, and it's " +
                   "worth saying out loud. It means a lot is resting on one thing going right. " +
                   "Take that as a reason to build a backup route, or to make the first step small " +
                   "enough that this can't reach it."
    };

    return "<h1>Now you know what to keep an eye on.</h1>" +
      '<p class="ya-result-lead">Most people carry a worry like this around without ever putting ' +
      "words to it, which is the worst of both worlds: all of the weight and none of the use. " +
      "You've just turned yours into something with a name and something to do about it.</p>" +

      (CAUSE_WORDS[cause]
        ? '<div class="ya-quote">The thing to watch: <b>' + esc(CAUSE_WORDS[cause]) + "</b></div>"
        : "") +

      (KIND[kind]
        ? '<div class="ya-readout"><h3>What kind of problem it is</h3><p>' + KIND[kind] + "</p></div>"
        : "") +

      (GUARD_WORDS[guard]
        ? '<div class="ya-readout"><h3>The one thing to do first</h3><p>You said the smallest ' +
          "thing that would have helped is <b>" + esc(GUARD_WORDS[guard]) + "</b>. By your own " +
          "account, that's what separates the version that works from the one that doesn't. So " +
          "do that before the big obvious step. There's something at the bottom of this page to " +
          "get you started.</p></div>"
        : "") +

      '<div class="ya-readout"><h3>One last thing</h3>' +
      "<p>Picturing it going wrong is not the same as expecting it to, and it doesn't make it " +
      "any more likely. We're all just better at explaining a problem after it happens than at " +
      "spotting one coming. Pretending it already happened gets you a much more useful list.</p>" +
      "<p>You've got that list now, and nothing on it is a reason not to go.</p></div>";
  },

  actions: function (state) {
    var g = state.answers.guard || "";
    if (g === "numbers") {
      return [
        "Work out your monthly floor, so the money question has a number in it",
        "Find out what the training costs from the provider, not from a search result",
        "Check what the work pays at the level you'd really start at"
      ];
    }
    if (g === "person") {
      return [
        "Tell one person what you're thinking about, properly rather than in passing",
        "Ask them straight out to be the person you check in with",
        "Write down who'd be hardest to tell, and why"
      ];
    }
    if (g === "talk") {
      return [
        "Find one person who does this work and ask for fifteen minutes",
        "Write down the one question you'd most want answered",
        "Ask them about the thing you said might trip you up"
      ];
    }
    if (g === "smaller") {
      return [
        "Find the part-time, evening or trial version of the route you'd take",
        "Work out the smallest version of this you could start without quitting anything",
        "Set the date you'd decide whether to go further"
      ];
    }
    return [
      "Put a date in the calendar to look at this properly, and treat it as real",
      "Write down what it would look like to be going well by then",
      "Tell one person the date, so it isn't only yours to keep"
    ];
  }
});

/* The field, named, or null so callers can phrase around it. */
function catName(v) {
  var T = window.YNSTaxonomy;
  var cat = (v && v.derived && v.derived.top_category) ||
            (window.YNSActivity && YNSActivity.context().derived.top_category);
  return (T && cat && T.label(cat)) || null;
}

function escHTML(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

})();
