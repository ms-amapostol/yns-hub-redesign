/* =====================================================================
   YNS hub redesign — mock activity runtime.

   Plays the real content files in activities/*.js, unmodified, inside
   the hub mock. It implements the subset of yns-activity.js those files
   use: ladders with `needs`, copy-as-function, prefill, factsFrom, the
   twelve mechanics below, results(), actions(). Facts live in memory for
   the session so one activity can read what another wrote.

   This is a review harness, not a replacement for yns-activity.js. Where
   the two differ, the live runtime is right. Things this does NOT do:
   axis scoring / category matching, half-lives, reflections, Supabase.
   ===================================================================== */
(function (global) {
"use strict";

var DEFS = {};
var facts = {};          /* the session profile */
var run = null;          /* the activity in progress */
var host = null;         /* the modal element */
var hooks = { onDone: function(){}, esc: null };

function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
function $(id){ return document.getElementById(id); }

/* ---------- context the content reads ------------------------------ */
function derived(){
  var T = global.YNSTaxonomy;
  var d = { top_category: facts.top_category || null, level: facts.level || null, confidence: facts.confidence || 0 };
  d.top_category_label = (T && d.top_category) ? T.label(d.top_category) : null;
  return d;
}
function ctx(){ return { facts: facts, stale: {}, factAge: {}, signals: {}, derived: derived() }; }
function view(){ return { ctx: ctx(), facts: facts, derived: derived(), answers: run ? run.answers : {}, extra: run ? run.extra : {} }; }
function val(x, v){ if (typeof x==="function"){ try { return x(v||view()); } catch(e){ return ""; } } return x; }

function cond(c){
  if (!c) return true;
  if (c.not) return !cond(c.not);
  if (c.all) return c.all.every(cond);
  if (c.any) return c.any.some(cond);
  var v = facts[c.fact]; if (v==null || v==="" || (Array.isArray(v)&&!v.length)) return false;
  if ("is" in c) return v===c.is;
  if ("in" in c) return c.in.indexOf(v)>=0;
  if ("atLeast" in c) return typeof v==="number" && v>=c.atLeast;
  return true;
}
function known(k){ var v=facts[k]; return v!=null && v!=="" && !(Array.isArray(v)&&!v.length); }
function resolve(slot){
  var ladder = slot.ladder || [ slot.ask || slot ];
  for (var i=ladder.length-1;i>=0;i--){
    var r=ladder[i];
    if (!cond(r.needs)) continue;
    if (r.asks && known(r.asks) && r.mechanic!=="learn") continue;
    return r;
  }
  return slot.learn || null;
}

/* ---------- open / navigate ---------------------------------------- */
/* The last finished run of each activity, kept so its results can be
   shown again without making anyone answer everything a second time. */
var lastRun = {};

function play(slug, opts){
  var d = DEFS[slug]; if (!d) return false;
  opts = opts || {};
  /* Re-open at the results of the run they already did. */
  if (opts.results && lastRun[slug]) {
    run = { slug:slug, d:d, i:0, answers:lastRun[slug].answers, extra:lastRun[slug].extra,
            ui:{}, steps:[], completed:true, allocation:lastRun[slug].allocation };
    document.body.classList.add("modal-open");
    host.style.display="block";
    renderResults(); return true;
  }
  run = { slug:slug, d:d, i:0, answers:{}, extra:{}, ui:{} };
  d.slots.forEach(function(s){ var r=resolve(s); if (r) run.steps=(run.steps||[]).concat([{slot:s, rung:r}]); });
  run.steps = run.steps || [];
  if (!run.steps.length){ run.steps=[{slot:{id:"empty"}, rung:{mechanic:"learn", eyebrow:d.title, title:"Nothing to ask you right now.", body:["This activity works from things you've said elsewhere, and there's nothing new to compare yet."], cta:"Okay"}}]; }
  document.body.classList.add("modal-open");
  host.style.display="block";
  renderStep(); return true;
}
function close(){ host.style.display="none"; host.innerHTML=""; document.body.classList.remove("modal-open"); run=null; }
function next(){ run.i++; renderStep(); }
function back(){ run.i=Math.max(0,run.i-1); renderStep(); }
function cur(){ return run.steps[run.i]; }

/* ---------- shell --------------------------------------------------- */
function shell(r, inner, footer){
  var v=view();
  var scene = val(r.scene, v) || []; if (typeof scene==="string") scene=[scene];
  var h = '<div class="am-card"><div class="am-top"><span class="am-eyebrow">'+esc(val(r.eyebrow,v))+'</span><span class="am-dots">'+run.steps.map(function(_,k){return '<i class="'+(k<run.i?"done":k===run.i?"now":"")+'"></i>';}).join("")+'</span><button class="am-x" onclick="YNSMock.close()" aria-label="Close">×</button></div>';
  h += '<h2>'+esc(val(r.title,v))+'</h2>';
  if (r.provenance) h += '<p class="am-prov">'+esc(val(r.provenance,v))+'</p>';
  scene.forEach(function(p){ h+='<p class="am-scene">'+p+'</p>'; });   /* scene may carry <b> */
  h += inner;
  if (footer!==false) h += '<div class="am-foot">'+(footer||'')+'</div>';
  h += (run.i>0?'<button class="btn-quiet am-back" onclick="YNSMock.back()">Back</button>':'')+'</div>';
  host.innerHTML=h; host.scrollTop=0;
}
function primary(label, fn, disabled){ return '<button class="btn btn-primary" onclick="'+fn+'" '+(disabled?'disabled':'')+'>'+esc(label||"Next")+'</button>'; }
function skip(r){ return r.optional ? '<button class="btn-quiet" onclick="YNSMock.skipStep()">'+esc(r.skipLabel||"Skip this one")+'</button>' : '<span></span>'; }
function skipStep(){ var r=cur().rung; if (r.skipTo){ var j=run.i+1; while (j<run.steps.length && run.steps[j].slot.id!==r.skipTo) j++; run.i=j; renderStep(); } else next(); }
function prompt(r){ var p=val(r.prompt); return p ? '<p class="am-prompt">'+esc(p)+'</p>' : ''; }

/* ---------- mechanics ---------------------------------------------- */
var M = {};

M.learn = function(r){
  var v=view(), h='';
  var stat=val(r.stat,v); if (stat) h+='<div class="am-stat">'+esc(stat)+'</div>';
  var lead=val(r.lead,v); if (lead) h+='<p class="am-lead">'+esc(lead)+'</p>';
  var ex=val(r.example,v); if (ex) h+='<div class="am-ex"><div class="am-ex-l">'+esc(ex.label||"")+'</div><div class="am-ex-row"><span>'+esc(ex.fromLabel||"")+'</span><b>'+esc(ex.from||"")+'</b></div><div class="am-ex-row"><span>'+esc(ex.toLabel||"")+'</span><b>'+esc(ex.to||"")+'</b></div>'+(ex.note?'<div class="am-ex-n">'+esc(ex.note)+'</div>':'')+'</div>';
  var pts=val(r.points,v)||[]; if (pts.length) h+='<ul class="am-points">'+pts.map(function(p){return '<li>'+p+'</li>';}).join("")+'</ul>';
  var body=val(r.body,v)||[]; if (typeof body==="string") body=[body]; body.forEach(function(p){ h+='<p class="am-scene">'+esc(p)+'</p>'; });
  var note=val(r.note,v); if (note) h+='<p class="am-note">'+esc(note)+'</p>';
  shell(r, h, '<span></span>'+primary(r.cta,"YNSMock.next()"));
};

M.choice = function(r){
  var h = prompt(r)+'<div class="am-opts">'+r.options.map(function(o){ return '<button class="opt" onclick="YNSMock.pick(\''+esc(o.k)+'\')"><i class="dot"></i><div><strong>'+esc(o.t)+'</strong>'+(o.s?'<span>'+esc(o.s)+'</span>':'')+'</div></button>'; }).join("")+'</div>';
  shell(r, h, r.optional ? skip(r) : false);
};
function pick(k){
  var s=cur(), r=s.rung, id=s.slot.id; var o=r.options.filter(function(x){return x.k===k;})[0];
  run.answers[id]=k; run.extra[id+"_label"]=o?o.t:k; if (o&&o.echo) run.extra[id+"_echo"]=o.echo;
  if (r.asks) facts[r.asks] = (o && o.fact!=null) ? o.fact : k;
  /* An activity can react to a single answer before the next screen
     renders. Used where a later screen needs something derived from
     this one plus a fact it does not carry. */
  if (run.d.onStep) { try { run.d.onStep({ slot:id, answer:k, facts:facts, extra:run.extra, setFact:function(a,b){ facts[a]=b; } }); } catch(e){} }
  next();
}

M.text = function(r){
  var pre=""; if (r.prefill){ try { pre=r.prefill({facts:facts, extra:run.extra, answers:run.answers, derived:derived()})||""; } catch(e){} }
  /* A short reference card, for screens where the person is being asked
     to apply something rather than recall it. Sits above the box so it
     is readable while typing rather than a thing they scrolled past. */
  var aside = r.aside ? '<div class="am-aside"><b>'+esc(r.aside.title)+'</b><ul>'
      + r.aside.points.map(function(x){ return "<li>"+x+"</li>"; }).join("")
      + "</ul>"+(r.aside.note?'<span>'+esc(r.aside.note)+'</span>':'')+"</div>" : "";
  var h = prompt(r)+aside+'<textarea id="amText" rows="'+(r.rows||4)+'" maxlength="'+(r.maxLength||600)+'" placeholder="'+esc(r.placeholder||"")+'">'+esc(pre)+'</textarea>';
  if (pre) h += '<p class="am-note">We started this for you. Change any of it.</p>';
  if (r.examples) h += '<div class="am-examples"><span>Examples</span>'+r.examples.map(function(e){return '<button type="button" class="am-chip" onclick="YNSMock.useExample(this)">'+esc(e)+'</button>';}).join("")+'</div>';
  if (r.tags) h += '<p class="am-prompt">'+esc(r.tagPrompt||"")+'</p><div class="am-tags">'+r.tags.map(function(t){return '<button type="button" class="am-tag" data-k="'+esc(t.k)+'" onclick="YNSMock.tag(this)">'+esc(t.t)+'</button>';}).join("")+'</div>';
  shell(r, h, skip(r)+primary(r.cta,"YNSMock.submitText()"));
};
function submitText(){
  var s=cur(), r=s.rung, id=s.slot.id; var t=$("amText").value.trim();
  if(!t && !r.optional){ $("amText").focus(); return; }
  run.extra[id+"_text"]=t; if (r.asks && t) facts[r.asks]=t;
  if (r.tags && run.ui.tag){ run.extra[id+"_tag"]=run.ui.tag; if (r.tagAsks) facts[r.tagAsks]=run.ui.tag; run.ui.tag=null; }
  next();
}

M.buildup = function(r){
  var b=run.ui.build||(run.ui.build={}); var sum=0;
  r.rows.forEach(function(row){ if (b[row.k]==null) b[row.k]=row.start||0; sum+=b[row.k]; });
  /* Typed in, not dragged. A slider is a bad way to say "$1,250" and an
     even worse one on a phone; people already know their rent. The
     stepper buttons stay for nudging, and the field takes the number. */
  var h = prompt(r)+'<div class="am-total"><b id="amSum">$'+sum.toLocaleString("en-US")+'</b><span>'+esc(r.totalLabel||"a month")+'</span></div><div class="am-build">'+r.rows.map(function(row){
    return '<div class="am-row"><div><strong>'+esc(row.t)+'</strong>'+(row.s?'<span>'+esc(row.s)+'</span>':'')+'</div>'
      +'<div class="am-step"><button type="button" onclick="YNSMock.bump(\''+row.k+'\',-'+row.step+')" aria-label="less">\u2212</button>'
      +'<span class="am-money"><i>$</i><input type="text" inputmode="numeric" value="'+b[row.k].toLocaleString("en-US")+'" data-k="'+row.k+'" aria-label="'+esc(row.t)+'" oninput="YNSMock.typeAmount(this)"></span>'
      +'<button type="button" onclick="YNSMock.bump(\''+row.k+'\','+row.step+')" aria-label="more">+</button></div></div>';
  }).join("")+'</div>';
  shell(r, h, '<span></span>'+primary(r.cta,"YNSMock.submitBuild()", sum<(r.minTotal||0)));
};
/* Parse as they type, keep the total live, never repaint the field they
   are inside. */
function typeAmount(input){
  var k=input.getAttribute("data-k");
  var n=parseInt(String(input.value).replace(/[^0-9]/g,""),10); if (isNaN(n)) n=0;
  var r=cur().rung, row=r.rows.filter(function(x){return x.k===k;})[0];
  if (row && row.max && n>row.max) n=row.max;
  run.ui.build[k]=n;
  refreshSum();
}
function refreshSum(){
  var r=cur().rung, b=run.ui.build||{}, sum=0;
  r.rows.forEach(function(row){ sum+=b[row.k]||0; });
  var el=host.querySelector("#amSum"); if (el) el.textContent="$"+sum.toLocaleString("en-US");
  var cta=host.querySelector(".am-foot .btn-primary"); if (cta) cta.disabled = sum<(r.minTotal||0);
}
function bump(k,d){
  var r=cur().rung, row=r.rows.filter(function(x){return x.k===k;})[0], b=run.ui.build;
  var n=(b[k]||0)+d; if(n<0)n=0; if(row&&row.max&&n>row.max)n=row.max; b[k]=n;
  var input=host.querySelector('input[data-k="'+k+'"]'); if (input) input.value=n.toLocaleString("en-US");
  refreshSum();
}
function submitBuild(){
  var s=cur(), r=s.rung, id=s.slot.id, b=run.ui.build||{}; var sum=0; r.rows.forEach(function(row){sum+=b[row.k]||0;});
  run.extra[id+"_total"]=sum; run.extra[id+"_number"]=sum; run.extra[id+"_rows"]=b;
  if (r.factsFrom){ var f=r.factsFrom(sum)||{}; Object.keys(f).forEach(function(k){facts[k]=f[k];}); }
  else if (r.asks) facts[r.asks]=sum;
  run.ui.build=null; next();
}

M.estimate = function(r){
  var v=view(), lo=r.min||0, hi=r.max||200000, step=r.step||1000;
  var g = run.ui.guess==null ? Math.round((lo+hi)/2) : run.ui.guess;
  var subject=val(r.subject,v);
  var h = (subject?'<p class="am-lead">'+esc(subject)+'</p>':'')+prompt(r);
  if (!run.ui.revealed){
    h += '<div class="am-total"><b>$'+g.toLocaleString("en-US")+'</b><span>a year, your guess</span></div>'+
         '<input type="range" id="amRange" min="'+lo+'" max="'+hi+'" step="'+step+'" value="'+g+'" oninput="YNSMock.guess(this.value)">';
    shell(r, h, '<span></span>'+primary("Show me the real figure","YNSMock.reveal()"));
  } else {
    var truth = 0; try { truth = r.truth(v); } catch(e){}
    var off=Math.abs(g-truth), pct=truth?Math.round(off/truth*100):0;
    h += '<div class="am-total"><b>$'+g.toLocaleString("en-US")+'</b><span>your guess</span></div>'+
         '<div class="am-total"><b>$'+truth.toLocaleString("en-US")+'</b><span>'+esc(r.truthLabel||"the published figure")+'</span></div>'+
         '<p class="am-lead">'+(pct<=10?"You were close.":"You were out by about "+pct+"%."+(g<truth?" It pays more than you thought.":" It pays less than you thought."))+'</p>'+
         (r.note?'<p class="am-note">'+esc(val(r.note,v))+'</p>':'');
    shell(r, h, '<span></span>'+primary("Okay","YNSMock.finishEstimate()"));
  }
};
function finishEstimate(){ var id=cur().slot.id; run.extra[id+"_guess"]=run.ui.guess; run.ui.guess=null; run.ui.revealed=false; next(); }

M.sort = function(r){
  var st=run.ui.sort||(run.ui.sort={i:0,a:[],b:[]}); var cards=r.cards;
  if (st.i>=cards.length){
    var id=cur().slot.id; run.extra[id+"_sortPiles"]={a:st.a,b:st.b};
    if (r.factsFrom){ var f=r.factsFrom({a:st.a,b:st.b})||{}; Object.keys(f).forEach(function(k){facts[k]=f[k];}); }
    run.ui.sort=null; return next();
  }
  var c=cards[st.i];
  var h = prompt(r)+'<div class="am-sortcard"><span class="am-note">Card '+(st.i+1)+' of '+cards.length+'</span><strong>'+esc(c.t)+'</strong>'+(c.s?'<p class="am-scene">'+esc(c.s)+'</p>':'')+'</div>'+
    '<div class="am-piles"><button class="btn btn-ghost" onclick="YNSMock.sortTo(\'a\')">'+esc(r.pileA||"A")+'</button><button class="btn btn-primary" onclick="YNSMock.sortTo(\'b\')">'+esc(r.pileB||"B")+'</button></div>'+
    (r.pileHint?'<p class="am-note">'+esc(r.pileHint)+'</p>':'')+
    '<div class="am-pilecount"><span>'+esc(r.pileA)+': '+st.a.length+'</span><span>'+esc(r.pileB)+': '+st.b.length+'</span></div>';
  shell(r, h, false);
};
function sortTo(p){ var st=run.ui.sort; var c=cur().rung.cards[st.i]; st[p].push(c.k); st.i++; renderStep(); }

M.collect = function(r){
  var st=run.ui.items||(run.ui.items=[]); var full = st.length>=(r.count||3);
  var h = prompt(r)+'<div class="am-items">'+st.map(function(it,i){ var lbl=(r.tags||[]).filter(function(t){return t.k===it.tag;})[0]; return '<div class="am-item"><span>'+esc(it.text)+'</span>'+(lbl?'<em>'+esc(lbl.t)+'</em>':'')+'<button type="button" onclick="YNSMock.removeItem('+i+')" aria-label="Remove">×</button></div>'; }).join("")+'</div>';
  if (!full){
    h += '<label class="am-note">'+esc(r.itemLabel||"One")+'</label><textarea id="amText" rows="3" placeholder="'+esc(r.placeholder||"")+'"></textarea>';
    if (r.tags) h += '<p class="am-prompt">'+esc(r.tagPrompt||"")+'</p><div class="am-tags">'+r.tags.map(function(t){return '<button type="button" class="am-tag" data-k="'+esc(t.k)+'" onclick="YNSMock.tag(this)">'+esc(t.t)+'</button>';}).join("")+'</div>';
    h += '<div style="margin-top:10px"><button class="btn btn-ghost" onclick="YNSMock.addItem()">Add this one</button></div>';
  }
  var can = st.length>=(r.min||1);
  shell(r, h, '<span></span>'+primary(full?(r.ctaFull||r.cta):(r.cta||"Done"),"YNSMock.submitCollect()",!can));
};
function addItem(){ var t=$("amText").value.trim(); if(!t){ $("amText").focus(); return; } run.ui.items.push({text:t, tag:run.ui.tag||null}); run.ui.tag=null; renderStep(); }
function removeItem(i){ run.ui.items.splice(i,1); renderStep(); }
function submitCollect(){ var s=cur(), r=s.rung, id=s.slot.id, items=run.ui.items||[]; run.extra[id+"_items"]=items; if (r.asks) facts[r.asks]=items.map(function(x){return {moment:x.text, skill:x.tag};}); run.ui.items=null; next(); }

M.hours = function(r){
  var st=run.ui.hours||(run.ui.hours={perDay:{}, weekly:{}, days:{}});
  var total=r.total||168, used=0;
  r.rows.forEach(function(row){ if (row.daily){ if (st.days[row.k]==null) st.days[row.k]=row.daily.days; if (st.perDay[row.k]==null) st.perDay[row.k]=0; st.weekly[row.k]=st.perDay[row.k]*st.days[row.k]; } else if (st.weekly[row.k]==null) st.weekly[row.k]=0; used+=st.weekly[row.k]; });
  var left=total-used;
  /* Typed, not dragged. Everyone knows roughly how many hours they sleep;
     nobody can land a slider on 7.5 with a thumb. */
  var h = prompt(r)+'<div class="am-total"><b id="hrUsed">'+Math.round(used)+'</b><span id="hrNote">of '+total+' hours placed · '+(left>=0?Math.round(left)+" left":Math.round(-left)+" over")+'</span></div><div class="am-build">'+r.rows.map(function(row){
    var daily=!!row.daily, v=daily?st.perDay[row.k]:st.weekly[row.k];
    return '<div class="am-row am-hrow"><div><strong>'+esc(row.t)+'</strong><span>'+esc(row.s||"")+'</span></div>'+
      '<div class="am-hval"><span class="am-money"><input type="text" inputmode="decimal" value="'+v+'" data-h="'+row.k+'" aria-label="'+esc(row.t)+'" oninput="YNSMock.hour(this.getAttribute(\'data-h\'),this.value)"></span><span>'+(daily?"hrs a day":"hrs a week")+'</span>'+(daily?'<em id="hw-'+row.k+'">'+Math.round(st.weekly[row.k]*10)/10+'/wk</em>':'')+
      (daily&&row.daily.adjustable?'<div class="am-days"><button type="button" onclick="YNSMock.days(\''+row.k+'\',-1)">−</button>'+st.days[row.k]+' days<button type="button" onclick="YNSMock.days(\''+row.k+'\',1)">+</button></div>':'')+'</div></div>';
  }).join("")+'</div>';
  shell(r, h, '<span></span>'+primary(r.cta,"YNSMock.submitHours()", left<0));
};
function hour(k,v){
  var st=run.ui.hours, r=cur().rung, row=r.rows.filter(function(x){return x.k===k;})[0];
  var n=parseFloat(String(v).replace(/[^0-9.]/g,"")); if (isNaN(n)) n=0;
  if (row.max && n>row.max) n=row.max;
  if (row.daily){ st.perDay[k]=n; st.weekly[k]=n*st.days[k]; } else st.weekly[k]=n;
  /* Patch the total and this row's weekly figure; never repaint the field
     someone is typing in. */
  var total=r.total||168, used=0;
  r.rows.forEach(function(x){ used += (x.daily ? (st.perDay[x.k]||0)*st.days[x.k] : (st.weekly[x.k]||0)); });
  var b=host.querySelector("#hrUsed"); if (b) b.textContent=Math.round(used);
  var sp=host.querySelector("#hrNote"); if (sp) sp.textContent="of "+total+" hours placed \u00b7 "+(total-used>=0?Math.round(total-used)+" left":Math.round(used-total)+" over");
  var wk=host.querySelector("#hw-"+k); if (wk) wk.textContent=Math.round(st.weekly[k]*10)/10+"/wk";
  var cta=host.querySelector(".am-foot .btn-primary"); if (cta) cta.disabled = used>total;
}
function days(k,d){ var st=run.ui.hours; st.days[k]=Math.min(7,Math.max(1,st.days[k]+d)); st.weekly[k]=(st.perDay[k]||0)*st.days[k]; renderStep(); }
function renderStepKeepFocus(k){ renderStep(); var el=host.querySelector('input[oninput*="\''+k+'\'"]'); if (el) el.focus(); }
function submitHours(){ var s=cur(), r=s.rung, id=s.slot.id, st=run.ui.hours; var alloc={}; r.rows.forEach(function(row){ alloc[row.k]=st.weekly[row.k]||0; }); run.extra[id+"_allocation"]=alloc; run.allocation=alloc; run.ui.hours=null; next(); }

M.compose = function(r){
  var b=run.ui.blanks||(run.ui.blanks={});
  var msg=r.template.replace(/\{(\w+)\}/g,function(_,k){ var bl=r.blanks.filter(function(x){return x.k===k;})[0]; return b[k]||("["+(bl?bl.placeholder:k)+"]"); });
  var h = prompt(r)+'<div class="am-blanks">'+r.blanks.map(function(bl){ return '<label><span>'+esc(bl.t)+'</span><input type="text" value="'+esc(b[bl.k]||"")+'" placeholder="'+esc(bl.placeholder||"")+'" oninput="YNSMock.blank(\''+bl.k+'\',this.value)"></label>'; }).join("")+'</div>'+
    '<pre class="am-msg">'+esc(msg)+'</pre>';
  shell(r, h, '<span></span>'+primary(r.cta,"YNSMock.submitCompose()"));
};
function blank(k,v){ run.ui.blanks[k]=v; var pre=host.querySelector(".am-msg"); var r=cur().rung; if (pre) pre.textContent=r.template.replace(/\{(\w+)\}/g,function(_,kk){ var bl=r.blanks.filter(function(x){return x.k===kk;})[0]; return run.ui.blanks[kk]||("["+(bl?bl.placeholder:kk)+"]"); }); }
function submitCompose(){
  var s=cur(), r=s.rung, id=s.slot.id, b=run.ui.blanks||{};
  run.extra[id+"_blanks"]=b;
  /* Keep the assembled sentence, not just the pieces. Anything built from
     a template is usually the thing you want to quote back. */
  var msg=r.template.replace(/\{(\w+)\}/g,function(_,k){ var bl=r.blanks.filter(function(x){return x.k===k;})[0]; return b[k]||("["+(bl?bl.placeholder:k)+"]"); });
  run.extra[id+"_text"]=msg;
  if (r.asks) facts[r.asks] = r.asksText ? msg : !!(b.name||"").trim();
  run.ui.blanks=null; next();
}

M.diff = function(r){
  var rows = run.ui.rows || (run.ui.rows = (function(){ try { return r.rows(ctx())||[]; } catch(e){ return []; } })());
  var d=run.ui.diff||(run.ui.diff={});
  if (!rows.length){ shell(r, '<p class="am-lead">Nothing to compare yet. Do a couple of activities first and come back.</p>', '<span></span>'+primary("Okay","YNSMock.close()")); return; }
  var h = prompt(r)+'<div class="am-diff">'+rows.map(function(row){ return '<div class="am-drow"><div><span class="am-note">'+esc(row.label)+(row.when?' · '+esc(row.when):'')+'</span><strong>'+esc(row.then)+'</strong></div><div class="am-dbtns"><button type="button" class="'+(d[row.key]==="true"?"on":"")+'" onclick="YNSMock.diffMark(\''+row.key+'\',\'true\')">Still true</button><button type="button" class="'+(d[row.key]==="changed"?"on":"")+'" onclick="YNSMock.diffMark(\''+row.key+'\',\'changed\')">Not any more</button></div></div>'; }).join("")+'</div>';
  shell(r, h, '<span></span>'+primary(r.cta,"YNSMock.submitDiff()"));
};
function diffMark(k,v){ run.ui.diff[k]=v; renderStep(); }
function submitDiff(){ var id=cur().slot.id, rows=run.ui.rows||[], d=run.ui.diff||{}; run.extra[id+"_diff"]=d; run.extra[id+"_changedRows"]=rows.filter(function(x){return d[x.key]==="changed";}); run.ui.rows=null; run.ui.diff=null; next(); }

M.chain = function(r){
  var k=run.ui.chainPick;
  if (!k){
    shell(r, prompt(r)+'<div class="am-opts">'+r.options.map(function(o){ return '<button class="opt" onclick="YNSMock.chainPick(\''+esc(o.k)+'\')"><i class="dot"></i><div><strong>'+esc(o.t)+'</strong>'+(o.s?'<span>'+esc(o.s)+'</span>':'')+'</div></button>'; }).join("")+'</div>', false);
  } else {
    var o=r.options.filter(function(x){return x.k===k;})[0];
    shell(r, '<div class="am-chain"><strong>'+esc(o.t)+'</strong><p class="am-scene">'+esc(o.then||"")+'</p>'+(o.cost?'<p class="am-cost">'+esc(o.cost)+'</p>':'')+'</div>', '<button class="btn-quiet" onclick="YNSMock.chainPick(null)">Pick a different one</button>'+primary(r.cta,"YNSMock.submitChain()"));
  }
};
function chainPick(k){ run.ui.chainPick=k; renderStep(); }
function submitChain(){ var s=cur(), r=s.rung, id=s.slot.id, k=run.ui.chainPick; var o=r.options.filter(function(x){return x.k===k;})[0]; run.answers[id]=k; run.extra[id+"_label"]=o?o.t:k; if (r.asks) facts[r.asks]=(o&&o.fact!=null)?o.fact:k; run.ui.chainPick=null; next(); }

/* A batch of short items, each answered from the same small set. Built
   for interest inventories: many questions, one tap each, no scrolling
   back and forth between a question and its answer. Answers accumulate
   across every rate screen in the activity under extra.rate_all, so the
   results function sees the whole instrument in one place. */
M.rate = function(r){
  var all=run.extra.rate_all||(run.extra.rate_all={});
  var done=r.items.every(function(it){ return all[it.k]; });
  var h = prompt(r)+'<div class="am-rate">'+r.items.map(function(it){
    return '<div class="am-ritem" data-k="'+it.k+'"><span class="am-rq">'+esc(it.t)+'</span><div class="am-ropts">'
      + r.options.map(function(o){ return '<button type="button" data-v="'+o.k+'" class="'+(all[it.k]===o.k?"on":"")+'" onclick="YNSMock.rate(\''+it.k+'\',\''+o.k+'\')">'+esc(o.t)+'</button>'; }).join("")
      + '</div></div>';
  }).join("")+'</div>';
  shell(r, h, '<span></span>'+primary(r.cta,"YNSMock.submitRate()", !done));
};
function rate(k,v){
  run.extra.rate_all[k]=v;
  /* Patch the one row rather than repainting the screen. Repainting on
     every tap loses the scroll position, which on a phone means the
     list jumps under your thumb between question two and question
     three. */
  var row=host.querySelector('.am-ritem[data-k="'+k+'"]');
  if (row) row.querySelectorAll(".am-ropts button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-v")===v); });
  var r=cur().rung, all=run.extra.rate_all;
  var done=r.items.every(function(it){ return all[it.k]; });
  var cta=host.querySelector(".am-foot .btn-primary");
  if (cta) cta.disabled=!done;
}
function submitRate(){ next(); }

