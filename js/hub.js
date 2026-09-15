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
    { key:"stage", opts:[
      { v:"never",  t:"Never had a job yet",             s:"School, family, or just not yet. Everyone starts here once." },
      { v:"some",   t:"A few part-time or short jobs",   s:"Retail, food, seasonal, gig. More experience than it feels like." },
      { v:"now",    t:"In a job right now",              s:"Working. Thinking about whether this is it." },
      { v:"switch", t:"Years in, and thinking of switching", s:"A real career already. Looking at a different one." }
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
  var state = { a:[null,null,null], q:0, done:{}, door:null, skipped:false, body:"n", tone:"3", facts: window.YNSMock.facts, opened:{}, aside:{}, asideAct:{}, offerAnswered:false };
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
    var st = {never:"you haven't had a job yet", some:"you've done a few jobs already", now:"you're working right now", switch:"you've built a career and you're looking at a different one"}[stage] || "you're where you are";
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
    /* Two small versions of the real thing: day one, and a few
       activities in. Showing the mechanic beats describing it. */
    var pv=$("pickPreview");
    function mini(slugs, label){
      var art='<img src="avatars/'+state.body+"-"+state.tone+'.png" alt="">';
      var sc=slugs.map(function(k){ var d=SCENE[k]; if(!d) return ""; if(d.full) return '<g>'+d.full+'</g>'; var at=SLOT[k]; return '<g transform="translate('+at[0]+' '+at[1]+')">'+d.d+'</g>'; }).join("");
      return '<figure class="mini"><div class="mini-card"><svg viewBox="0 0 200 200" aria-hidden="true">'+sc+'</svg><span class="mini-art">'+art+'</span></div><figcaption>'+label+'</figcaption></figure>';
    }
    pv.innerHTML = mini([], "Day one") + mini(["why","proof","hours168","floor","cyoa"], "Five activities in");
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
  var appOpen=null, uploadWatch=null;
  function openApp(slug, url, name, opts){
    opts=opts||{};
    appOpen=slug; var m=$("actModal"); m.style.display="block"; document.body.classList.add("modal-open");
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
  function absorbRun(slug){
    var runs=readRuns().filter(function(r){ return r.activity===slug && r.status!=="in_progress"; });
    var last=runs[runs.length-1]; if (!last) return false;
    if (last.top_categories && last.top_categories[0]) state.facts.top_category=last.top_categories[0];
    if (last.level) state.facts.level=last.level;
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

  /* ---------- the scene behind the portrait ---------------------------------
     One small drawing per activity, placed in a fixed slot around the
     portrait so nothing ever lands on the face and the composition holds
     at any combination. Each drawing is authored in its own 36x36 box
     and translated into its slot, which is why the paths below all use
     small numbers.

     Five slots across the top, five across the bottom, three down each
     side, and the ground band, which is The Floor. Seventeen places for
     seventeen activities. */
  var SLOT = {
    /* Five across the top, three down each side, five across the bottom.
       Every box is 36 wide, so these are spaced 38 apart and the rows
       clear each other: top 6-40, sides 46-156, bottom 156-190, ground
       190-200. */
    why:[6,6], dayinlife:[44,6], cyoa:[82,6], grit:[120,6], stilltrue:[158,6],
    bounce:[6,46], constraints:[6,84], conversations:[6,122],
    doors:[158,46], money101:[158,84], abcs_b:[158,122],
    proof:[6,156], hours168:[44,156], budget:[82,156], smart6:[120,156], premortem:[158,156],
    abcs_a:[44,84], abcs_c:[120,84], interests:[82,84]
  };
  var SCENE = {
    why:        { title:"Your why \u2014 the sun",              d:'<circle cx="18" cy="18" r="9" fill="var(--yns-gold)"/><g stroke="var(--yns-gold)" stroke-width="2" stroke-linecap="round"><path d="M18 3v-2M18 33v2M3 18H1M33 18h2M7.5 7.5l-1.5-1.5M28.5 28.5l1.5 1.5M28.5 7.5l1.5-1.5M7.5 28.5l-1.5 1.5"/></g>' },
    dayinlife:  { title:"A Day In The Life \u2014 a window with the light on", d:'<rect x="5" y="5" width="26" height="28" rx="2" fill="var(--yns-gold-tint)" stroke="var(--yns-blue-deep)" stroke-width="2"/><path d="M18 5v28M5 19h26" stroke="var(--yns-blue-deep)" stroke-width="2"/>' },
    interests:  { title:"What Kind of Work \u2014 a compass, pointing", d:'<circle cx="18" cy="18" r="15" fill="var(--yns-paper)" stroke="var(--yns-blue-deep)" stroke-width="2"/><path d="M24 12l-4.5 9.5L10 26l4.5-9.5z" fill="var(--yns-blue)"/><path d="M10 26l4.5-9.5 5 5z" fill="var(--yns-gold)"/><circle cx="18" cy="18" r="1.6" fill="var(--yns-ink)"/>' },
    cyoa:       { title:"The Story \u2014 the path out",        d:'<path d="M8 33c0-9 20-10 20-18 0-5-6-6-6-11" fill="none" stroke="var(--yns-tint-2)" stroke-width="7" stroke-linecap="round"/><path d="M8 33c0-9 20-10 20-18 0-5-6-6-6-11" fill="none" stroke="var(--yns-blue)" stroke-width="1.5" stroke-dasharray="3 4" stroke-linecap="round"/>' },
    grit:       { title:"Bounce Back \u2014 the storm, and the light after", d:'<path d="M6 16a8 8 0 0113-6 7 7 0 019 2 6 6 0 01-2 11H10a6 6 0 01-4-7z" fill="var(--yns-tint-2)"/><path d="M20 24l-6 8h5l-4 7" fill="none" stroke="var(--yns-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    stilltrue:  { title:"Still True? \u2014 the flag at the top", d:'<path d="M12 34V4" stroke="var(--yns-blue-deep)" stroke-width="2.5" stroke-linecap="round"/><path d="M12 5l18 6-18 6z" fill="var(--yns-gold)"/>' },
    bounce:     { title:"The Week It\u2019s Hard \u2014 a light left on for you", d:'<circle cx="18" cy="12" r="8" fill="var(--yns-gold-tint)" stroke="var(--yns-gold)" stroke-width="2"/><path d="M13 20h10l-2 5h-6z" fill="var(--yns-gold)"/><rect x="16" y="25" width="4" height="9" rx="1" fill="var(--yns-blue-deep)"/>' },
    constraints:{ title:"Fixed or Assumed \u2014 a wall with a door in it", d:'<rect x="3" y="6" width="30" height="28" fill="var(--yns-tint-2)"/><rect x="12" y="14" width="13" height="20" rx="1.5" fill="var(--yns-paper)" stroke="var(--yns-blue-deep)" stroke-width="2"/><circle cx="21" cy="24" r="1.6" fill="var(--yns-blue-deep)"/>' },
    conversations:{ title:"Two Conversations \u2014 two people talking", d:'<g><path d="M2 3h20a3 3 0 013 3v9a3 3 0 01-3 3h-9l-6 5v-5H2a3 3 0 01-3-3V6a3 3 0 013-3z" transform="translate(1 0)" fill="var(--yns-paper)" stroke="var(--yns-blue-deep)" stroke-width="1.8" stroke-linejoin="round"/><path d="M13 19h20a3 3 0 013 3v8a3 3 0 01-3 3h-3v4l-5-4h-12a3 3 0 01-3-3v-8a3 3 0 013-3z" transform="translate(-1 0)" fill="var(--yns-blue)" stroke="var(--yns-blue-deep)" stroke-width="1.8" stroke-linejoin="round"/></g>' },
    doors:      { title:"Three Doors \u2014 the routes in",     d:'<g fill="var(--yns-paper)" stroke="var(--yns-blue-deep)" stroke-width="1.8"><path d="M2 34V17a4.5 4.5 0 019 0v17z"/><path d="M14 34V12a4.5 4.5 0 019 0v22z"/><path d="M26 34V20a4 4 0 018 0v14z"/></g><g fill="var(--yns-blue-deep)"><circle cx="9" cy="26" r="1.3"/><circle cx="21" cy="24" r="1.3"/><circle cx="32" cy="28" r="1.2"/></g>' },
    money101:   { title:"Money, Plainly \u2014 the jar with something in it", d:'<path d="M7 10h22v20a4 4 0 01-4 4H11a4 4 0 01-4-4z" fill="var(--yns-paper)" stroke="var(--yns-blue-deep)" stroke-width="2"/><path d="M7 22h22v8a4 4 0 01-4 4H11a4 4 0 01-4-4z" fill="var(--yns-gold)" opacity=".85"/><rect x="5" y="5" width="26" height="5" rx="2" fill="var(--yns-blue-deep)"/>' },
    abcs_b:{ title:"Put it on paper \u2014 the resume in your hand", d:'<g transform="rotate(-6 18 19)"><rect x="6" y="3" width="24" height="32" rx="2" fill="var(--yns-paper)" stroke="var(--yns-blue-deep)" stroke-width="2"/><g stroke="var(--yns-blue)" stroke-width="2" stroke-linecap="round"><path d="M11 12h14M11 19h14M11 26h9"/></g></g>' },
    abcs_a:{ title:"What you\u2019ve already done \u2014 your stories, gathered", d:'<g fill="none" stroke="var(--yns-blue-deep)" stroke-width="1.8"><rect x="3" y="8" width="17" height="13" rx="2" fill="var(--yns-paper)"/><rect x="10" y="15" width="17" height="13" rx="2" fill="var(--yns-paper)"/><rect x="17" y="22" width="16" height="12" rx="2" fill="var(--yns-gold-tint)"/></g>' },
    abcs_c:{ title:"Say it out loud \u2014 the table, and you at it", d:'<g><rect x="2" y="16" width="32" height="3" rx="1.5" fill="var(--yns-blue-deep)"/><rect x="6" y="19" width="2.5" height="10" fill="var(--yns-blue-deep)"/><rect x="27" y="19" width="2.5" height="10" fill="var(--yns-blue-deep)"/><circle cx="9" cy="9" r="5" fill="var(--yns-blue)"/><circle cx="27" cy="9" r="5" fill="var(--yns-tint-2)"/><path d="M15 4h8v6h-3l-2 2v-2h-3z" fill="var(--yns-gold)"/></g>' },
    proof:      { title:"Proof \u2014 three stones that hold",  d:'<g fill="var(--yns-blue-deep)"><rect x="2" y="25" width="22" height="8" rx="2"/><rect x="7" y="16" width="22" height="8" rx="2"/><rect x="12" y="7" width="20" height="8" rx="2"/></g>' },
    hours168:   { title:"168 Hours \u2014 the week, in bars",   d:'<g fill="var(--yns-blue)" opacity=".85"><rect x="3" y="18" width="5" height="15" rx="1.5"/><rect x="12" y="10" width="5" height="23" rx="1.5"/><rect x="21" y="23" width="5" height="10" rx="1.5"/><rect x="30" y="4" width="5" height="29" rx="1.5"/></g>' },
    budget:     { title:"Spend Your 100 \u2014 what you\u2019d pay for", d:'<g fill="none" stroke="var(--yns-gold)" stroke-width="2.5"><circle cx="12" cy="12" r="8"/><circle cx="24" cy="20" r="8"/><circle cx="11" cy="26" r="7"/></g>' },
    smart6:     { title:"Your Six Months \u2014 the staircase", d:'<g fill="var(--yns-blue)"><rect x="1" y="26" width="9" height="7"/><rect x="10" y="19" width="9" height="14"/><rect x="19" y="12" width="9" height="21"/><rect x="28" y="5" width="8" height="28"/></g>' },
    premortem:  { title:"What Might Trip You Up \u2014 the rock you saw coming", d:'<path d="M3 33l9-17 11-5 11 22z" fill="var(--yns-muted)"/><path d="M12 16l11-5 4 8-9 3z" fill="var(--yns-ink)" opacity=".35"/>' },
    /* The ground everything else stands on. Full width, no slot. */
    floor:      { title:"The Floor \u2014 solid ground", full:'<rect x="0" y="190" width="200" height="10" fill="var(--yns-blue-deep)" opacity=".9"/>' }
  };
  /* Back to front. The ground lands last so it sits in front of the feet
     of everything standing on it. */
  var SCENE_ORDER = ["why","dayinlife","interests","cyoa","grit","stilltrue","bounce","constraints","conversations","doors","money101","abcs_a","abcs_b","abcs_c","proof","hours168","budget","smart6","premortem","floor"];

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
    var n=doneCount(), total=Object.keys(ACTS).filter(function(k){return !ACTS[k].soon;}).length;

    /* The portrait. Clear from the first visit, and it never changes. */
    var art=$("avatarArt");
    if (art.getAttribute("data-key")!==state.body+state.tone){
      art.innerHTML=""; art.appendChild(artFor(state.body,state.tone)); art.setAttribute("data-key",state.body+state.tone);
    }

    /* The scene around the portrait, one drawing per finished activity. */
    var svg=$("avatarScene"), parts="";
    SCENE_ORDER.forEach(function(slug){
      var sc=SCENE[slug]; if (!state.done[slug] || !sc) return;
      if (sc.full){ parts += '<g class="sc"><title>'+sc.title+'</title>'+sc.full+'</g>'; return; }
      var at=SLOT[slug]||[82,82];
      parts += '<g class="sc" transform="translate('+at[0]+' '+at[1]+')"><title>'+sc.title+'</title>'+sc.d+'</g>';
    });
    if (svg.getAttribute("data-n")!==String(n)){ svg.innerHTML=parts; svg.setAttribute("data-n",n); }

    
    var fr=n/total;
    var cap = n===0 ? "Nothing around you yet, and that\u2019s exactly where everyone starts."
            : fr<.35 ? "Look at that, it\u2019s starting to fill in."
            : fr<.7  ? "Half a life on the page already."
            : n<total ? "Nearly the whole picture, and all of it yours."
            : "That\u2019s everything. You did all of it.";
    $("avatarCaption").textContent=(n?n+" of "+total+" \u00b7 ":"")+cap;
    $("heroH1").textContent = n===0 ? "What should you do with your life?" : fr<.7 ? "You\u2019re getting somewhere." : "Look at what you\u2019ve built.";
    renderLegend(n);
    renderBubble();
  }

  /* The newest addition, named. The rest are in the picture's tooltips
     and in the full list, which opens on click. Seventeen chips at once
     was a wall of text under a small picture. */
  function renderLegend(n){
    var el=$("sceneLegend"); if (!el) return;
    if (!n){ el.innerHTML='<span class="small muted">The space around you fills in as you go.</span>'; return; }
    var items=SCENE_ORDER.filter(function(s){ return state.done[s] && SCENE[s]; });
    var newest = (lastAdded && SCENE[lastAdded]) ? SCENE[lastAdded] : SCENE[items[items.length-1]];
    el.innerHTML='<button class="lg" onclick="YNS.sceneList()" title="See everything in the picture">'+newest.title+'</button>'
      + (items.length>1 ? '<span class="small muted">and '+(items.length-1)+' more</span>' : '');
  }
  YNS.sceneList=function(){
    var items=SCENE_ORDER.filter(function(s){ return state.done[s] && SCENE[s]; });
    var m=$("actModal"); m.style.display="block"; document.body.classList.add("modal-open");
    m.innerHTML='<div class="am-card"><div class="am-top"><span class="am-eyebrow">Your picture</span><button class="am-x" onclick="YNS.closeList()" aria-label="Close">\u00d7</button></div>'
      +'<h2>Everything in it so far</h2><p class="am-scene">One thing for every activity you\u2019ve finished.</p><div class="scene-list">'
      +items.map(function(s){ return '<div><svg viewBox="0 0 36 36" aria-hidden="true">'+(SCENE[s].full?'<rect x="0" y="26" width="36" height="8" fill="var(--yns-blue-deep)" opacity=".9"/>':SCENE[s].d)+'</svg><span>'+SCENE[s].title+'</span></div>'; }).join("")
      +'</div><div class="am-foot"><span></span><button class="btn btn-primary" onclick="YNS.closeList()">Close</button></div></div>';
  };
  YNS.closeList=function(){ $("actModal").style.display="none"; $("actModal").innerHTML=""; document.body.classList.remove("modal-open"); };

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
        if (done) { if (a.app) openApp(slug, ABCS_URL+"#"+a.app, a.name); else if (a.play) window.YNSMock.play(slug); else if (a.live) openApp(slug,a.live,a.name); return; }
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
      el.onclick=function(){ if (a.app) openApp(slug, ABCS_URL+"#"+a.app, a.name); else if (a.play) window.YNSMock.play(slug); else if (a.live) openApp(slug,a.live,a.name); else toggle(slug); };
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
    next: function(){ if (state.q<3) showQ(state.q+1); else { state.door=route(state.a); state.skipped=false; render(); show("hub"); } },
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
    reset: function(){ state={a:[null,null,null],q:0,done:{},door:null,skipped:false,body:"n",tone:"3",facts:window.YNSMock.facts,opened:{},aside:{},asideAct:{},offerAnswered:false}; Object.keys(state.facts).forEach(function(k){ delete state.facts[k]; }); $("youChip").textContent="Not signed in"; renderPicker(); showQ(0); show("intake"); }
  });

  window.YNSMock.mount($("actModal"), function(slug){ state.done[slug]=true; lastAdded=slug; bubbleIdx=Math.max(0,bubbleLines().length-1); render(); toast("Nice work. That\u2019s "+ACTS[slug].name+" done."); });
  renderPicker(); renderQ(1); renderQ(2); renderQ(3); showQ(0);
})();