/* =====================================================================
   Two Conversations — the highest-leverage thing per minute.

   Outcome: "I know the two people I should talk to, and what I'd say to
   them."

   Networking advice usually fails for the people this product is for,
   because it assumes a network. This does not: it asks who they already
   know, at one remove, and then writes the message for them.

   The `compose` mechanic is the point. Nobody is stuck on "should I
   reach out" — they are stuck on the blank message box, staring at it,
   deciding they will do it tomorrow. So we fill it in.

   Gated on top_category, because "message someone in your field"
   without a field is not a thing you can act on.
   ===================================================================== */
(function () {
"use strict";

/* The field, named, or null so callers can fall back to a phrasing that
   does not pretend to know. This activity is gated on top_category and
   still never said which field it meant, which is the whole problem. */
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

YNSActivity.define({
  slug: "conversations",
  title: "Two Conversations",

  slots: [

    /* ---------------------------------------------------------------
       1. Who. Deliberately at one remove — "someone you know who does
       this" is a question most people answer with "nobody", and they
       are almost always wrong once you widen it by one degree.
       --------------------------------------------------------------- */
    {
      id: "who",
      axes: [],
      ladder: [
        {
          mechanic: "choice",
          eyebrow: "The first one",
          title: function (v) {
            var n = catName(v);
            return n ? "Who's the closest person you know to " + n + "?" : "Who's the closest person to this work?";
          },
          scene: function (v) {
            var n = catName(v);
            return [
              "We're looking for the nearest human being to " +
              (n ? "<b>" + escHTML(n) + "</b>" : "the work you're thinking about") +
              ". They don't have to be a contact or a mentor, and you don't have to know them well.",
              "Almost everyone says \u201cnobody\u201d at first. Almost everyone is wrong, once you widen it by one step."
            ];
          },
          prompt: "Which of these exists for you?",
          options: [
            { k: "direct", t: "Someone I know who does it",
              s: "A friend, a relative, someone you used to work with.",
              echo: "I know someone who does it" },
            { k: "second", t: "Someone I know who knows someone",
              s: "You'd be asking for an introduction, not for the conversation itself.",
              echo: "I know someone who knows them" },
            { k: "cold",   t: "Someone I've never met but could find",
              s: "A name on a company page, a person in a group, someone local.",
              echo: "I can find someone even if I don't know them" },
            { k: "none",   t: "Genuinely nobody, and I don't know where to look",
              s: "Then the first job is finding one name. There's a way to do that below.",
              echo: "I don't know where to look yet" }
          ]
        }
      ]
    },

    /* ---------------------------------------------------------------
       2. The message. The deliverable.
       --------------------------------------------------------------- */
    {
      id: "draft",
      axes: [],
      ladder: [
        {
          asks: "contact_named",
          mechanic: "compose",
          eyebrow: "The message",
          title: "Here's the message. Fill in the blanks.",
          scene: function (v) {
            var n = catName(v);
            return [
              "You're asking someone in " + (n ? "<b>" + escHTML(n) + "</b>" : "that line of work") +
              " for fifteen minutes of their opinion, which most people enjoy giving. You're not " +
              "asking for a job, a favour, or half an hour of mentoring.",
              "Short is better. The version below is shorter than you think it should be, on purpose."
            ];
          },
          prompt: "Type into the fields and the message writes itself.",
          cta: "That's my message",
          blanks: [
            { k: "name",    t: "Their name",                 placeholder: "Sam" },
            { k: "how",     t: "How you know them, or found them", placeholder: "we worked together at the warehouse" },
            { k: "what",    t: "What they do",               placeholder: "you're an electrician now" },
            { k: "you",     t: "Where you're at",            placeholder: "I'm looking at getting into the trade" }
          ],
          template:
            "Hi {name},\n\n" +
            "Hope you're well. {how}.\n\n" +
            "I saw that {what}. {you}, and I'd really value fifteen minutes of your honest take " +
            "on it. What the work is like day to day, and what you'd tell someone thinking about " +
            "starting.\n\n" +
            "No agenda beyond that. I'm not asking you for a job. Happy to work around whenever " +
            "suits you.\n\n" +
            "Thanks either way."
        },
        {
          needs: { fact: "why_statement" },
          asks: "contact_named",
          mechanic: "compose",
          eyebrow: "The message",
          title: "Here's the message. Fill in the blanks.",
          scene: function (v) {
            var n = catName(v);
            return [
              "You're asking someone in " + (n ? "<b>" + escHTML(n) + "</b>" : "that line of work") +
              " for fifteen minutes of their opinion. You're not asking for a job or for mentoring.",
              "You've already written down why you're doing this. The version below leaves room for " +
              "one line of it. The real reason lands better than a formal one."
            ];
          },
          prompt: "Type into the fields and the message writes itself.",
          provenance: "This version has room for the reason you already told us.",
          cta: "That's my message",
          blanks: [
            { k: "name",   t: "Their name",                       placeholder: "Sam" },
            { k: "how",    t: "How you know them, or found them", placeholder: "we worked together at the warehouse" },
            { k: "what",   t: "What they do",                     placeholder: "you're an electrician now" },
            { k: "why",    t: "Why you're looking, in a few words", placeholder: "I want work that doesn't follow me home" }
          ],
          template:
            "Hi {name},\n\n" +
            "Hope you're well. {how}.\n\n" +
            "I saw that {what}. I'm looking at making a change. {why}. I'd really value fifteen " +
            "minutes of your honest take on it: what the work is like day to day, and what you'd " +
            "tell someone thinking about starting.\n\n" +
            "No agenda beyond that. I'm not asking you for a job. Happy to work around whenever " +
            "suits you.\n\n" +
            "Thanks either way."
        }
      ]
    },

    /* ---------------------------------------------------------------
       3. What to ask. Turns fifteen minutes of small talk into fifteen
       minutes of information.
       --------------------------------------------------------------- */
    {
      id: "ask",
      axes: [],
      ladder: [
        {
          mechanic: "choice",
          eyebrow: "The one question",
          title: "If you only get one real question in, make it this one.",
          scene: function (v) {
            var n = catName(v);
            return [
              "Most of these chats get eaten by small talk and end with \u201cwell, good luck\u201d. " +
              "One well-chosen question is worth the whole call.",
              "Pick the one that would tell you most about " +
              (n ? "<b>" + escHTML(n) + "</b>" : "the work") + "."
            ];
          },
          prompt: "Which would tell you the most?",
          options: [
            { k: "badday", t: "\u201cWhat does a bad day look like?\u201d",
              s: "Everyone tells you about the good ones unprompted. The bad ones are the information.",
              echo: "I'll ask what a bad day looks like" },
            { k: "wish",   t: "\u201cWhat do you wish you'd known before you started?\u201d",
              s: "It invites the thing they're still slightly annoyed about, which is usually the useful part.",
              echo: "I'll ask what they wish they'd known" },
            { k: "who",    t: "\u201cWho else should I be talking to?\u201d",
              s: "The question that turns one conversation into three.",
              echo: "I'll ask who else to talk to" },
            { k: "again",  t: "\u201cIf you were starting today, would you do it again?\u201d",
              s: "The bluntest question there is, and people answer it honestly more often than you'd expect.",
              echo: "I'll ask whether they'd do it again" }
          ]
        }
      ]
    }
  ],

  /* ------------------------------------------------------------------ */
  results: function (r) {
    var blanks = r.extra.draft_blanks || {};
    var who = r.state.answers.who || "";
    var ask = r.state.answers.ask || "";
    var ASK_WORDS = {
      badday: "\u201cWhat does a bad day look like?\u201d",
      wish:   "\u201cWhat do you wish you\u2019d known before you started?\u201d",
      who:    "\u201cWho else should I be talking to?\u201d",
      again:  "\u201cIf you were starting today, would you do it again?\u201d"
    };
    var esc = r.esc;
    /* The draft slot is droppable once contact_named is on file, so a
       returning visitor may have no blanks this run. Fall back rather
       than telling somebody who already found their person that the name
       is the missing piece. */
    var named = !!(blanks.name || "").trim() || r.ctx.facts.contact_named === true;

    var lead = named
      ? "You've got a name and a message."
      : "You've got the message. The name is the missing piece.";

    var WHO = {
      direct: "You already know someone who does this. The hard version of this activity is for " +
              "people who don't, and you are not doing the hard version.",
      second: "One person in between is a useful distance. A shared connection means your " +
              "message gets read, and asking for an introduction is a much smaller favour than " +
              "the conversation itself.",
      cold:   "You don't know them yet, but you can find them. A short, specific message with no " +
              "favour attached gets answered more often than people expect, mostly because almost " +
              "nobody sends one.",
      none:   "Then the first conversation is about finding the second. A trade body, a local " +
              "college's course page, a union hall, a group for people who do this work. Any of " +
              "them will hand you a name inside an hour."
    };
    var whoNote = WHO[who] || "";

    /* Their own message, quoted back. The runtime keeps the assembled
       text; a blank left empty shows as its example ("[Sam]"), which
       would read like a real name, so those become a plain fill-in. */
    var draft = String(r.extra.draft_text || "");
    var BLANK_LABEL = { Sam: "their name", "we worked together at the warehouse": "how you know them",
      "you're an electrician now": "what they do", "I'm looking at getting into the trade": "where you're at",
      "I want work that doesn't follow me home": "why you're looking" };
    draft = draft.replace(/\[([^\]]+)\]/g, function (m, k) { return "[" + (BLANK_LABEL[k] || k) + "]"; });
    var name = (blanks.name || "").trim();
    var WHO_SHORT = { direct: "someone you know who does this work", second: "someone who can introduce you",
      cold: "someone you found", none: "the first person you find" };
    var whoLabel = WHO_SHORT[who] || "";
    var sendTo = name
      ? "For <b>" + esc(name) + "</b>" + (whoLabel ? ", " + esc(whoLabel) : "") + "."
      : (whoLabel ? "For " + esc(whoLabel) + "." : "");
    var draftBlock = draft
      ? '<div class="ya-readout"><h3>Your message</h3>' +
        (sendTo ? "<p>" + sendTo + "</p>" : "") +
        '<div class="ya-quote"><p style="white-space:pre-line;margin:0">' + esc(draft) + "</p></div>" +
        '<p><button type="button" class="lnk" onclick="var t=this.parentNode.previousElementSibling.textContent;' +
        'if(navigator.clipboard){navigator.clipboard.writeText(t);this.textContent=\'Copied\';}">Copy the message</button></p>' +
        "</div>"
      : "";

    return "<h1>" + esc(lead) + "</h1>" +
      '<p class="ya-result-lead">Fifteen minutes with someone who does this will tell you more ' +
      "than any activity here, including this one. We don't say that to be modest. It's the " +
      "difference between a model of the work and the work.</p>" +

      draftBlock +

      (whoNote ? '<div class="ya-readout"><h3>Who you\u2019re starting with</h3><p>' + whoNote + "</p></div>" : "") +

      (ASK_WORDS[ask]
        ? '<div class="ya-quote">Your one question: <b>' + esc(ASK_WORDS[ask]) + "</b></div>"
        : "") +

      '<div class="ya-readout"><h3>Two, not one</h3>' +
      "<p>One conversation is a one-off. Two starts to look like a pattern. The second is " +
      "always easier, because the first person usually tells you who it should be.</p>" +
      "<p>If the message sits in drafts for a week, send it anyway. The worst realistic outcome " +
      "is silence, and silence is where you are standing right now.</p></div>";
  },

  actions: function (state) {
    if (state.answers.who === "none") {
      return [
        "Find one local training provider's course page and note who runs it",
        "Join one group where these people are. A union, a trade body, a subreddit",
        "Just find one name. That's the whole task."
      ];
    }
    return [
      "Send the message today rather than tomorrow.",
      "Write down the one question so you don't lose it in the small talk",
      "Ask whoever replies who else you should be speaking to"
    ];
  }
});

})();