/* ---- budget: give every dollar a job ------------------------------
   Income at the top, categories underneath, and a live "still to
   assign" figure. Typed, never dragged. */
M.budget = function(r){
  var st=run.ui.budget||(run.ui.budget={alloc:{}});
  var income = facts[r.incomeFrom] || run.extra.income_total || 0;
  st.income=income;
  r.rows.forEach(function(row){ if (st.alloc[row.k]==null) st.alloc[row.k]=0; });
  /* The savings decision made earlier arrives already filled in, so it is
     in the budget before anything competes with it. */
  if (r.seedFrom && !st.seeded){
    var seed=facts[r.seedFrom];
    if (seed && seed.k!=null && st.alloc[seed.k]!=null) st.alloc[seed.k]=seed.v;
    st.seeded=true;
  }
  var assigned=0; Object.keys(st.alloc).forEach(function(k){ assigned+=st.alloc[k]||0; });
  var left=income-assigned;
  var groups=[], seen={};
  r.rows.forEach(function(row){ if(!seen[row.group]){ seen[row.group]=1; groups.push(row.group); } });
  var h = prompt(r)
    + '<div class="am-total"><b id="bgLeft">'+(left<0?"-":"")+"$"+Math.abs(Math.round(left)).toLocaleString("en-US")+'</b><span id="bgNote">'+(left>0?"still to assign, of $"+income.toLocaleString("en-US"):left<0?"more than you\u2019ve got":"every dollar has a job")+'</span></div>'
    + groups.map(function(g){
        return '<h3 class="am-group">'+esc(g)+'</h3><div class="am-build">'
          + r.rows.filter(function(x){return x.group===g;}).map(function(row){
              return '<div class="am-row"><div><strong>'+esc(row.t)+'</strong>'+(row.s?'<span>'+esc(row.s)+'</span>':'')+'</div>'
                +'<div class="am-step"><span class="am-money"><i>$</i><input type="text" inputmode="numeric" value="'+st.alloc[row.k].toLocaleString("en-US")+'" data-b="'+row.k+'" aria-label="'+esc(row.t)+'" oninput="YNSMock.budgetType(this)"></span></div></div>';
            }).join("")
          + "</div>";
      }).join("");
  shell(r, h, '<span></span>'+primary(r.cta,"YNSMock.submitBudget()"));
};
function budgetType(input){
  var k=input.getAttribute("data-b");
  var n=parseInt(String(input.value).replace(/[^0-9]/g,""),10); if (isNaN(n)) n=0;
  run.ui.budget.alloc[k]=n;
  var st=run.ui.budget, assigned=0;
  Object.keys(st.alloc).forEach(function(x){ assigned+=st.alloc[x]||0; });
  var left=st.income-assigned;
  var b=host.querySelector("#bgLeft"), note=host.querySelector("#bgNote");
  if (b) b.textContent=(left<0?"-":"")+"$"+Math.abs(Math.round(left)).toLocaleString("en-US");
  if (note) note.textContent=left>0?"still to assign, of $"+st.income.toLocaleString("en-US"):left<0?"more than you\u2019ve got":"every dollar has a job";
  if (b) b.className = left===0 ? "bg-zero" : left<0 ? "bg-over" : "";
}
function submitBudget(){
  var s2=cur(), r=s2.rung, id=s2.slot.id, st=run.ui.budget;
  run.extra[id+"_alloc"]=st.alloc; run.extra[id+"_income"]=st.income;
  if (r.asks) facts[r.asks]=st.alloc;
  lastBudget={ rows:r.rows, alloc:st.alloc, income:st.income };
  run.ui.budget=null; next();
}
/* The export. A budget that only lives on a website is a budget nobody
   updates, so it leaves as a CSV with a spent column and a difference
   column already in it. */
