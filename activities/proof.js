/* =====================================================================
   Proof — evidence, not preference.

   Outcome: "I know three things I'm really good at, and I have a
   story for each."

   The missing axis in the original four. Everything else here asks what
   appeals to you; this asks what you have actually done. It is the only
   activity that produces something the person keeps — three sentences
   they can paste straight into Career ABCs.

   Two deliberate choices:

   * Moments, not skills. "Name your strengths" produces a blank stare
     and then a list of adjectives. "Think of a time someone was better
     off because you were there" produces a story, and the skill can be
     read off the story afterwards. Never ask for the abstraction.

   * Any context counts. Work, family, a side thing, school, the thing
     you organized for your mom. Most people carrying real capability
     discount all of it because it was not paid, and that is exactly the
     group this product exists for.

   Scores nothing. A story about fixing your neighbor's boiler is not
   evidence for Skilled Trades over Health — it is evidence that you are
   the kind of person who fixes things, which is a different claim and
   one the person gets to make for themselves.
   ===================================================================== */
(function () {
"use strict";

var SKILLS = [
  { k: "fixing",     t: "Working out what was wrong" },
  { k: "explaining", t: "Making it make sense to someone" },
  { k: "calming",    t: "Being steady when it was tense" },
  { k: "organising", t: "Getting the pieces to line up" },
  { k: "building",   t: "Making the thing itself" },
  { k: "persuading", t: "Getting people to agree" },
  { k: "noticing",   t: "Spotting what everyone else missed" },
  { k: "finishing",  t: "Actually getting it done" }
];

/* First-draft sentences, one per skill tag. Deliberately unfinished —
   they end mid-thought so the person has to supply the specific bit,
   which is the part that makes it theirs and the part an interviewer
   actually wants. */
var OPENER = {
  fixing:     "I'm the person who works out why something broke when everyone else is still guessing. Like the time ",
  explaining: "I can explain something complicated to someone who's already frustrated. Like the time ",
  calming:    "When it gets tense I'm the one who stays steady and gets everyone through it. Like the time ",
  organising: "I'm the one who gets the moving parts to line up. Like the time ",
  building:   "I'd rather build the thing than talk about building it. Like the time ",
  persuading: "I can get people to agree without strong-arming them. Like the time ",
  noticing:   "I catch the thing everyone else has walked past. Like the time ",
  finishing:  "I'm the one who gets it finished. Like the time "
};

var SKILL_READING = {
  fixing:     "diagnosis. You go straight at the cause, and in some fields that is a big part of the job",
  explaining: "translation. Getting something you understand into someone else's head is a real skill in its own right",
  calming:    "steadiness under pressure. It can be hard to teach, and it's worth naming when you apply for work in a hard room",
  organising: "coordination. Other work can lean on it, and it can go unnoticed until it's missing",
  building:   "making. You would rather have the thing existing than the plan for it perfect",
  persuading: "moving people. It can matter in senior jobs, even when a job description leaves it out",
  noticing:   "attention. Catching the detail that could have cost everyone time",
  finishing:  "completion. It can sound modest, and it's worth saying out loud when you describe yourself"
};

YNSActivity.define({
  slug: "proof",
  title: "Proof",

  slots: [

    /* ---------------------------------------------------------------
       1. The moments. A list builder rather than one big box: "give me
       three" produces far better answers than an empty rectangle.
       --------------------------------------------------------------- */
    {
      id: "moments",
      axes: [],
      ladder: [
        {
          asks: "strengths",
          mechanic: "collect",
          eyebrow: "Three moments",
          title: "When were you the reason it went well?",
          scene: [
            "Think of a moment where something worked out and you were the reason for it. It doesn't need to be your biggest achievement, and something small and recent can be easier to write about.",
            "Any part of your life counts. The thing you sorted out for your mom counts. The thing you fixed that nobody asked you to fix counts. The shift where you were the one who stayed calm counts.",
            "If you're tempted to leave out unpaid work, keep it in. Here, all of it counts."
          ],
          prompt: "Write one, tag what the skill was, then add it. One will do, though three gives us more to work with.",
          placeholder: "There was a time when…",
          itemLabel: "One moment",
          count: 3,
          min: 1,
          cta: "That's enough to work with",
          ctaFull: "That's my three",
          tagPrompt: "What was the actual skill in that story?",
          tags: SKILLS
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. Who noticed. Turns a private story into external evidence,
       which is what makes it usable in an interview.
       --------------------------------------------------------------- */
    {
      id: "witness",
      axes: [],
      ladder: [
        {
          mechanic: "choice",
          eyebrow: "The evidence",
          title: "Did anybody else notice?",
          scene: [
            "If someone else has noticed a strength of yours, they might be willing to speak for it."
          ],
          prompt: "Whichever is closest to the truth.",
          options: [
            { k: "said",   t: "Yes, someone said so at the time",
              s: "That person could be a reference. It may be worth asking.",
              echo: "someone said so at the time" },
            { k: "unsaid", t: "People rely on me for it, but nobody's ever said it out loud",
              s: "That still counts as evidence.",
              echo: "people rely on me for it without saying so" },
            { k: "alone",  t: "It was mostly on my own",
              s: "Which makes it yours entirely.",
              echo: "I did it on my own" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. The sentence. This is the deliverable — one line they can put
       in a cover letter without editing it.
       --------------------------------------------------------------- */
    {
      id: "line",
      axes: [],
      ladder: [
        {
          mechanic: "text",
          eyebrow: "The useful bit",
          title: "Now say it in one line.",
          scene: [
            "Take the strongest one and write it as a single sentence. Say it the way you'd say it out loud if someone asked what you're good at.",
            "Use plain words. Skip \"passionate\" and \"results-driven\", and just say what you did and what happened."
          ],
          prompt: "Just one sentence.",
          placeholder: "I'm the person who…",
          rows: 3,
          maxLength: 300,
          cta: "Done",
          /* Fourth free-text box in one activity is where people stop.
             So this one arrives half-written, from the skill they tagged
             most — editing a sentence is a far smaller ask than writing
             one, and the result is still in their words because the
             moment underneath it was. */
          prefill: function (ctx) {
            var stored = ctx.facts.strengths;
            if (!Array.isArray(stored) || !stored.length) return "";
            var counts = {};
            stored.forEach(function (x) { if (x.skill) counts[x.skill] = (counts[x.skill] || 0) + 1; });
            var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
            return top && OPENER[top] ? OPENER[top] : "";
          },
          examples: [
            "I'm the person who works out why the thing broke when everyone else is still guessing.",
            "I can explain something complicated to someone who's already frustrated.",
            "When a shift goes badly I'm the one who stays calm and gets everyone through it."
          ]
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    /* The moments slot is DROPPED for someone who has already recorded
       strengths — correct behavior, but results must fall back to the
       stored fact or it reports "0 things that actually happened" to the
       person with the fullest profile in the product. */
    var items = r.extra.moments_items;
    var recalled = false;
    if (!items || !items.length) {
      var stored = r.ctx.facts.strengths || r.ctx.stale.strengths || [];
      items = (Array.isArray(stored) ? stored : []).map(function (x) {
        return { text: x.moment || "", tag: x.skill || null };
      }).filter(function (x) { return x.text; });
      recalled = items.length > 0;
    }
    var line = r.extra.line_text || "";
    var witness = r.state.answers.witness || "";
    var esc = r.esc;

    /* The most-tagged skill across their moments. Read off what they
       did, never asserted about who they are. */
    var counts = {};
    items.forEach(function (i) { if (i.tag) counts[i.tag] = (counts[i.tag] || 0) + 1; });
    var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
    var topLabel = (SKILLS.filter(function (s) { return s.k === top; })[0] || {}).t;

    var WITNESS = {
      said:   "Someone has already said this to you out loud. That person could be a reference. " +
              "Asking can take one short message, and some people are glad to be asked.",
      unsaid: "People rely on you for it and nobody has ever said so. That can make \"what are you good at\" " +
              "a hard interview question. The proof is still there, and you can be the one to say it.",
      alone:  "You did it on your own, which makes the story entirely yours. It also means " +
              "you'll have to be the one who tells it, and that's what the line below is for."
    };
    var witnessNote = WITNESS[witness] || "";

    return "<h1>That's the evidence.</h1>" +
      '<p class="ya-result-lead">' +
      items.length + (items.length === 1 ? " thing that happened" : " things that happened") +
      ", with you as the reason.</p>" +

      (line ? '<div class="ya-quote">' + esc(line) + "</div>" : "") +

      (items.length
        ? '<div class="ya-readout"><h3>' + (recalled ? "What you wrote down before" : "What you wrote down") + "</h3>" +
          items.map(function (i) {
            var lbl = (SKILLS.filter(function (s) { return s.k === i.tag; })[0] || {}).t;
            return "<p>" + esc(i.text) + (lbl ? ' <span class="ya-chip">' + esc(lbl) + "</span>" : "") + "</p>";
          }).join("") + "</div>"
        : "") +

      (top && SKILL_READING[top]
        ? '<div class="ya-readout"><h3>The thread running through them</h3><p>You tagged <b>' +
          esc(topLabel) + "</b> more than anything else. Read plainly, that is " +
          SKILL_READING[top] + ".</p></div>"
        : "") +

      (witnessNote ? '<div class="ya-readout"><h3>Whether anyone else saw it</h3><p>' + witnessNote + "</p></div>" : "") +

      '<div class="ya-readout"><h3>Where this goes next</h3><p>Treat these as raw material. ' +
      '<button type="button" class="lnk" onclick="YNS.open(\'abcs_a\')">Career ABCs</button> turns them into ' +
      "resume bullets and interview answers, and having these in front of you " +
      "can make that easier.</p></div>";
  },

  actions: function (state) {
    if (state.answers.witness === "said") {
      return [
        "Message the person who said it and ask if they'd be a reference",
        "Put the one-line version into Career ABCs while it's fresh",
        "Write down the numbers attached to one of those three moments"
      ];
    }
    return [
      "Put the one-line version into Career ABCs while it's fresh",
      "Say it out loud once, to one person, and see how it lands",
      "Add the detail you left out of the strongest of the three"
    ];
  }
});

})();
