/* =====================================================================
   Your Why — the reason underneath all of it, found with the five whys.

   Outcome: "I can say what my work is for."

   Five short screens that each ask "why?" about the last answer, then
   the sentence. The first answer is usually a job or a complaint; the
   fifth is usually the real reason. The sentence gets pinned to the top of
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


/* The five why slots share a shape. `optional` from the third on means
   "stop here", and the statement screen picks up the deepest answer. */
function WHY(n, title, scene, placeholder, optional, examples) {
  var rung = {
    /* The one place a first rung carries a condition. It reads TRUE for a
       first-timer (an unknown fact makes {fact:...} false, and `not`
       flips it), so the one rule holds. It reads false once a why is on
       file, which drops the five screens instead of digging twice. */
    needs: { not: { fact: "why_statement" } },
    asks: "why_" + n,
    mechanic: "text",
    eyebrow: "Why " + n + " of 5",
    title: title,
    scene: scene,
    prompt: n === 1 ? "The plain version." : "Keep going.",
    placeholder: placeholder,
    rows: 3,
    maxLength: 400,
    cta: n === 5 ? "That's the bottom" : "Why?",
    optional: !!optional,
    skipLabel: "That's the real one. Stop here.",
    skipTo: "statement"
  };
  if (examples) rung.examples = examples;
  return { id: "why" + n, axes: [], ladder: [rung] };
}

/* The answers so far, this run first, stored facts as fallback. */
function whysFrom(src) {
  var out = [];
  for (var i = 1; i <= 5; i++) {
    var t = (src && src.extra && src.extra["why" + i + "_text"]) || (src && src.facts && src.facts["why_" + i]) || "";
    if (t) out.push(t);
  }
  return out;
}
function whys(v) { return whysFrom({ extra: v && v.extra, facts: v && v.facts }); }
function last(v) { var c = whys(v); return c.length ? c[c.length - 1] : "that"; }

YNSActivity.define({
  slug: "why",
  title: "Your Why",

  slots: [

    /* ---------------------------------------------------------------
       0. Frame. Say what the five whys are before asking the first one.
       Dropped for anyone who already has a why on file.
       --------------------------------------------------------------- */
    {
      id: "frame",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Five minutes",
          title: "Ask why five times.",
          lead: "The first answer is usually a job or a complaint. The fifth is usually the real reason. That's the whole trick.",
          body: [
            "Each screen asks why about the thing you just wrote. It gets uncomfortable around the third one, which is a sign it's working. You can stop early if you hit the real one sooner.",
            "It doesn't have to be noble or tidy. It just has to be true. Nothing here is shared."
          ],
          cta: "Start"
        },
        {
          needs: { fact: "why_statement" },
          mechanic: "learn",
          eyebrow: "Already done",
          title: "You've already found your why.",
          lead: function (v) { return "\u201c" + ((v && v.facts && v.facts.why_statement) || "") + "\u201d"; },
          body: ["No need to dig again. This run asks the question underneath it instead."],
          provenance: "You've told us your why already, so the five whys are skipped.",
          cta: "Okay"
        }
      ]
    },

    /* ---------------------------------------------------------------
       1–5. The whys. Each one quotes the last answer and asks why about
       it. From the third on, stopping is allowed, because some people
       reach the bottom in three and making them write two more is
       homework. Each has its own fact key so a returning visitor's
       ladder drops them instead of re-asking.
       --------------------------------------------------------------- */
    WHY(1, "Why are you doing this at all?",
      function () { return ["Whatever made you open a career site on " + whenPhrase() + ". Start with the obvious version. We'll dig from here."]; },
      "Because\u2026", false,
      ["Because I hate my job.", "Because I need more money.", "Because I'm 24 and still working the same register."]),
    WHY(2, "And why does that matter to you?",
      function (v) { return ["You said: \u201c" + last(v) + "\u201d", "Why does that matter? Not to anyone else. To you."]; },
      "Because\u2026", false, null),
    WHY(3, "Why?",
      function (v) { return ["\u201c" + last(v) + "\u201d", "One more layer. This is the one where most people find the real thing."]; },
      "Because\u2026", true, null),
    WHY(4, "And underneath that?",
      function (v) { return ["\u201c" + last(v) + "\u201d", "If that came true, what would it give you?"]; },
      "It would mean\u2026", true, null),
    WHY(5, "Last one. Why does that matter?",
      function (v) { return ["\u201c" + last(v) + "\u201d", "This is usually where the real reason lives. Say it plainly."]; },
      "Because\u2026", true, null),

    /* ---------------------------------------------------------------
       6. The sentence. Prefilled from the deepest answer, editable, and
       tagged with who it's for. This is what gets pinned.
       --------------------------------------------------------------- */
    {
      id: "statement",
      axes: [],
      ladder: [
        {
          asks: "why_statement",
          mechanic: "text",
          eyebrow: "Your why",
          title: "Now say it in one sentence.",
          scene: function (v) {
            var chain = whys(v);
            return chain.length
              ? ["Here's the trail you just walked: " + chain.map(function (x) { return "\u201c" + x + "\u201d"; }).join(" \u2192 "), "The last one is usually the real one. We've put it in the box. Change it if a different rung was the true one."]
              : ["One sentence is plenty."];
          },
          prompt: "In your own words.",
          prefill: function (ctx) { var c = whysFrom(ctx); return c.length ? c[c.length - 1] : ""; },
          placeholder: "Because\u2026",
          rows: 4,
          maxLength: 600,
          cta: "That's my why",
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
           do not ask them to confirm it. Go one level deeper instead,
           at the thing a why is actually for: knowing when you've got
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
          prompt: "One year from now, I will know this worked because\u2026",
          placeholder: "Because by then\u2026",
          provenance: "You've already told us your why, so this asks the next question instead of repeating it.",
          rows: 4,
          maxLength: 600,
          cta: "That's my test",
          optional: true
        }
      ],

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
    var why = r.extra.statement_text || r.ctx.facts.why_statement || (whysFrom({ extra: r.extra, facts: r.ctx.facts }).slice(-1)[0]) || "";
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

    var chain = whysFrom({ extra: r.extra, facts: r.ctx.facts });

    return "<h1>That's your why.</h1>" +
      (why ? '<div class="ya-quote">' + esc(why) + "</div>" : "") +
      (chain.length > 1
        ? '<div class="ya-readout"><h3>How you got there</h3>' +
          chain.map(function (x, i) { return "<p><b>" + (i + 1) + ".</b> " + esc(x) + "</p>"; }).join("") +
          "<p>The first line is what you'd have said a week ago. The last one is the reason.</p></div>"
        : "") +
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
