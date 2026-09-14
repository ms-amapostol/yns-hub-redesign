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
  var DOORS = [
    { key:"know", n:"Door 1", title:"Get to know you",
      blurb:"Start with who you are. No career words required.",
      why:"Before anyone picks a direction, it helps to know what you're actually working with: what matters to you, what you're already good at, and where your week really goes.",
      acts:["why","proof","hours168","constraints"] },
    { key:"explore", n:"Door 2", title:"Explore what's out there",
      blurb:"Try on a few futures. See which one fits.",
      why:"You have a rough shape of what you want. These help you see real options side by side, and name the kinds of work that match what you'd actually enjoy.",
      acts:["cyoa","dayinlife","budget","doors","conversations"] },
    { key:"get", n:"Door 3", title:"Get the job",
      blurb:"Resume, cover letter, interview. Built from what you've already done.",
      why:"You know the direction, or you just need work now. Career ABCs turns things you've actually done into resume bullets and interview answers, no blank page.",
      acts:["career_abcs","conversations"] },
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
    cyoa:         { name:"The Story",            tag:"Seven chapters of a life eighteen months from now.",min:5, fact:"Work that fits", tile:4, live:"https://apps.yournextstepai.com/prototype-1-choose-your-own-adventure.html" },
    dayinlife:    { name:"A Day In The Life",    tag:"Six moments in a day you'd actually want.",         min:5, fact:"A day you'd want", tile:5, live:"https://apps.yournextstepai.com/prototype-2-day-in-the-life.html" },
    budget:       { name:"Spend Your 100",       tag:"What you'd really pay for in a job.",               min:4, fact:"What you value in work", tile:6, live:"https://apps.yournextstepai.com/prototype-3-budget-allocation.html" },
    doors:        { name:"Three Doors",          tag:"Every realistic route in, side by side.",           min:7, fact:"Your route in", tile:7, play:true },
    conversations:{ name:"Two Conversations",    tag:"Who to talk to, and the message already written.",  min:6, fact:"Someone to talk to", tile:8, play:true },
    career_abcs:  { name:"Career ABCs",          tag:"Build the resume, the cover letter and the interview.", min:20, fact:"Resume, letter, interview", tile:9, big:true, live:"https://apps.yournextstepai.com/career-abcs_v2.html" },
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
    career_abcs:  { lead:"Ready to send:",                     say:"Resume, cover letter, and three interview stories. Built from what I've done.", key:"" },
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
  var state = { a:[null,null,null], q:0, done:{}, door:null, skipped:false, body:"n", tone:"3", facts: window.YNSMock.facts };
  var $ = function(id){ return document.getElementById(id); };

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
    var pv=$("pickPreview"); pv.innerHTML=""; var a=artFor(state.body,state.tone); a.style.opacity=".25"; pv.appendChild(a);
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

  /* ---------- hub render -------------------------------------------- */
  function doneCount(){ return Object.keys(state.done).length; }
  function doorProgress(d){ var n=0; d.acts.forEach(function(s){ if(state.done[s]) n++; }); return {n:n,of:d.acts.length}; }

  var bubbleTimer=null, bubbleIdx=0;
  function renderAvatar(){
    var n=doneCount(), total=Object.keys(ACTS).filter(function(k){return !ACTS[k].soon;}).length;
    var stage = n===0 ? 1 : Math.min(6, 1+Math.floor(n/total*5)+ (n>0?1:0));
    if (stage>6) stage=6; if (n>=total) stage=6;
    var box=$("avatarBox"); box.setAttribute("data-stage",stage);
    var art=$("avatarArt");
    if (art.getAttribute("data-key")!==state.body+state.tone){ art.innerHTML=""; art.appendChild(artFor(state.body,state.tone)); art.setAttribute("data-key",state.body+state.tone);
      var grid=document.createElement("div"); grid.className="tiles"; var G=6;
      REVEAL_ORDER.forEach(function(c){ var t=document.createElement("i"); t.style.left=(c[0]*100/G)+"%"; t.style.top=(c[1]*100/G)+"%"; t.style.width=(100/G+0.3)+"%"; t.style.height=(100/G+0.3)+"%"; grid.appendChild(t); });
      art.appendChild(grid); }
    var tiles=art.querySelectorAll(".tiles i"); var reveal = n>=total ? tiles.length : Math.round(n/total*tiles.length);
    tiles.forEach(function(t,k){ t.classList.toggle("off", k<reveal); });
    $("avatarPct").textContent=Math.round(n/total*100)+"%";
    var fr=n/total;
    var cap = n===0 ? "Nothing filled in yet. That's where everyone starts."
            : fr<.35 ? "A few pieces in."
            : fr<.7  ? "Half the picture. You can see who this is now."
            : n<total ? "Nearly all of it. Most of this is you, in your own words."
            : "All of it. Every piece, filled in by you.";
    $("avatarCaption").textContent=cap;
    $("heroH1").textContent = n===0 ? "What should you do with your life?" : fr<.7 ? "You're filling in." : "Look who showed up.";
    renderBubble();
  }
  var WHO = { me:"me", kids:"my kids", family:"my family", partner:"my partner", someone_specific:"one person in particular", community:"people like me" };
  var REAL = {
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
    if (!lines.length){ lead.textContent=""; say.textContent="I don't know much about you yet. Finish one activity and I'll start saying it back to you."; dots.innerHTML=""; return; }
    if (bubbleIdx>=lines.length) bubbleIdx=0;
    var l=lines[bubbleIdx];
    say.classList.add("fade");
    setTimeout(function(){ lead.textContent=l.lead; say.textContent=l.say; say.classList.remove("fade"); },200);
    dots.innerHTML=lines.map(function(_,i){ return '<i class="'+(i===bubbleIdx?"on":"")+'"></i>'; }).join("");
    if (lines.length>1) bubbleTimer=setTimeout(function(){ bubbleIdx=(bubbleIdx+1)%lines.length; renderBubble(); },4200);
  }

  function actCard(slug, door){
    var a=ACTS[slug]; var done=!!state.done[slug];
    var el=document.createElement("button"); el.type="button";
    el.className="act"+(done?" done":"")+(a.soon?" soon":"");
    el.innerHTML='<span class="mark" aria-hidden="true"></span><h3>'+a.name+'</h3><p>'+a.tag+'</p>'
      +'<div class="meta"><span>'+a.min+' min</span>'+(a.soon?'<span class="tag gold">Coming soon</span>':'')+(a.play?'<span class="tag gold">Play it here</span>':'')+(a.live?'<a class="ext" href="'+a.live+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">Open the live app ↗</a><span class="ext">tap card = mark done</span>':'')+(a.big?'<span class="tag">Bigger one</span>':'')+'</div>';
    if (a.play) el.onclick=function(){ if (state.done[slug]) toggle(slug); else window.YNSMock.play(slug); };
    else if (a.live) el.onclick=function(){ if (!state.done[slug]) { state.facts.top_category = state.facts.top_category || "health"; state.facts.level = state.facts.level || "some"; } toggle(slug); };
    else if (!a.soon) el.onclick=function(){ toggle(slug); };
    else el.title="Proposed for this door. Not built yet.";
    return el;
  }

  function renderDoor(){
    var d=DOORS.filter(function(x){return x.key===state.door;})[0];
    var host=$("doorPanel");
    var p=doorProgress(d);
    var eyebrow = state.skipped ? "A good place to start" : "Your starting door";
    var because = state.skipped
      ? "You skipped the questions, so we opened the first door. Answer them any time from the panel on the right and we'll point you somewhere more specific."
      : routeReason(state.a);
    host.innerHTML='<div class="eyebrow">'+eyebrow+' · '+d.n+'</div><h2>'+d.title+'</h2><p class="why">'+d.why+'</p>'
      +'<div class="because"><svg viewBox="0 0 20 20" fill="none" stroke="#2859B6" stroke-width="1.6"><circle cx="10" cy="10" r="8"/><path d="M10 9v5M10 6.5v.5"/></svg><span><b>Why this door:</b> '+because+'</span></div>'
      +'<div class="acts" id="doorActs"></div>'
      +'<div class="door-foot"><span class="small muted">'+p.n+' of '+p.of+' done here.</span>'
      +(p.n===p.of?'<span class="tag gold">Door complete. The picture just got a gold piece.</span>':'')+'</div>';
    var acts=$("doorActs"); d.acts.forEach(function(s){ acts.appendChild(actCard(s,d)); });
  }

  function renderGrid(){
    var g=$("doorGrid"); g.innerHTML="";
    DOORS.forEach(function(d){
      if (d.key===state.door) return;
      var p=doorProgress(d);
      var el=document.createElement("button"); el.type="button";
      el.className="dcard"+(p.n===p.of?" full":"");
      el.innerHTML='<span class="num">'+d.n+'</span><h3>'+d.title+'</h3><p>'+d.blurb+'</p><div class="prog"><i style="width:'+(p.n/p.of*100)+'%"></i></div><span class="small muted">'+p.n+' of '+p.of+'</span>';
      el.onclick=function(){ state.door=d.key; state.skipped=true; render(); $("doorPanel").scrollIntoView({behavior:"smooth",block:"start"}); };
      g.appendChild(el);
    });
  }

  function renderRail(){
    var y=$("youSummary");
    if (state.a[0]){
      var lbl=function(i){ var o=QUESTIONS[i].opts.filter(function(x){return x.v===state.a[i];})[0]; return o?o.t:"—"; };
      y.innerHTML='<div><span>Clarity</span><span>'+lbl(0)+'</span></div><div><span>Why now</span><span>'+lbl(1)+'</span></div><div><span>Work</span><span>'+lbl(2)+'</span></div>';
      $("youChip").textContent="Signed in · "+lbl(2);
    } else {
      y.innerHTML='<div><span class="muted">You skipped the questions. That\'s allowed.</span></div>';
    }
    /* staircase: one step per activity, gold for completed doors */
    var st=$("stair"); st.innerHTML="";
    var allSlugs=[]; DOORS.forEach(function(d){ d.acts.forEach(function(s){ if(allSlugs.indexOf(s)<0) allSlugs.push(s); }); });
    var goldSet={}; DOORS.forEach(function(d){ var p=doorProgress(d); if(p.n===p.of) d.acts.forEach(function(s){goldSet[s]=true;}); });
    allSlugs.forEach(function(s,i){
      var b=document.createElement("i");
      b.style.height=(18+ (i/allSlugs.length)*82)+"%";
      if (state.done[s]) b.className="on"+(goldSet[s]?" gold":"");
      st.appendChild(b);
    });
    $("stairCaption").textContent=doneCount()+" of "+allSlugs.length+" steps taken.";
    /* facts */
    var f=$("facts"); f.innerHTML="";
    allSlugs.forEach(function(s){ var li=document.createElement("li"); li.className=state.done[s]?"on":""; li.textContent=ACTS[s].fact; f.appendChild(li); });
    /* next step */
    var d=DOORS.filter(function(x){return x.key===state.door;})[0];
    var nxt=d.acts.filter(function(s){return !state.done[s] && !ACTS[s].soon;})[0];
    if (!nxt){ DOORS.some(function(dd){ nxt=dd.acts.filter(function(s){return !state.done[s] && !ACTS[s].soon;})[0]; return !!nxt; }); }
    $("nextStep").innerHTML = nxt ? '<div><b>'+ACTS[nxt].name+'</b><span>'+ACTS[nxt].min+' minutes. '+ACTS[nxt].tag+'</span></div>' : '<div><b>You\'ve done every live activity.</b><span>Come back when something changes.</span></div>';
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
  window.YNS = window.YNS || {};
  Object.assign(window.YNS, {
    next: function(){ if (state.q<3) showQ(state.q+1); else { state.door=route(state.a); state.skipped=false; render(); show("hub"); } },
    back: function(){ showQ(state.q-1); },
    skip: function(){ state.skipped=true; state.door="know"; render(); show("hub"); },
    retake: function(){ state.a=[null,null,null]; renderPicker(); renderQ(1);renderQ(2);renderQ(3); showQ(1); show("intake"); },
    pickAvatar: function(){ renderPicker(); showQ(0); show("intake"); },
    reset: function(){ state={a:[null,null,null],q:0,done:{},door:null,skipped:false,body:"n",tone:"3",facts:window.YNSMock.facts}; Object.keys(state.facts).forEach(function(k){ delete state.facts[k]; }); $("youChip").textContent="Not signed in"; renderPicker(); showQ(0); show("intake"); }
  });

  window.YNSMock.mount($("actModal"), function(slug){ state.done[slug]=true; bubbleIdx=Math.max(0,bubbleLines().length-1); render(); toast("Done: "+ACTS[slug].name+". One more piece of you."); });
  renderPicker(); renderQ(1); renderQ(2); renderQ(3); showQ(0);
})();