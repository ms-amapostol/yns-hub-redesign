/* =====================================================================
   Mock logic. Everything below is illustrative and would be replaced by
   yns-profile.js / yns-progress.js in production.
   ===================================================================== */
(function(){
  "use strict";

  /* ---------- the three questions ---------------------------------- */
  var QUESTIONS = [
    { key:"clarity", opts:[
      { v:"none",  t:"Still figuring it out",         s:"I don't know what I want, and I'm not sure where to look yet." },
      { v:"rough", t:"I have a rough idea",            s:"A direction or two I keep coming back to. Nothing I'd commit to yet." },
      { v:"clear", t:"I know what I want",             s:"I've picked the thing. Now it's about actually getting there." }
    ]},
    { key:"reason", opts:[
      /* First, because the people arriving through a college or a program
         have not stalled; they have chosen. The site should not presume a
         crisis before it has asked. Everyone else still gets their own
         language in the options below. */
      { v:"enrolled", t:"I'm in a program and want to make the most of it", s:"College, a certificate, an apprenticeship. Already moving. Want to move well." },
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
      { v:"experienced", t:"Experienced",
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
      acts:["grit","able","floor","money101","budget0","compound","taxes","retire","invest","bounce"] },
    { key:"plan", n:"Door 5", title:"Make the plan",
      blurb:"Six months, one SMART goal, written down.",
      why:"You're ready to commit. This door turns a direction into a plan with dates on it, and helps you spot what might knock it off course before it does.",
      acts:["smart6","premortem","stilltrue"] }
  ];

  /* ---------- activities (live registry + four proposed) ---------- */
  var ACTS = {
    why:          { name:"Your Why",             tag:"The reason underneath all of it, in your own words.", min:5, fact:"Why you're looking", tile:0, play:true },
    proof:        { name:"Proof",                tag:"Three things you're good at, with the evidence.",   min:8, fact:"Your strengths", tile:1, play:true },
    hours168:     { name:"168 Hours",            tag:"Where your week actually goes.",                    min:4, fact:"Where your time goes", tile:2, play:true },
    constraints:  { name:"Fixed or Assumed",     tag:"Which of your reasons are actually true.",          min:5, fact:"What's really fixed", tile:3, play:true },
    interests:    { name:"What Kind of Work", tag:"Thirty quick questions about what you\u2019d enjoy doing all day.", min:6, fact:"What fits you", tile:4, play:true },
    cyoa:         { seven:["Look up one role from your top match on CareerOneStop","Tell one person which story you picked, and why","Write down the one thing from your story you\u2019d want most"], name:"The Story",            tag:"Seven chapters of a life eighteen months from now.",min:5, fact:"Work that fits", tile:4, live:"apps/prototype-1-choose-your-own-adventure.html" },
    dayinlife:    { seven:["Find one person who works a day like the one you picked, and ask them one question","Notice one moment this week that felt like the day you\u2019d want","Look up the top role from your match on CareerOneStop"], name:"A Day In The Life",    tag:"Six moments in a day you'd actually want.",         min:5, fact:"A day you'd want", tile:5, live:"apps/prototype-2-day-in-the-life.html" },
    budget:       { seven:["Check one job posting for the thing you\u2019d pay most for","Ask someone in that field whether their job has it","Write down why your biggest spend matters to you"], name:"Spend Your 100",       tag:"What you'd really pay for in a job.",               min:4, fact:"What you value in work", tile:6, live:"apps/prototype-3-budget-allocation.html" },
    doors:        { name:"Three Doors",          tag:"Every realistic route in, side by side.",           min:7, fact:"Your route in", tile:7, play:true },
    conversations:{ name:"Two Conversations",    tag:"Who to talk to, and the message already written.",  min:6, fact:"Someone to talk to", tile:8, play:true },
    /* Career ABCs is one app with three stages. The hub opens it at the
       stage she picked (#a/#b/#c) and reads real completion back out of
       its own storage, so wandering inside the app still counts. */
    abcs_a:       { seven:["Add one more story from something that happened this week","Tell a friend one of your stories out loud","Put a number on one story: how many, how fast, or how often"], name:"A · What you\u2019ve already done", tag:"Turn things you\u2019ve actually done into short stories you can use.", min:8, fact:"Your stories", tile:9, app:"a" },
    abcs_b:       { seven:["Send your resume to one place","Ask one person you trust to read your resume","Save your resume as a PDF with your name in the file name"], name:"B · Put it on paper",  tag:"A resume and a cover letter, built from those stories.", min:10, fact:"Resume and cover letter", tile:9, app:"b", after:"abcs_a" },
    abcs_c:       { seven:["Practice one answer out loud tomorrow","Ask someone to ask you one interview question","Write down the question you\u2019d least like to be asked, and one line of your answer"], name:"C · Say it out loud",  tag:"Interview practice, using the same stories.", min:8, fact:"Interview practice", tile:9, app:"c", after:"abcs_a" },
    able:         { name:"Solve It",           tag:"One real problem, taken apart four ways. The ABLE method.", min:7, fact:"How you solve things", tile:11, play:true },
    budget0:      { name:"Every Dollar a Job", tag:"Build a budget that adds to zero, then take the spreadsheet with you.", min:12, fact:"Your budget", tile:13, play:true },
    compound:     { name:"What Money Does Over Time", tag:"Watch a small monthly amount turn into a number you didn\u2019t expect.", min:6, fact:"What time does to money", tile:13, play:true },
    invest:       { name:"Where Money Can Live", tag:"Five places money can sit, from safest to riskiest, and which end yours goes.", min:5, fact:"Where money lives", tile:13, play:true, wix:true },
    retire:       { name:"The Match",            tag:"401k, 403b, pension, Roth, and the free money you might be leaving.", min:10, fact:"The match", tile:13, play:true, wix:true },
    taxes:        { name:"Where Your Paycheck Goes", tag:"The four lines that take money out, and the one you control.", min:4, fact:"Your paycheck", tile:13, play:true, wix:true },
    floor:        { name:"The Floor",            tag:"The number you need, not the number you want.",     min:6, fact:"Your number", tile:10, play:true },
    grit:         { name:"Bounce Back",          tag:"The last time it went wrong, and what you did next.", min:6, fact:"How you recover", tile:11, play:true },
    bounce:       { name:"The Week It's Hard",   tag:"A plan for the week you want to quit.",             min:8, fact:"Your hard-week plan", tile:12, play:true },
    money101:     { name:"Money, Plainly",       tag:"Paycheck, rent, the gap. No jargon.",               min:8, fact:"Money basics", tile:13, play:true },
    smart6:       { name:"Your Six Months",      tag:"One SMART goal, with dates on it.",                 min:15, fact:"Your six-month goal", tile:14, play:true, big:true },
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
    if (reason==="enrolled")                return clarity==="clear" ? "plan" : clarity==="rough" ? "explore" : "know";
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
    if (reason==="enrolled"){
      return {
        plan:    "You're already in a program and you know where it's going. This door turns that into six months with dates on it, and it's the one that keeps you moving when the semester gets heavy.",
        explore: "You're in a program and you've got a rough idea of where it leads. These help you see the real options inside it, so the choice is yours rather than the default.",
        know:    "You're in a program, which is a real step, and you said you're still working out what it's for. Two or three of these and that gets clearer."
      }[route(a)];
    }
    var map = {
      know:    "You said you're still figuring it out, and "+st+". So we start with you, before any of the career stuff. Two or three of these and the picture starts to show.",
      explore: "You said you've got a rough idea, and "+st+". These let you try the idea on before you commit to it.",
      get:     reason==="job"
        ? "You said you need a job soon, and "+st+". That's a deadline, so we skip the philosophy and build the thing you'll actually send."
        : "You said you know what you want, and "+st+". So we start with your resume, your cover letter and interview practice for that work.",
      mind:    "You know the direction. You said the part that isn't ready is your head or your money, and "+st+". A lot of people say this, and it's exactly what this door is for.",
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
      el.setAttribute('aria-label','Character: '+(o.t||('option '+(BODIES.indexOf(o)+1)))); el.appendChild(artFor(o.k,state.tone));
      el.onclick=function(){ state.body=o.k; renderPicker(); refocus("pickBody"); };
      b.appendChild(el);
    });
    var t=$("pickTone"); t.innerHTML="";
    TONES.forEach(function(o){
      var el=document.createElement("button"); el.type="button"; el.className="ptone"; el.setAttribute("role","radio");
      el.setAttribute("aria-label","Skin tone "+o.k); el.style.background=o.hex;
      el.setAttribute("aria-checked", state.tone===o.k?"true":"false");
      el.onclick=function(){ state.tone=o.k; renderPicker(); refocus("pickTone"); };
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
      b.onclick=function(){ state.a[i-1]=o.v; renderQ(i); $("nextBtn").disabled=false; refocus("q"+i); };
      host.appendChild(b);
    });
  }
  function refocus(id){ var n=$(id) && $(id).querySelector('[aria-checked="true"]'); if (n) n.focus(); }
  function showQ(i){
    var hadFocus = document.activeElement && document.activeElement!==document.body;
    state.q=i;
    document.querySelectorAll(".q").forEach(function(el,k){ el.classList.toggle("is-on",k===i); });
    for (var k=0;k<4;k++){ var s=$("st"+k); s.className = k<i?"done":(k===i?"now":""); }
    $("backBtn").style.display = i>0?"":"none";
    $("nextBtn").disabled = i>0 && !state.a[i-1];
    $("nextBtn").textContent = i===3 ? "Show me where to start" : (i===0 ? "That's me" : "Next");
    window.scrollTo({top:0});
    var h=document.querySelector('.q[data-q="'+i+'"] h2');
    if (h && hadFocus && i>0){ h.setAttribute("tabindex","-1"); h.focus({preventScroll:true}); }
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
    /* If stage B named a target company, it's a place they're looking
       at. Added once, never overwritten. */
    try {
      var st=abcsState(), tgt=st && st.build && st.build.target;
      if (tgt && tgt.company && tgt.company.trim()){
        var name=tgt.company.trim();
        if (!places().some(function(p){ return p.name.toLowerCase()===name.toLowerCase(); })){
          places().push({ id:"p"+Date.now(), name:name, type:"company", status:"looking", note:tgt.role||"", at:Date.now(), from:"Career ABCs" });
        }
      }
    } catch(e){}
    var d=abcsDone(), changed=false;
    Object.keys(d).forEach(function(k){ if (d[k] && !state.done[k]) { state.done[k]=true; lastAdded=k; changed=true; } });
    return changed;
  }

  /* ---------- the standalone apps, in an iframe --------------------- */
  var appOpen=null, uploadWatch=null, appRunBaseline=0, appFinishedNow=null, sevenOffered={};
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
    if (ev.data.yns==="run"){ if (absorbRun(appOpen) && !state.done[appOpen]) { state.done[appOpen]=true; lastAdded=appOpen; appFinishedNow=appOpen; render(); } }
    /* The activity finished and asked to come back. One set of
       navigation rather than two. */
    if (ev.data.yns==="close") YNS.closeApp();
  });
  YNS.closeApp=function(){
    var slug=appOpen; appOpen=null; if (uploadWatch){ clearInterval(uploadWatch); uploadWatch=null; }
    $("actModal").style.display="none"; $("actModal").innerHTML=""; document.body.classList.remove("modal-open");
    if (!slug) return;
    if (ACTS[slug] && ACTS[slug].app){
      var was=Object.assign({}, state.done);
      syncAbcs();
      var fresh=["abcs_a","abcs_b","abcs_c"].filter(function(k){ return state.done[k] && !was[k]; });
      render();
      if (fresh.length){ toast("Nice work. That\u2019s saved."); sevenDays(fresh[fresh.length-1]); }
      else toast("Nothing lost. Pick it up whenever you like.");
      return;
    }
    var had=absorbRun(slug), isNew=(had && !state.done[slug]) || appFinishedNow===slug;
    appFinishedNow=null;
    if (isNew) { state.done[slug]=true; lastAdded=slug; toast("Nice work. That\u2019s "+ACTS[slug].name+" done."); }
    else if (!had && !state.done[slug]) toast("No problem, nothing lost. "+ACTS[slug].name+" is there whenever you want it.");
    render();
    if (isNew) sevenDays(slug);
  };

  /* One way to start any activity, used by the cards and by links inside
     other activities' results (YNS.open). */
  function openActivity(slug){
    var a=ACTS[slug]; if (!a || a.soon) return;
    if (a.app) openApp(slug, withLevel(ABCS_URL)+"#"+a.app, a.name);
    else if (a.play) window.YNSMock.play(slug);
    else if (a.live) openApp(slug, withLevel(a.live), a.name);
    else toggle(slug);
  }
  YNS.open=function(slug){
    if (!ACTS[slug]) return;
    try { if (window.YNSMock.isOpen && window.YNSMock.isOpen()) window.YNSMock.close(); } catch(e){}
    if (appOpen) YNS.closeApp();
    $("actModal").style.display="none"; $("actModal").innerHTML=""; document.body.classList.remove("modal-open");
    var door=DOORS.filter(function(d){ return d.acts.indexOf(slug)>=0; })[0];
    var here=byKey(state.door);
    if (door && !(here && here.acts.indexOf(slug)>=0)) { state.door=door.key; state.opened[door.key]=true; render(); }
    setTimeout(function(){ if (state.done[slug]) reopen(slug, false); else openActivity(slug); }, 60);
  };

  /* The same "Seven days" pick the in-hub activities end with, for the
     activities that live in their own pages. */
  function sevenDays(slug){
    var a=ACTS[slug]; if (!a || !a.seven || sevenOffered[slug]) { afterFinish(); return; }
    sevenOffered[slug]=true;
    var m=$("actModal"); m.style.display="block"; document.body.classList.add("modal-open");
    m.innerHTML='<div class="am-card am-results"><div class="am-top"><span class="am-eyebrow">'+a.name+'</span><button class="am-x" onclick="YNS.pickSeven(null)" aria-label="Close">\u00d7</button></div>'
      +'<h2>Seven days</h2><p class="am-scene">Pick one thing to do this week. It goes in your Planner until you tick it off.</p>'
      +a.seven.map(function(t,i){ return '<button class="opt" onclick="YNS.pickSeven(\''+slug+'\','+i+')"><i class="dot"></i><div><strong>'+t+'</strong></div></button>'; }).join("")
      +'<button class="btn-quiet" onclick="YNS.pickSeven(null)">Skip for now</button></div>';
  }
  YNS.pickSeven=function(slug, i){
    if (slug && ACTS[slug] && ACTS[slug].seven){
      var text=ACTS[slug].seven[i];
      state.facts.steps_open=steps().filter(function(x){ return x.text!==text; });
      state.facts.steps_open.push({ id:slug+"-"+Date.now(), slug:slug, text:text, from:ACTS[slug].name, at:now(), done:false });
      toast("On your Planner.");
    }
    YNS.closeList(); render(); afterFinish();
  };

  /* Re-open a finished activity, either at its results or from the top.
     The in-hub activities keep their last run in the runtime. The three
     quizzes and Career ABCs keep their own state, so re-opening them
     lands where the person left off; only "do it again" clears it. */
  function reopen(slug, atResults){
    var a=ACTS[slug];
    if (a.play){
      if (atResults && window.YNSMock.hasResults(slug)) window.YNSMock.play(slug, {results:true});
      else window.YNSMock.play(slug);
      return;
    }
    if (a.app){ openApp(slug, withLevel(ABCS_URL)+"#"+a.app, a.name); return; }
    if (a.live){ var u=withLevel(a.live); openApp(slug, atResults ? u : u+(u.indexOf("?")<0?"?":"&")+"fresh=1", a.name); return; }
    toggle(slug);
  }

  /* ---------- the account, as a screen ------------------------------

     Built here so the words and the order are decided; wired by Matt to
     Supabase. Nothing in this panel submits anywhere. The perks are the
     real ones, the consent box starts unticked, and the same sentence
     belongs in the privacy policy. */
  YNS.signup=function(){
    var m=$("actModal"); m.style.display="block"; document.body.classList.add("modal-open");
    var ns=nextStepSentence();
    m.innerHTML='<div class="am-card"><div class="am-top"><span class="am-eyebrow">Keep your next step</span><button class="am-x" onclick="YNS.closeList()" aria-label="Close">\u00d7</button></div>'
      +'<h2>'+(ns ? "That\u2019s your next step. Save it, free." : "Save your progress with a free account.")+'</h2>'
      +(ns ? '<p class="am-scene">'+ns+'</p>' : '')
      +'<p class="am-scene">Every activity here is free, with or without an account. A free account adds four things:</p>'
      +'<ul class="am-points">'
      +'<li><b>It saves.</b> Your plan, your portfolio, your places, on any device, and it survives a cleared browser.</li>'
      +'<li><b>The coach.</b> The AI coach inside Career ABCs helps with your stories, your resume and your interview answers.</li>'
      +'<li><b>Check-ins that follow you.</b> Check-ins pop up on this page when a step is due. With an account, they follow you to any device. Email reminders are planned for later.</li>'
      +'<li><b>First to hear.</b> When we start working with schools, programs and employers, you\u2019ll be first to hear about ones that match what you\u2019ve told us. You choose whether to be introduced, every time, and you can turn it off any time.</li>'
      +'</ul>'
      +'<div class="signup-form">'
      +'<label>Email<input type="email" placeholder="you@email.com" autocomplete="email"></label>'
      +'<label>Password<input type="password" placeholder="At least 8 characters" autocomplete="new-password"></label>'
      +'<label class="signup-consent"><input type="checkbox"> Yes, tell me when there\u2019s an opportunity that fits. I can turn this off any time.</label>'
      +'<p class="am-note">By making an account you agree to the <a href="https://www.yournextstepai.com/terms" target="_blank" rel="noopener">terms</a> and the privacy policy. We don\u2019t sell your data, and nobody is introduced to you without your say-so.</p>'
      +'</div>'
      +'<div class="am-foot"><button class="btn-quiet" onclick="YNS.closeList()">Not now</button><button class="btn btn-primary" disabled title="Wired by Matt to Supabase in the live build">Make my free account</button></div>'
      +'<p class="am-note" style="margin-top:8px">Review build: this screen shows the words and the order. The button is connected in the live build.</p>'
      +'</div>';
  };

  /* ---------- the structured course --------------------------------

     Promoted in exactly two places, and nowhere else. At the end of the
     money activities, where a person has just met a concept the course
     teaches in full with video and the coach. And once, when all five
     doors are finished. Never on arrival, never on every door. */
  var WIX_URL = "https://www.yournextstepai.com/curriculum";
  var WIX_LINE = "Want to go deeper, with videos and more structure? Module 5 of the Your Next Step course covers this end to end. It\u2019s an optional paid course, and there\u2019s no obligation to join.";
  function wixCard(text){
    return '<div class="wix-card"><p>'+text+'</p><a class="btn btn-ghost" href="'+WIX_URL+'" target="_blank" rel="noopener">Take a look at the course \u2197</a></div>';
  }
  function allDoorsDone(){
    return DOORS.every(function(d){ var l=live(d); return l.length && l.every(function(sl){ return state.done[sl]; }); });
  }

  /* ---------- the next step, said in one sentence --------------------

     Direction, route and month one already exist as separate facts. Said
     together they become the thing the site is named after. No partner
     is involved: the sentence is the person's own, and the places under
     it are ones they chose. */
  var CATEGORY_KEYWORD = { health:"medical assistant", social:"community health worker", edu:"teaching assistant", gov:"public service", creative:"graphic designer", trades:"electrician apprentice", biz:"operations coordinator", tech:"IT support", finance:"bookkeeper" };
  function nextStepSentence(){
    var f=state.facts;
    if (!f.top_category) return null;
    var route = ROUTE_WORD[f.route_preference] ? ROUTE_WORD[f.route_preference].toLowerCase() : null;
    var m1 = f.smart_month1 ? String(f.smart_month1).split("\n")[0].replace(/^By /,"by ") : null;
    var s2 = "Your next step is <b>" + catLabel(f.top_category) + "</b>";
    if (route) s2 += ", " + route;
    s2 += ".";
    if (m1) s2 += " First move: " + m1;
    return s2;
  }
  /* Public search tools from the same government source the wage data
     comes from. No partner, no payment, no ranking by anyone but the
     person. The keyword is a plain example role for the category; the
     person can change it on the page. */
  function searchLinks(){
    var f=state.facts; if (!f.top_category) return [];
    var kw=encodeURIComponent(CATEGORY_KEYWORD[f.top_category]||catLabel(f.top_category));
    var loc=encodeURIComponent(f.zip||"");
    return [
      { t:"Jobs near you",        u:"https://www.careeronestop.org/Toolkit/Jobs/find-jobs.aspx?keyword="+kw+"&location="+loc },
      { t:"Training programs",    u:"https://www.careeronestop.org/Toolkit/Training/find-local-training.aspx?keyword="+kw+"&location="+loc },
      { t:"Apprenticeships",      u:"https://www.careeronestop.org/Toolkit/Training/find-apprenticeships.aspx?keyword="+kw+"&location="+loc },
      { t:"Scholarships",         u:"https://www.careeronestop.org/Toolkit/Training/find-scholarships.aspx?keyword="+kw }
    ];
  }

  /* The places. School, program or company: what it's called, what it is,
     and where it stands. This is the log that makes the next step real,
     and, aggregated one day, the evidence for who to partner with. */
  var PLACE_TYPE = { school:"School", program:"Program", company:"Company" };
  var PLACE_STATUS = { looking:"Looking into it", applied:"Applied", heard:"Heard back", in:"I\u2019m in", no:"Not this one" };
  function places(){ return state.facts.places || (state.facts.places = []); }
  YNS.addPlace=function(){
    var name=($("plName").value||"").trim(); if (!name) return;
    places().push({ id:"p"+Date.now(), name:name, type:$("plType").value, status:"looking", note:"", at:Date.now() });
    YNS.profile(); toast("Added. Come back and update it as it moves.");
  };
  YNS.placeStatus=function(id,v){ places().forEach(function(p){ if (p.id===id) p.status=v; }); render(); };
  YNS.removePlace=function(id){ state.facts.places=places().filter(function(p){ return p.id!==id; }); YNS.profile(); };
  YNS.editPlace=function(id){
    var p=places().filter(function(x){return x.id===id;})[0]; if (!p) return;
    inlineEdit("pn-"+id, p.name, function(v){ p.name=v; }, YNS.profile);
  };
  YNS.setZip=function(v){ state.facts.zip=(v||"").trim(); };

  /* ---------- the portfolio ------------------------------------------

     Everything they have done, on paper. Built into a hidden container
     and printed with a stylesheet that hides the rest of the page, so
     there is no popup to be blocked and no library to load. Every
     browser's print dialog offers Save as PDF, including on a phone.

     This is the artefact someone takes to an interview, a careers
     adviser, a parent, or a college application. It is also, bluntly,
     the best argument for making an account: it is everything that
     would otherwise disappear with the browser cache. */
  function fmtDate(ts){
    try { return new Date(ts).toLocaleDateString(undefined,{ day:"numeric", month:"long", year:"numeric" }); }
    catch(e){ return ""; }
  }
  function money2(n){ return "$" + Math.round(n||0).toLocaleString("en-US"); }

  function portfolioHTML(){
    var f=state.facts, out=[];
    var doneNames=[];
    DOORS.forEach(function(d){
      var got=d.acts.filter(function(sl){ return state.done[sl]; }).map(function(sl){ return ACTS[sl].name; });
      if (got.length) doneNames.push({ door:d.title, items:got });
    });
    var total=Object.keys(ACTS).filter(function(k){ return !ACTS[k].soon; }).length;
    var n=doneCount();

    out.push('<header class="pp-head"><img src="assets/yns-lockup.svg" alt="Your Next Step" class="pp-logo">'
      +'<h1>What I\u2019ve worked out so far</h1>'
      +'<p class="pp-sub">'+n+" of "+total+" activities \u00b7 "+fmtDate(Date.now())+"</p></header>");

    /* 0. The next step, and the places */
    var ns=nextStepSentence();
    if (ns) out.push('<section class="pp-sec"><h2>My next step</h2><p class="pp-big">'+ns+"</p></section>");
    var pl=places();
    if (pl.length){
      out.push('<section class="pp-sec"><h2>Places I\u2019m looking at</h2><ul>'
        + pl.map(function(p){ return "<li>"+p.name+" \u00b7 "+(PLACE_TYPE[p.type]||"")+" \u00b7 "+(PLACE_STATUS[p.status]||"")+"</li>"; }).join("")
        + "</ul></section>");
    }

    /* 1. Direction */
    if (f.top_category){
      var roles=[];
      try {
        var band=window.YNS_ROLES.categories[f.top_category][f.level||"early"] || window.YNS_ROLES.categories[f.top_category].early;
        roles=(band||[]).slice(0,3).map(function(r){ return "<li>"+r.title+" \u00b7 "+money2(r.low)+"\u2013"+money2(r.high)+"</li>"; });
      } catch(e){}
      out.push('<section class="pp-sec"><h2>Where I\u2019m pointing</h2>'
        +"<p class=\"pp-big\">"+catLabel(f.top_category)+"</p>"
        +(f.interest_top?"<p>"+f.interest_top+"</p>":"")
        +(roles.length?"<p class=\"pp-label\">Roles at my level</p><ul>"+roles.join("")+"</ul>":"")
        +((state.evidence||[]).length?'<p class="pp-note">Based on '+(state.evidence||[]).length+" activity"+((state.evidence||[]).length>1?" results":" result")+", weighed together.</p>":"")
        +"</section>");
    }

    /* 2. Their own words */
    var own=[];
    if (f.why_statement) own.push(["Why I\u2019m doing this", "\u201c"+f.why_statement+"\u201d"]);
    if (f.why_test) own.push(["How I\u2019ll know it worked", f.why_test]);
    var st=Array.isArray(f.strengths)?f.strengths:[];
    if (st.length) own.push(["What I\u2019m good at", st.map(function(x){return x.moment;}).filter(Boolean).join("<br>")]);
    if (f.setback_story) own.push(["A setback, and what I did", f.setback_story]);
    if (own.length){
      out.push('<section class="pp-sec"><h2>In my own words</h2>'
        + own.map(function(r){ return '<div class="pp-row"><div class="pp-t">'+r[0]+"</div><div>"+r[1]+"</div></div>"; }).join("")
        + "</section>");
    }

    /* 3. The plan */
    if (f.smart_goal || f.smart_month1 || f.smart_months){
      out.push('<section class="pp-sec"><h2>My plan</h2>'
        +(f.vision_line?'<div class="pp-row"><div class="pp-t">Five years</div><div>'+f.vision_line+"</div></div>":"")
        +(f.smart_goal?'<div class="pp-row"><div class="pp-t">Six months</div><div>'+f.smart_goal+"</div></div>":"")
        +(f.smart_measure?'<div class="pp-row"><div class="pp-t">How I\u2019ll know</div><div>'+f.smart_measure+"</div></div>":"")
        +(f.smart_month1?'<div class="pp-row"><div class="pp-t">Month one</div><div style="white-space:pre-line">'+f.smart_month1+"</div></div>":"")
        +(f.smart_months?'<div class="pp-row"><div class="pp-t">Month by month</div><div style="white-space:pre-line">'+f.smart_months+"</div></div>":"")
        +(f.route_preference?'<div class="pp-row"><div class="pp-t">How I get in</div><div>'+(ROUTE_WORD[f.route_preference]||f.route_preference)+"</div></div>":"")
        +(f.premortem_risk?'<div class="pp-row"><div class="pp-t">What might trip me up</div><div>'+f.premortem_risk+"</div></div>":"")
        +"</section>");
    }

    /* 4. Commitments */
    var open=openSteps(), doneSteps=steps().filter(function(x){return x.done;});
    if (open.length || doneSteps.length){
      out.push('<section class="pp-sec"><h2>What I said I\u2019d do</h2>'
        +(open.length?"<ul>"+open.map(function(s2){ return "<li>"+s2.text+' <span class="pp-note">'+s2.from+"</span></li>"; }).join("")+"</ul>":"")
        +(doneSteps.length?'<p class="pp-label">Already done</p><ul>'+doneSteps.map(function(s2){ return "<li>"+s2.text+"</li>"; }).join("")+"</ul>":"")
        +"</section>");
    }

    /* 5. Money */
    var mon=[];
    if (f.floor_monthly) mon.push(["What I need to earn", money2(f.floor_monthly)+" a month"]);
    if (f.money_in) mon.push(["What comes in", money2(f.money_in)+" a month"]);
    if (f.budget_plan){
      var a=f.budget_plan, tot=0, save=(a.save||0)+(a.buffer||0);
      Object.keys(a).forEach(function(k){ tot+=a[k]||0; });
      mon.push(["Budgeted", money2(tot)+" a month, all assigned"]);
      if (save) mon.push(["Going to me", money2(save)+" a month"]);
    }
    if (f.training_appetite) mon.push(["Training I\u2019m up for", APPETITE_WORD[f.training_appetite]||f.training_appetite]);
    if (mon.length){
      out.push('<section class="pp-sec"><h2>My numbers</h2>'
        + mon.map(function(r){ return '<div class="pp-row"><div class="pp-t">'+r[0]+"</div><div>"+r[1]+"</div></div>"; }).join("")
        + "</section>");
    }

    /* 6. What was completed */
    if (doneNames.length){
      out.push('<section class="pp-sec"><h2>What I\u2019ve finished</h2>'
        + doneNames.map(function(d){ return '<div class="pp-row"><div class="pp-t">'+d.door+"</div><div>"+d.items.join(" \u00b7 ")+"</div></div>"; }).join("")
        + "</section>");
    }

    out.push('<footer class="pp-foot"><p>Made with Your Next Step. Pay ranges are national bands from the US Bureau of Labor Statistics via CareerOneStop, narrowed to the experience level stated above. They are not starting salaries or offers.</p></footer>');
    return out.join("");
  }

  YNS.portfolio=function(){
    var root=$("printRoot");
    root.innerHTML=portfolioHTML();
    /* Give the browser a tick to lay it out before the dialog opens. */
    setTimeout(function(){ window.print(); }, 60);
  };

  /* ---------- the Planner ------------------------------------------

     Every activity ends by asking for one thing to do this week. Until
     now those answers lived on the screen that produced them and nowhere
     else, which makes them a nice feeling rather than a commitment.

     The Planner is the list. Everything picked, where it came from, and
     a box to tick. It also carries the dated things: the six-month goal,
     the first step, and the note for a hard week. */
  function weekOf(ts){
    var days=Math.floor((now()-ts)/86400000);
    if (days<1) return "today";
    if (days<7) return days+(days===1?" day ago":" days ago");
    return Math.round(days/7)+(days<14?" week ago":" weeks ago");
  }
  function steps(){ return (state.facts.steps_open||[]); }
  function openSteps(){ return steps().filter(function(s){ return !s.done; }); }

  YNS.planner=function(){
    var all=steps(), open=all.filter(function(s){return !s.done;}), done=all.filter(function(s){return s.done;});
    var f=state.facts;
    /* The dated things. Each one belongs to an activity, so each one can
       be edited or cleared the same way a weekly step can. */
    var dated=[];
    if (f.smart_goal)      dated.push({ k:"smart_goal",      slug:"smart6",   t:"Six months from now", v:f.smart_goal });
    if (f.smart_month1)    dated.push({ k:"smart_month1",    slug:"smart6",   t:"Month one",           v:String(f.smart_month1).split("\n")[0] });
    if (f.hard_week_plan)  dated.push({ k:"hard_week_plan",  slug:"bounce",   t:"If it gets hard",     v:String(f.hard_week_plan).split("\n")[0] });
    if (f.able_step)       dated.push({ k:"able_step",       slug:"able",     t:"The ten minutes you picked", v:f.able_step });

    var m=$("actModal"); m.style.display="block"; document.body.classList.add("modal-open");
    var list = open.length
      ? open.map(function(s){
          return '<div class="pl-row" id="row-'+s.id+'">'
            + '<input type="checkbox" onchange="YNS.tickStep(\''+s.id+'\')" aria-label="Mark done: '+String(s.text).replace(/"/g,"&quot;")+'">'
            + '<span class="pl-t" id="t-'+s.id+'">'+s.text+'</span>'
            + '<span class="pl-acts"><button class="lnk" onclick="YNS.editStep(\''+s.id+'\')">Edit</button>'
            + '<button class="lnk" onclick="YNS.askDeleteStep(\''+s.id+'\')">Delete</button></span>'
            + '<span class="pl-from">'+s.from+' \u00b7 '+weekOf(s.at)+'</span></div>';
        }).join("")
      : '<p class="am-scene">Nothing on the list yet. Every activity ends by asking for one thing to do this week, and whatever you pick lands here.</p>';
    var doneList = done.length
      ? '<details class="pl-done"><summary>'+done.length+" done</summary>"
        + done.map(function(s){ return '<div class="pl-row pl-off"><span class="pl-t">'+s.text+'</span><span class="pl-from">'+s.from+'</span></div>'; }).join("")
        + "</details>"
      : "";
    m.innerHTML='<div class="am-card am-results"><div class="am-top"><span class="am-eyebrow">Your planner</span><button class="am-x" onclick="YNS.closeList()" aria-label="Close">\u00d7</button></div>'
      +'<h1>What you said you\u2019d do</h1>'
      +'<p class="am-scene">One line for every thing you picked at the end of an activity. Tick them off as they happen, change the wording, or clear one and plan it again.</p>'
      +'<section class="pf-sec"><h3>This week</h3>'+list+doneList+"</section>"
      +(dated.length
        ? '<section class="pf-sec"><h3>Further out</h3>'
          + dated.map(function(d){
              return '<div class="pl-row pl-dated" id="row-'+d.k+'"><span class="pl-t" id="t-'+d.k+'"><b>'+d.t+'</b><br>'+d.v+'</span>'
                + '<span class="pl-acts"><button class="lnk" onclick="YNS.editFact(\''+d.k+'\')">Edit</button>'
                + '<button class="lnk" onclick="YNS.askDeleteFact(\''+d.k+'\',\''+d.slug+'\')">Delete</button></span></div>';
            }).join("")
          + "</section>"
        : "")
      /* Saving lives in Portfolio, which already includes this list. One
         place for one job. */
      +'<div class="am-foot"><span class="small muted">Signed out, this lives in this browser only. Everything here is in your Portfolio too, which is the one you can save.</span><button class="btn btn-primary" onclick="YNS.closeList()">Close</button></div></div>';
  };

  /* Editing is not a big deal and does not need a warning: it is their
     wording, and changing it changes nothing else. */
  function inlineEdit(cellId, current, onSave, rerender){
    rerender = rerender || YNS.planner;
    var cell=$(cellId); if (!cell) return;
    cell.innerHTML='<input class="pl-edit" type="text" value="'+String(current).replace(/"/g,"&quot;")+'">';
    var input=cell.querySelector("input"); input.focus(); input.select();
    /* Enter and blur both land here, and repainting the panel fires blur
       again. One flag stops the second pass rebuilding a panel that is
       already being rebuilt. */
    var settled=false;
    function save(){
      if (settled) return; settled=true;
      input.onblur=null;
      var v=input.value.trim(); if (v) onSave(v);
      rerender();
    }
    function cancel(){ if (settled) return; settled=true; input.onblur=null; rerender(); }
    input.onkeydown=function(e){ if (e.key==="Enter"){ e.preventDefault(); save(); } if (e.key==="Escape"){ e.preventDefault(); e.stopPropagation(); cancel(); } };
    input.onblur=save;
  }
  YNS.editStep=function(id){
    var s=steps().filter(function(x){return x.id===id;})[0]; if (!s) return;
    inlineEdit("t-"+id, s.text, function(v){ s.text=v; });
  };
  YNS.editFact=function(k){
    inlineEdit("t-"+k, String(state.facts[k]).split("\n")[0], function(v){ state.facts[k]=v; });
  };

  /* Deleting is a different matter, because the commitment came out of an
     activity and clearing it puts that activity back to unanswered. Say
     which one, by name, before doing it. */
  function confirmPanel(title, body, onYes, yesLabel){
    var m=$("actModal");
    m.innerHTML='<div class="am-card"><div class="am-top"><span class="am-eyebrow">Just checking</span><button class="am-x" onclick="YNS.planner()" aria-label="Back">\u00d7</button></div>'
      +"<h2>"+title+"</h2>"
      +'<p class="am-scene">'+body+"</p>"
      +'<div class="am-foot" data-back="planner"><button class="btn-quiet" onclick="YNS.planner()">Keep it</button>'
      +'<button class="btn btn-primary" id="confirmYes">'+(yesLabel||"Delete and start that one again")+'</button></div></div>';
    $("confirmYes").onclick=onYes;
  }
  function resetActivity(slug){
    if (!slug) return;
    var cleared = window.YNSMock.resetActivity ? window.YNSMock.resetActivity(slug) : [];
    delete state.done[slug];
    state.evidence=(state.evidence||[]).filter(function(e){ return e.source!==slug; });
    resolveDirection();
    return cleared;
  }
  YNS.askDeleteStep=function(id){
    var s=steps().filter(function(x){return x.id===id;})[0]; if (!s) return;
    var name=s.from;
    if (ACTS[s.slug] && (ACTS[s.slug].app || ACTS[s.slug].live)){
      confirmPanel("Remove this line?",
        "This removes it from your Planner. What you made in <b>"+name+"</b> stays where it is, and you can pick a new step there any time.",
        function(){ state.facts.steps_open = steps().filter(function(x){ return x.id!==id; }); render(); YNS.planner(); toast("Removed from your Planner."); },
        "Remove it");
      return;
    }
    confirmPanel("Delete this, and start " + name + " again?",
      "This came out of <b>"+name+"</b>. Clearing it also clears what you told that activity, so it asks you properly next time rather than skipping the questions it already has answers for. Everything else stays exactly as it is.",
      function(){
        state.facts.steps_open = steps().filter(function(x){ return x.id!==id; });
        resetActivity(s.slug);
        render(); YNS.planner();
        toast(name+" is ready to do again.");
      });
  };
  YNS.askDeleteFact=function(k, slug){
    var name = (window.YNSMock.title && window.YNSMock.title(slug)) || slug;
    confirmPanel("Delete this, and start " + name + " again?",
      "This came out of <b>"+name+"</b>. Clearing it also clears what you told that activity, so you can plan it from scratch rather than editing around an old answer.",
      function(){
        delete state.facts[k];
        state.facts.steps_open = steps().filter(function(x){ return x.slug!==slug; });
        resetActivity(slug);
        render(); YNS.planner();
        toast(name+" is ready to do again.");
      });
  };

  YNS.tickStep=function(id){
    steps().forEach(function(s){ if (s.id===id) s.done=true; });
    render(); YNS.planner();
    toast("Ticked off. That\u2019s the whole point of the list.");
  };

  /* ---------- everything we know, in one place ----------------------

     The rail shows the headline. This is the whole thing, written the way
     someone would need it when they are actually filling in an
     application or messaging a stranger: their own sentences first, then
     the roles and the numbers, then the practical facts.

     Nothing here is invented. Every line is either something they typed
     or something an activity resolved from their answers, and each one
     says where it came from. */
  var WHO_FOR = { me:"me", kids:"my kids", family:"my family", partner:"my partner", someone_specific:"one particular person", community:"people like me" };
  var LEVEL_WORD = { early:"Just starting out", some:"A couple of years in", experienced:"Experienced", leader:"Running things already" };
  var APPETITE_WORD = { none:"No training right now", short:"A short course", medium:"A year or two", long:"The full route" };
  var ROUTE_WORD = { degree:"A degree", certificate:"A certificate", apprenticeship:"An apprenticeship", lateral:"Sideways, then up", self_taught:"Teach myself and show the work", none:"Straight in" };
  var DRAIN_WORD = { commute:"the commute", work:"the job itself", chores:"keeping life running", none:"nothing \u2014 the week is the wrong shape" };
  var PROTECT_WORD = { evenings:"my evenings", weekends:"my weekends", sleep:"sleep", own_time:"the one thing that\u2019s mine", flexible:"most of it, for the right thing" };

  function money(n){ return "$" + Math.round(n/1000) + "k"; }

  function profileSections(){
    var f=state.facts, out=[];

    /* In your own words. */
    var own=[];
    if (f.why_statement) own.push({ t:"Why you\u2019re doing this", v:"\u201c"+f.why_statement+"\u201d"+(WHO_FOR[f.why_who]?" Mostly for "+WHO_FOR[f.why_who]+".":""), from:"Your Why" });
    if (f.why_test) own.push({ t:"How you\u2019ll know it worked", v:f.why_test, from:"Your Why" });
    var st=Array.isArray(f.strengths)?f.strengths:[];
    if (st.length) own.push({ t:"What you\u2019re good at", v:st.map(function(x){return x.moment;}).filter(Boolean).join("<br>"), from:"Proof" });
    if (f.smart_goal) own.push({ t:"Your six-month goal", v:f.smart_goal+(f.smart_first_step?"<br><b>First step:</b> "+f.smart_first_step:""), from:"Your Six Months" });
    if (own.length) out.push({ h:"In your own words", note:"Useful in a cover letter, and in the first message to anyone you reach out to.", rows:own });

    /* Where you're pointing. */
    var dir=[];
    if (f.top_category){
      var roles=[];
      try {
        var band=window.YNS_ROLES.categories[f.top_category][f.level||"early"] || window.YNS_ROLES.categories[f.top_category].early;
        roles=(band||[]).slice(0,3).map(function(r){ return r.title+" \u00b7 "+money(r.low)+"\u2013"+money(r.high); });
      } catch(e){}
      dir.push({ t:"The work", v:catLabel(f.top_category)+(roles.length?"<br>"+roles.join("<br>")+'<br><span class="small muted">National pay bands, BLS via CareerOneStop.</span>':""), from:(state.evidence||[]).length+" activities" });
    }
    if (f.interest_top) dir.push({ t:"What you\u2019d enjoy doing", v:f.interest_top, from:"What Kind of Work" });
    if (f.route_preference) dir.push({ t:"How you\u2019d get in", v:(ROUTE_WORD[f.route_preference]||f.route_preference), from:"Three Doors" });
    if (f.training_appetite) dir.push({ t:"Training you\u2019re up for", v:APPETITE_WORD[f.training_appetite]||f.training_appetite, from:"What Kind of Work" });
    if (dir.length) out.push({ h:"Where you\u2019re pointing", note:"This is the answer to \u201cwhat are you looking for?\u201d in an interview.", rows:dir });

    /* The practical facts. */
    var prac=[];
    if (f.level) prac.push({ t:"Experience", v:LEVEL_WORD[f.level]||f.level, from:"Your answers" });
    if (f.floor_monthly) prac.push({ t:"What you need to earn", v:money(f.floor_monthly)+" a month", from:"The Floor" });
    if (f.time_protected) prac.push({ t:"What you won\u2019t give up", v:PROTECT_WORD[f.time_protected]||f.time_protected, from:"168 Hours" });
    if (f.time_drain) prac.push({ t:"What you\u2019d take back", v:DRAIN_WORD[f.time_drain]||f.time_drain, from:"168 Hours" });
    if (f.premortem_risk) prac.push({ t:"What might trip you up", v:f.premortem_risk, from:"What Might Trip You Up" });
    if (f.hard_week_plan) prac.push({ t:"Your plan for a hard week", v:String(f.hard_week_plan).split("\n")[0], from:"The Week It\u2019s Hard" });
    if (prac.length) out.push({ h:"The practical facts", note:"Worth having in front of you before you accept anything.", rows:prac });

    return out;
  }

  YNS.profile=function(){
    var sec=profileSections();
    var m=$("actModal"); m.style.display="block"; document.body.classList.add("modal-open");
    var ns=nextStepSentence(), links=searchLinks();
    var nextStep = ns
      ? '<section class="pf-sec pf-next"><h3>Your next step</h3><p class="pf-next-line">'+ns+'</p>'
        + (links.length ? '<p class="am-note">Real places to take it, from CareerOneStop (US Department of Labor), the same source as the pay figures. Add your zip code and they narrow to near you.</p>'
          + '<div class="pf-links">'+links.map(function(l){ return '<a class="btn btn-ghost" href="'+l.u+'" target="_blank" rel="noopener">'+l.t+' \u2197</a>'; }).join("")+'</div>'
          + '<label class="pf-zip">Zip code <input type="text" inputmode="numeric" maxlength="5" value="'+(state.facts.zip||"")+'" onchange="YNS.setZip(this.value);YNS.profile()"></label>' : '')
        + "</section>"
      : "";
    var pl=places();
    var placesSec = '<section class="pf-sec"><h3>Places I\u2019m looking at</h3>'
      + '<p class="am-note">Schools, programs, companies. Log them here as you look, and move them along as things happen. They go on your PDF and into your six-month plan.</p>'
      + (pl.length ? pl.map(function(p){
          return '<div class="pf-place" id="row-'+p.id+'"><div><span class="pf-place-name" id="pn-'+p.id+'">'+p.name+'</span><span class="pf-place-type">'+(PLACE_TYPE[p.type]||"")+'</span></div>'
            + '<select aria-label="Status of '+String(p.name).replace(/"/g,"&quot;")+'" onchange="YNS.placeStatus(\''+p.id+'\',this.value)">'
            + Object.keys(PLACE_STATUS).map(function(k){ return '<option value="'+k+'"'+(p.status===k?" selected":"")+'>'+PLACE_STATUS[k]+'</option>'; }).join("")
            + '</select><span class="pl-acts"><button class="lnk" onclick="YNS.editPlace(\''+p.id+'\')">Edit</button><button class="lnk" onclick="YNS.removePlace(\''+p.id+'\')">Remove</button></span></div>';
        }).join("") : '')
      + '<div class="pf-add"><input type="text" id="plName" aria-label="Name of the place" placeholder="Name of the school, program or company"><select id="plType" aria-label="Type of place"><option value="school">School</option><option value="program">Program</option><option value="company">Company</option></select><button class="btn btn-ghost" onclick="YNS.addPlace()">Add</button></div>'
      + "</section>";
    var body = sec.length
      ? sec.map(function(s){
          return '<section class="pf-sec"><h3>'+s.h+'</h3><p class="am-note">'+s.note+'</p>'
            + s.rows.map(function(r){
                return '<div class="pf-row"><div class="pf-t">'+r.t+'</div><div class="pf-v">'+r.v+'</div><div class="pf-from">from '+r.from+'</div></div>';
              }).join("")
            + "</section>";
        }).join("")
      : '<p class="am-scene">Nothing here yet. Finish any activity and this page starts filling in: your own words, the work they point at, and the numbers worth having to hand. It is also the thing you can save as a PDF and take to an interview.</p>';
    m.innerHTML='<div class="am-card am-results"><div class="am-top"><span class="am-eyebrow">Everything you\u2019ve told us</span><button class="am-x" onclick="YNS.closeList()" aria-label="Close">\u00d7</button></div>'
      +'<h1>What we know about you</h1>'
      +'<p class="am-scene">Your own words, the direction they add up to, and the facts worth having to hand. Take any of it straight into an application or a message.</p>'
      +nextStep
      +placesSec
      +body
      +'<div class="am-foot"><button class="btn btn-ghost" onclick="YNS.copyProfile(this)">Copy it all as text</button><button class="btn btn-ghost" onclick="YNS.portfolio()">Save as PDF</button><button class="btn btn-primary" onclick="YNS.closeList()">Close</button></div></div>';
  };
  YNS.closeList=function(){ $("actModal").style.display="none"; $("actModal").innerHTML=""; document.body.classList.remove("modal-open"); };
  YNS.copyProfile=function(btn){
    var text=profileSections().map(function(s){
      return s.h.toUpperCase()+"\n"+s.rows.map(function(r){
        return r.t+": "+String(r.v).replace(/<br>/g,"\n  ").replace(/<[^>]+>/g,"");
      }).join("\n");
    }).join("\n\n");
    try { navigator.clipboard.writeText(text); btn.textContent="Copied"; setTimeout(function(){btn.textContent="Copy it all as text";},1600); }
    catch(e){ btn.textContent="Select and copy from the panel"; }
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
    $("heroH1").textContent = n===0 ? "What\u2019s your next step?" : fr<.7 ? "You\u2019re getting somewhere." : "Look at what you\u2019ve built.";
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
    el.setAttribute("data-slug", slug);
    el.innerHTML='<span class="mark" aria-hidden="true"></span><h3>'+a.name+'</h3><p>'+a.tag+'</p>'
      +(a.after && !state.done[a.after] ? '<p class="after">Works best after A, and it pulls your stories in for you.</p>' : '')
      +'<div class="meta"><span>'+a.min+' min</span>'+(a.soon?'<span class="tag gold">Coming soon</span>':'')+((a.play||a.live)&&!aside?'<span class="tag gold">Play it here</span>':'')+(a.big?'<span class="tag">Bigger one</span>':'')+'</div>';
    if (!a.soon){
      /* A finished activity gets two ways back in: look at what you said,
         or answer it again. Re-opening used to drop straight into the
         questions, which is a poor reward for having finished. */
      var row=document.createElement("div"); row.className="act-actions";
      if (done){
        var see=document.createElement("button"); see.type="button"; see.className="notme";
        see.textContent="See my results";
        see.onclick=function(ev){ ev.stopPropagation(); reopen(slug, true); };
        var again=document.createElement("button"); again.type="button"; again.className="notme";
        again.textContent="Do it again";
        again.onclick=function(ev){ ev.stopPropagation(); reopen(slug, false); };
        row.appendChild(see); row.appendChild(again);
      } else {
        var link=document.createElement("button"); link.type="button"; link.className="notme";
        link.textContent = aside ? "Bring it back" : "Not for me right now";
        link.onclick=function(ev){ ev.stopPropagation(); state.asideAct[slug]=!aside; render(); };
        row.appendChild(link);
      }
      el.appendChild(row);
    }
    /* Stage A offers the other way in: bring in a resume or cover letter
       you already have, and it becomes stories rather than a blank page. */
    if (slug==="abcs_a" && !aside){
      var up=document.createElement("button"); up.type="button"; up.className="bringin";
      up.textContent="Already have a resume or cover letter? Bring it in";
      up.onclick=function(ev){ ev.stopPropagation(); openApp(slug, withLevel(ABCS_URL)+"#home", ACTS[slug].name, {upload:true}); };
      el.appendChild(up);
    }
    if (!a.soon && !aside && !done){
      el.onclick=function(){ openActivity(slug); };
      el.style.cursor="pointer";
      var h3=el.querySelector("h3");
      h3.innerHTML='<button type="button" class="act-open" aria-label="'+a.name+', '+a.min+' minutes">'+a.name+'</button>';
    }
    if (a.soon) el.title="Proposed for this door. Not built yet.";
    return el;
  }

  function renderDoor(){
    var d=DOORS.filter(function(x){return x.key===state.door;})[0];
    var host=$("doorPanel");
    var p=doorProgress(d);
    var answered = !!state.a[0] && !!state.a[1];
    var recommended = answered ? route(state.a) : "know";
    var picked = state.door!==recommended;
    var eyebrow = picked ? "The door you picked" : answered ? "Your starting door" : "A good place to start";
    var because = picked
      ? "You picked this one, and every door is open to you. "+(answered ? 'Your answers pointed to <button class="lnk" onclick="YNS.goDoor(\''+recommended+'\')">'+byKey(recommended).title+'</button>, if you\u2019d like to start there instead.' : "")
      : answered ? routeReason(state.a)
      : "You haven't answered the questions yet, so we've opened the door most people start at. Answer them whenever you like and we'll point you somewhere that fits you better.";
    var offer="";
    if (allDoorsDone()){
      offer=wixCard("You\u2019ve been through all five doors. If you\u2019d like the same journey with videos and more structure, the Your Next Step course has six modules, each with an AI coach. It\u2019s optional and paid, with no obligation to join.");
    }
    if (offerDue()){
      var names=notNeeded().map(function(k){ return byKey(k).title; });
      offer='<div class="offer"><svg viewBox="0 0 20 20" fill="none" stroke="#6B5F00" stroke-width="1.6"><circle cx="10" cy="10" r="8"/><path d="M10 9v5M10 6.5v.5"/></svg><div>'
        +'<p><b>You already know what you want, so let\u2019s not waste your time.</b> '+(names.length>1?names.join(" and ")+" are":names[0]+" is")+' built for people still working that out. Shall we set '+(names.length>1?"them":"it")+' aside for now? '+(names.length>1?"They\u2019ll be":"It\u2019ll be")+' right here if you ever want '+(names.length>1?"them":"it")+'.</p>'
        +'<div class="offer-acts"><button class="btn btn-ghost" onclick="YNS.acceptOffer()">Yes, set '+(names.length>1?"them":"it")+' aside</button><button class="btn-quiet" onclick="YNS.declineOffer()">I\u2019d rather keep '+(names.length>1?"them":"it")+'</button></div></div></div>';
    }
    var nd=doorDone(d), nl=live(d).length;
    /* Door 3 has a "ready" state: when the direction, a resume and one
       practice answer all exist, the door says so and points at real
       places to take it. It appears only when it is true. */
    var ready="";
    if (d.key==="get" && state.facts.top_category && state.done.abcs_b && state.done.abcs_c){
      var links=searchLinks();
      ready='<div class="ready"><b>You\u2019ve got the story, the paper and the practice.</b> Here\u2019s where to point it.'
        +'<div class="pf-links">'+links.map(function(l){ return '<a class="btn btn-ghost" href="'+l.u+'" target="_blank" rel="noopener">'+l.t+' \u2197</a>'; }).join("")+'</div>'
        +'<p class="small muted" style="margin:8px 0 0">Log anywhere you apply under Places in your Portfolio, so it lands in your plan.</p></div>';
    }
    host.innerHTML='<img class="door-banner" src="assets/banners/'+(BANNER[d.key]||"banner")+'.webp" alt="">'
      +'<div class="eyebrow">'+eyebrow+' · '+d.n+'</div><h2>'+d.title+'</h2><p class="why">'+d.why+'</p>'
      +'<div class="because"><svg viewBox="0 0 20 20" fill="none" stroke="#2859B6" stroke-width="1.6"><circle cx="10" cy="10" r="8"/><path d="M10 9v5M10 6.5v.5"/></svg><span><b>Why this door:</b> '+because+'</span></div>'
      +offer
      +ready
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
      el.onclick=function(){ state.door=d.key; state.opened[d.key]=true; render(); $("doorPanel").scrollIntoView({behavior:"smooth",block:"start"}); };
      g.appendChild(el);
    });
  }

  function renderRail(){
    /* Your answers, unchanged. */
    var y=$("youSummary");
    if (state.a[0]){
      var lbl=function(i){ var o=QUESTIONS[i].opts.filter(function(x){return x.v===state.a[i];})[0]; return o?o.t:"\u2014"; };
      y.innerHTML='<div><span>Clarity</span><span>'+lbl(0)+'</span></div><div><span>Why now</span><span>'+lbl(1)+'</span></div><div><span>Experience</span><span>'+lbl(2)+'</span></div>';
      $("youChip").textContent="Not signed in \u00b7 "+lbl(2);
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
            : full ? "All done here. Still True? is there whenever you want to check what\u2019s changed."
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
        dir.innerHTML = '<p class="small muted">Do one of the Explore activities and your direction shows up here.</p>'
          + (Object.keys(state.facts).length ? '<button class="btn btn-ghost dir-more" onclick="YNS.profile()">See everything we know</button>' : "");
      } else {
        var rank = state.facts.category_ranking || [];
        var names = { interests: "What Kind of Work", cyoa: "The Story", dayinlife: "A Day In The Life", budget: "Spend Your 100" };
        var topCat = state.facts.top_category;
        var parts = [];
        parts.push(topCat
          ? '<p class="dir-top">' + catLabel(topCat) + "</p>"
          : '<p class="dir-top">A tie, so far</p>');
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
        var ns2=nextStepSentence(); if (ns2) parts.push('<p class="dir-next">'+ns2+'</p>');
        parts.push('<button class="btn btn-ghost dir-more" onclick="YNS.profile()">See everything we know</button>');
        dir.innerHTML = parts.join("");
      }
    }


    /* All 26, closed by default, grouped by door, summarised by what they
       have done rather than what they have not. */
    var acc=$("allActs");
    acc.innerHTML=DOORS.map(function(d){
      var nd=doorDone(d), nl=live(d).length, st=doorState(d);
      var label = st==="aside" ? "Set aside" : nd===nl&&nl ? "All "+nd+" done" : nd ? nd+" done" : "Nothing yet";
      return '<details><summary><span class="car">\u203a</span><span class="nm">'+d.title+'</span><span class="st">'+label+'</span></summary><div class="accbody">'
        + d.acts.map(function(s){
            var a=ACTS[s], cls = state.done[s] ? "done" : (state.asideAct[s]||st==="aside") ? "aside" : "";
            var also = DOORS.filter(function(o){ return o.key!==d.key && o.acts.indexOf(s)>=0; })[0];
            var dup = also && DOORS.indexOf(also) < DOORS.indexOf(d);
            return '<div class="arow '+cls+'"><span class="dot"></span><span class="nm">'+a.name+(dup?' <span class="muted">(also in '+also.title+')</span>':'')+'</span><span class="mins">'+(a.soon?"soon":a.min+" min")+'</span></div>';
          }).join("")
        + '</div></details>';
    }).join("");
  }

  function renderPlannerButton(){
    var b=$("plannerBtn"); if (!b) return;
    var n=openSteps().length;
    b.innerHTML='Planner'+(n?'<span class="pl-count">'+n+'</span>':'');
  }
  function render(){ renderAvatar(); renderDoor(); renderGrid(); renderRail(); renderPlannerButton(); }
  /* The hub checks for a due check-in whenever it comes into view. */
  document.addEventListener("visibilitychange", function(){ if (!document.hidden && $("screenHub").classList.contains("is-on")) afterFinish(); });

  function toggle(slug){
    if (state.done[slug]) delete state.done[slug]; else state.done[slug]=true;
    bubbleIdx=Math.max(0,bubbleLines().length-1);
    render();
    if (state.done[slug]) toast("Done: "+ACTS[slug].name+". A little clearer.");
  }

  var tt;
  function toast(msg){ var sr=$("srStatus"); if (sr) sr.textContent=msg; var t=$("toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(tt); tt=setTimeout(function(){t.classList.remove("show");},2200); }

  function show(screen){
    $("screenIntake").classList.toggle("is-on",screen==="intake");
    $("screenHub").classList.toggle("is-on",screen==="hub");
    window.scrollTo({top:0});
  }

  /* ---------- public ------------------------------------------------ */
  Object.assign(window.YNS, {
    next: function(){ if (state.q<3) showQ(state.q+1); else {
      if (state.a[2]) state.facts.level=state.a[2];
      state.facts.enrolled = state.a[1]==="enrolled"; state.door=route(state.a); state.skipped=false; render(); show("hub"); } },
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

  YNS.activityClosed=function(slug, finished){
    if (!finished && ACTS[slug]) toast("No problem, nothing lost. "+ACTS[slug].name+" is there whenever you want it.");
    if (finished) setTimeout(afterFinish, 400);
  };
  YNS.goDoor=function(k){ if (!byKey(k)) return; state.door=k; state.opened[k]=true; render(); $("doorPanel").scrollIntoView({behavior:"smooth",block:"start"}); };

  /* ---------- check-ins, on the screen ------------------------------

     Weekly: a step picked seven or more days ago and not ticked off
     gets one gentle question. Monthly: a month after the six-month goal
     was set, Still True? is offered. These show whenever the hub is
     open; with an account the same list will come by email once that
     is built. In this review build nothing survives a reload, so the
     demo bar can move the clock forward to show them. */
  var WEEK=7*86400000, MONTH=28*86400000, nudgedSave=false, clockShift=0;
  function now(){ return Date.now()+clockShift; }
  function dueCheckin(){
    var t=now();
    var wk=openSteps().filter(function(s){ return t-s.at>=WEEK && (!s.nudgedAt || t-s.nudgedAt>=WEEK); })[0];
    if (wk) return { kind:"week", step:wk };
    var f=state.facts;
    if (f.smart_goal && f.smart_set_at && t-f.smart_set_at>=MONTH && (!f.stilltrue_at || t-f.stilltrue_at>=MONTH) && (!f.month_nudged || t-f.month_nudged>=WEEK))
      return { kind:"month" };
    return null;
  }
  function popup(html){
    var p=$("checkin");
    if (!p){ p=document.createElement("div"); p.id="checkin"; p.className="checkin"; p.setAttribute("role","region"); p.setAttribute("aria-label","Check-in"); document.body.appendChild(p); }
    p.innerHTML='<button class="checkin-x" onclick="YNS.closePopup()" aria-label="Close">\u00d7</button>'+html;
    p.classList.add("show");
    document.body.style.paddingBottom=(p.offsetHeight+24)+"px";
    var st=$("srStatus"); if (st) st.textContent=Array.prototype.map.call(p.querySelectorAll("p"), function(n){ return n.textContent; }).join(". ");
  }
  var popupKind=null, popupStep=null;
  YNS.dismissPopup=function(){ var p=$("checkin"); if (p) p.classList.remove("show"); document.body.style.paddingBottom=""; };
  document.addEventListener("keydown", function(e){
    var p=$("checkin");
    if ((e.key==="Escape"||e.key==="Esc") && p && p.classList.contains("show") && !document.body.classList.contains("modal-open")) YNS.closePopup();
  });
  YNS.closePopup=function(){
    if (popupKind==="week" && popupStep) steps().forEach(function(s){ if (s.id===popupStep) s.nudgedAt=now(); });
    if (popupKind==="month") state.facts.month_nudged=now();
    YNS.dismissPopup();
  };
  function afterFinish(){
    if (document.body.classList.contains("modal-open")) return;
    var c=dueCheckin();
    popupKind=c ? c.kind : "save"; popupStep=c && c.step ? c.step.id : null;
    if (c && c.kind==="week"){
      popup('<p class="checkin-eyebrow">Check-in</p><p><b>A week ago you picked:</b> '+c.step.text+'</p><p class="small muted">From '+c.step.from+'. How did it go?</p>'
        +'<div class="checkin-acts"><button class="btn btn-primary" onclick="YNS.checkinDone(\''+c.step.id+'\')">I did it</button>'
        +'<button class="btn btn-ghost" onclick="YNS.checkinLater(\''+c.step.id+'\')">Still on it</button>'
        +'<button class="lnk" onclick="YNS.dismissPopup();YNS.planner()">Change it</button></div>');
      return;
    }
    if (c && c.kind==="month"){
      popup('<p class="checkin-eyebrow">Check-in</p><p><b>It\u2019s been a month since you set your six-month goal.</b></p><p class="small muted">Still True? takes about four minutes and shows what has changed.</p>'
        +'<div class="checkin-acts"><button class="btn btn-primary" onclick="YNS.dismissPopup();YNS.open(\'stilltrue\')">Check in now</button>'
        +'<button class="btn btn-ghost" onclick="YNS.monthLater()">Later</button></div>');
      return;
    }
    /* Once per visit, after the first thing is finished: the free account. */
    if (!nudgedSave && Object.keys(state.done).length){
      nudgedSave=true;
      popup('<p class="checkin-eyebrow">Keep what you made</p><p><b>Save your progress, free.</b></p><p class="small muted">A free account keeps your answers, your Planner and your Portfolio, on any device.</p>'
        +'<div class="checkin-acts"><button class="btn btn-primary" onclick="YNS.dismissPopup();YNS.signup()">Save it, free</button>'
        +'<button class="btn btn-ghost" onclick="YNS.dismissPopup()">Not now</button></div>');
    }
  }
  YNS.checkinDone=function(id){ YNS.dismissPopup(); YNS.tickStep(id); YNS.closeList(); };
  YNS.checkinLater=function(id){ steps().forEach(function(s){ if (s.id===id) s.nudgedAt=now(); }); YNS.dismissPopup(); toast("Good. We\u2019ll ask again next week."); };
  YNS.monthLater=function(){ state.facts.month_nudged=now(); YNS.dismissPopup(); };
  /* Review build only: move the clock so the check-ins can be seen. */
  YNS.now=now;
  YNS.skipAhead=function(days){ clockShift+=days*86400000; toast("Moved the clock ahead "+days+" days."); afterFinish(); };

  window.YNSHub = { addEvidence: addEvidence };
  window.YNSMock.mount($("actModal"),
    function(slug){
      state.done[slug]=true; lastAdded=slug;
      if (slug==="smart6") state.facts.smart_set_at=now();
      if (slug==="stilltrue") state.facts.stilltrue_at=now();
      bubbleIdx=Math.max(0,bubbleLines().length-1); render();
      toast(allDoorsDone() ? "That\u2019s all five doors. Really well done." : "Nice work. That\u2019s "+ACTS[slug].name+" done.");
    },
    /* The course card, on the results of the money activities only. */
    function(slug){ return (ACTS[slug] && ACTS[slug].wix) ? wixCard(WIX_LINE) : ""; });
  renderPicker(); renderQ(1); renderQ(2); renderQ(3); showQ(0);
})();