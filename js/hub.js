/* =====================================================================
   Mock logic. Everything below is illustrative and would be replaced by
   yns-profile.js / yns-progress.js in production.
   ===================================================================== */
(function(){
  "use strict";

  /* ---------- the three questions ---------------------------------- */
  var QUESTIONS = [
    { key:"clarity", opts:[
      { v:"none",  t:"Still figuring it out",         s:"I don't know what I want, and honestly I'm not sure where to even look." },
      { v:"rough", t:"I have a rough idea",            s:"A direction or two I keep coming back to. Nothing I'd commit to yet." },
      { v:"clear", t:"I know what I want",             s:"I've picked the thing. Now it's about actually getting there." }
    ]},
    { key:"reason", opts:[
      { v:"stuck",    t:"I feel stuck and I'm done standing still",  s:"Same shifts, same paycheck, costs going up. Something in me clicked." },
      { v:"fit",      t:"I want to find work that actually fits me", s:"I've had jobs. I want to understand what I'd be good at and enjoy." },
      { v:"job",      t:"I need a job, soon",                        s:"There's a deadline. A resume, an application, an interview coming." },
      { v:"mindset",  t:"I know the direction. My head or my money isn't there yet", s:"Confidence, follow-through, or the finances need sorting first." },
      { v:"plan",     t:"I'm ready to commit to a real plan",        s:"I want the next six months mapped out, in writing." }
    ]},
    /* This is the level question, and it is the only place it gets asked.
       The vocabulary is the one every activity already scores against —
       early, some, experienced, leader — so nothing has to be derived or
       translated, and nothing downstream asks it a second time. */
    { key:"stage", opts:[
      { v:"early",       t:"Just starting out",
        s:"First job, or first job in anything like this. No relevant experience yet, and that\u2019s fine." },
      { v:"some",        t:"A couple of years in",
        s:"You\u2019ve worked, you\u2019ve picked things up, and nobody would call you senior yet." },
      { v:"experienced", t:"Genuinely experienced",
        s:"Five years or more. You\u2019re good at what you do, you\u2019re just not sure it\u2019s the right thing." },
      { v:"leader",      t:"Running things already",
        s:"You manage people, a shift, or a whole department." }
    ]}
  ];

  /* ---------- the five doors --------------------------------------- */
  /* One illustration per door. banner-a is about-you, banner-b is
     building something, banner-c is a conversation, banner is the
     staircase everyone climbs, banner-e is the path ahead with the
     milestones still to fill in. */
  var BANNER = { know:"banner-a", explore:"banner", get:"banner-b", mind:"banner-c", plan:"banner-e" };

  var DOORS = [
    { key:"know", n:"Door 1", title:"Get to know you",
      blurb:"Start with who you are. No career words required.",
      why:"Before anyone picks a direction, it helps to know what you're actually working with: what matters to you, what you're already good at, and where your week really goes.",
      acts:["why","proof","hours168","constraints"] },
    { key:"explore", n:"Door 2", title:"Explore what's out there",
      blurb:"Try on a few futures. See which one fits.",
      why:"You have a rough shape of what you want. These help you see real options side by side, and name the kinds of work that match what you'd actually enjoy.",
      acts:["interests","cyoa","dayinlife","budget","doors","conversations"] },
    { key:"get", n:"Door 3", title:"Get the job",
      blurb:"Resume, cover letter, interview. Built from what you've already done.",
      why:"You know the direction, or you just need work now. These three run on the same raw material: things you have actually done. Start at A, or jump in wherever you need to.",
      acts:["abcs_a","abcs_b","abcs_c","conversations"] },
    { key:"mind", n:"Door 4", title:"Mindset and money",
      blurb:"Build the grit and the financial footing to follow through.",
      why:"Knowing what you want is half of it. This door works on the part nobody teaches: bouncing back when it's hard, and knowing your real numbers.",
      acts:["floor","grit","bounce","money101"] },
    { key:"plan", n:"Door 5", title:"Make the plan",
      blurb:"Six months, one SMART goal, written down.",
      why:"You're ready to commit. This door turns a direction into a plan with dates on it, and helps you spot what might knock it off course before it does.",
      acts:["smart6","premortem","stilltrue"] }
  ];

  /* ---------- activities (live registry + four proposed) ---------- */
  var ACTS = {
    why:          { name:"Your Why",             tag:"The reason underneath all of it, in your own words.", min:2, fact:"Why you're looking", tile:0, play:true },
    proof:        { name:"Proof",                tag:"Three things you're good at, with the evidence.",   min:8, fact:"Your strengths", tile:1, play:true },
    hours168:     { name:"168 Hours",            tag:"Where your week actually goes.",                    min:4, fact:"Where your time goes", tile:2, play:true },
    constraints:  { name:"Fixed or Assumed",     tag:"Which of your reasons are actually true.",          min:5, fact:"What's really fixed", tile:3, play:true },
    interests:    { name:"What Kind of Work", tag:"Thirty quick questions about what you\u2019d enjoy doing all day.", min:6, fact:"What fits you", tile:4, play:true },
    cyoa:         { name:"The Story",            tag:"Seven chapters of a life eighteen months from now.",min:5, fact:"Work that fits", tile:4, live:"apps/prototype-1-choose-your-own-adventure.html" },
    dayinlife:    { name:"A Day In The Life",    tag:"Six moments in a day you'd actually want.",         min:5, fact:"A day you'd want", tile:5, live:"apps/prototype-2-day-in-the-life.html" },
    budget:       { name:"Spend Your 100",       tag:"What you'd really pay for in a job.",               min:4, fact:"What you value in work", tile:6, live:"apps/prototype-3-budget-allocation.html" },
    doors:        { name:"Three Doors",          tag:"Every realistic route in, side by side.",           min:7, fact:"Your route in", tile:7, play:true },
    conversations:{ name:"Two Conversations",    tag:"Who to talk to, and the message already written.",  min:6, fact:"Someone to talk to", tile:8, play:true },
    /* Career ABCs is one app with three stages. The hub opens it at the
       stage she picked (#a/#b/#c) and reads real completion back out of
       its own storage, so wandering inside the app still counts. */
    abcs_a:       { name:"A · What you\u2019ve already done", tag:"Turn things you\u2019ve actually done into short stories you can use.", min:8, fact:"Your stories", tile:9, app:"a" },
    abcs_b:       { name:"B · Put it on paper",  tag:"A resume and a cover letter, built from those stories.", min:10, fact:"Resume and cover letter", tile:9, app:"b", after:"abcs_a" },
    abcs_c:       { name:"C · Say it out loud",  tag:"Interview practice, using the same stories.", min:8, fact:"Interview practice", tile:9, app:"c", after:"abcs_a" },
    floor:        { name:"The Floor",            tag:"The number you need, not the number you want.",     min:6, fact:"Your number", tile:10, play:true },
    grit:         { name:"Bounce Back",          tag:"The last time it went wrong, and what you did next.", min:6, fact:"How you recover", tile:11, play:true },
    bounce:       { name:"The Week It's Hard",   tag:"A plan for the week you want to quit.",             min:5, fact:"Your hard-week plan", tile:12, play:true },
    money101:     { name:"Money, Plainly",       tag:"Paycheck, rent, the gap. No jargon.",               min:8, fact:"Money basics", tile:13, play:true },
    smart6:       { name:"Your Six Months",      tag:"One SMART goal, with dates on it.",                 min:12, fact:"Your six-month goal", tile:14, play:true, big:true },
    premortem:    { name:"What Might Trip You Up", tag:"Find the thing most likely to knock this off course.", min:7, fact:"What could trip you", tile:15, play:true },
    stilltrue:    { name:"Still True?",          tag:"What's changed since last time, and whether it still holds.", min:4, fact:"A check-in", tile:16, play:true }
  };

  /* ---------- avatar: 17 tiles that form a head-and-shoulders -------
     Grid 12x12. Each tile has a "resolved" colour. Untaken = ghost.
     Order of tiles matches ACTS[].tile, so each activity has a piece. */
  var TILES = [
    {x:4,y:1,w:4,h:1,c:"ink"},    /* 0 hair top      */
    {x:3,y:2,w:6,h:1,c:"ink"},    /* 1 hair          */
    {x:3,y:3,w:1,h:3,c:"ink"},    /* 2 hair left     */
    {x:8,y:3,w:1,h:3,c:"ink"},    /* 3 hair right    */
    {x:4,y:3,w:4,h:1,c:"skin"},   /* 4 forehead      */
    {x:4,y:4,w:1,h:2,c:"skin"},   /* 5 cheek L       */
    {x:7,y:4,w:1,h:2,c:"skin"},   /* 6 cheek R       */
    {x:5,y:4,w:2,h:1,c:"skin2"},  /* 7 eyes line     */
    {x:5,y:5,w:2,h:1,c:"skin"},   /* 8 nose/mouth    */
    {x:4,y:6,w:4,h:1,c:"skin2"},  /* 9 chin          */
    {x:5,y:7,w:2,h:1,c:"skin"},   /* 10 neck         */
    {x:2,y:8,w:3,h:1,c:"blue"},   /* 11 shoulder L   */
    {x:7,y:8,w:3,h:1,c:"blue"},   /* 12 shoulder R   */
    {x:1,y:9,w:10,h:1,c:"blue"},  /* 13 chest        */
    {x:1,y:10,w:10,h:2,c:"deep"}, /* 14 torso        */
    {x:5,y:8,w:2,h:1,c:"gold"},   /* 15 collar/pin   */
    {x:0,y:10,w:1,h:2,c:"deep"}   /* 16 arm L        */
  ];

  /* ---------- avatar catalogue ---------------------------------------
     Production: drop Nano Banana PNGs at avatars/<body>-<tone>.png (one
     finished portrait per combination, 15 files). The stages 1→6 are CSS
     filters on that one image, so no per-stage art is needed. If the
     file is missing the inline SVG cartoon below stands in. */
  var BODIES = [ {k:"f",t:"Feminine"}, {k:"m",t:"Masculine"}, {k:"n",t:"Either / neither"} ];
  var TONES  = [ {k:"1",hex:"#F7D7C4"}, {k:"2",hex:"#E8B894"}, {k:"3",hex:"#C68B5C"}, {k:"4",hex:"#9A5F3A"}, {k:"5",hex:"#5C3A21"} ];
  var HAIR   = { f:"#2B1D14", m:"#1C1A2E", n:"#3B2A1E" };
  function cartoonSVG(body, tone){
    var skin=(TONES.filter(function(t){return t.k===tone;})[0]||TONES[2]).hex, hair=HAIR[body]||"#222";
    var hairShape = body==="f" ? '<path d="M22 44c0-20 12-30 28-30s28 10 28 30v20c-6-4-8-14-8-22-8 6-20 6-28 0-4 8-6 18-12 22z"/>'
                   : body==="m" ? '<path d="M24 40c0-14 12-24 26-24s26 10 26 24v6H24z"/>'
                   : '<path d="M22 42c0-18 12-28 28-28s28 10 28 28v8c-4-4-6-10-6-16-8 8-24 8-36 0 0 6-2 12-6 16z"/>';
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      +'<circle cx="50" cy="50" r="50" fill="#E8E6E6"/>'
      +'<path d="M18 100c2-22 14-30 32-30s30 8 32 30z" fill="#0057E1"/>'
      +'<rect x="41" y="60" width="18" height="14" rx="4" fill="'+skin+'"/>'
      +'<ellipse cx="50" cy="46" rx="20" ry="24" fill="'+skin+'"/>'
      +'<g fill="'+hair+'">'+hairShape+'</g>'
      +'<circle cx="42" cy="48" r="2.2" fill="#14203A"/><circle cx="58" cy="48" r="2.2" fill="#14203A"/>'
      +'<path d="M44 58q6 5 12 0" stroke="#14203A" stroke-width="2" fill="none" stroke-linecap="round"/>'
      +'<rect x="46" y="76" width="8" height="5" fill="#E1CC00"/>'
      +'</svg>';
  }
  function artFor(body,tone){
    var img=new Image(); var src="avatars/"+body+"-"+tone+".png";
    var wrap=document.createElement("div"); wrap.innerHTML=cartoonSVG(body,tone);
    img.alt=""; img.onload=function(){ wrap.innerHTML=""; wrap.appendChild(img); };
    img.src=src; return wrap;
  }

  /* ---------- what the character says (sample facts for the demo) ----
     Production: each line reads a real fact key from the profile. The
     lead-in is fixed per key; the quote is the person's own words. */
  var SAYS = {
    why:          { lead:"The reason I'm doing this:",        say:"\u201cBecause I want to stop dreading Sunday nights.\u201d", key:"why_statement" },
    proof:        { lead:"Something I'm good at:",             say:"Staying calm when a customer is losing it. I've got the evidence.", key:"strengths" },
    hours168:     { lead:"Where my week goes:",                say:"Work takes 38 hours. Scrolling takes 19. That one surprised me.", key:"time_drain" },
    constraints:  { lead:"One thing I thought was fixed:",     say:"\u201cI can't go back to school.\u201d Turns out that one was assumed.", key:"constraints_assumed" },
    cyoa:         { lead:"Work that fits the life I picked:",  say:"Health & Care came out on top. Didn't expect that.", key:"top_category" },
    dayinlife:    { lead:"A day I'd actually want:",           say:"Up early, on my feet, home by four. No inbox.", key:"top_category" },
    budget:       { lead:"What I'd pay for in a job:",         say:"Stability first, then flexibility. Pay ceiling came third.", key:"value_ranking" },
    doors:        { lead:"My route in:",                       say:"Certificate program. Eighteen months, and I keep my job.", key:"route_preference" },
    conversations:{ lead:"Someone I'm going to talk to:",      say:"My cousin's friend who does medical assisting. Message is written.", key:"contact_named" },
    abcs_a:       { lead:"Something I\u2019ve actually done:",  say:"Covered a double shift when we were two people down, and the night still ran.", key:"" },
    abcs_b:       { lead:"Ready to send:",                     say:"A resume and a cover letter, built from my own stories.", key:"" },
    abcs_c:       { lead:"I\u2019ve practised out loud:",       say:"Three answers, in my own words, with the clock running.", key:"" },
    floor:        { lead:"My number:",                         say:"$2,900 a month keeps the lights on. Everything above that is choice.", key:"floor_monthly" },
    grit:         { lead:"The last time it went wrong:",       say:"I got passed over for shift lead. I asked why, and I'm still here.", key:"setback_response" },
    bounce:       { lead:"My plan for the hard week:",         say:"Text Jordan, do the smallest step, no big decisions before Friday.", key:"hard_week_plan" },
    money101:     { lead:"Money, plainly:",                    say:"After rent and the car, $410 a month is actually mine to decide on.", key:"money_left" },
    smart6:       { lead:"My next six months:",                say:"Enrolled in the CMA certificate by March, first clinical shift by August.", key:"smart_goal" },
    premortem:    { lead:"What might trip me up:",             say:"Money running out around month four. So I'm planning for month three.", key:"premortem_risk" },
    stilltrue:    { lead:"Still true?",                        say:"Checked back. The why hasn't moved. The route changed a little.", key:"" }
  };

  /* Tile reveal order: bottom-left to top-right, diagonal by diagonal,
     the same direction the staircase in the logo climbs. 36 tiles. */
  var REVEAL_ORDER=(function(){ var G=6, out=[]; for (var d=0; d<=2*(G-1); d++){ for (var x=0;x<G;x++){ var y=(G-1)-(d-x); if (y>=0&&y<G) out.push([x,y]); } } return out; })();

  /* ---------- state ------------------------------------------------- */
  var state = { a:[null,null,null], q:0, done:{}, door:null, skipped:false, body:"n", tone:"3", facts: window.YNSMock.facts, opened:{}, aside:{}, asideAct:{}, offerAnswered:false, evidence:[] };
  var $ = function(id){ return document.getElementById(id); };
  window.YNS = window.YNS || {};

  /* ---------- routing ----------------------------------------------
     Ordered rules. First match wins. This is the whole "starting door"
     decision and the thing to argue about. */
  function route(a){
    var clarity=a[0], reason=a[1];
    if (reason==="job")                     return "get";
    if (reason==="plan"  && clarity==="clear") return "plan";
    if (reason==="mindset")                 return "mind";
    if (clarity==="none")                   return "know";
    if (clarity==="rough")                  return "explore";
    if (clarity==="clear")                  return reason==="plan" ? "plan" : "get";
    return "know";
  }
  function routeReason(a){
    var clarity=a[0], reason=a[1], stage=a[2];
    var st = {
      early:"you're near the start of it",
      some:"you've got a couple of years behind you",
      experienced:"you've got real experience behind you",
      leader:"you're already running things"
    }[stage] || "you're where you are";
    var map = {
      know:    "You said you're still figuring it out, and "+st+". So we start with you, before any of the career stuff. Two or three of these and the picture starts to show.",
      explore: "You said you've got a rough idea, and "+st+". These let you try the idea on before you commit to it.",
      get:     "You said you need a job soon, and "+st+". That's a deadline, so we skip the philosophy and build the thing you'll actually send.",
      mind:    "You know the direction. You said the part that isn't ready is your head or your money, and "+st+". That's the most honest thing anyone says here, and it's exactly what this door is for.",
      plan:    "You know what you want and you're ready to commit. "+st.charAt(0).toUpperCase()+st.slice(1)+", so the plan should fit that. Let's put dates on it."
    };
    return map[route(a)];
  }

  /* ---------- intake render ----------------------------------------- */
  function renderPicker(){
    var b=$("pickBody"); b.innerHTML="";
    BODIES.forEach(function(o){
      var el=document.createElement("button"); el.type="button"; el.className="pbody"; el.setAttribute("role","radio");
      el.setAttribute("aria-checked", state.body===o.k?"true":"false");
      el.setAttribute('aria-label','Character option '+(BODIES.indexOf(o)+1)); el.appendChild(artFor(o.k,state.tone));
      el.onclick=function(){ state.body=o.k; renderPicker(); };
      b.appendChild(el);
    });
    var t=$("pickTone"); t.innerHTML="";
    TONES.forEach(function(o){
      var el=document.createElement("button"); el.type="button"; el.className="ptone"; el.setAttribute("role","radio");
      el.setAttribute("aria-label","Skin tone "+o.k); el.style.background=o.hex;
      el.setAttribute("aria-checked", state.tone===o.k?"true":"false");
      el.onclick=function(){ state.tone=o.k; renderPicker(); };
      t.appendChild(el);
    });
    /* One small version of the real thing, so the pick feels like a
       choice about the page rather than an avatar for its own sake. */
    var pv=$("pickPreview");
    function mini(label){
      return '<figure class="mini"><div class="mini-card"><span class="mini-art"><img src="avatars/'+state.body+"-"+state.tone+'.png" alt=""></span></div><figcaption>'+label+'</figcaption></figure>';
    }
    pv.innerHTML = mini("This is you on the page");
  }
  function renderQ(i){
    var host=$("q"+i); host.innerHTML="";
    QUESTIONS[i-1].opts.forEach(function(o){
      var b=document.createElement("button");
      b.className="opt"; b.type="button"; b.setAttribute("role","radio");
      b.setAttribute("aria-checked", state.a[i-1]===o.v ? "true":"false");
      b.innerHTML='<i class="dot"></i><div><strong>'+o.t+'</strong><span>'+o.s+'</span></div>';
      b.onclick=function(){ state.a[i-1]=o.v; renderQ(i); $("nextBtn").disabled=false; };
      host.appendChild(b);
    });
  }
  function showQ(i){
    state.q=i;
    document.querySelectorAll(".q").forEach(function(el,k){ el.classList.toggle("is-on",k===i); });
    for (var k=0;k<4;k++){ var s=$("st"+k); s.className = k<i?"done":(k===i?"now":""); }
    $("backBtn").style.display = i>0?"":"none";
    $("nextBtn").disabled = i>0 && !state.a[i-1];
    $("nextBtn").textContent = i===3 ? "Show me where to start" : (i===0 ? "That's me" : "Next");
    window.scrollTo({top:0});
  }

  /* ---------- one direction, built from many signals -----------------

     Five activities in Door 2 ask overlapping questions in different
     ways, and each one used to write `top_category` outright. Whoever
     finished last won, so the hub could tell someone Health & Care on
     Tuesday and Finance & Data on Wednesday from the same person's
     answers. That is the contradiction.

     Now nothing writes the answer. Each activity files *evidence*: a
     ranked list of categories plus how much that instrument is worth.
     One resolver adds it up. Doing another activity refines the picture
     rather than replacing it, which is what asking the same thing five
     ways is supposed to buy.

     Weights are a judgement about instrument strength, not importance:

       interests   3   thirty items, five per interest area. The most
                       direct measurement of the thing being measured.
       cyoa        2   a narrative of the life you'd want, which is real
                       evidence and also a mood on the night.
       dayinlife   2   same shape, different slice.
       budget      1   measures what you value in work more than which
                       field, so it gets a light touch on category.

     Re-taking an activity replaces that activity's evidence rather than
     adding a second vote. */
  var SOURCE_WEIGHT = { interests: 3, cyoa: 2, dayinlife: 2, budget: 1 };

  function addEvidence(source, ranked){
    if (!ranked || !ranked.length) return;
    state.evidence = (state.evidence || []).filter(function(e){ return e.source !== source; });
    state.evidence.push({ source: source, ranked: ranked.slice(0, 5), w: SOURCE_WEIGHT[source] || 1 });
    resolveDirection();
  }

  /* Points down the ranking: first place 3, second 2, third 1. Times the
     weight of the instrument that said it. */
  function resolveDirection(){
    var ev = state.evidence || [];
    if (!ev.length) return;
    var score = {};
    ev.forEach(function(e){
      e.ranked.forEach(function(cat, i){
        var pts = [3, 2, 1][i] || 0;
        if (pts) score[cat] = (score[cat] || 0) + pts * e.w;
      });
    });
    var ranked = Object.keys(score).sort(function(a,b){ return score[b]-score[a]; });
    state.facts.category_ranking = ranked;
    /* Only claim a direction when the top two actually separate. A tie
       is a real result and saying so is more use than picking. */
    if (ranked.length > 1 && score[ranked[0]] === score[ranked[1]]) delete state.facts.top_category;
    else state.facts.top_category = ranked[0];
    state.facts.signal_count = ev.length;
    /* Do the instruments agree on first place? */
    var firsts = {};
    ev.forEach(function(e){ firsts[e.ranked[0]] = (firsts[e.ranked[0]]||0)+1; });
    state.facts.signals_agree = Object.keys(firsts).length === 1;
    state.direction = { score: score, ranked: ranked, firsts: firsts };
  }

  /* ---------- Career ABCs, opened at a stage ------------------------ */
  var ABCS_URL="apps/career-abcs_v2.html", ABCS_KEY="yns.abcs.v1";
  function abcsState(){
    try { var raw=localStorage.getItem(ABCS_KEY); return raw ? JSON.parse(raw) : null; } catch(e){ return null; }
  }
  /* Completion comes from her actual work, never from "opened the card".
     These three reads are the contract between the hub and the app; if
     the app's state shape changes, this is the thing to update. */
  function abcsDone(){
    var st=abcsState(); if (!st) return {};
    var about=st.about||{}, build=st.build||{}, carry=st.carry||{};
    var stories=(about.stories||[]).length;
    var bullets=(build.experience||[]).some(function(e){ return (e.bullets||e.bulletIds||[]).length; });
    return {
      abcs_a: stories>0,
      abcs_b: !!(build.cover || bullets || build.summary),
      abcs_c: (carry.practice||[]).length>0
    };
  }
  function syncAbcs(){
    var d=abcsDone(), changed=false;
    Object.keys(d).forEach(function(k){ if (d[k] && !state.done[k]) { state.done[k]=true; lastAdded=k; changed=true; } });
    return changed;
  }

  /* ---------- the standalone apps, in an iframe --------------------- */
  var appOpen=null, uploadWatch=null, appRunBaseline=0;
  /* Asked once, in the intake, in the vocabulary the activities score
     against. Nothing derives it and nothing re-asks it. If someone skips
     the intake entirely, the first activity that needs it asks, and the
     hub picks the answer up from the run. */
  function levelKnown(){ return state.a[2] || state.facts.level || null; }
  function withLevel(url){ var l=levelKnown(); return l ? url+(url.indexOf("?")<0?"?":"&")+"lvl="+l : url; }
  function openApp(slug, url, name, opts){
    opts=opts||{};
    appOpen=slug; appRunBaseline=runsFor(slug).length;
    var m=$("actModal"); m.style.display="block"; document.body.classList.add("modal-open");
    m.innerHTML='<div class="am-card am-frame"><div class="am-top"><span class="am-eyebrow">'+name+'</span><span class="small muted">Close when you\u2019re done. Everything saves as you go.</span><button class="am-x" onclick="YNS.closeApp()" aria-label="Back to your hub">\u00d7 Back to your hub</button></div><iframe src="'+url+'" title="'+name+'"></iframe></div>';
    if (opts.upload){
      /* The app already has a proper document importer: PDF, DOC, DOCX,
         TXT, 8MB cap, and it pulls the jobs and bullets out into stories.
         It sits on the app's home screen, which is reached after its own
         welcome, so this waits for the button rather than assuming it is
         there. Same origin, so this is a click and not a fork of the app.
         Cleared when the panel closes. */
      var frame=m.querySelector("iframe"), fired=false;
      uploadWatch=setInterval(function(){
        if (fired) return;
        try {
          var btn=frame.contentDocument && frame.contentDocument.querySelector('[data-act="upload"]');
          if (btn){ fired=true; btn.click(); clearInterval(uploadWatch); uploadWatch=null; }
        } catch(e){}
      },200);
    }
  }
  function readRuns(){
    try { var q=JSON.parse(localStorage.getItem("yns_pending_runs")||"[]"); return Array.isArray(q)?q:[]; } catch(e){ return []; }
  }
  function runsFor(slug){
    return readRuns().filter(function(r){ return r.activity===slug && r.status!=="in_progress"; });
  }
  /* Only a run finished during this open counts. Reading the queue alone
     would mark an activity done again every time it was opened and
     closed, because a run from an earlier visit is still sitting there. */
  function absorbRun(slug){
    var runs=runsFor(slug);
    if (runs.length <= appRunBaseline) return false;
    var last=runs[runs.length-1]; if (!last) return false;
    if (last.top_categories && last.top_categories.length) addEvidence(slug, last.top_categories);
    if (last.level && !state.facts.level) state.facts.level=last.level;
    return true;
  }
  window.addEventListener("message", function(ev){
    if (!ev.data || !appOpen) return;
    if (ev.data.yns==="run"){ if (absorbRun(appOpen) && !state.done[appOpen]) { state.done[appOpen]=true; lastAdded=appOpen; render(); } }
    /* The activity finished and asked to come back. One set of
       navigation rather than two. */
    if (ev.data.yns==="close") YNS.closeApp();
  });
  YNS.closeApp=function(){
    var slug=appOpen; appOpen=null; if (uploadWatch){ clearInterval(uploadWatch); uploadWatch=null; }
    $("actModal").style.display="none"; $("actModal").innerHTML=""; document.body.classList.remove("modal-open");
    if (!slug) return;
    if (ACTS[slug] && ACTS[slug].app){
      var before=Object.keys(state.done).length;
      syncAbcs();
      toast(Object.keys(state.done).length>before ? "Nice work. That\u2019s saved." : "Nothing lost. Pick it up whenever you like.");
      render(); return;
    }
    var had=absorbRun(slug);
    if (had) { if (!state.done[slug]) { state.done[slug]=true; lastAdded=slug; toast("Nice work. That\u2019s "+ACTS[slug].name+" done."); } }
    else toast("No problem, nothing lost. "+ACTS[slug].name+" is there whenever you want it.");
    render();
  };

  /* ---------- hub render -------------------------------------------- */
  function doneCount(){ return Object.keys(state.done).length; }
  function live(d){ return d.acts.filter(function(s){ return !ACTS[s].soon; }); }
  function doorDone(d){ return live(d).filter(function(s){ return state.done[s]; }).length; }
  function doorOpen(d){ return !!state.opened[d.key] || doorDone(d)>0; }
  function doorAside(d){
    if (state.aside[d.key]) return true;
    var l=live(d); return l.length>0 && l.every(function(s){ return state.asideAct[s]; }) && doorDone(d)===0;
  }
  function doorState(d){ return doorOpen(d) ? "open" : doorAside(d) ? "aside" : "untouched"; }
  function nextIn(d){ return live(d).filter(function(s){ return !state.done[s] && !state.asideAct[s]; })[0]; }

  /* Which untouched doors the person's own answers say they do not need. This is
     the only thing that decides whether the offer is shown, and it is
     read off the three questions rather than guessed from behaviour. */
  function notNeeded(){
    var clarity=state.a[0], reason=state.a[1], out=[];
    if (clarity==="clear"){ out.push("know"); if (reason!=="fit") out.push("explore"); }
    if (reason==="job" && clarity!=="none" && out.indexOf("explore")<0) out.push("explore");
    return out.filter(function(k){ var d=byKey(k); return doorState(d)==="untouched"; });
  }
  function byKey(k){ return DOORS.filter(function(d){return d.key===k;})[0]; }
  function offerDue(){ return !state.offerAnswered && doneCount()>=1 && notNeeded().length>0; }
  function doorProgress(d){ var n=0; d.acts.forEach(function(s){ if(state.done[s]) n++; }); return {n:n,of:d.acts.length}; }

  var bubbleTimer=null, bubbleIdx=0, lastAdded=null;
  function renderAvatar(){
    var n=doneCount(), total=Object.keys(ACTS).filter(function(k){ return !ACTS[k].soon; }).length;

    /* The portrait, and nothing else. An earlier version drew a small
       illustration around it for every finished activity; it crowded the
       character and pulled attention away from what she actually said,
       which is the speech bubble next to it. */
    var art=$("avatarArt");
    if (art.getAttribute("data-key")!==state.body+state.tone){
      art.innerHTML=""; art.appendChild(artFor(state.body,state.tone)); art.setAttribute("data-key",state.body+state.tone);
    }

    var fr=n/total;
    var cap = n===0 ? "Nothing here yet, and that\u2019s exactly where everyone starts."
            : fr<.35 ? "Look at that, you\u2019re getting going."
            : fr<.7  ? "You\u2019ve told us a lot about yourself."
            : n<total ? "Nearly all of it, and every bit is in your own words."
            : "That\u2019s everything. You did all of it.";
    $("avatarCaption").textContent=(n?n+" of "+total+" \u00b7 ":"")+cap;
    $("heroH1").textContent = n===0 ? "What should you do with your life?" : fr<.7 ? "You\u2019re getting somewhere." : "Look at what you\u2019ve built.";
    renderBubble();
  }

  var WHO = { me:"me", kids:"my kids", family:"my family", partner:"my partner", someone_specific:"one person in particular", community:"people like me" };
  function catLabel(k){ var T=window.YNSTaxonomy; return (T&&k)?T.label(k):k; }
  var REAL = {
    interests:    function(f){ return f.interest_top ? {lead:"What I\u2019d actually enjoy:", say:f.interest_top} : null; },
    cyoa:         function(f){ return f.top_category ? {lead:"Work that fits the life I picked:", say:catLabel(f.top_category)+" came out on top."} : null; },
    dayinlife:    function(f){ return f.top_category ? {lead:"A day I'd actually want:", say:"The one that points at "+catLabel(f.top_category)+"."} : null; },
    budget:       function(f){ return f.top_category ? {lead:"What I'd pay for in a job:", say:"My hundred pointed at "+catLabel(f.top_category)+"."} : null; },
    why:          function(f){ return f.why_statement ? {lead:"The reason I'm doing this:", say:"\u201c"+f.why_statement+"\u201d"+(WHO[f.why_who]?" Mostly for "+WHO[f.why_who]+".":"")} : null; },
    proof:        function(f){ var s=Array.isArray(f.strengths)&&f.strengths[0]; return s&&s.moment ? {lead:"Something I'm good at:", say:s.moment} : null; },
    hours168:     function(f){ var D={commute:"the commute",work:"the job itself",chores:"keeping life running",none:"nothing, the week's the wrong shape"}, P={evenings:"my evenings",weekends:"my weekends",sleep:"sleep",own_time:"the one thing that's mine",flexible:"most of it, for the right thing"}; return f.time_drain ? {lead:"Where my week goes:", say:"I'd take hours back from "+(D[f.time_drain]||f.time_drain)+"."+(P[f.time_protected]?" I won't give up "+P[f.time_protected]+".":"")} : null; },
    constraints:  function(f){ var n=Array.isArray(f.constraints_assumed)?f.constraints_assumed.length:0; return f.constraints_fixed ? {lead:"What I thought was fixed:", say: n ? n+" of my reasons are worth questioning. I'm going to check one." : "All of them are real. I'll plan around them."} : null; },
    floor:        function(f){ return f.floor_monthly ? {lead:"My number:", say:"$"+f.floor_monthly.toLocaleString("en-US")+" a month keeps the lights on."} : null; },
    doors:        function(f){ var R={apprenticeship:"an apprenticeship",certificate:"a certificate program",lateral:"getting in sideways and working up",degree:"a degree",self_taught:"teaching myself and building a portfolio"}; return f.route_preference ? {lead:"My route in:", say:(R[f.route_preference]||f.route_preference)+"."} : null; },
    conversations:function(f){ return f.contact_named ? {lead:"Someone I'm going to talk to:", say:"I've got a name and the message is written."} : (f.contact_named===false ? {lead:"Someone I'm going to talk to:", say:"Still need a name. The message is ready."} : null); },
    premortem:    function(f){ var R={money:"the money running out",support:"not enough support at home",stamina:"running out of steam",fit:"the work not being what I pictured",luck:"something outside my control"}; return f.premortem_risk ? {lead:"What might trip me up:", say:(R[f.premortem_risk]||f.premortem_risk)+". So I'm planning for it."} : null; },
    grit:     function(f){ return f.setback_story ? {lead:"The last time it went wrong:", say:"\u201c"+f.setback_story+"\u201d"} : null; },
    bounce:   function(f){ return f.hard_week_plan ? {lead:"My plan for the hard week:", say:f.hard_week_plan.split("\n")[0]} : null; },
    money101: function(f){ if(!f.money_in) return null; var fx=f.money_fixed||f.floor_monthly||0, l=f.money_in-fx; return {lead:"Money, plainly:", say: l>=0 ? "$"+l.toLocaleString("en-US")+" a month is mine to decide on." : "I'm $"+(-l).toLocaleString("en-US")+" short a month. Now I know."}; },
    smart6:   function(f){ return f.smart_goal ? {lead:"My next six months:", say:"\u201c"+f.smart_goal+"\u201d"} : null; }
  };
  function bubbleLines(){
    var lines=[]; Object.keys(ACTS).forEach(function(s){ if(!state.done[s]) return; var real=REAL[s]&&REAL[s](state.facts); if (real) lines.push(real); else if (SAYS[s]) lines.push(SAYS[s]); });
    return lines;
  }
  function renderBubble(){
    var lines=bubbleLines(); clearTimeout(bubbleTimer);
    var lead=$("bubbleLead"), say=$("bubbleSay"), dots=$("bubbleDots");
    if (!lines.length){ lead.textContent=""; say.textContent="We're just getting started. Finish one activity and I'll update it here."; dots.innerHTML=""; return; }
    if (bubbleIdx>=lines.length) bubbleIdx=0;
    var l=lines[bubbleIdx];
    say.classList.add("fade");
    setTimeout(function(){ lead.textContent=l.lead; say.textContent=l.say; say.classList.remove("fade"); },200);
    dots.innerHTML=lines.map(function(_,i){ return '<i class="'+(i===bubbleIdx?"on":"")+'"></i>'; }).join("");
    if (lines.length>1) bubbleTimer=setTimeout(function(){ bubbleIdx=(bubbleIdx+1)%lines.length; renderBubble(); },4200);
  }

  function actCard(slug, door){
    var a=ACTS[slug]; var done=!!state.done[slug], aside=!!state.asideAct[slug];
    var el=document.createElement("div");
    el.className="act"+(done?" done":"")+(a.soon?" soon":"")+(aside?" aside":"");
    el.innerHTML='<span class="mark" aria-hidden="true"></span><h3>'+a.name+'</h3><p>'+a.tag+'</p>'
      +(a.after && !state.done[a.after] ? '<p class="after">Works best after A, and it pulls your stories in for you.</p>' : '')
      +'<div class="meta"><span>'+a.min+' min</span>'+(a.soon?'<span class="tag gold">Coming soon</span>':'')+((a.play||a.live)&&!aside?'<span class="tag gold">Play it here</span>':'')+(a.big?'<span class="tag">Bigger one</span>':'')+'</div>';
    if (!a.soon){
      var link=document.createElement("button"); link.type="button"; link.className="notme";
      link.textContent = done ? "Do it again" : aside ? "Bring it back" : "Not for me right now";
      link.onclick=function(ev){ ev.stopPropagation();
        if (done) { if (a.app) openApp(slug, ABCS_URL+"#"+a.app, a.name); else if (a.play) window.YNSMock.play(slug); else if (a.live) openApp(slug,withLevel(a.live),a.name); return; }
        state.asideAct[slug]=!aside; render();
      };
      el.appendChild(link);
    }
    /* Stage A offers the other way in: bring in a resume or cover letter
       you already have, and it becomes stories rather than a blank page. */
    if (slug==="abcs_a" && !aside){
      var up=document.createElement("button"); up.type="button"; up.className="bringin";
      up.textContent="Already have a resume or cover letter? Bring it in";
      up.onclick=function(ev){ ev.stopPropagation(); openApp(slug, ABCS_URL+"#home", ACTS[slug].name, {upload:true}); };
      el.appendChild(up);
    }
    if (!a.soon && !aside && !done){
      el.onclick=function(){ if (a.app) openApp(slug, ABCS_URL+"#"+a.app, a.name); else if (a.play) window.YNSMock.play(slug); else if (a.live) openApp(slug,withLevel(a.live),a.name); else toggle(slug); };
      el.style.cursor="pointer"; el.tabIndex=0;
      el.onkeydown=function(ev){ if(ev.key==="Enter"||ev.key===" "){ ev.preventDefault(); el.onclick(); } };
    }
    if (a.soon) el.title="Proposed for this door. Not built yet.";
    return el;
  }

  function renderDoor(){
    var d=DOORS.filter(function(x){return x.key===state.door;})[0];
    var host=$("doorPanel");
    var p=doorProgress(d);
    var eyebrow = state.skipped ? "A good place to start" : "Your starting door";
    var because = state.skipped
      ? "You haven't answered the questions yet, so we've opened the door most people start at. Answer them whenever you like and we'll point you somewhere that fits you better."
      : routeReason(state.a);
    var offer="";
    if (offerDue()){
      var names=notNeeded().map(function(k){ return byKey(k).title; });
      offer='<div class="offer"><svg viewBox="0 0 20 20" fill="none" stroke="#6B5F00" stroke-width="1.6"><circle cx="10" cy="10" r="8"/><path d="M10 9v5M10 6.5v.5"/></svg><div>'
        +'<p><b>You already know what you want, so let\u2019s not waste your time.</b> '+(names.length>1?names.join(" and ")+" are":names[0]+" is")+' built for people still working that out. Shall we set '+(names.length>1?"them":"it")+' aside for now? '+(names.length>1?"They\u2019ll be":"It\u2019ll be")+' right here if you ever want '+(names.length>1?"them":"it")+'.</p>'
        +'<div class="offer-acts"><button class="btn btn-ghost" onclick="YNS.acceptOffer()">Yes, set '+(names.length>1?"them":"it")+' aside</button><button class="btn-quiet" onclick="YNS.declineOffer()">I\u2019d rather keep '+(names.length>1?"them":"it")+'</button></div></div></div>';
    }
    var nd=doorDone(d), nl=live(d).length;
    host.innerHTML='<img class="door-banner" src="assets/banners/'+(BANNER[d.key]||"banner")+'.webp" alt="">'
      +'<div class="eyebrow">'+eyebrow+' · '+d.n+'</div><h2>'+d.title+'</h2><p class="why">'+d.why+'</p>'
      +'<div class="because"><svg viewBox="0 0 20 20" fill="none" stroke="#2859B6" stroke-width="1.6"><circle cx="10" cy="10" r="8"/><path d="M10 9v5M10 6.5v.5"/></svg><span><b>Why this door:</b> '+because+'</span></div>'
      +offer
      +'<div class="acts" id="doorActs"></div>'
      +'<div class="door-foot"><span class="small muted">'+nd+' of '+nl+' done here.</span>'
      +(nd===nl&&nl?'<span class="tag gold">That\u2019s the whole door. Really well done.</span>':'')+'</div>';
    var acts=$("doorActs"); d.acts.forEach(function(s){ acts.appendChild(actCard(s,d)); });
    state.opened[d.key]=true;
  }

  function renderGrid(){
    var g=$("doorGrid"); g.innerHTML="";
    DOORS.forEach(function(d){
      if (d.key===state.door) return;
      var st=doorState(d), nd=doorDone(d), nl=live(d).length;
      var el=document.createElement("button"); el.type="button";
      el.className="dcard"+(nd===nl&&nl?" full":"")+(st==="aside"?" aside":"");
      /* A bar only exists for a door they have opened. An untouched door
         shows nothing to be behind on. */
      var foot = st==="aside" ? '<span class="small muted">Set aside</span>'
               : st==="open" ? '<div class="prog"><i style="width:'+(nl?nd/nl*100:0)+'%"></i></div><span class="small muted">'+nd+' of '+nl+'</span>'
               : '<span class="small muted">Not opened yet</span>';
      el.innerHTML='<span class="num">'+d.n+'</span><h3>'+d.title+'</h3><p>'+d.blurb+'</p>'+foot;
      el.onclick=function(){ state.door=d.key; state.skipped=true; state.opened[d.key]=true; render(); $("doorPanel").scrollIntoView({behavior:"smooth",block:"start"}); };
      g.appendChild(el);
    });
  }

  function renderRail(){
    /* Your answers, unchanged. */
    var y=$("youSummary");
    if (state.a[0]){
      var lbl=function(i){ var o=QUESTIONS[i].opts.filter(function(x){return x.v===state.a[i];})[0]; return o?o.t:"\u2014"; };
      y.innerHTML='<div><span>Clarity</span><span>'+lbl(0)+'</span></div><div><span>Why now</span><span>'+lbl(1)+'</span></div><div><span>Work</span><span>'+lbl(2)+'</span></div>';
      $("youChip").textContent="Signed in \u00b7 "+lbl(2);
    } else {
      y.innerHTML='<div><span class="muted">You haven\u2019t answered the questions yet. Whenever you\u2019re ready.</span></div>';
    }

    /* Progress: a bar for every door they have opened, then the quiet ones.
       Nothing untouched gets a bar, so nothing untouched can look unfinished. */
    var host=$("progress"), h="";
    var open=DOORS.filter(function(d){ return doorState(d)==="open"; });
    var untouched=DOORS.filter(function(d){ return doorState(d)==="untouched"; });
    var aside=DOORS.filter(function(d){ return doorState(d)==="aside"; });

    if (!open.length) h+='<p class="small muted">Finish anything at all and it shows up here.</p>';
    open.forEach(function(d){
      var nd=doorDone(d), nl=live(d).length, nx=nextIn(d), full=nd===nl&&nl;
      h+='<div class="prog'+(full?" full":"")+'"><div class="top"><b>'+d.title+'</b><span>'+nd+' of '+nl+'</span></div>'
        +'<div class="pbar"><i style="width:'+(nl?nd/nl*100:0)+'%"></i></div>'
        +'<p class="nextline">'+(nx
            ? (nl-nd)+" left: <b>"+ACTS[nx].name+"</b>, "+ACTS[nx].min+" minutes."
            : full ? "All done here. Still True? will check in with you in a month."
            : "Everything else in here is set aside for now.")+'</p></div>';
    });

    if (untouched.length){
      h+='<div class="quiet-doors"><div class="qhead"><span>Not opened yet</span></div>'
        +untouched.map(function(d){ return '<div class="qd"><span class="nm">'+d.title+'</span><button class="lnk" onclick="YNS.asideDoor(\''+d.key+'\')">Set aside</button></div>'; }).join("")+'</div>';
    }
    if (aside.length){
      h+='<div class="quiet-doors"><div class="qhead"><span>Set aside</span><span>'+aside.length+'</span></div>'
        +aside.map(function(d){ return '<div class="qd aside"><span class="nm">'+d.title+'</span><button class="lnk" onclick="YNS.revisit(\''+d.key+'\')">Revisit</button></div>'; }).join("")+'</div>';
    }
    host.innerHTML=h;

    /* What the signals add up to. Shown only once something has been
       measured, and honest when the instruments disagree. */
    var dir = $("direction");
    if (dir) {
      var ev = state.evidence || [];
      if (!ev.length) {
        dir.innerHTML = '<p class="small muted">Do one of the Explore activities and your direction shows up here.</p>';
      } else {
        var rank = state.facts.category_ranking || [];
        var names = { interests: "What Kind of Work", cyoa: "The Story", dayinlife: "A Day In The Life", budget: "Spend Your 100" };
        var topCat = state.facts.top_category;
        var parts = [];
        parts.push(topCat
          ? '<p class="dir-top">' + catLabel(topCat) + "</p>"
          : '<p class="dir-top">Level, so far</p>');
        parts.push('<p class="small muted">' + (topCat
          ? (rank[1] ? "Then " + catLabel(rank[1]) + "." : "")
          : catLabel(rank[0]) + " and " + catLabel(rank[1]) + " are tied.") + "</p>");
        parts.push('<p class="dir-sig">' + ev.length + (ev.length === 1 ? " signal" : " signals") + ": "
          + ev.map(function (e) { return names[e.source] || e.source; }).join(", ") + ".</p>");
        if (ev.length > 1) {
          parts.push(state.facts.signals_agree
            ? '<p class="dir-note">All of them point the same way, which makes this a stronger read than any one on its own.</p>'
            : '<p class="dir-note">These do not all point the same way, and that is worth knowing rather than hiding. Each one measures something different, so the answer above is the weight of all of them together.</p>');
        }
        dir.innerHTML = parts.join("");
      }
    }


    /* All 17, closed by default, grouped by door, summarised by what they
       have done rather than what they have not. */
    var acc=$("allActs");
    acc.innerHTML=DOORS.map(function(d){
      var nd=doorDone(d), nl=live(d).length, st=doorState(d);
      var label = st==="aside" ? "Set aside" : nd===nl&&nl ? "All "+nd+" done" : nd ? nd+" done" : "Nothing yet";
      return '<details><summary><span class="car">\u203a</span><span class="nm">'+d.title+'</span><span class="st">'+label+'</span></summary><div class="accbody">'
        + d.acts.map(function(s){
            var a=ACTS[s], cls = state.done[s] ? "done" : (state.asideAct[s]||st==="aside") ? "aside" : "";
            return '<div class="arow '+cls+'"><span class="dot"></span><span class="nm">'+a.name+'</span><span class="mins">'+(a.soon?"soon":a.min+" min")+'</span></div>';
          }).join("")
        + '</div></details>';
    }).join("");
  }

  function render(){ renderAvatar(); renderDoor(); renderGrid(); renderRail(); }

  function toggle(slug){
    if (state.done[slug]) delete state.done[slug]; else state.done[slug]=true;
    bubbleIdx=Math.max(0,bubbleLines().length-1);
    render();
    if (state.done[slug]) toast("Done: "+ACTS[slug].name+". A little clearer.");
  }

  var tt;
  function toast(msg){ var t=$("toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(tt); tt=setTimeout(function(){t.classList.remove("show");},2200); }

  function show(screen){
    $("screenIntake").classList.toggle("is-on",screen==="intake");
    $("screenHub").classList.toggle("is-on",screen==="hub");
    window.scrollTo({top:0});
  }

  /* ---------- public ------------------------------------------------ */
  Object.assign(window.YNS, {
    next: function(){ if (state.q<3) showQ(state.q+1); else {
      if (state.a[2]) state.facts.level=state.a[2]; state.door=route(state.a); state.skipped=false; render(); show("hub"); } },
    back: function(){ showQ(state.q-1); },
    skip: function(){ state.skipped=true; state.door="know"; render(); show("hub"); },
    retake: function(){ state.a=[null,null,null]; renderPicker(); renderQ(1);renderQ(2);renderQ(3); showQ(1); show("intake"); },
    pickAvatar: function(){ renderPicker(); showQ(0); show("intake"); },
    /* Review build only: mark activities done without playing them, so
       the team can see the scene fill. Remove with the demo strip. */
    demoFill: function(list){ (list||Object.keys(ACTS)).forEach(function(k){ if(!ACTS[k].soon) state.done[k]=true; }); render(); },
    acceptOffer: function(){ notNeeded().forEach(function(k){ state.aside[k]=true; }); state.offerAnswered=true; render(); toast("Done. They're in the panel on the right whenever you want them."); },
    declineOffer: function(){ state.offerAnswered=true; render(); },
    asideDoor: function(k){ state.aside[k]=true; render(); },
    revisit: function(k){ delete state.aside[k]; byKey(k).acts.forEach(function(s){ delete state.asideAct[s]; }); render(); toast("Welcome back to "+byKey(k).title+"."); },
    reset: function(){ state={a:[null,null,null],q:0,done:{},door:null,skipped:false,body:"n",tone:"3",facts:window.YNSMock.facts,opened:{},aside:{},asideAct:{},offerAnswered:false,evidence:[]}; Object.keys(state.facts).forEach(function(k){ delete state.facts[k]; }); $("youChip").textContent="Not signed in"; renderPicker(); showQ(0); show("intake"); }
  });

  window.YNSHub = { addEvidence: addEvidence };
  window.YNSMock.mount($("actModal"), function(slug){ state.done[slug]=true; lastAdded=slug; bubbleIdx=Math.max(0,bubbleLines().length-1); render(); toast("Nice work. That\u2019s "+ACTS[slug].name+" done."); });
  renderPicker(); renderQ(1); renderQ(2); renderQ(3); showQ(0);
})();