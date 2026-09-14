/* =====================================================================
   Your Why — the reason underneath all of it.

   Outcome: "I can say what my work is for."

   The shortest thing here, and the one with the longest half-life. Two
   minutes, mostly free text, and the answer gets pinned to the top of
   their profile — so the next time they come back tired and unsure why
   they started, the first thing on the screen is their own sentence.

   Design notes worth keeping:

   * `why_statement` has NO half-life. A reason for wanting a better life
     does not expire on a 180-day timer, and asking someone to re-confirm
     it would be insulting. It changes when they change it.

   * It is free text, so it can be quoted back but never conditioned on.
     The closed-vocabulary `why_who` tag alongside it is what ladders in
     other activities are allowed to read.

   * No scoring at all. Nothing about this should feed a category match —
     "I want my kids to see me do something I like" is not evidence for
     Technology over Health, and pretending it is would be the kind of
     quiet dishonesty that makes a profile untrustworthy.
   ===================================================================== */
(function () {
"use strict";

/* "on a Thursday evening", from their clock.

   Before 5am counts as the night before, because that is how people talk
   about it: somebody opening this at 2am on Saturday has had a Friday
   night, not a Saturday one. */
function whenPhrase() {
  try {
    var d = new Date();
    var h = d.getHours();
    var shift = h < 5 ? -1 : 0;
    var day = new Date(d.getTime() + shift * 86400000)
      .toLocaleDateString(undefined, { weekday: "long" });
    var part = h < 5 ? "night"
      : h < 12 ? "morning"
      : h < 17 ? "afternoon"
      : h < 21 ? "evening"
      : "night";
    return "a " + day + " " + part;
  } catch (e) { return "a weeknight"; }
}

YNSActivity.define({
  slug: "why",
  title: "Your Why",

  slots: [

    /* ---------------------------------------------------------------
       1. The sentence. This is the whole activity; everything else is
       support for getting it written.
       --------------------------------------------------------------- */
    {
      id: "statement",
      axes: [],
      ladder: [
        {
          asks: "why_statement",
          mechanic: "text",
          eyebrow: "Two minutes",
          title: "Why are you doing this at all?",
          /* "a Tuesday night" was hardcoded, so it was wrong roughly six
             days out of seven. In an activity whose whole job is showing
             somebody we were listening, opening with a detail they can
             see is false is a bad first move. It reads off their clock
             now. */
          scene: function () {
            return [
              "We want the reason you're looking, rather than which job you want.",
              "Whatever made you open a career site on " + whenPhrase() +
              ". It doesn't have to be noble or tidy. It just has to be true."
            ];
          },
          prompt: "In your own words. One sentence is plenty.",
          placeholder: "Because…",
          rows: 5,
          maxLength: 600,
          cta: "That's it",
          examples: [
            "Because I want to stop dreading Sunday nights.",
            "Because my daughter is about to start school and I want to be there for pickup.",
            "Because I'm good at something and nobody is paying me for it.",
            "Because I've been doing the same thing for eleven years and I don't want to do it for eleven more.",
            "Because I want to earn enough that a broken car isn't a crisis."
          ],
          tagPrompt: "And mostly, this is for:",
          tagAsks: "why_who",
          tags: [
            { k: "me",               t: "Me" },
            { k: "kids",             t: "My kids" },
            { k: "family",           t: "My family" },
            { k: "partner",          t: "My partner" },
            { k: "someone_specific", t: "One specific person" },
            { k: "community",        t: "People like me" }
          ]
        },

        /* Rung 1. They already have a why on file. Do not re-ask it and
           do not ask them to confirm it — go one level deeper instead,
           at the thing a why is actually for: knowing when you have got
           there. */
        {
          needs: { fact: "why_statement" },
          asks: "why_test",
          mechanic: "text",
          eyebrow: "Going deeper",
          title: "How will you know it worked?",
          scene: [
            "You've already written down why you're doing this. Here's the harder question underneath it. A year from now, what would have to be true for you to say it worked?",
            "Be specific enough you could check. \"Happier\" isn't checkable. \"I don't think about work on Sunday\" is."
          ],
          prompt: "One year from now, I will know this worked because…",
          placeholder: "Because by then…",
          provenance: "You've already told us your why, so this asks the next question instead of repeating it.",
          rows: 4,
          maxLength: 600,
          cta: "That's my test",
          optional: true
        }
      ],

      /* Ladder exhausted — both written, nothing left to ask. Give them
         something rather than a shorter activity for no reason. */
      learn: {
        mechanic: "learn",
        eyebrow: "Worth knowing",
        title: "You have already done the hard part",
        stat: "Written down",
        body: [
          "You've got both a reason and a test for it, saved. Most people never write either " +
          "one down. So most career changes get judged against a standard that moves every " +
          "time the mood does.",
          "Yours is at the top of your profile. It's there for the week you can't remember why you started."
        ],
        cta: "Good"
      }
    },

    /* ---------------------------------------------------------------
       2. The pressure test. One question, closed vocabulary, so there
       is something other activities can actually read.
       --------------------------------------------------------------- */
    {
      id: "urgency",
      axes: [],
      ladder: [
        {
          mechanic: "choice",
          eyebrow: "Last one",
          title: "And how long has this been true?",
          scene: [
            "This isn't a test. It just helps to know. Something you've sat with for three years needs a different next step than something that started last month."
          ],
          prompt: "Roughly.",
          options: [
            { k: "new",    t: "It just started",
              s: "Something changed recently and this is new.",
              echo: "this started recently" },
            { k: "year",   t: "About a year",
              s: "Long enough to know it isn't just a bad week.",
              echo: "this has been building for about a year" },
            { k: "years",  t: "A few years",
              s: "You've thought about this more than once and haven't moved yet.",
              echo: "this has been true for a few years" },
            { k: "always", t: "As long as I can remember",
              s: "It goes back further than the job you're in.",
              echo: "this has always been true" }
          ]
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    /* The statement slot resolves to a learn card once both the why and
       the test are on file, so there is no fresh text to quote. Fall back
       to the stored fact — the whole point of this activity is reading it
       back, and an empty quote block would be the one failure that
       matters here. */
    var why = r.extra.statement_text || r.ctx.facts.why_statement || "";
    var tag = r.extra.statement_tag || r.ctx.facts.why_who || "";
    var howLong = r.state.answers.urgency || "";
    var esc = r.esc;

    var WHO = {
      me: "yourself", kids: "your kids", family: "your family",
      partner: "your partner", someone_specific: "one particular person",
      community: "people in the same position you are"
    };

    /* Keyed, not matched on the option's words. The old version tested
       `howLong.indexOf("year")`, which also matched "A few years" and had
       to be un-matched with a second test — the sort of thing that breaks
       silently the first time someone rewords an option. */
    var LONG = {
      "new": "It's new. That's the easiest time to move and the hardest time to trust yourself. " +
             "Give it one honest test before you decide it was a mood.",
      year:  "A year is long enough to know this is more than a bad week. It deserves a real " +
             "next step, not another year of noticing it.",
      years: "A few years, and you haven't moved yet. For most people that's not about wanting " +
             "it enough. Usually nobody has ever handed them a first step small enough to take, " +
             "which is what the bottom of this page is for.",
      always: "If it predates the job you're in, then this was never really about the job. So the " +
              "thing that needs to change may be bigger than you've been assuming, or much smaller."
    };
    var longNote = LONG[howLong] || "";

    /* "Saved at the top of your profile" is only true with an account.
       Signed out it lives in this browser and disappears with the cache,
       and saying otherwise is a promise the product cannot keep. */
    var signedIn = !!(window.YNS && YNS.signedIn && YNS.signedIn());

    return "<h1>That's your why.</h1>" +
      (why ? '<div class="ya-quote">' + esc(why) + "</div>" : "") +
      '<p class="ya-result-lead">' +
      (signedIn
        ? "It's at the top of your profile now. It'll be there on the week you can't remember " +
          "why you started. Hold any job up against it before you take it."
        : "Keep it somewhere you'll see it. It's the thing to read on the week you can't " +
          "remember why you started. Right now it only lives in this browser. An account would " +
          "put it at the top of your profile and keep it.") +
      "</p>" +

      (tag && WHO[tag]
        ? '<div class="ya-readout"><h3>Who it\u2019s for</h3><p>You said this is mostly for <b>' +
          esc(WHO[tag]) + "</b>. Keep that in mind when an option looks like a compromise, " +
          "because the question to ask is whether it serves that, rather than whether it is the " +
          "best job available.</p></div>"
        : "") +

      (longNote
        ? '<div class="ya-readout"><h3>How long it\u2019s been true</h3><p>' + longNote + "</p></div>"
        : "");
  },

  actions: function () {
    return [
      "Read it back tomorrow morning and see whether it still sounds true",
      "Tell one person the sentence you just wrote",
      "Spend fifteen minutes on one activity here that moves it forward"
    ];
  }
});

})();