var lastBudget=null;
function exportBudget(){
  if (!lastBudget) return;
  var rows=[["Category","Group","Planned","Actually spent","Difference"]];
  lastBudget.rows.forEach(function(row){
    var n=lastBudget.alloc[row.k]||0;
    rows.push([row.t, row.group, n, "", ""]);
  });
  rows.push([]);
  rows.push(["Income","",lastBudget.income,"",""]);
  rows.push(["Assigned","","=SUM(C2:C"+(lastBudget.rows.length+1)+")","",""]);
  rows.push(["Left to assign","","=C"+(rows.length-1)+"-C"+rows.length,"",""]);
  var csv=rows.map(function(r2){ return r2.map(function(c){
    var v=String(c==null?"":c); return /[",]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v;
  }).join(","); }).join("\n");
  var blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  var a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="my-budget.csv";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

/* ---- calc: a live calculator, typed --------------------------------
   Used by the compound-interest activity. Generic enough for any
   "change the numbers, watch the answer" screen. */
M.calc = function(r){
  var v=run.ui.calc||(run.ui.calc={});
  r.inputs.forEach(function(i){ if (v[i.k]==null) v[i.k]=i.start; });
  /* A screen can bring its own maths and its own readout. `mode` still
     selects one of the three built-in calculators for everything else. */
  var res=(r.compute||compute)(v, r.mode);
  var h = prompt(r)+'<div class="am-build">'+r.inputs.map(function(i){
    return '<div class="am-row"><div><strong>'+esc(i.t)+'</strong>'+(i.s?'<span>'+esc(i.s)+'</span>':'')+'</div>'
      +'<div class="am-step"><button type="button" onclick="YNSMock.calcBump(\''+i.k+'\',-'+i.step+')" aria-label="less">\u2212</button>'
      +'<span class="am-money">'+(i.prefix?'<i>'+i.prefix+'</i>':'')+'<input type="text" inputmode="numeric" value="'+v[i.k]+'" data-c="'+i.k+'" aria-label="'+esc(i.t)+'" oninput="YNSMock.calcType(this)">'+(i.suffix?'<i>'+i.suffix+'</i>':'')+'</span>'
      +'<button type="button" onclick="YNSMock.calcBump(\''+i.k+'\','+i.step+')" aria-label="more">+</button></div></div>';
  }).join("")+'</div>'
  + '<div class="am-calcout" id="calcOut">'+(r.render||calcHTML)(res,v,r.mode)+'</div>';
  shell(r, h, '<span></span>'+primary(r.cta,"YNSMock.submitCalc()"));
};
function compute(v, mode){
  /* Three calculators share one mechanic. `mode` picks the maths and
     the readout; the inputs are whatever the activity declared. */
  if (mode==="match"){
    var sal=v.salary||0, you=(v.you||0)/100, mt=(v.match||0)/100;
    var youYear=sal*you, matchYear=sal*mt, total=youYear+matchYear;
    var bal=0, r2=0.07/12, mo=total/12;
    for (var i=0;i<120;i++) bal=(bal+mo)*(1+r2);
    return { youYear:youYear, matchYear:matchYear, tenYear:bal };
  }
  if (mode==="net"){
    var g=v.salary||0, pct=(v.pct||0)/100;
    return { outYear:g*pct, netYear:g*(1-pct), netMonth:g*(1-pct)/12 };
  }
  var m=v.monthly||0, yrs=v.years||0, rate=(v.rate||0)/100;
  function run2(years){
    var bal=0, r2=rate/12, n=Math.round(years*12);
    for (var i=0;i<n;i++) bal=(bal+m)*(1+r2);
    return bal;
  }
  var end=run2(yrs), paid=m*Math.round(yrs*12);
  return { end:end, paid:paid, growth:Math.max(0,end-paid), late:run2(Math.max(0,yrs-10)) };
}
function calcHTML(res,v,mode){
  if (mode==="match"){
    return '<div class="calc-big">$'+Math.round(res.matchYear).toLocaleString("en-US")+' a year</div>'
      +'<p class="calc-sub">from your employer, for $'+Math.round(res.youYear).toLocaleString("en-US")+' from you</p>'
      +'<p class="calc-late">'+(res.matchYear>0 ? "Over ten years at the same numbers, about $"+Math.round(res.tenYear).toLocaleString("en-US")+" in the account, using the same 7% assumption as the compounding activity." : "No match means no free money on this one. A Roth IRA is the one you open yourself.")+'</p>';
  }
  if (mode==="net"){
    return '<div class="calc-big">$'+Math.round(res.netMonth).toLocaleString("en-US")+' a month</div>'
      +'<p class="calc-sub">lands in your account, from $'+Math.round(v.salary||0).toLocaleString("en-US")+' a year on the offer</p>'
      +'<p class="calc-late">About $'+Math.round(res.outYear).toLocaleString("en-US")+' a year comes out across tax, FICA and anything you chose. Rule of thumb, not your actual withholding.</p>';
  }
  var pct = res.end ? Math.min(100, Math.round(res.paid/res.end*100)) : 0;
  return '<div class="calc-big">$'+Math.round(res.end).toLocaleString("en-US")+'</div>'
    +'<p class="calc-sub">after '+(v.years||0)+' years, from $'+(v.monthly||0)+' a month</p>'
    +'<div class="calc-bar"><i style="width:'+pct+'%"></i></div>'
    +'<p class="calc-key"><span class="k1"></span>$'+Math.round(res.paid).toLocaleString("en-US")+' you put in &nbsp; <span class="k2"></span>$'+Math.round(res.growth).toLocaleString("en-US")+' growth</p>'
    +'<p class="calc-late">Start ten years later instead and the same amount reaches $'+Math.round(res.late).toLocaleString("en-US")+'.</p>';
}
function refreshCalc(){
  var r=cur().rung, v=run.ui.calc, out=host.querySelector("#calcOut");
  if (out) out.innerHTML=(r.render||calcHTML)((r.compute||compute)(v,r.mode),v,r.mode);
}
function calcType(input){
  var k=input.getAttribute("data-c");
  var n=parseFloat(String(input.value).replace(/[^0-9.]/g,"")); if (isNaN(n)) n=0;
  var i=cur().rung.inputs.filter(function(x){return x.k===k;})[0];
  if (i && i.max && n>i.max) n=i.max;
  run.ui.calc[k]=n; refreshCalc();
}
function calcBump(k,d){
  var i=cur().rung.inputs.filter(function(x){return x.k===k;})[0];
  var n=(run.ui.calc[k]||0)+d; if(n<0)n=0; if(i&&i.max&&n>i.max)n=i.max;
  run.ui.calc[k]=n;
  var input=host.querySelector('input[data-c="'+k+'"]'); if (input) input.value=n;
  refreshCalc();
}
function submitCalc(){
  var s2=cur(), r=s2.rung, id=s2.slot.id, v=run.ui.calc;
  run.extra[id+"_values"]=v; run.extra[id+"_result"]=(r.compute||compute)(v, r.mode);
  if (r.asks) facts[r.asks]=v.monthly;
  run.ui.calc=null; next();
}

M.compare = function(r){
  var v=view(), routes=val(r.routes,v)||[], p=run.ui.picks||(run.ui.picks={});
  var h = prompt(r)+'<div class="am-table"><table><thead><tr><th>'+esc(r.rowHeader||"")+'</th>'+r.columns.map(function(c){return '<th>'+esc(c.t)+'</th>';}).join("")+'<th></th></tr></thead><tbody>'+
    routes.map(function(x){ return '<tr><td><strong>'+esc(x.t)+'</strong><span>'+esc(x.s||"")+'</span></td>'+r.columns.map(function(c){return '<td>'+esc(x[c.k]||"")+'</td>';}).join("")+'<td class="am-yn"><button type="button" class="'+(p[x.k]==="yes"?"on":"")+'" onclick="YNSMock.compareMark(\''+x.k+'\',\'yes\')">Yes</button><button type="button" class="'+(p[x.k]==="no"?"on":"")+'" onclick="YNSMock.compareMark(\''+x.k+'\',\'no\')">No</button></td></tr>'; }).join("")+'</tbody></table></div>';
  shell(r, h, '<span></span>'+primary(r.cta,"YNSMock.submitCompare()", Object.keys(p).length<routes.length));
};
function compareMark(k,v){ run.ui.picks[k]=v; renderStep(); }
function submitCompare(){ var s=cur(), r=s.rung, id=s.slot.id, p=run.ui.picks||{}; var routes=val(r.routes)||[]; run.extra[id+"_picks"]=p; run.extra[id+"_rowCount"]=routes.length; var yes=routes.filter(function(x){return p[x.k]==="yes";})[0]; if (r.asks && yes) facts[r.asks]=yes.k; run.ui.picks=null; next(); }

/* ---------- render / results --------------------------------------- */
function renderStep(){
  if (run.i>=run.steps.length) return renderResults();
  var r=cur().rung, fn=M[r.mechanic];
  if (!fn){ shell(r, '<p class="am-note">This mock can\'t render the "'+esc(r.mechanic)+'" mechanic yet.</p>', '<span></span>'+primary("Skip","YNSMock.next()")); return; }
  fn(r);
}
function renderResults(){
  var d=run.d;
  var r={ esc:esc, extra:run.extra, ctx:ctx(), state:{answers:run.answers, extra:run.extra, allocation:run.allocation||{}}, Quiz:global.Quiz||null, DB:null };
  var html=""; try { html=d.results(r); } catch(e){ html="<h1>Done.</h1><p class='am-note'>results() threw: "+esc(e.message)+"</p>"; }
  /* onComplete is where an activity writes facts it could not write from
     a single `asks` — a whole instrument's worth, in the case of the
     interest profiler. Called once, before the result renders. */
  if (d.onComplete && !run.completed){
    run.completed=true;
    try { d.onComplete({ extra:run.extra, ctx:ctx(), state:{answers:run.answers}, setFact:function(k,v){ facts[k]=v; }, DB:null }); } catch(e){}
  }
  var acts=[]; try { acts=d.actions({answers:run.answers, extra:run.extra}, ctx())||[]; } catch(e){}
  var h='<div class="am-card am-results"><div class="am-top"><span class="am-eyebrow">'+esc(d.title)+'</span><button class="am-x" onclick="YNSMock.close()" aria-label="Close">×</button></div>'+html;
  if (hooks.resultsFooter){ try { h+=hooks.resultsFooter(run.slug)||""; } catch(e){} }
  h+='<div class="am-seven"><h3>Seven days</h3><p class="am-scene">Pick one thing to do this week. It goes on your hub until you tick it off.</p>'+acts.map(function(a){return '<button class="opt" onclick="YNSMock.finish(this)"><i class="dot"></i><div><strong>'+esc(a)+'</strong></div></button>';}).join("")+'<button class="btn-quiet" onclick="YNSMock.finish(null)">Skip for now</button></div></div>';
  host.innerHTML=h; host.scrollTop=0;
}
function finish(el){
  var slug=run.slug;
  lastRun[slug] = { answers: run.answers, extra: run.extra, allocation: run.allocation || {} };
  /* The thing they picked at the end is a commitment, not a sentiment.
     It goes on the list in the Planner with where it came from and the
     date, so it exists somewhere other than that one screen. */
  if (el){
    var text=el.textContent.trim();
    facts.steps_open = (facts.steps_open||[]).filter(function(x){ return x.text!==text; });
    facts.steps_open.push({ id: slug+"-"+Date.now(), slug: slug, text: text, from: (DEFS[slug]||{}).title || slug, at: Date.now(), done: false });
  } if (el) facts.next_action=el.textContent.trim(); facts.activities_completed=(facts.activities_completed||[]).concat([slug]); close(); hooks.onDone(slug); }

/* ---------- public --------------------------------------------------- */
global.YNSActivity = {
  define: function(d){ DEFS[d.slug]=d; },
  context: function(){ return ctx(); },
  validate: function(){ return true; },
  unlockedBy: function(){ return {text:"", slugs:[]}; }
};
global.YNSMock = {
  mount: function(el, onDone, resultsFooter){ host=el; hooks.onDone=onDone||hooks.onDone; hooks.resultsFooter=resultsFooter||null; },
  has: function(slug){ return !!DEFS[slug]; },
  title: function(slug){ return (DEFS[slug]||{}).title || slug; },
  /* Put an activity back to never-answered: forget its saved results and
     clear the facts it owns, so the ladders ask again instead of
     skipping every question whose answer is still on file. An activity
     owns a fact if one of its rungs declares it with `asks`. */
  resetActivity: function(slug){
    var d=DEFS[slug]; delete lastRun[slug];
    if (!d) return [];
    var cleared=[];
    (d.slots||[]).forEach(function(sl){
      (sl.ladder||[]).forEach(function(rung){
        if (rung.asks && facts[rung.asks]!=null){ delete facts[rung.asks]; cleared.push(rung.asks); }
        if (rung.tagAsks && facts[rung.tagAsks]!=null){ delete facts[rung.tagAsks]; cleared.push(rung.tagAsks); }
      });
    });
    return cleared;
  },
  hasResults: function(slug){ return !!lastRun[slug]; },
  facts: facts,
  setFact: function(k,v){ facts[k]=v; },
  play: play, close: close, next: next, back: back, pick: pick,
  useExample: function(el){ $("amText").value=el.textContent; $("amText").focus(); },
  tag: function(el){ host.querySelectorAll(".am-tag").forEach(function(t){t.classList.remove("on");}); el.classList.add("on"); run.ui.tag=el.getAttribute("data-k"); },
  submitText: submitText, bump: bump, submitBuild: submitBuild,
  guess: function(v){ run.ui.guess=parseInt(v,10); var b=host.querySelector(".am-total b"); if (b) b.textContent="$"+run.ui.guess.toLocaleString("en-US"); },
  reveal: function(){ if (run.ui.guess==null){ var r=cur().rung; run.ui.guess=Math.round(((r.min||0)+(r.max||200000))/2); } run.ui.revealed=true; renderStep(); },
  finishEstimate: finishEstimate,
  sortTo: sortTo, addItem: addItem, removeItem: removeItem, submitCollect: submitCollect,
  hour: hour, days: days, submitHours: submitHours,
  blank: blank, submitCompose: submitCompose,
  diffMark: diffMark, submitDiff: submitDiff,
  chainPick: chainPick, submitChain: submitChain,
  compareMark: compareMark, submitCompare: submitCompare,
  finish: finish, skipStep: skipStep, rate: rate, submitRate: submitRate,
  typeAmount: typeAmount,
  budgetType: budgetType, submitBudget: submitBudget, exportBudget: exportBudget,
  calcType: calcType, calcBump: calcBump, submitCalc: submitCalc
};
})(window);
