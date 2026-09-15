/* =====================================================================
   YNS — quiz-shared.js

   The engine behind the three quiz prototypes. Each prototype file is
   pure content: the story beats, the moments, the budget values. Every
   piece of shared machinery lives here.

     scoring        six axes, nine categories, cosine similarity
     content        category blurbs, archetypes, levels, role tables
     persistence    resume-in-progress, and saving finished runs to
                    Supabase when the person is signed in
     personalization reads profile_signals so a second activity knows
                    what the first one learned
     capture        the email form and the share block
     analytics      step / complete / ad-hoc events

   Load order in each prototype:
     <script src="yns-config.js"></script>
     <script src="yns-supabase.js"></script>
     <script src="quiz-shared.js"></script>

   yns-supabase.js is optional. Without it — or with an unconfigured
   yns-config.js — everything below still works against localStorage and
   simply never offers to save.
   ===================================================================== */
(function (global) {
  "use strict";

  var DB = global.YNS || null;

  /* ===================================================================
     THE SIX AXES

     Every option in every prototype scores some combination of these.
     They are deliberately about the texture of the work rather than the
     subject matter, so the same six describe a nurse and a electrician.
     =================================================================== */
  var AXES = [
    { k: "people",   label: "People"   },
    { k: "analysis", label: "Analysis" },
    { k: "making",   label: "Making"   },
    { k: "leading",  label: "Leading"  },
    { k: "hands",    label: "Hands"    },
    { k: "order",    label: "Order"    }
  ];

  var AXIS_KEYS = AXES.map(function (a) { return a.k; });

  /* ===================================================================
     THE NINE CATEGORIES

     `profile` is the axis shape of the category, on 0..1. Matching is
     cosine similarity against these, so it is the *shape* that matters
     and not the magnitude — someone who answered enthusiastically all
     the way through does not get a different category to someone who
     answered the same way more sparingly.
     =================================================================== */
  var CATS = {
    social: {
      name: "Social & Community Work",
      blurb: "Work where a specific person is measurably better off because you were there. Case work, support, advocacy, community programmes.",
      profile: { people: 1.00, order: 0.40, leading: 0.40, analysis: 0.20, making: 0.10, hands: 0.10 }
    },
    edu: {
      name: "Education & Training",
      blurb: "Getting someone from not being able to do a thing to being able to do it. Classrooms, training rooms, coaching, curriculum.",
      profile: { people: 0.95, leading: 0.50, order: 0.45, making: 0.40, analysis: 0.30, hands: 0.15 }
    },
    health: {
      name: "Health & Care",
      blurb: "Hands-on work with people at the moments that matter most. Clinical roles, allied health, care settings, public health.",
      profile: { people: 0.90, order: 0.60, hands: 0.60, analysis: 0.45, leading: 0.30, making: 0.10 }
    },
    gov: {
      name: "Government & Public Service",
      blurb: "Making the system work for the people inside it. Policy, administration, regulation, public programmes.",
      profile: { order: 1.00, analysis: 0.55, people: 0.50, leading: 0.50, hands: 0.20, making: 0.15 }
    },
    creative: {
      name: "Creative & Media",
      blurb: "Work that leaves something behind that did not exist that morning. Design, writing, video, brand, production.",
      profile: { making: 1.00, hands: 0.35, analysis: 0.30, people: 0.30, leading: 0.25, order: 0.15 }
    },
    trades: {
      name: "Skilled Trades & Technical",
      blurb: "The physical world, kept standing up. Electrical, mechanical, construction, installation, maintenance.",
      profile: { hands: 1.00, making: 0.55, order: 0.50, analysis: 0.25, people: 0.20, leading: 0.20 }
    },
    biz: {
      name: "Business & Operations",
      blurb: "Getting moving parts to line up: people, deadlines, budgets. Operations, project management, sales, general management.",
      profile: { leading: 1.00, order: 0.65, people: 0.55, analysis: 0.50, making: 0.25, hands: 0.15 }
    },
    tech: {
      name: "Technology",
      blurb: "Building and running the things everything else depends on. Software, data, IT, security, support engineering.",
      profile: { analysis: 1.00, making: 0.80, order: 0.50, leading: 0.25, hands: 0.20, people: 0.20 }
    },
    finance: {
      name: "Finance & Data",
      blurb: "Making numbers tell the truth, and helping people act on them. Accounting, analysis, planning, insurance, banking.",
      profile: { analysis: 1.00, order: 0.85, leading: 0.40, people: 0.25, making: 0.20, hands: 0.05 }
    }
  };

  var CAT_KEYS = Object.keys(CATS);

  /* Read back as: "You're ${ARCHETYPE[top]}." */
  var ARCHETYPE = {
    social:   "someone people end up leaning on",
    edu:      "the one who explains it so it lands",
    health:   "steady when it matters",
    gov:      "a fixer of systems",
    creative: "a maker",
    trades:   "someone who wants the day to leave evidence",
    biz:      "the one who makes it actually happen",
    tech:     "a builder of the things underneath",
    finance:  "the one who wants the real number"
  };

  var ARCHETYPE_LINE = {
    social:   "You kept choosing the person over the process. That is the whole job in a set of careers most people never seriously look at.",
    edu:      "You get something out of watching the moment it clicks for someone else. That instinct is the actual skill, and it is rarer than it sounds.",
    health:   "You went towards the difficult thing rather than around it, and you wanted to be useful in a specific, physical way.",
    gov:      "You kept reaching past the patch, for the rule or the process or the thing that will still be true after you have gone.",
    creative: "You want the day to end with something in front of you that was not there that morning, and you would rather redo it than ship it nearly right.",
    trades:   "You want a clear standard for done, and you want to be the one who reached it. Evidence over opinion, every time.",
    biz:      "You kept being the one who calls it when the room has been going in circles for forty minutes. That is a job, and it pays.",
    tech:     "You go to the root cause while everyone else is still treating the symptom, and you would rather build the thing that stops it recurring.",
    finance:  "You want the record, not the impression. Everything you chose pointed at wanting to know what is actually true before acting."
  };

  /* ===================================================================
     LEVELS — where the person is standing today.

     Every prototype ends on this question because it is what makes the
     role suggestions honest. `LEVEL_WORD` is read back as
     "roles matched to your ___ experience".
     =================================================================== */
  var LEVELS = [
    { k: "early",       t: "Just starting out",
      s: "First job, or first job in anything like this. No relevant experience yet, and that is fine." },
    { k: "some",        t: "A couple of years in",
      s: "You have worked, you have picked things up, but nobody would call you senior yet." },
    { k: "experienced", t: "Genuinely experienced",
      s: "Five years or more. You are good at what you do, you are just not sure it is the right thing." },
    { k: "leader",      t: "Running things already",
      s: "You manage people, a budget, or both. A move sideways has to be worth it." }
  ];

  var LEVEL_WORD = {
    early:       "early",
    some:        "building",
    experienced: "experienced",
    leader:      "senior"
  };

  /* ===================================================================
     ROLES

     Three roles per category per level. The salary bands are PLACEHOLDER
     RANGES — see salaryNote(). Replace this table wholesale when the BLS
     import lands; nothing else in the codebase reads these numbers.
     =================================================================== */
  var ROLES = {
    social: {
      early:       [["Case Aide", "$34k–42k"], ["Community Outreach Worker", "$36k–45k"], ["Residential Support Worker", "$33k–41k"]],
      some:        [["Case Manager", "$44k–56k"], ["Housing Specialist", "$45k–58k"], ["Youth Programme Coordinator", "$42k–54k"]],
      experienced: [["Licensed Social Worker", "$55k–72k"], ["Programme Manager", "$60k–78k"], ["Clinical Case Supervisor", "$62k–80k"]],
      leader:      [["Director of Programmes", "$78k–105k"], ["Executive Director, Nonprofit", "$85k–130k"], ["Head of Community Services", "$80k–110k"]]
    },
    edu: {
      early:       [["Teaching Assistant", "$30k–38k"], ["Tutor / Learning Coach", "$34k–44k"], ["Training Coordinator", "$40k–50k"]],
      some:        [["Classroom Teacher", "$46k–60k"], ["Corporate Trainer", "$52k–68k"], ["Instructional Designer", "$58k–75k"]],
      experienced: [["Curriculum Lead", "$65k–85k"], ["Senior Instructional Designer", "$78k–100k"], ["Learning & Development Manager", "$80k–105k"]],
      leader:      [["Head of Learning & Development", "$105k–145k"], ["School Principal", "$95k–135k"], ["Director of Education", "$100k–140k"]]
    },
    health: {
      early:       [["Medical Assistant", "$36k–46k"], ["Patient Care Technician", "$34k–44k"], ["Pharmacy Technician", "$36k–47k"]],
      some:        [["Licensed Practical Nurse", "$52k–65k"], ["Radiologic Technologist", "$58k–74k"], ["Respiratory Therapist", "$62k–78k"]],
      experienced: [["Registered Nurse", "$75k–98k"], ["Physician Assistant", "$105k–135k"], ["Clinical Specialist", "$85k–110k"]],
      leader:      [["Nurse Manager", "$100k–130k"], ["Director of Clinical Operations", "$115k–155k"], ["Practice Administrator", "$95k–130k"]]
    },
    gov: {
      early:       [["Administrative Assistant, Public Sector", "$36k–46k"], ["Permit Technician", "$40k–50k"], ["Eligibility Specialist", "$40k–51k"]],
      some:        [["Programme Analyst", "$55k–70k"], ["Compliance Officer", "$58k–75k"], ["Planner", "$58k–76k"]],
      experienced: [["Senior Policy Analyst", "$80k–105k"], ["Programme Manager, Public Sector", "$85k–110k"], ["Regulatory Affairs Specialist", "$88k–115k"]],
      leader:      [["Division Director", "$110k–150k"], ["City Manager", "$120k–180k"], ["Head of Policy", "$115k–160k"]]
    },
    creative: {
      early:       [["Junior Designer", "$40k–52k"], ["Production Assistant", "$34k–45k"], ["Content Coordinator", "$40k–52k"]],
      some:        [["Graphic Designer", "$55k–72k"], ["Video Editor", "$52k–70k"], ["Copywriter", "$55k–75k"]],
      experienced: [["Senior Product Designer", "$95k–135k"], ["Art Director", "$85k–115k"], ["Brand Lead", "$90k–120k"]],
      leader:      [["Creative Director", "$120k–175k"], ["Head of Design", "$140k–200k"], ["Executive Producer", "$115k–165k"]]
    },
    trades: {
      early:       [["Apprentice Electrician", "$36k–48k"], ["HVAC Installer's Helper", "$34k–45k"], ["Maintenance Technician I", "$38k–48k"]],
      some:        [["Journeyman Electrician", "$60k–82k"], ["HVAC Technician", "$55k–75k"], ["Industrial Maintenance Tech", "$58k–78k"]],
      experienced: [["Master Electrician", "$85k–115k"], ["Lead Millwright", "$78k–105k"], ["Field Service Engineer", "$80k–110k"]],
      leader:      [["Site Superintendent", "$105k–150k"], ["Trades Business Owner", "$90k–200k+"], ["Maintenance Manager", "$95k–130k"]]
    },
    biz: {
      early:       [["Operations Assistant", "$38k–48k"], ["Sales Development Rep", "$45k–60k"], ["Project Coordinator", "$45k–58k"]],
      some:        [["Operations Analyst", "$60k–78k"], ["Account Executive", "$70k–110k"], ["Project Manager", "$70k–92k"]],
      experienced: [["Senior Programme Manager", "$105k–140k"], ["Operations Manager", "$90k–125k"], ["Strategy Manager", "$110k–150k"]],
      leader:      [["Director of Operations", "$130k–180k"], ["VP, Business Operations", "$160k–230k"], ["General Manager", "$140k–200k"]]
    },
    tech: {
      early:       [["IT Support Specialist", "$42k–55k"], ["QA Tester", "$48k–62k"], ["Junior Developer", "$62k–85k"]],
      some:        [["Software Engineer", "$95k–135k"], ["Data Analyst", "$70k–95k"], ["Systems Administrator", "$72k–95k"]],
      experienced: [["Senior Software Engineer", "$145k–195k"], ["Data Engineer", "$130k–175k"], ["Security Engineer", "$130k–180k"]],
      leader:      [["Engineering Manager", "$175k–240k"], ["Director of Engineering", "$200k–290k"], ["Head of Data", "$180k–250k"]]
    },
    finance: {
      early:       [["Accounts Payable Clerk", "$38k–48k"], ["Bank Teller / Personal Banker", "$36k–50k"], ["Junior Bookkeeper", "$38k–50k"]],
      some:        [["Staff Accountant", "$58k–75k"], ["Financial Analyst", "$70k–92k"], ["Underwriter", "$65k–88k"]],
      experienced: [["Senior Financial Analyst", "$95k–130k"], ["Controller", "$110k–150k"], ["Risk Manager", "$105k–145k"]],
      leader:      [["Finance Director", "$145k–200k"], ["VP Finance", "$175k–250k"], ["Chief Financial Officer", "$200k–350k"]]
    }
  };

  /* ===================================================================
     SCORING
     =================================================================== */

  /* Cosine similarity of `vec` against each profile in `profiles`, over
     the given key set. Exported because prototype 3 builds its own
     profiles out of the budget values rather than the six axes. */
  function cosineAgainst(vec, profiles, keys) {
    var out = {};
    var vMag = 0, i;
    for (i = 0; i < keys.length; i++) {
      var v = +(vec[keys[i]] || 0);
      vMag += v * v;
    }
    vMag = Math.sqrt(vMag);

    Object.keys(profiles).forEach(function (c) {
      var p = profiles[c];
      var dot = 0, pMag = 0;
      for (var j = 0; j < keys.length; j++) {
        var a = +(vec[keys[j]] || 0);
        var b = +(p[keys[j]] || 0);
        dot += a * b;
        pMag += b * b;
      }
      pMag = Math.sqrt(pMag);
      out[c] = (vMag && pMag) ? dot / (vMag * pMag) : 0;
    });
    return out;
  }

  /* The six-axis version, for prototypes 1 and 2. */
  function score(axes) {
    var profiles = {};
    CAT_KEYS.forEach(function (c) { profiles[c] = CATS[c].profile; });
    return cosineAgainst(axes || {}, profiles, AXIS_KEYS);
  }

  function rank(scores) {
    return Object.keys(scores)
      .map(function (k) { return { k: k, v: scores[k] }; })
      .sort(function (a, b) { return b.v - a.v; });
  }

  /* Cosine values for realistic answers bunch up around 0.75–0.95, which
     reads as "everything is a 90% match" and tells the person nothing.
     Stretch the actual observed range across 50–100 instead, with a
     curve so second and third place are visibly behind the winner. */
  function pctScaler(all) {
    var max = all[0].v;
    var min = all[all.length - 1].v;
    var span = (max - min) || 1;
    return function (v) {
      return Math.round(50 + 50 * Math.pow((v - min) / span, 2.5));
    };
  }

  /* -------------------------------------------------------------------
     Real wage data, when it exists.

     scripts/build-roles.mjs writes data/roles.json from the CareerOneStop
     API at build time. If it is present we use it; if not, the invented
     ROLES table above is the fallback so nothing breaks. Which one is in
     play changes what salaryNote() is allowed to claim — see below.
     ------------------------------------------------------------------- */
  var liveRoles = null;

  function loadRoles() {
    return fetch("data/roles.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (d && d.categories) liveRoles = d;
        return liveRoles;
      })
      .catch(function () { return null; });   // file:// or not built yet
  }

  function usingRealWages() {
    return !!liveRoles;
  }

  /* "$98k–168k" — currency symbol on the first figure only, matching the
     existing role tables so the two sources look identical on the page. */
  function fmtBand(lo, hi) {
    var k = function (n) { return n >= 1000 ? Math.round(n / 1000) + "k" : String(n); };
    return "$" + k(lo) + "–" + k(hi);
  }

  /* Returns [[title, payRange], ...] — the shape the prototypes render. */
  function rolesFor(cat, level) {
    if (liveRoles && liveRoles.categories[cat]) {
      var list = liveRoles.categories[cat][level] || [];
      if (list.length) {
        return list.map(function (r) { return [r.title, fmtBand(r.low, r.high)]; });
      }
      // fall through to placeholders if this level was not populated
    }
    var byLevel = ROLES[cat];
    if (!byLevel) return [];
    return byLevel[level] || byLevel.early || [];
  }

  /* ===================================================================
     STATE — resume an interrupted run
     =================================================================== */

  var activity = "unknown";
  var runId = null;
  var signalsData = null;
  var signalsLoaded = false;

  function storeKey() { return "yns_quiz_" + activity; }
  function runKey() { return "yns_runid_" + activity; }

  function save(payload) {
    try {
      global.localStorage.setItem(storeKey(), JSON.stringify({
        at: Date.now(),
        runId: currentRunId(),
        payload: payload
      }));
    } catch (e) { /* private mode; resume just will not be offered */ }
  }

  /* Returns the saved payload, or null if there is none or it is older
     than maxAgeMs. */
  function load(maxAgeMs) {
    try {
      var raw = global.localStorage.getItem(storeKey());
      if (!raw) return null;
      var wrapped = JSON.parse(raw);
      if (!wrapped || !wrapped.payload) return null;
      if (maxAgeMs && (Date.now() - wrapped.at) > maxAgeMs) {
        clear();
        return null;
      }
      if (wrapped.runId) runId = wrapped.runId;
      return wrapped.payload;
    } catch (e) { return null; }
  }

  function clear() {
    try {
      global.localStorage.removeItem(storeKey());
      global.localStorage.removeItem(runKey());
    } catch (e) {}
    runId = null;
  }

  /* One id per attempt at an activity, stable across reloads mid-run.
     It is the conflict key on activity_runs, so a run saved twice — once
     queued while signed out, once after signing in — lands in one row. */
  function currentRunId() {
    if (runId) return runId;
    try {
      runId = global.localStorage.getItem(runKey());
    } catch (e) {}
    if (!runId) {
      runId = (DB && DB.uuid) ? DB.uuid() : String(Date.now()) + "-" + Math.random().toString(16).slice(2);
      try { global.localStorage.setItem(runKey(), runId); } catch (e) {}
    }
    return runId;
  }

  /* ===================================================================
     ANALYTICS
     =================================================================== */

  function track(name, props) {
    props = props || {};
    if (global.console && console.debug) {
      console.debug("[quiz:" + activity + "] " + name, props);
    }
    if (DB) DB.logEvent(name, activity, props);
  }

  function trackStep(index, stepId, choice) {
    track("step", { index: index, step: stepId, choice: choice });
  }

  function trackComplete(top, level, rankedKeys) {
    track("complete", { result: top, level: level, ranked: rankedKeys });
  }

  /* ===================================================================
     SAVING A FINISHED RUN

     Called by finish(). Works signed out — yns-supabase.js queues the
     run and adopts it the moment the person signs in.
     =================================================================== */

  function finish(result) {
    var ranked = result.ranked || [];
    var payload = {
      activity: activity,
      status: "complete",
      level: result.level || null,
      axes: result.axes || {},
      allocation: result.allocation || null,
      answers: result.answers || {},
      scores: result.scores || {},
      top_categories: ranked.slice(0, 3),
      archetype: result.top || null,
      client_run_id: currentRunId()
    };

    trackComplete(result.top, result.level, ranked);

    if (!DB) return Promise.resolve({ ok: false, queued: false });
    return DB.saveRun(payload);
  }

  /* ===================================================================
     PERSONALIZATION

     profile_signals is the cross-activity memory. It is null for a
     signed-out visitor and for a signed-in one who has not finished
     anything yet — both mean "treat this as their first time".
     =================================================================== */

  function signals() { return signalsData; }

  /* The level they gave a previous activity, so this one can default to
     it instead of asking cold. */
  function priorLevel() {
    return (signalsData && signalsData.level) || null;
  }

  /* Categories they have matched to before, strongest first. */
  function priorCategories() {
    return (signalsData && signalsData.top_categories) || [];
  }

  function priorActivities() {
    return (signalsData && signalsData.activities_completed) || [];
  }

  var ACTIVITY_NAME = {
    cyoa: "the story",
    dayinlife: "the day-in-the-life",
    budget: "the budget",
    career_abcs: "Career ABCs"
  };

  /* A short paragraph for the results page that ties this run to the
     previous ones. Returns "" when there is nothing honest to say —
     never invents continuity that is not there. */
  function continuityHTML(topThisTime) {
    if (!signalsData || !signalsData.runs_completed) return "";

    var others = priorActivities().filter(function (a) { return a !== activity; });
    if (!others.length) return "";

    var prior = priorCategories();
    var priorTop = prior[0];
    var names = others.map(function (a) { return ACTIVITY_NAME[a] || a; });
    var list = names.length === 1
      ? names[0]
      : names.slice(0, -1).join(", ") + " and " + names[names.length - 1];

    var agrees = priorTop && priorTop === topThisTime;
    var alsoRan = prior.indexOf(topThisTime) > 0;

    var body;
    if (agrees) {
      body = "You did " + list + " too, and it pointed the same way. Two different sets of questions, " +
             "the same answer, which is worth more than either result on its own.";
    } else if (alsoRan) {
      body = "You did " + list + " too. " + CATS[topThisTime].name + " showed up there as well, " +
             "just not in first place. It keeps appearing, which is the signal.";
    } else if (priorTop && CATS[priorTop]) {
      body = "You did " + list + " too, and that one landed on <b>" + CATS[priorTop].name + "</b>. " +
             "Two different answers is not a contradiction. Usually it means the two things you want " +
             "are both real, and the job you are looking for has to hold both.";
    } else {
      body = "You did " + list + " too, and we are reading this alongside it.";
    }

    return '<div class="q-recall"><b>Building on what you have already told us.</b> ' + body + "</div>";
  }

  /* Injected above the card on load, so someone returning knows their
     history is being used. */
  function recallBannerHTML() {
    if (!signalsData || !signalsData.runs_completed) return "";
    var done = priorActivities().filter(function (a) { return a !== activity; });
    if (!done.length) return "";
    var lvl = priorLevel();
    return '<div class="q-recall">Welcome back. We still have your ' +
      (done.length === 1 ? "previous result" : done.length + " previous results") +
      (lvl ? ", including that you are <b>" + escapeHTML(levelLabel(lvl).toLowerCase()) + "</b>" : "") +
      '. This activity will read alongside them.</div>';
  }

  /* A level handed in by the hub, so the person is not asked the same
     boring question in every activity. The hub owns it; whoever asks
     first writes it; everyone after reads it. */
  /* The hub asks for a fresh run with ?fresh=1. Without it, re-opening
     lands wherever the person left off, which is what "see my results"
     needs. */
  function wantsFresh() {
    try { return /[?&]fresh=1/.test(window.location.search || ""); } catch (e) { return false; }
  }

  function presetLevel() {
    try {
      var m = /[?&]lvl=([a-z_]+)/.exec(window.location.search || "");
      if (m && levelLabel(m[1]) !== m[1]) return m[1];
    } catch (e) {}
    return null;
  }

  function levelLabel(k) {
    for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].k === k) return LEVELS[i].t;
    return k;
  }

  /* ===================================================================
     EMAIL CAPTURE + SHARE + NOTES
     =================================================================== */

  /* Every activity ends the same way: back to the hub. Inside the hub
     this asks the parent to close the panel, which keeps one set of
     navigation rather than two. Opened directly, it navigates. */
  function wireBackToHub(root) {
    var btn = root.querySelector("#tohub");
    if (!btn) return;
    btn.onclick = function () {
      track("back_to_hub", { activity: activity });
      if (window.parent !== window) { window.parent.postMessage({ yns: "close" }, "*"); return; }
      window.location.href = "../index.html";
    };
  }

  function emailFormHTML() {
    return '<div class="emailrow q-email">' +
      '<input type="email" placeholder="you@email.com" autocomplete="email" data-q="email" aria-label="Your email">' +
      '<button type="button" class="btn" data-q="send">Send it to me</button>' +
      '</div><div class="q-emailmsg" data-q="emailmsg" role="status" hidden></div>';
  }

  /* `context` is whatever the prototype knows about the result. It is
     stored on the capture row so a follow-up email can be specific. */
  function wireEmailForm(root, context) {
    var input = root.querySelector('[data-q="email"]');
    var btn = root.querySelector('[data-q="send"]');
    var msg = root.querySelector('[data-q="emailmsg"]');
    if (!input || !btn) return;

    function send() {
      var value = input.value;
      btn.disabled = true;
      btn.textContent = "Sending…";

      var ctx = {};
      for (var k in context) if (Object.prototype.hasOwnProperty.call(context, k)) ctx[k] = context[k];
      ctx.run_id = currentRunId();

      var job = DB
        ? DB.captureEmail(value, activity, ctx)
        : Promise.resolve({ ok: !!(value && value.indexOf("@") > 0) });

      job.then(function (r) {
        if (msg) {
          msg.hidden = false;
          msg.textContent = r.ok
            ? "On its way. Check your inbox in a minute or two."
            : (r.message || "That email did not look right. Try again?");
          msg.className = "q-emailmsg" + (r.ok ? "" : " err");
        }
        btn.disabled = !r.ok;
        btn.textContent = r.ok ? "Sent ✓" : "Send it to me";
        track(r.ok ? "email_captured" : "email_failed", { activity: activity });

        // Someone who just handed over an email is the right person to
        // ask about an account — but only once, and only as an offer.
        if (r.ok && DB && DB.configured && !DB.signedIn()) offerAccount(root, value);
      });
    }

    btn.onclick = send;
    input.onkeydown = function (e) { if (e.key === "Enter") send(); };
  }

  function offerAccount(root, email) {
    var host = root.querySelector('[data-q="emailmsg"]');
    if (!host || host.dataset.offered) return;
    host.dataset.offered = "1";

    var box = document.createElement("div");
    box.className = "q-offer";
    box.innerHTML =
      "<p>Want this saved? We can email you a link that signs you in. Your result gets kept, " +
      "and the next activity will build on it instead of starting from nothing.</p>" +
      '<button type="button" class="btn" data-q="mklink">Save my results</button>' +
      '<span class="q-offermsg" data-q="offermsg"></span>';
    host.parentNode.insertBefore(box, host.nextSibling);

    var b = box.querySelector('[data-q="mklink"]');
    var m = box.querySelector('[data-q="offermsg"]');
    b.onclick = function () {
      b.disabled = true;
      b.textContent = "Sending…";
      DB.signIn(email).then(function (r) {
        m.textContent = r.message;
        b.textContent = r.ok ? "Link sent" : "Try again";
        b.disabled = !!r.ok;
      });
    };
  }

  function shareHTML() {
    return '<div class="q-share" data-q="share">' +
      '<button type="button" data-q="copy">Copy my result</button>' +
      '<span class="q-sharemsg" data-q="sharemsg"></span></div>';
  }

  function wireShare(root, top) {
    var btn = root.querySelector('[data-q="copy"]');
    var msg = root.querySelector('[data-q="sharemsg"]');
    if (!btn) return;

    btn.onclick = function () {
      var text = "I took the Your Next Step quiz. Apparently I'm " +
        ARCHETYPE[top] + ", and it pointed me at " + CATS[top].name + ". " +
        global.location.href;

      var done = function (ok) {
        if (msg) msg.textContent = ok ? "Copied." : "Could not copy. Select it and copy manually.";
        track("share_copied", { result: top, ok: ok });
      };

      if (global.navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    };
  }

  /* Two different notes, because they make two different claims.

     With real data this doubles as the licence obligation: CareerOneStop
     requires attribution to US DOL/ETA and Minnesota DEED on every page
     where the data appears. The citation string is the API's own
     CitationSuggested, rendered verbatim rather than paraphrased. */
  function salaryNote() {
    if (!liveRoles) {
      return '<p class="q-note">Salary ranges are placeholder bands for the prototype, not ' +
        'a quote for your area. They will be replaced with real BLS figures adjusted for ' +
        'your location before this ships.</p>';
    }

    var year = liveRoles.wage_year ? " (May " + escapeHTML(String(liveRoles.wage_year)) + ")" : "";
    var where = liveRoles.location && liveRoles.location !== "United States"
      ? escapeHTML(liveRoles.location)
      : "the United States";

    return '<p class="q-note">Each range is the ' +
      'published wage spread for that occupation across ' + where + year +
      ', narrowed to the part that matches your experience. It is not a starting ' +
      'salary and not an offer. Half of people in an occupation earn less than its ' +
      'midpoint.</p>' +
      '<p class="q-note">' + escapeHTML(liveRoles.citation ||
        "Data from CareerOneStop, sponsored by the U.S. Department of Labor, " +
        "Employment and Training Administration, and the Minnesota Department of " +
        "Employment and Economic Development.") + "</p>";
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ===================================================================
     SHARED CHROME

     Injected rather than copied into each prototype's <style>, so the
     three stay visually consistent as this evolves.
     =================================================================== */
  var CSS = [
    ".q-resume{max-width:680px;margin:0 auto 14px;padding:12px 16px;background:#eef1fe;",
    "border:1px solid #c9d4fb;border-radius:12px;font-size:13.5px;color:#1b3aa8;line-height:1.6}",
    ".q-resume button{background:none;border:none;color:#2952e0;font:inherit;font-weight:600;",
    "cursor:pointer;padding:0 0 0 10px;text-decoration:underline}",
    ".q-recall{margin:0 auto 14px;padding:12px 16px;background:#f2fbf5;border:1px solid #bfe6cd;",
    "border-radius:12px;font-size:13.5px;color:#14532d;line-height:1.6}",
    ".q-recall b{color:#0f3d21}",
    ".q-emailmsg{font-size:13px;color:#b9bfd4;margin-top:8px;line-height:1.5}",
    ".q-emailmsg.err{color:#f0a37a}",
    ".q-offer{margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.14);",
    "font-size:13.5px;line-height:1.6}",
    ".q-offer p{margin:0 0 10px;color:#b9bfd4}",
    ".q-offermsg{display:block;margin-top:9px;font-size:12.5px;color:#b9bfd4}",
    ".q-share{margin-top:18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}",
    ".q-share button{background:none;border:1.5px solid #e4e7f2;border-radius:10px;padding:9px 15px;",
    "font:inherit;font-size:13.5px;font-weight:600;color:#2952e0;cursor:pointer}",
    ".q-share button:hover{border-color:#2952e0;background:#eef1fe}",
    ".q-sharemsg{font-size:13px;color:#6b7280}",
    ".q-note{font-size:12px;color:#6b7280;line-height:1.6;margin:14px 0 0}"
  ].join("");

  function injectCSS() {
    if (document.getElementById("q-shared-css")) return;
    var s = document.createElement("style");
    s.id = "q-shared-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ===================================================================
     INIT

     Returns a promise that resolves once the person's prior signals — if
     any — have been read. Prototypes should render off the back of it so
     the first screen can already reflect what we know.
     =================================================================== */
  /* opts.chrome === false skips the auth strip and recall banner.

     The three original prototypes have no account layer of their own, so
     init() mounts one for them. Activities built on yns-activity.js run
     inside activity.html, which already mounts the full branded account
     bar via YNSProfile — mounting a second, simpler one on top of it is
     how you end up with two sign-in buttons that disagree. Everything
     else init() does (the activity slug, wage data, prior signals, the
     start event) is still wanted, which is why this is a flag rather
     than a separate function. */
  function init(slug, opts) {
    activity = slug || "unknown";
    injectCSS();
    opts = opts || {};

    if (opts.chrome === false) {
      track("start", {});
      var rolesOnly = loadRoles();
      if (!DB) {
        signalsLoaded = true;
        return rolesOnly.then(function () { return null; });
      }
      return Promise.all([
        rolesOnly,
        DB.signals().then(function (s) { signalsData = s; return s; }).catch(function () { return null; })
      ]).then(function (out) {
        signalsLoaded = true;
        return out[1];
      });
    }

    // Auth strip and recall banner go above the card, in the #resume
    // slot's parent, so no prototype markup has to change.
    var mount = document.getElementById("resume");
    var chrome = document.createElement("div");
    chrome.id = "q-chrome";
    if (mount && mount.parentNode) {
      mount.parentNode.insertBefore(chrome, mount);
    } else {
      document.body.insertBefore(chrome, document.body.firstChild);
    }

    var authSlot = document.createElement("div");
    var recallSlot = document.createElement("div");
    chrome.appendChild(authSlot);
    chrome.appendChild(recallSlot);

    if (DB) {
      DB.mountAuthBar(authSlot, activity);
      // Re-read signals whenever auth changes, so signing in mid-run
      // immediately turns on personalization.
      DB.onAuth(function () {
        DB.signals(true).then(function (s) {
          signalsData = s;
          recallSlot.innerHTML = recallBannerHTML();
        });
      });
    }

    track("start", {});

    // Wage data and prior signals load in parallel — neither blocks the
    // other, and the first screen waits for both so it never has to
    // re-render with different numbers underneath the person.
    var roles = loadRoles();

    if (!DB) {
      signalsLoaded = true;
      return roles.then(function () { return null; });
    }

    var signalsJob = DB.signals().then(function (s) {
      signalsData = s;
      recallSlot.innerHTML = recallBannerHTML();
      return s;
    }).catch(function () { return null; });

    return Promise.all([roles, signalsJob]).then(function (out) {
      signalsLoaded = true;
      return out[1];
    });
  }

  /* ------------------------------------------------------------ export */
  global.Quiz = {
    init: init,

    AXES: AXES,
    AXIS_KEYS: AXIS_KEYS,
    CATS: CATS,
    CAT_KEYS: CAT_KEYS,
    ROLES: ROLES,
    LEVELS: LEVELS,
    LEVEL_WORD: LEVEL_WORD,
    ARCHETYPE: ARCHETYPE,
    ARCHETYPE_LINE: ARCHETYPE_LINE,

    score: score,
    rank: rank,
    pctScaler: pctScaler,
    cosineAgainst: cosineAgainst,
    rolesFor: rolesFor,
    levelLabel: levelLabel,
    usingRealWages: usingRealWages,
    wageData: function () { return liveRoles; },

    save: save,
    load: load,
    clear: clear,
    runId: currentRunId,
    finish: finish,

    signals: signals,
    signalsReady: function () { return signalsLoaded; },
    priorLevel: priorLevel,
    priorCategories: priorCategories,
    priorActivities: priorActivities,
    continuityHTML: continuityHTML,

    track: track,
    trackStep: trackStep,
    trackComplete: trackComplete,

    wireBackToHub: wireBackToHub,
    presetLevel: presetLevel,
    wantsFresh: wantsFresh,
    emailFormHTML: emailFormHTML,
    wireEmailForm: wireEmailForm,
    shareHTML: shareHTML,
    wireShare: wireShare,
    salaryNote: salaryNote,
    escapeHTML: escapeHTML
  };
})(window);
