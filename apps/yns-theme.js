/* =====================================================================
   YNS — yns-theme.js

   Light / dark / follow-the-system, and the control that switches them.

   LOAD THIS IN <head>, BEFORE ANY STYLESHEET, AND DO NOT DEFER IT.

   It writes data-theme onto <html> synchronously. Anywhere later — the
   end of <body>, an onload handler, a module — and a dark-mode visitor
   gets a full white page for one frame before it flips. That flash is
   worse than not having dark mode at all, and it is the single most
   common way this feature ships broken.

   Three states, and LIGHT is the default.

     "light"   data-theme="light". The default, and it wins even when the
               OS says dark. Chosen deliberately: this is somebody's
               first impression of a career service, the brand is built
               on a white page, and a visitor whose phone happens to be
               in dark mode should not get a different-looking product
               from the one in the screenshots.
     "dark"    data-theme="dark". Explicit, and it wins over an OS that
               says light.
     "system"  no data-theme attribute. prefers-color-scheme decides, and
               keeps deciding, so a phone that flips at sunset flips with
               it. Still reachable, one press past dark.

   "system" stays a real state rather than "whatever it was when you
   first loaded", because the second kind silently stops tracking the OS
   the moment somebody touches the control and never explains why.
   ===================================================================== */
(function (global) {
  "use strict";

  var KEY = "yns_theme";
  /* Cycle order. Starts at the default and ends on the one most people
     will never want, so two presses covers everybody. */
  var MODES = ["light", "dark", "system"];
  var DEFAULT = "light";
  var listeners = [];

  var doc = global.document;
  var root = doc.documentElement;

  function stored() {
    try {
      var v = global.localStorage.getItem(KEY);
      return MODES.indexOf(v) >= 0 ? v : DEFAULT;
    } catch (e) { return DEFAULT; }   /* private mode: the default, every time */
  }

  var mode = stored();

  /* What is actually on screen right now, which is not the same as the
     mode — "system" resolves to one or the other. */
  function resolved() {
    if (mode !== "system") return mode;
    try {
      return global.matchMedia && global.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark" : "light";
    } catch (e) { return "light"; }
  }

  function apply() {
    if (mode === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);

    /* Tells the browser to theme its own furniture — form controls,
       scrollbars, the address bar on mobile. Without it a dark page keeps
       white scrollbars and white date pickers, which is the tell that a
       dark mode was painted on rather than built in. */
    root.style.colorScheme = mode === "system" ? "light dark" : mode;

    listeners.forEach(function (fn) { try { fn(mode, resolved()); } catch (e) {} });
  }

  function set(next) {
    if (MODES.indexOf(next) < 0) next = DEFAULT;
    mode = next;
    try { global.localStorage.setItem(KEY, mode); } catch (e) {}
    apply();
    if (global.YNS && global.YNS.logEvent) {
      global.YNS.logEvent("theme_set", null, { mode: mode, resolved: resolved() });
    }
  }

  /* light → dark → system → light. Three positions, because the third
     state has to be reachable without a settings screen. */
  function cycle() {
    set(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
  }

  function onChange(fn) { listeners.push(fn); }

  function offChange(fn) {
    var i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  }

  apply();

  /* Follow the OS while in system mode. addEventListener on a MediaQuery
     list is not in older Safari, hence the fallback. */
  try {
    var mq = global.matchMedia("(prefers-color-scheme: dark)");
    var react = function () { if (mode === "system") apply(); };
    if (mq.addEventListener) mq.addEventListener("change", react);
    else if (mq.addListener) mq.addListener(react);
  } catch (e) {}

  /* ===================================================================
     THE CONTROL

     One button that cycles, rather than three buttons or a select. It is
     a preference people set roughly once, and it does not deserve three
     permanent slots of the header on a phone.

     aria-label carries the state and what pressing does, because the
     icon alone tells a screen reader nothing.
     =================================================================== */

  var ICON = {
    system: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 20.5h8"/></svg>',
    light:  '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M22 12h-2.4M4.4 12H2M19.07 4.93l-1.7 1.7M6.63 17.37l-1.7 1.7M19.07 19.07l-1.7-1.7M6.63 6.63l-1.7-1.7"/></svg>',
    dark:   '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a6.8 6.8 0 0 0 11 11Z"/></svg>'
  };

  var LABEL = {
    light:  "Theme: light. Switch to dark.",
    dark:   "Theme: dark. Switch to following your device.",
    system: "Theme: following your device. Switch to light."
  };

  var TITLE = { system: "Auto", light: "Light", dark: "Dark" };

  function mountToggle(el, opts) {
    if (!el) return null;
    opts = opts || {};

    var btn = doc.createElement("button");
    btn.type = "button";
    btn.className = "yns-theme-toggle" + (opts.className ? " " + opts.className : "");

    function paint() {
      btn.innerHTML = ICON[mode] + (opts.label ? '<span>' + TITLE[mode] + "</span>" : "");
      btn.setAttribute("aria-label", LABEL[mode]);
      btn.title = LABEL[mode];
    }

    btn.onclick = function () { cycle(); };

    /* The account bar repaints on every auth change, registry load and
       logo load, replacing its innerHTML each time — so mountToggle runs
       repeatedly on one page. Without this, each run leaves a listener
       behind holding a button that is no longer in the document, and the
       list grows for as long as the tab is open. */
    var listener = function (m, r) {
      if (!doc.documentElement.contains(btn)) { offChange(listener); return; }
      paint();
    };
    onChange(listener);
    paint();

    el.appendChild(btn);
    return btn;
  }

  /* Styling lives here rather than in yns-brand.css so that a page which
     loads the toggle always has its styles, including the three original
     prototypes, which have their own palettes and do not load the brand
     sheet's components. */
  var CSS = [
    ".yns-theme-toggle{display:inline-flex;align-items:center;gap:7px;",
    "background:none;border:1.5px solid var(--yns-line,var(--line,#D5DAE3));border-radius:10px;",
    "padding:7px 9px;cursor:pointer;color:var(--yns-muted,var(--muted,#5B6478));font:inherit;",
    "font-size:.8rem;line-height:1;transition:color .15s,border-color .15s,background .15s}",
    ".yns-theme-toggle:hover{color:var(--yns-blue,var(--blue,#0057E1));border-color:var(--yns-blue,var(--blue,#0057E1))}",
    ".yns-theme-toggle:focus-visible{outline:none;box-shadow:var(--yns-focus,0 0 0 3px rgba(0,87,225,.35))}",
    ".yns-theme-toggle svg{flex:0 0 auto}",
    /* On the dark inline bar the button sits on ink, not paper. */
    ".yns-bar--inline .yns-theme-toggle{color:rgba(255,255,255,.78);border-color:rgba(255,255,255,.24)}",
    ".yns-bar--inline .yns-theme-toggle:hover{color:#fff;border-color:rgba(255,255,255,.5)}"
  ].join("");

  function injectCSS() {
    if (doc.getElementById("yns-theme-css")) return;
    var s = doc.createElement("style");
    s.id = "yns-theme-css";
    s.textContent = CSS;
    (doc.head || doc.documentElement).appendChild(s);
  }
  injectCSS();

  global.YNSTheme = {
    get: function () { return mode; },
    resolved: resolved,
    set: set,
    cycle: cycle,
    onChange: onChange,
    offChange: offChange,
    mountToggle: mountToggle
  };
})(window);
