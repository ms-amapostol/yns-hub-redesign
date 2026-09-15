/* =====================================================================
   YNS — the shared taxonomy.

   One definition of what the nine categories are called. Previously each
   component carried its own copy, and they had already drifted: the
   trades category was "Skilled Trades & Technical" in the progress panel
   and "Skilled Trades" in the reflect modal and the admin dashboard.

   That drift is not cosmetic. "Skilled Trades & Technical" sitting next
   to "Technology" reads as though they overlap, so ruling out Technology
   looks like it should also remove an electrician. It doesn't — they are
   separate categories with no shared occupations — but a label that
   invites the misreading is a broken label.

   Hence: "Skilled Trades". The "& Technical" bought nothing and cost
   clarity.

   Load before any component that names a category.
   ===================================================================== */
(function (global) {
  "use strict";

  /* label  what a person sees
     blurb  one line, for places with room to explain
     Keys must match the category keys in quiz-shared.js and
     data/crosswalk.json. */
  var CATEGORIES = {
    social:   { label: "Social & Community Work",
                blurb: "Work where a specific person is better off because you were there." },
    edu:      { label: "Education & Training",
                blurb: "Getting someone from not being able to do a thing to being able to." },
    health:   { label: "Health & Care",
                blurb: "Hands-on work with people at the moments that matter most." },
    gov:      { label: "Government & Public Service",
                blurb: "Making the system work for the people inside it." },
    creative: { label: "Creative & Media",
                blurb: "Work that leaves something behind that did not exist that morning." },
    trades:   { label: "Skilled Trades",
                blurb: "The physical world, kept standing up." },
    biz:      { label: "Business & Operations",
                blurb: "Getting moving parts to line up — people, deadlines, budgets." },
    tech:     { label: "Technology",
                blurb: "Building and running the things everything else depends on." },
    finance:  { label: "Finance & Data",
                blurb: "Making numbers tell the truth, and helping people act on them." }
  };

  var LEVELS = {
    early:       "just starting out",
    some:        "a couple of years in",
    experienced: "genuinely experienced",
    leader:      "running things already"
  };

  var VALUES = {
    pay: "pay ceiling", flex: "flexibility and time", impact: "impact on people",
    stable: "stability", growth: "growth", craft: "craft and mastery"
  };

  function label(key) {
    return (CATEGORIES[key] && CATEGORIES[key].label) || key;
  }

  /* {key: label} — for anything that wants a plain map. */
  function labels() {
    var out = {};
    Object.keys(CATEGORIES).forEach(function (k) { out[k] = CATEGORIES[k].label; });
    return out;
  }

  global.YNSTaxonomy = {
    CATEGORIES: CATEGORIES,
    LEVELS: LEVELS,
    VALUES: VALUES,
    label: label,
    labels: labels
  };
})(window);
