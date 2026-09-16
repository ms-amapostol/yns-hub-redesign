/* =====================================================================
   The Week It's Hard — a plan for the week you want to quit.

   Door 4 · Mindset and money. Module 4 (Mighty Mindset), app-ised.
   Source scripts: #12 Developing a Solutions-First Mindset (ABLE), and
   "Using the ABLE Framework in Everyday Challenges". The middle of this
   activity is the class's ABLE framework, walked once on a real problem
   so that the note to future you has a method inside it.

   Outcome: "I have a written plan for the bad week, made on a good one."

   Design notes:

   * A plan for the hard week has to be written on an easy one. That is
     the whole reason this is a separate activity from Bounce Back. One
     looks back; this one looks forward.

   * `hard_week_plan` is free text and the deliverable. `hard_week_person`
     is a boolean so the runtime can nudge people who have nobody named.

   * If the person has a why on file, it is quoted back on the last
     screen. That is the strongest "this knows me" move available and it
     costs nothing.
   ===================================================================== */
(function () {
"use strict";

function escHTML(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* able_options is a block of text here, but Solve It stores a list of
   {moment}. Either way this gives back plain lines. */
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

/* Anything still in [brackets] is a fill-in nobody filled. It must not
   reach the saved note, the Planner or the hub. */
var FILL = {
  "name": "the person you thought of",
  "day": "the end of the week",
  "ten minutes of ___": "ten minutes of the next step"
};
function clearFills(t) {
  /* Only the fill-ins the draft itself put there. Anything else in
     brackets is the person's own writing and stays as typed. */
  return String(t || "").replace(/\[([^\]]*)\]/g, function (m, k) {
    var key = k.trim().toLowerCase();
    return FILL[key] ? FILL[key] : m;
  });
}

YNSActivity.define({
  slug: "bounce",
  title: "The Week It's Hard",

  slots: [

    /* ---------------------------------------------------------------
       1. Frame it. Five minutes, made now, read later.
       --------------------------------------------------------------- */
    {
      id: "frame",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "Eight minutes",
          title: "There will be a week you want to quit.",
          lead: "Everyone who changes something has one. The people who get through it usually decided what to do before it arrived.",
          body: [
            "Right now you can think clearly. On the hard week you won't be able to. So this activity writes the plan now and hands it to future you.",
            "You'll name your warning sign, pick one person, walk one real problem through the class's ABLE method, and write a short note to future you."
          ],
          cta: "Let's write it"
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. The signs. Closed vocabulary so a check-in can read it later.
       --------------------------------------------------------------- */
    {
      id: "signal",
      axes: [],
      ladder: [
        {
          asks: "hard_week_signal",
          mechanic: "choice",
          eyebrow: "The warning sign",
          title: "How do you usually know a hard week has started?",
          scene: [
            "Most people have a tell. Naming it means you'll notice it a day or two earlier next time."
          ],
          prompt: "The most familiar one.",
          options: [
            { k: "avoid",  t: "I stop opening the thing",           s: "The app, the email, the book. It sits unopened.", echo: "you stop opening it" },
            { k: "tired",  t: "I'm tired in a way sleep doesn't fix", s: "Flat, not just sleepy.", echo: "you go flat" },
            { k: "doubt",  t: "I start rewriting the whole plan",     s: "Suddenly the entire direction feels wrong.", echo: "you start doubting the plan" },
            { k: "snap",   t: "I get short with people",             s: "Small things land harder than they should.", echo: "you get short with people" },
            { k: "hide",   t: "I go quiet",                          s: "Fewer replies, fewer plans, fewer people.", echo: "you go quiet" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. The person. One name. This is the highest-value line in the
       plan and the one people skip, so it is optional but pushed.
       --------------------------------------------------------------- */
    {
      id: "person",
      axes: [],
      ladder: [
        {
          asks: "hard_week_person",
          mechanic: "choice",
          eyebrow: "The person",
          title: "Who will you text when it's a hard week?",
          scene: [
            "Not for advice. Just so one person knows. It's easier to keep going when someone is watching, and it's very hard to keep going when nobody is."
          ],
          prompt: "Do you have someone?",
          options: [
            { k: "yes",   t: "Yes, I know who",           s: "Keep them in mind for the note at the end.", echo: "you have someone" },
            { k: "maybe", t: "Maybe. Someone I'd have to ask", s: "That's fine. Asking is the step.", echo: "you have someone to ask" },
            { k: "no",    t: "Not right now",             s: "A lot of people are here. The plan still works.", echo: "you don't have someone yet" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       4. ABLE, walked once. Assess, Brainstorm, List, Execute. Four
       short text screens on one problem they actually have. Every step
       is optional so a tired person can skip to the note.
       --------------------------------------------------------------- */
    {
      id: "able_a",
      axes: [],
      ladder: [
        {
          asks: "able_problem",
          mechanic: "text",
          eyebrow: "A · Assess",
          title: "What's one problem that's in your way right now?",
          scene: [
            "The class calls this a solutions-first mindset. It starts with one belief: every problem has a solution, so the question changes from \u201cwhy me\u201d to \u201chow do I solve this.\u201d",
            "Pick a real one. Small is fine."
          ],
          prompt: "The problem, in one line.",
          placeholder: "The problem is\u2026",
          rows: 3, maxLength: 300, cta: "That's the problem", optional: true,
          examples: [
            "I can't get to the 6am shift because the bus doesn't run that early.",
            "The certificate costs $900 and I have $200.",
            "I keep saying I'll apply and then I don't."
          ]
        },
        {
          needs: { fact: "able_problem" },
          mechanic: "learn",
          eyebrow: "A \u00b7 Assess",
          title: function (v) {
            var done = (v && v.facts && v.facts.activities_completed) || [];
            return done.indexOf("able") >= 0
              ? "You already ran this in Solve It."
              : "You already wrote this part down.";
          },
          provenance: "You've told us this already, so this doesn't ask again.",
          lead: function (v) { return "The problem: \u201c" + ((v && v.facts && v.facts.able_problem) || "") + "\u201d"; },
          points: function (v) {
            var f = (v && v.facts) || {};
            var out = optionList(f.able_options).map(function (t, n) { return "Way " + (n + 1) + ": " + escHTML(t); });
            if (f.able_step) out.push("<b>First ten minutes:</b> " + escHTML(f.able_step));
            return out;
          },
          body: ["Your note at the end will use these."],
          cta: "Use these"
        }
      ]
    },
    {
      id: "able_b",
      axes: [],
      ladder: [
        {
          asks: "able_options",
          mechanic: "text",
          eyebrow: "B · Brainstorm",
          title: "Three ways it could be solved. Bad ideas welcome.",
          scene: function (v) {
            var pr = (v && v.extra && v.extra.able_a_text) || (v && v.facts && v.facts.able_problem);
            return [ (pr ? "\u201c" + escHTML(pr) + "\u201d " : "") + "There's usually more than one way. Write three, even if two are silly. The point is getting past the first one." ];
          },
          prompt: "One per line.",
          placeholder: "1.\n2.\n3.",
          rows: 5, maxLength: 500, cta: "Those are my three", optional: true
        }
      ]
    },
    {
      id: "able_l",
      axes: [],
      ladder: [
        {
          asks: "able_pick",
          mechanic: "choice",
          eyebrow: "L · List",
          title: "Which of your three is the most realistic this week?",
          scene: function (v) {
            var items = optionList((v && v.extra && v.extra.able_b_text) || (v && v.facts && v.facts.able_options));
            return (items.length
              ? ["Your list:<br>" + items.map(function (t, n) { return (n + 1) + ". " + escHTML(t); }).join("<br>")]
              : []).concat(["The class says list them from most to least realistic and start at the top. You only need the top one."]);
          },
          prompt: "Your top one.",
          options: [
            { k: "first",  t: "The first one I wrote",  s: "Usually the obvious one, and obvious is fine.", echo: "your first idea" },
            { k: "second", t: "The second one",         s: "", echo: "your second idea" },
            { k: "third",  t: "The third one",          s: "The one you almost didn't write.", echo: "your third idea" },
            { k: "none",   t: "None of them yet",       s: "Then the next step is asking someone for a fourth.", echo: "none yet" }
          ]
        }
      ]
    },
    {
      id: "able_e",
      axes: [],
      ladder: [
        {
          asks: "able_step",
          mechanic: "text",
          eyebrow: "E · Execute",
          title: "What's the first ten minutes of that?",
          scene: ["Execute, learn, adjust. You don't need the whole solution. You need the first ten minutes, and a day this week to do them."],
          prompt: "This week I'll\u2026",
          placeholder: "On [day] I'll\u2026",
          rows: 3, maxLength: 200, cta: "That's the first step", optional: true
        }
      ]
    },

    /* ---------------------------------------------------------------
       5. The plan itself. Prefilled from everything above so it is an
       edit rather than a blank page.
       --------------------------------------------------------------- */
    {
      id: "plan",
      axes: [],
      ladder: [
        {
          asks: "hard_week_plan",
          mechanic: "text",
          eyebrow: "The plan",
          title: "Write the note to future you.",
          scene: [
            "This is what you'll read on the hard week. Short, plain, and specific. We've drafted it from your answers. Change every word if you want."
          ],
          prompt: "Keep it to a few lines.",
          prefill: function (ctx) {
            var a = (ctx && ctx.answers) || {};
            var SIG = { avoid: "I've stopped opening things", tired: "I'm flat in a way sleep doesn't fix", doubt: "I'm rewriting the whole plan", snap: "I'm short with people", hide: "I've gone quiet" };
            var ex = (ctx && ctx.extra) || {};
            var f = (ctx && ctx.facts) || {};
            var who = a.person || f.hard_week_person;
            var sig = a.signal || f.hard_week_signal;
            var person = who === "yes" ? "Text the person you thought of." : who === "maybe" ? "Text the person you have in mind, even if it feels weird." : "Tell one person, anyone.";
            var step = ex.able_e_text || f.able_step || "ten minutes of the next step";
            return "If " + (SIG[sig] || "it's a hard week") + ", this is a hard week. That's all it is.\n" +
              "1. " + person + "\n" +
              "2. Do the smallest version of the thing: " + step + "\n" +
              "3. If it's a problem, run ABLE: assess it, brainstorm three ways, pick the realistic one, do ten minutes.\n" +
              "4. No big decisions until the end of the week. Especially not quitting.";
          },
          rows: 8,
          maxLength: 900,
          cta: "Save the note"
        }
      ]
    },

    /* ---------------------------------------------------------------
       5. Close. Quote their why back if we have it.
       --------------------------------------------------------------- */
    {
      id: "close",
      axes: [],
      ladder: [
        {
          mechanic: "learn",
          eyebrow: "One more thing",
          title: "The hard week is a week.",
          lead: function (v) {
            var why = v && v.facts && v.facts.why_statement;
            return why ? "You wrote down why you're doing this. Here it is: \u201c" + why + "\u201d" : "It ends. Plans made on a good week are how you get to the other side of it.";
          },
          body: function (v) {
            var why = v && v.facts && v.facts.why_statement;
            return why
              ? ["That sentence is the thing to read on the hard week, right after the note you just wrote."]
              : ["If you haven't done Your Why yet, it's two minutes, and it's the other half of this plan."];
          },
          cta: "Done"
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var esc = r.esc;
    var plan = clearFills(r.extra.plan_text || r.ctx.facts.hard_week_plan || "");
    var person = r.state.answers.person || "";
    var signedIn = !!(window.YNS && YNS.signedIn && YNS.signedIn());
    return "<h1>Your note to future you.</h1>" +
      (plan ? '<div class="ya-quote" style="white-space:pre-line">' + esc(plan) + "</div>" : "") +
      '<p class="ya-result-lead">' +
      (signedIn
        ? "It's saved to your profile. When a hard week shows up, read this first."
        : "Right now this only lives in this browser. Screenshot it, or make an account and it'll be on your profile when you need it.") +
      "</p>" +
      (person === "no"
        ? '<div class="ya-readout"><h3>About the person</h3><p>You said there\u2019s nobody to text right now. The plan works without one. Two Conversations is built for finding that person, when you\u2019re ready.</p></div>'
        : "");
  },

  /* The saved note is free text, so tidy any unfilled [fill-in] before
     it is stored where the Planner and the hub read it. */
  onComplete: function (r) {
    var f = (r && r.ctx && r.ctx.facts) || {};
    var t = (r && r.extra && r.extra.plan_text) || f.hard_week_plan || "";
    if (t && /\[[^\]]*\]/.test(t)) {
      var clean = clearFills(t);
      if (r.extra && r.extra.plan_text) r.extra.plan_text = clean;
      if (r.setFact) r.setFact("hard_week_plan", clean);
    }
  },

  actions: function (state, ctx) {
    var person = (state && state.answers && state.answers.person) || (ctx && ctx.facts && ctx.facts.hard_week_person) || "";
    return [
      person === "yes" ? "Tell the person you thought of that they're in your plan"
        : person === "maybe" ? "Ask the person you have in mind if you can text them on a bad week"
        : "Do Two Conversations and find one person",
      "Put the note somewhere you'll see it on a bad day",
      "Decide which day of the week is your no-big-decisions day"
    ];
  }
});

})();
