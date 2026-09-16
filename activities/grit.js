/* =====================================================================
   Bounce Back — the last time it went wrong, and what you did next.

   Door 4 · Mindset and money. Module 4 (Mighty Mindset), app-ised.
   Source scripts: #6 The Power of a Growth Mindset, #10 Grit & Resilience.
   The three self-check questions and the self-talk swap are the class's
   own; the Dweck and Duckworth points are stated the way the class
   states them and attributed, never sharpened into numbers.

   Outcome: "I can name how I recover, and I have one thing to try next
   time."

   Design notes:

   * The activity never asks anyone to be resilient. It asks what they
     actually did the last time something went sideways, then reads that
     back without a verdict. The point is that they already have a
     pattern; most people have never had it named.

   * `setback_response` is closed vocabulary so other activities can read
     it. `setback_story` is free text: quoted back, never conditioned on.

   * No scoring. A setback is not evidence for one career over another.
   ===================================================================== */
(function () {
"use strict";

YNSActivity.define({
  slug: "grit",
  title: "Bounce Back",

  slots: [

    /* ---------------------------------------------------------------
       1. Why this exists. A hard question is coming, so say what the
       activity is for first. Same move as What Might Trip You Up.
       --------------------------------------------------------------- */
    {
      id: "frame",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Six minutes",
          title: "You've already bounced back from things.",
          lead: "This activity looks at one of them, so you can see how you do it.",
          body: [
            "Most people think bouncing back is a personality trait. It works more like a habit. You already have a way of handling things that go wrong. It's just never been written down.",
            "We'll pick one setback, look at what you did next, and name the pattern. Then you get one small thing to try the next time.",
            "Nothing here is graded. What you write stays private."
          ],
          cta: "Okay"
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. The class's three self-check questions, one screen. Closed
       vocabulary so the result can say which way they lean without a
       label that sounds like a diagnosis.
       --------------------------------------------------------------- */
    {
      id: "check",
      axes: [],
      ladder: [
        {
          asks: "mindset_lean",
          mechanic: "choice",
          eyebrow: "Quick check",
          title: "When something new and hard shows up, which is closer?",
          scene: [
            "Three things the class asks: a new challenge, a big task, a friend who's doing well. Pick the line that sounds most like you on a normal day. Nobody is one thing all the time."
          ],
          prompt: "Closest to you.",
          options: [
            { k: "growth", t: "I get a little excited to try it",
              s: "Even if I might mess it up. I plan ahead and I'm glad when friends win.", echo: "you lean toward growth" },
            { k: "mixed",  t: "Depends on the day",
              s: "Some things I jump at. Some I put off until the last minute.", echo: "it depends on the day" },
            { k: "fixed",  t: "I mostly worry about failing",
              s: "I stall, then rush. When friends do well I feel behind.", echo: "you lean toward worry" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. The setback. One thing, in their own words.
       --------------------------------------------------------------- */
    {
      id: "setback",
      axes: [],
      ladder: [
        {
          asks: "setback_story",
          mechanic: "text",
          eyebrow: "The setback",
          title: "What's one thing that went wrong in the last year or two?",
          scene: [
            "Work, school, money, a plan that fell through. Pick one that still stings a little. It doesn't have to be big."
          ],
          prompt: "One or two sentences is plenty.",
          placeholder: "The time that…",
          rows: 4,
          maxLength: 500,
          cta: "That's the one",
          examples: [
            "I got passed over for shift lead after they told me I was next.",
            "I dropped out of a class because I couldn't cover the fee and never went back.",
            "I applied to eleven jobs and heard nothing from any of them.",
            "My car died and I lost a job I couldn't get to."
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. What they did next. Closed vocabulary, no judgement on any
       option. Every one of these is a real and common response.
       --------------------------------------------------------------- */
    {
      id: "response",
      axes: [],
      ladder: [
        {
          asks: "setback_response",
          mechanic: "choice",
          eyebrow: "What happened next",
          title: "And what did you actually do after that?",
          scene: [
            "The first thing you did, in the days after. Every one of these is a normal response. We're looking for your pattern, not the right answer."
          ],
          prompt: "The closest one.",
          options: [
            { k: "pushed",  t: "I pushed harder at the same thing",
              s: "Applied again, asked again, tried the same door another way.",
              echo: "you pushed harder" },
            { k: "pivoted", t: "I tried something different",
              s: "Changed the plan, the place, or the approach.",
              echo: "you changed direction" },
            { k: "asked",   t: "I asked someone for help",
              s: "A person, a manager, a friend. Even one text counts.",
              echo: "you reached out" },
            { k: "paused",  t: "I stepped back for a while",
              s: "Took a break from it. Sometimes a long one.",
              echo: "you stepped back" },
            { k: "froze",   t: "I didn't do anything",
              s: "It sat there. Most people have at least one of these.",
              echo: "you let it sit" }
          ]
        },

        /* Rung 1. They have done this before. Ask the question that only
           makes sense the second time. */
        {
          needs: { fact: "setback_response" },
          asks: "setback_response",
          mechanic: "choice",
          eyebrow: "Going deeper",
          title: "Did you handle this one the same way as last time?",
          scene: function (v) {
            var last = (v && v.facts && v.facts.setback_response) || "";
            var WAS = { pushed: "pushed harder", pivoted: "changed direction", asked: "asked for help", paused: "stepped back", froze: "let it sit" };
            return [
              "Last time you told us " + (WAS[last] ? "you " + WAS[last] : "how you responded") +
              ". Here's what you did this time. If it's the same, that's your pattern. If it's different, that's worth knowing too."
            ];
          },
          prompt: "This time, the closest one.",
          provenance: "You've told us about a setback before, so this asks whether the pattern held.",
          options: [
            { k: "pushed",  t: "Pushed harder at the same thing",   s: "Same door, another try.", echo: "you pushed harder" },
            { k: "pivoted", t: "Tried something different",         s: "New plan, new place, new approach.", echo: "you changed direction" },
            { k: "asked",   t: "Asked someone for help",            s: "Any person counts.", echo: "you reached out" },
            { k: "paused",  t: "Stepped back for a while",          s: "A break, short or long.", echo: "you stepped back" },
            { k: "froze",   t: "Didn't do anything",                s: "It sat there.", echo: "you let it sit" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       4. The idea. One thing worth knowing, described as a mechanism,
       with no outcome claim we cannot source.
       --------------------------------------------------------------- */
    {
      id: "idea",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Worth knowing",
          title: "Ability can grow. That one belief changes what you do after a setback.",
          lead: "A fixed mindset says you're either good at a thing or you're not. A growth mindset says you get better with effort, learning, and sticking with it.",
          points: [
            "<b>The swap the class teaches:</b> \u201cI'm just not good at this\u201d becomes \u201cI can get better with practice.\u201d Same situation, different next move.",
            "<b>Carol Dweck's research</b> found students who believed ability could be developed did better in school than students who believed it was fixed.",
            "<b>Angela Duckworth</b> calls the long version of this grit: passion and perseverance for a long-term goal. Resilience is the short version, bouncing back from one setback.",
            "None of this is a personality type. Every time you face a hard thing instead of avoiding it, you're practicing it."
          ],
          note: "The optional paid Your Next Step course covers this in Module 4, with video, if you want the full idea.",
          cta: "Got it"
        }
      ]
    },

    /* ---------------------------------------------------------------
       5. The small version. Rewrite their own setback in the second
       frame. Prefilled from what they wrote, so it's an edit, not a
       blank page.
       --------------------------------------------------------------- */
    {
      id: "reframe",
      axes: [],
      ladder: [
        {
          asks: "setback_reframe",
          mechanic: "text",
          eyebrow: "Last one",
          title: "Say it the second way.",
          scene: [
            "Take the thing you wrote and describe it as an attempt that didn't work, plus one thing you'd change about the attempt. We've started it for you. Change anything."
          ],
          prompt: "In your words.",
          prefill: function (ctx) {
            var s = (ctx && ctx.extra && ctx.extra.setback_text) || (ctx && ctx.facts && ctx.facts.setback_story) || "";
            return s ? "That attempt didn't work: " + s + " Next time I'd change one thing: " : "That attempt didn't work. Next time I'd change one thing: ";
          },
          rows: 5,
          maxLength: 600,
          cta: "Done",
          optional: true
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    var resp = r.state.answers.response || r.ctx.facts.setback_response || "";
    var story = r.extra.setback_text || r.ctx.facts.setback_story || "";
    var reframe = r.extra.reframe_text || "";

    var PATTERN = {
      pushed:  { name: "You push", body: "Your first move is to try again at the same thing. That's a strength when the door is real and just stuck. The thing to watch is a door that's actually closed, where a second try costs you time you could spend on a different door." },
      pivoted: { name: "You pivot", body: "Your first move is to change the plan. That keeps you moving, and it's how a lot of people find the thing that fits. The thing to watch is pivoting before the first plan had a fair chance." },
      asked:   { name: "You reach out", body: "Your first move is to bring in another person. Most people find this the hardest one to do, and it's usually the fastest route to an answer. Keep doing it." },
      paused:  { name: "You step back", body: "Your first move is to take space. That's often the right call when you're running on empty. The thing to watch is a pause with no end date, because those turn into years without anyone deciding." },
      froze:   { name: "You let it sit", body: "Your first move was no move, and you were able to say so, which is more than most people manage. Usually this means the next step was too big to see. The fix is a smaller step, not more willpower." }
    };
    var p = PATTERN[resp];
    var lean = r.state.answers.check || "";
    var LEAN = {
      growth: "On the quick check you leaned toward growth: new things sound a bit exciting, you plan, you cheer people on. Keep that. It's the thing this whole module is trying to build.",
      mixed:  "On the quick check you said it depends on the day. That's most people. The move is noticing which days, because the fixed days usually have a pattern too.",
      fixed:  "On the quick check you leaned toward worry about failing. That's a mindset, and mindsets shift. The swap on the last screen is how: catch the sentence, change the sentence."
    };

    return "<h1>That's how you bounce back.</h1>" +
      (LEAN[lean] ? '<div class="ya-readout"><h3>Where you lean right now</h3><p>' + esc(LEAN[lean]) + "</p></div>" : "") +
      (story ? '<div class="ya-quote">' + esc(story) + "</div>" : "") +
      (p ? '<div class="ya-readout"><h3>' + esc(p.name) + "</h3><p>" + esc(p.body) + "</p></div>" : "") +
      (reframe ? '<div class="ya-readout"><h3>Said the second way</h3><p>' + esc(reframe) + "</p></div>" : "") +
      '<p class="ya-result-lead">The next time something goes wrong, you\u2019ll know your first move before you make it. That\u2019s most of what grit is.</p>';
  },

  actions: function (state) {
    var resp = (state && state.answers && state.answers.response) || "";
    var by = {
      pushed:  "Before the next retry, spend ten minutes checking whether the door is actually open",
      pivoted: "Give the current plan one more honest week before changing it",
      asked:   "Ask one person for one specific thing this week",
      paused:  "Put an end date on the pause, even a rough one",
      froze:   "Do the smallest possible version of the thing you've been avoiding, today"
    };
    return [
      by[resp] || "Write down your first move the next time something goes wrong",
      "Tell one person the setback and what you did next",
      "Read your reframed sentence once, out loud"
    ];
  }
});

})();
