/* =====================================================================
   YNS — Career ABCs ⇄ Supabase sync.

   career-abcs_v2.html is a compiled single-file bundle. Its store is a
   closure: it reads localStorage once at boot into a cache, then writes
   through on every change. There is no exported handle to hook.

   So this file syncs at the storage boundary instead of inside the app,
   which means the bundle never has to be rebuilt to gain accounts:

     local → remote   poll the key, push on change (debounced). Writes
                      are cheap, the document is small, and this survives
                      any future rebuild of the bundle.

     remote → local   only at a moment where a reload is already
                      expected: landing back from a magic-link email, or
                      the person explicitly choosing "load my saved
                      version". Silently swapping the document out from
                      under a live editing session would lose whatever
                      was on screen.

   Load BEFORE the app bundle so the hydrate check runs first.
   ===================================================================== */
(function (global) {
  "use strict";

  var DB = global.YNS;
  if (!DB) {
    if (global.console) console.warn("[YNS] yns-abcs-sync.js needs yns-supabase.js first");
    return;
  }

  var KEY = "yns.abcs.v1";        // must match storage.js in the bundle
  var APP = "career_abcs";
  var POLL_MS = 2500;
  var DEBOUNCE_MS = 1200;

  var lastPushed = null;
  var pushTimer = null;

  function readLocal() {
    try { return global.localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function writeLocal(doc) {
    try { global.localStorage.setItem(KEY, JSON.stringify(doc)); return true; }
    catch (e) { return false; }
  }

  /* A document the person has not actually put anything into yet. Used to
     decide whether pulling the remote copy would destroy anything. */
  function isEmpty(raw) {
    if (!raw) return true;
    try {
      var d = JSON.parse(raw);
      if (!d || !d.about) return true;
      var a = d.about, b = d.build || {};
      return !a.name && !a.email && !a.stage && !a.direction &&
             !(a.strengths || []).length && !(a.stories || []).length &&
             !b.headline && !b.summary && !(b.experience || []).length;
    } catch (e) { return true; }
  }

  /* ------------------------------------------------------ local → remote */

  function push() {
    var raw = readLocal();
    if (!raw || raw === lastPushed) return;
    if (!DB.signedIn()) return;

    var doc;
    try { doc = JSON.parse(raw); } catch (e) { return; }

    lastPushed = raw;
    DB.saveAppState(APP, doc).then(function (r) {
      if (r.ok) return;
      if (r.reason === "conflict") {
        // Another device saved since we last read. Ask rather than pick.
        lastPushed = null;
        offerConflict();
      } else if (r.reason !== "signed_out") {
        lastPushed = null;   // let the next poll retry
      }
    });
  }

  function schedulePush() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, DEBOUNCE_MS);
  }

  function watch() {
    var seen = readLocal();
    setInterval(function () {
      var now = readLocal();
      if (now !== seen) { seen = now; schedulePush(); }
    }, POLL_MS);

    // Another tab on the same device.
    global.addEventListener("storage", function (e) {
      if (e.key === KEY) schedulePush();
    });

    // Best effort on the way out. Not guaranteed, which is why the poll
    // above is the real mechanism rather than the fallback.
    global.addEventListener("pagehide", function () { push(); });
  }

  /* ------------------------------------------------------ remote → local */

  var HYDRATED = "yns_abcs_hydrated";

  function hydrated() {
    try { return global.sessionStorage.getItem(HYDRATED) === "1"; } catch (e) { return true; }
  }
  function markHydrated() {
    try { global.sessionStorage.setItem(HYDRATED, "1"); } catch (e) {}
  }

  function hydrate() {
    if (hydrated()) return;

    DB.loadAppState(APP).then(function (remote) {
      markHydrated();
      if (!remote) return;                    // nothing saved yet

      var raw = readLocal();
      if (isEmpty(raw)) {
        // Fresh device, or the first arrival back from a sign-in email.
        // Nothing on this machine to lose, so take the saved copy.
        if (writeLocal(remote)) {
          lastPushed = readLocal();
          banner("Loaded your saved work.", function () { location.reload(); }, "Reload to see it");
        }
        return;
      }

      // Both sides have real content. Never guess — ask.
      if (JSON.stringify(remote) !== raw) offerConflict(remote);
      else lastPushed = raw;
    });
  }

  /* --------------------------------------------------------------- UI */

  function banner(text, onClick, cta) {
    var el = document.createElement("div");
    el.className = "yns-msg yns-msg--ok";
    el.style.cssText = "max-width:940px;margin:0 auto 14px;display:flex;gap:12px;" +
      "align-items:center;justify-content:space-between;flex-wrap:wrap";
    el.innerHTML = "<span>" + DB.escapeHTML(text) + "</span>";
    if (onClick) {
      var b = document.createElement("button");
      b.className = "yns-btn";
      b.textContent = cta || "OK";
      b.onclick = onClick;
      el.appendChild(b);
    }
    // Into the top of the main column — not the app bar, which is where
    // the account control lives and is far too small for a message.
    var host = document.getElementById("main") || document.querySelector("main");
    if (host) host.insertBefore(el, host.firstChild);
    else document.body.insertBefore(el, document.body.firstChild);
  }

  var conflictOpen = false;

  function offerConflict(remote) {
    if (conflictOpen) return;
    conflictOpen = true;

    var scrim = document.createElement("div");
    scrim.className = "yns-scrim";
    scrim.innerHTML =
      '<div class="yns-modal" role="dialog" aria-modal="true">' +
        "<h2>Two versions of your work</h2>" +
        "<p>There's a saved copy of your Career ABCs on your account, and a different copy on " +
        "this device. We won't guess which one you want — pick one and we'll keep it.</p>" +
        '<div class="yns-modal__actions">' +
          '<button class="yns-btn" data-a="local">Keep this device\'s version</button>' +
          '<button class="yns-btn yns-btn--quiet" data-a="remote">Use the saved version</button>' +
        "</div>" +
        '<p style="margin:14px 0 0;font-size:.8rem">Keeping this device\'s version overwrites the ' +
        "saved copy. Using the saved version reloads the page.</p>" +
      "</div>";
    document.body.appendChild(scrim);

    function close() {
      conflictOpen = false;
      if (scrim.parentNode) scrim.parentNode.removeChild(scrim);
    }

    scrim.querySelector('[data-a="local"]').onclick = function () {
      var raw = readLocal();
      var doc;
      try { doc = JSON.parse(raw); } catch (e) { return close(); }
      lastPushed = raw;
      DB.saveAppState(APP, doc, true).then(close);
    };

    scrim.querySelector('[data-a="remote"]').onclick = function () {
      var take = remote;
      var done = function (d) {
        if (d && writeLocal(d)) location.reload();
        else close();
      };
      if (take) done(take);
      else DB.loadAppState(APP).then(done);
    };
  }

  /* ------------------------------------------------------------- boot */

  /* The bundle renders its own shell into <body> after we run, so a bar
     parked at the top of the document gets wiped. Wait for the app's own
     header and sit inside it instead — which is where it belongs anyway,
     since Career ABCs already has a brand and a nav. */
  function mountBar() {
    var tries = 0;

    (function attach() {
      if (document.getElementById("yns-account-bar")) return;

      var host = document.querySelector(".appbar .appbar-in") ||
                 document.querySelector(".appbar");

      if (!host) {
        // ~12s of 100ms polls. If the app never renders a header there is
        // nothing to attach to, and failing quietly beats a floating bar.
        if (++tries > 120) return;
        return setTimeout(attach, 100);
      }

      var el = document.createElement("div");
      el.id = "yns-account-bar";
      el.style.cssText = "margin-left:auto;display:flex;align-items:center;gap:10px";
      host.appendChild(el);
      DB.mountAuthBar(el, APP, { inline: true });
    })();
  }

  function start() {
    mountBar();
    watch();

    DB.onAuth(function (u) {
      if (!u) return;
      hydrate();
      schedulePush();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})(window);
