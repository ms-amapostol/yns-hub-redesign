/* =====================================================================
   YNS — the shared account layer.

   One sign-in and one profile panel, identical on all four activities.
   Loading this file upgrades the plain strip in yns-supabase.js to the
   branded bar, so pages that already call YNS.mountAuthBar() get the
   good version for free.

   Load order:
     <link rel="stylesheet" href="yns-brand.css">
     <script src="yns-config.js"></script>
     <script src="yns-supabase.js"></script>
     <script src="yns-profile.js"></script>

   What it puts on the page:
     - an account bar: wordmark, progress dots, and either "Save my
       progress" or the person's avatar
     - a sign-in modal (magic link — no passwords to forget, which
       matters for an audience that may be filling this in on a phone)
     - a profile panel showing what we know about them and what it is
       being used for, plus the way out: sign out, or delete everything

   Everything degrades. With Supabase unconfigured the bar renders the
   wordmark and progress dots only, and no account is ever mentioned.
   ===================================================================== */
(function (global) {
  "use strict";

  var DB = global.YNS;
  if (!DB) {
    if (global.console) console.warn("[YNS] yns-profile.js needs yns-supabase.js loaded first");
    return;
  }

  /* Fallback only. The real list is data/activities.json — see
     loadRegistry() below. This array exists so the bar and the profile
     panel still work if the registry fails to load, and so nothing has
     to await a fetch before it can render. */
  var ACTIVITIES = [
    { k: "cyoa",        name: "The Story",        href: "prototype-1-choose-your-own-adventure.html",
      blurb: "Seven chapters of a life eighteen months from now" },
    { k: "dayinlife",   name: "A Day In The Life", href: "prototype-2-day-in-the-life.html",
      blurb: "Six moments in a day you would actually want" },
    { k: "budget",      name: "Spend Your 100",    href: "prototype-3-budget-allocation.html",
      blurb: "What you would really pay for in a job" },
    { k: "career_abcs", name: "Career ABCs",       href: "career-abcs_v2.html",
      blurb: "Build the resume, the cover letter and the interview" }
  ];

  var esc = DB.escapeHTML;
  var currentActivity = null;

  /* The wordmark, inlined rather than an <img>.

     It has to be inline for `fill="currentColor"` to work: an <img> is a
     separate document and cannot inherit the page's colour, so it would
     render black on the blue Career ABCs header. Inlining lets one asset
     serve both the white-on-blue and blue-on-white cases.

     Fetched once and cached. If it fails, the text wordmark it replaces
     is still there — the bar never renders empty. */
  var logoMarkup = null;
  var logoPromise = null;
  function loadLogo() {
    if (logoPromise) return logoPromise;
    logoPromise = fetch("assets/yns-lockup.svg", { cache: "force-cache" })
      .then(function (r) { return r.ok ? r.text() : null; })
      .then(function (t) {
        if (t && t.indexOf("<svg") === 0) logoMarkup = t;
        return logoMarkup;
      })
      .catch(function () { return null; });
    return logoPromise;
  }
  var registry = null;          // full registry once loaded
  var registryWaiters = [];

  /* Load the registry once, share it with everyone who asks. Components
     render immediately from the fallback and re-render when this lands,
     so a slow fetch never blocks the page. */
  function loadRegistry() {
    if (registry) return Promise.resolve(registry);
    return fetch("data/activities.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.activities) return null;
        registry = d;
        // Keep the legacy shape working for anything reading ACTIVITIES.
        ACTIVITIES = d.activities
          .filter(function (a) { return a.status !== "retired"; })
          .sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); })
          .map(function (a) {
            return { k: a.slug, name: a.name, href: a.href, blurb: a.tagline.replace(/\.$/, "") };
          });
        registryWaiters.forEach(function (fn) { try { fn(registry); } catch (e) {} });
        registryWaiters = [];
        return registry;
      })
      .catch(function () { return null; });
  }

  function onRegistry(fn) {
    if (registry) { fn(registry); return; }
    registryWaiters.push(fn);
    loadRegistry();
  }
  var barEl = null;
  var signalsData = null;

  /* ------------------------------------------------------------ modal */

  var openScrim = null;

  function closeModal() {
    if (openScrim && openScrim.parentNode) openScrim.parentNode.removeChild(openScrim);
    openScrim = null;
    document.removeEventListener("keydown", onEsc);
  }

  function onEsc(e) { if (e.key === "Escape") closeModal(); }

  function openModal(html, opts) {
    closeModal();
    opts = opts || {};
    var scrim = document.createElement("div");
    scrim.className = "yns-scrim";
    scrim.innerHTML = '<div class="yns-modal' + (opts.wide ? " yns-modal--wide" : "") +
      (opts.split ? " yns-modal--split" : "") +
      '" role="dialog" aria-modal="true">' + html + "</div>";

    scrim.addEventListener("click", function (e) { if (e.target === scrim) closeModal(); });
    document.body.appendChild(scrim);
    document.addEventListener("keydown", onEsc);
    openScrim = scrim;

    var close = scrim.querySelector("[data-yns-close]");
    if (close) close.onclick = closeModal;

    var focusable = scrim.querySelector("input, button");
    if (focusable) focusable.focus();

    return scrim.querySelector(".yns-modal");
  }

  /* --------------------------------------------------------- sign in */

  var METHODS = (global.YNS_CONFIG && global.YNS_CONFIG.authMethods) || ["password"];
  var PRIMARY = METHODS[0];
  var SECONDARY = METHODS.slice(1);
  var has = function (m) { return METHODS.indexOf(m) >= 0; };
  var ALLOW_PW = has("password");

  /* Google's mark, inline so it keeps its own colours on any background.
     Google's brand guidelines require the unmodified four-colour "G". */
  var GOOGLE_G =
    '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12' +
    's5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.0 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20' +
    's20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>' +
    '<path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7' +
    'C34.0 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>' +
    '<path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36' +
    'c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/>' +
    '<path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2' +
    'C36.9 40.2 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>';

  var META_F =
    '<svg width="18" height="18" viewBox="0 0 36 36" aria-hidden="true" focusable="false">' +
    '<path fill="#1877F2" d="M36 18C36 8.06 27.94 0 18 0S0 8.06 0 18c0 8.98 6.58 16.43 15.19 17.78' +
    'V23.2h-4.57V18h4.57v-3.96c0-4.51 2.69-7 6.8-7 1.97 0 4.03.35 4.03.35v4.43h-2.27c-2.24 0-2.94 1.39-2.94 2.81' +
    'V18h5l-.8 5.2h-4.2v12.58C29.42 34.43 36 26.98 36 18z"/>' +
    '<path fill="#fff" d="M25.01 23.2l.8-5.2h-5v-3.37c0-1.42.7-2.81 2.94-2.81h2.27V7.39s-2.06-.35-4.03-.35' +
    'c-4.11 0-6.8 2.49-6.8 7V18h-4.57v5.2h4.57v12.58a18.2 18.2 0 0 0 5.62 0V23.2h4.2z"/></svg>';

  var PROVIDERS = {
    google:   { label: "Google",   mark: GOOGLE_G, cls: "yns-btn--google" },
    facebook: { label: "Facebook", mark: META_F,   cls: "yns-btn--meta" }
  };

  function providerBtnHTML(key, isNew) {
    var p = PROVIDERS[key];
    if (!p) return "";
    return '<button class="yns-btn ' + p.cls + '" data-f="oauth" data-provider="' + key + '">' +
      p.mark + "<span>" + (isNew ? "Continue with " : "Sign in with ") + p.label + "</span></button>";
  }

  /* Inside an in-app browser Google refuses the request outright, so
     demote it. Leading Meta ad traffic with a button that cannot work is
     the single worst thing this dialog could do. */
  function orderedMethods() {
    var m = METHODS.slice();
    if (DB.inAppBrowser && DB.inAppBrowser()) {
      m.sort(function (a, b) {
        var rank = function (x) { return x === "google" ? 1 : 0; };
        return rank(a) - rank(b);
      });
    }
    return m;
  }


  /* Two modes in one dialog.

     Log in and sign up are the same API call with one flag flipped, but
     they are not the same question in someone's head. A returning person
     wants to know "do I already have an account?", and answering that
     — rather than cheerfully sending a link to an address that has never
     registered — is the whole reason these are separate.

     mode: "login" | "signup". Defaults to login, because after the first
     few weeks most people arriving at this dialog are returning. */
  function openSignIn(reason, mode) {
    mode = mode === "signup" ? "signup" : "login";

    function body(m) {
      var isNew = m === "signup";

      /* Only the first method is shown outright. Anything else lives
         behind a disclosure, so a single-method config is genuinely a
         single button and a multi-method one is not a wall of choices. */
      var ord = orderedMethods();
      var primary = ord[0];
      var rest = ord.slice(1);
      var webview = !!(DB.inAppBrowser && DB.inAppBrowser());
      var hasOAuthPrimary = !!PROVIDERS[primary];

      var primaryHTML = "";
      ord.forEach(function (k) {
        if (PROVIDERS[k]) primaryHTML += providerBtnHTML(k, isNew);
      });

      if (webview && METHODS.indexOf("google") >= 0) {
        primaryHTML =
          '<div class="yns-msg yns-msg--warn" style="margin:0 0 var(--yns-s3)">' +
          "You're in an in-app browser, where Google sign-in is blocked. Use an option " +
          "below, or open this page in Safari or Chrome." +
          "</div>" + primaryHTML;
      }

      var emailBlock =
        '<input class="yns-field" type="email" inputmode="email" autocomplete="email" ' +
          'placeholder="you@email.com" data-f="email" aria-label="Your email address">' +
        (ALLOW_PW
          ? '<input class="yns-field" type="password" ' +
            'autocomplete="' + (isNew ? "new-password" : "current-password") + '" ' +
            'placeholder="' + (isNew ? "Choose a password (8+ characters)" : "Password") + '" ' +
            'data-f="pw" aria-label="Password">'
          : "") +
        (ALLOW_PW && isNew
          ? '<input class="yns-field" type="password" autocomplete="new-password" ' +
            'placeholder="Type it again" data-f="pw2" aria-label="Confirm password">'
          : "") +
        '<div class="yns-modal__actions">' +
          (ALLOW_PW
            ? '<button class="yns-btn" data-f="pwgo">' +
              (isNew ? "Create my account" : "Log in") + "</button>"
            : "") +
          (has("magiclink")
            ? '<button class="yns-btn ' + (ALLOW_PW ? "yns-btn--bare" : "") +
              '" data-f="go">Email me a link</button>'
            : "") +
        "</div>";

      var emailWrapped = hasOAuthPrimary
        ? (rest.filter(function (k) { return !PROVIDERS[k]; }).length
            ? '<details class="yns-alt"><summary>Trouble signing in? Use email instead</summary>' +
              '<div class="yns-alt__body">' + emailBlock + "</div></details>"
            : "")
        : emailBlock;

      return '<button class="yns-modal__close" data-yns-close aria-label="Close">&times;</button>' +
        '<div class="yns-tabs" role="tablist">' +
          '<button role="tab" data-mode="login"  aria-selected="' + (!isNew) + '">Log in</button>' +
          '<button role="tab" data-mode="signup" aria-selected="' + (isNew) + '">Create account</button>' +
        "</div>" +
        "<h2>" + (isNew ? "Save your progress" : "Welcome back") + "</h2>" +
        "<p>" + esc(reason || (isNew
          ? "Create an account and every activity afterwards builds on what the last one learned."
          : "Sign in and we'll pick up exactly where you left off.")) + "</p>" +
        primaryHTML +
        emailWrapped +
        '<div class="yns-msg" data-f="msg" role="status" hidden></div>' +
        CODE_BLOCK +
        '<p style="margin:16px 0 0;font-size:.8rem">' +
        (hasOAuthPrimary
          ? "We only read your name and email address. Nothing is posted anywhere."
          : (isNew
             ? "We use your email to sign you in and save your work. If we ever work with schools, programs or employers, we'll ask you first, every time. " +
               "<b>Write your password down.</b> We can't reset it for you yet."
             : "No account yet? Use <b>Create account</b> above.")) +
        "</p>";
    }

    function wire(el, m) {
      var isNew = m === "signup";
      var input = el.querySelector('[data-f="email"]');
      var go    = el.querySelector('[data-f="go"]');
      var msg   = el.querySelector('[data-f="msg"]');
      var codeBox = el.querySelector('[data-f="codebox"]');

      el.querySelectorAll('[data-f="oauth"]').forEach(function (gbtn) {
        var prov = gbtn.dataset.provider;
        gbtn.onclick = function () {
          gbtn.disabled = true;
          var t = gbtn.querySelector("span");
          var was = t ? t.textContent : "";
          if (t) t.textContent = "Redirecting…";
          DB.logEvent("signin_oauth_started", currentActivity, { provider: prov, mode: m });
          // Survives the round trip to the provider, so a failed return
          // can say what actually failed instead of guessing.
          try { sessionStorage.setItem("yns_auth_attempt", prov); } catch (e) {}
          DB.signInWithProvider(prov).then(function (r) {
            if (r.ok) return;                 // navigating away
            gbtn.disabled = false;
            if (t) t.textContent = was;
            msg.hidden = false;
            msg.className = "yns-msg yns-msg--err";
            msg.textContent = r.notEnabled
              ? (PROVIDERS[prov].label + " sign-in isn't switched on yet. Enable it in " +
                 "Supabase → Authentication → Providers → " + PROVIDERS[prov].label + ".")
              : r.message;
            // Do not strand them: open the fallback if one exists.
            var alt = el.querySelector(".yns-alt");
            if (alt) alt.open = true;
          });
        };
      });

      el.querySelectorAll("[data-mode]").forEach(function (t) {
        t.onclick = function () {
          var carry = input.value;
          var next = openModal(body(t.dataset.mode), { wide: false });
          var f = next.querySelector('[data-f="email"]');
          if (f) f.value = carry;                 // never make them retype it
          wire(next, t.dataset.mode);
        };
      });

      // Google-only config: no email form exists, so nothing below applies.
      if (!input) return;

      function sendLink() {
        go.disabled = true;
        var label = go.textContent;
        go.textContent = "Sending…";
        DB.signIn(input.value, { createUser: isNew }).then(function (r) {
          msg.hidden = false;
          msg.className = "yns-msg " + (r.ok ? "yns-msg--ok" : "yns-msg--err");

          if (r.noAccount) {
            // The useful answer, not a dead end.
            msg.innerHTML = esc(r.message) +
              ' <button class="yns-btn yns-btn--bare" data-f="switch" ' +
              'style="padding:0 4px">Create one instead →</button>';
            var sw = msg.querySelector('[data-f="switch"]');
            if (sw) sw.onclick = function () {
              var carry = input.value;
              var next = openModal(body("signup"), { wide: false });
              var f = next.querySelector('[data-f="email"]');
              if (f) f.value = carry;
              wire(next, "signup");
            };
          } else {
            msg.textContent = r.message;
          }

          go.disabled = !!r.ok;
          go.textContent = r.ok ? "Link sent" : label;
          if (r.ok && codeBox) codeBox.hidden = false;
          DB.logEvent(r.ok ? "signin_requested" : "signin_failed", currentActivity,
                      { mode: m, no_account: !!r.noAccount });
        });
      }

      if (go) go.onclick = sendLink;

      wireCodeEntry(el, function () { return input.value; });

      var pwBtn = el.querySelector('[data-f="pwgo"]');
      var pw = el.querySelector('[data-f="pw"]');
      var pw2 = el.querySelector('[data-f="pw2"]');

      if (pwBtn && pw) {
        var label = pwBtn.textContent;
        var fail = function (t) {
          msg.hidden = false;
          msg.className = "yns-msg yns-msg--err";
          msg.textContent = t;
          pwBtn.disabled = false;
          pwBtn.textContent = label;
        };

        var submit = function () {
          if (!input.value) return fail("Enter your email address.");
          if (!pw.value) return fail(isNew ? "Choose a password." : "Enter your password.");
          if (isNew && pw2 && pw.value !== pw2.value) {
            return fail("Those two passwords don't match.");
          }

          pwBtn.disabled = true;
          pwBtn.textContent = isNew ? "Creating…" : "Signing in…";

          var job = isNew
            ? DB.signUpWithPassword(input.value, pw.value)
            : DB.signInWithPassword(input.value, pw.value);

          job.then(function (r) {
            if (r.ok) {
              DB.logEvent(isNew ? "signup_password" : "signin_password", currentActivity, {});
              closeModal();
              return;
            }

            // An existing account is a routing problem, not an error.
            if (r.exists) {
              msg.hidden = false;
              msg.className = "yns-msg";
              msg.innerHTML = esc(r.message) +
                ' <button class="yns-btn yns-btn--bare" data-f="tologin" style="padding:0 4px">Log in →</button>';
              msg.querySelector('[data-f="tologin"]').onclick = function () {
                var carry = input.value;
                var next = openModal(body("login"), { wide: false });
                next.querySelector('[data-f="email"]').value = carry;
                wire(next, "login");
              };
              pwBtn.disabled = false;
              pwBtn.textContent = label;
              return;
            }

            // The one configuration mistake that makes this look broken.
            if (r.needsConfirm) {
              return fail("Almost. Email confirmation is still switched on for this project. " +
                          "Turn it off in Supabase (Authentication → Providers → Email), then try again.");
            }

            fail(/invalid/i.test(r.message || "") && !isNew
              ? "That email and password don't match. If you never set a password, use the emailed link."
              : r.message);
          });
        };

        pwBtn.onclick = submit;
        pw.onkeydown = function (e) { if (e.key === "Enter") { if (pw2) pw2.focus(); else submit(); } };
        if (pw2) pw2.onkeydown = function (e) { if (e.key === "Enter") submit(); };
        input.onkeydown = function (e) { if (e.key === "Enter") pw.focus(); };
      }
    }

    var el = openModal(body(mode), { wide: false });
    wire(el, mode);
  }



  function wirePasswordEntry(el, getEmail) {
    var pw = el.querySelector('[data-f="pw"]');
    var btn = el.querySelector('[data-f="pwgo"]');
    var msg = el.querySelector('[data-f="msg"]');
    if (!pw || !btn) return;

    function submit() {
      btn.disabled = true;
      btn.textContent = "Signing in…";
      DB.signInWithPassword(getEmail(), pw.value).then(function (r) {
        if (r.ok) { closeModal(); return; }
        if (msg) {
          msg.hidden = false;
          msg.textContent = r.message;
          msg.className = "yns-msg yns-msg--err";
        }
        btn.disabled = false;
        btn.textContent = "Sign in with password";
      });
    }
    btn.onclick = submit;
    pw.onkeydown = function (e) { if (e.key === "Enter") submit(); };
  }

  /* Shared by the sign-in modal and the "your link did not work" recovery
     prompt: the person types the code from the email instead. */
  function wireCodeEntry(el, getEmail) {
    var codeIn = el.querySelector('[data-f="code"]');
    var codeBtn = el.querySelector('[data-f="codego"]');
    var msg = el.querySelector('[data-f="msg"]');
    if (!codeIn || !codeBtn) return;

    function submit() {
      codeBtn.disabled = true;
      codeBtn.textContent = "Checking…";
      DB.verifyOtp(getEmail(), codeIn.value).then(function (r) {
        if (r.ok) {
          DB.logEvent("signin_otp_success", currentActivity, {});
          closeModal();
          return;
        }
        if (msg) {
          msg.hidden = false;
          msg.textContent = r.message;
          msg.className = "yns-msg yns-msg--err";
        }
        codeBtn.disabled = false;
        codeBtn.textContent = "Sign me in";
        DB.logEvent("signin_otp_failed", currentActivity, {});
      });
    }

    codeBtn.onclick = submit;
    codeIn.onkeydown = function (e) { if (e.key === "Enter") submit(); };
  }

  /* Only offered when the email actually carries a code — promising one
     that is not in the message is worse than not offering it. Controlled
     by otpCodeInEmail in yns-config.js; see the note there. */
  var HAS_CODE = !!(global.YNS_CONFIG && global.YNS_CONFIG.otpCodeInEmail);

  var CODE_BLOCK = !HAS_CODE ? "" :
    '<div data-f="codebox" hidden style="margin-top:18px;padding-top:16px;' +
    'border-top:1px solid var(--yns-line-soft)">' +
      '<p style="margin:0 0 10px">Link not working? The same email has a ' +
      '<b>6-digit code</b>, which always works, even if the link opens in a ' +
      'different browser.</p>' +
      '<input class="yns-field" type="text" inputmode="numeric" autocomplete="one-time-code" ' +
      'maxlength="8" placeholder="123456" data-f="code" aria-label="Six digit code from the email">' +
      '<button class="yns-btn yns-btn--quiet" data-f="codego">Sign me in</button>' +
    "</div>";

  /* Shown when someone lands back from an email link with no session — a
     dead end that previously rendered as an ordinary signed-out page. */
  function openLinkRecovery(reason) {
    var attempt = null;
    try {
      attempt = sessionStorage.getItem("yns_auth_attempt");
      sessionStorage.removeItem("yns_auth_attempt");
    } catch (e) {}

    var provider = PROVIDERS[attempt] ? PROVIDERS[attempt].label : null;

    var heading = provider
      ? provider + " sign-in didn't finish"
      : "That sign-in link didn't finish";

    var why = provider
      ? " You may have cancelled it, or " + provider + " declined the request. " +
        "You can try again, use a different option, or open this page in Safari " +
        "or Chrome if you're inside an app."
      : (HAS_CODE
        ? " It usually means the link opened in a different browser from the " +
          "one you started in, or your email provider opened it first to check " +
          "it was safe."
        : " Links expire quickly and can only be used once. If your email app " +
          "previewed it first, it may already have been used up.");

    var el = openModal(
      '<button class="yns-modal__close" data-yns-close aria-label="Close">&times;</button>' +
      "<h2>" + esc(heading) + "</h2>" +
      "<p>" + esc(reason) + why + "</p>" +
      (HAS_CODE
        ? '<input class="yns-field" type="email" inputmode="email" autocomplete="email" ' +
          'placeholder="you@email.com" data-f="email2" aria-label="Your email address">' +
          CODE_BLOCK.replace(" hidden", "")
        : "") +
      '<div class="yns-msg" data-f="msg" role="status" hidden></div>' +
      '<div class="yns-modal__actions" style="margin-top:16px">' +
        '<button class="yns-btn" data-f="resend">' +
          (provider ? "Try another way" : "Send me a new link") + "</button>" +
        '<button class="yns-btn yns-btn--bare" data-yns-close>Carry on without saving</button>' +
      "</div>"
    );

    var email2 = el.querySelector('[data-f="email2"]');
    if (email2) wireCodeEntry(el, function () { return email2.value; });

    el.querySelector('[data-f="resend"]').onclick = function () {
      closeModal();
      openSignIn("Enter your email and we'll send a fresh link.");
    };
  }

  /* --------------------------------------------------- profile panel */

  var CAT_NAMES = {
    social: "Social & Community", edu: "Education & Training", health: "Health & Care",
    gov: "Government & Public Service", creative: "Creative & Media",
    trades: "Skilled Trades", biz: "Business & Operations", tech: "Technology",
    finance: "Finance & Data"
  };

  var LEVEL_NAMES = {
    early: "just starting out", some: "a couple of years in",
    experienced: "experienced", leader: "running things already"
  };

  function initials(email) {
    var s = String(email || "?").trim();
    var at = s.indexOf("@");
    var local = at > 0 ? s.slice(0, at) : s;
    var parts = local.split(/[._-]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return local.slice(0, 2).toUpperCase();
  }

  function openProfile() {
    var u = DB.user();
    if (!u) return openSignIn();

    var el = openModal(
      '<div class="yns-modal__body">' +
      '<button class="yns-modal__close" data-yns-close aria-label="Close">&times;</button>' +
      '<div class="yns-profile__id">' +
        '<div class="yns-avatar">' + esc(initials(u.email)) + "</div>" +
        "<div><div class=\"yns-profile__email\">" + esc(u.email || "Signed in") + "</div>" +
        '<div class="yns-profile__since" data-f="since">Loading your progress…</div></div>' +
      "</div>" +
      '<div data-f="body"></div>' +
      (ALLOW_PW
        ? '<div class="yns-readout" style="margin-top:4px">' +
            '<h3>Getting back in</h3>' +
            "Email links only work once and can be swallowed by spam filters. Set a " +
            "password and you can always sign in, on any device." +
            '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">' +
              '<input class="yns-field" type="password" autocomplete="new-password" ' +
              'placeholder="New password (8+ characters)" data-f="newpw" ' +
              'aria-label="New password" style="flex:1;min-width:190px;margin:0">' +
              '<button class="yns-btn yns-btn--quiet" data-f="setpw">Save password</button>' +
            "</div></div>"
        : "") +
      '<div class="yns-msg" data-f="msg" role="status" hidden></div>' +
      "</div>" +                                   /* end scrolling body */
      '<div class="yns-modal__foot"><div class="yns-modal__actions">' +
        '<button class="yns-btn yns-btn--quiet" data-f="out">Sign out</button>' +
        '<button class="yns-btn yns-btn--bare" data-f="wipe">Delete my data</button>' +
      "</div></div>",
      { wide: true, split: true }
    );

    var body = el.querySelector('[data-f="body"]');
    var since = el.querySelector('[data-f="since"]');
    var msg = el.querySelector('[data-f="msg"]');

    el.querySelector('[data-f="out"]').onclick = function () {
      DB.signOut().then(function () { closeModal(); });
    };
    el.querySelector('[data-f="wipe"]').onclick = function () { confirmWipe(msg); };

    var newpw = el.querySelector('[data-f="newpw"]');
    var setpw = el.querySelector('[data-f="setpw"]');
    if (newpw && setpw) {
      var save = function () {
        setpw.disabled = true;
        setpw.textContent = "Saving…";
        DB.setPassword(newpw.value).then(function (r) {
          msg.hidden = false;
          msg.className = "yns-msg " + (r.ok ? "yns-msg--ok" : "yns-msg--err");
          msg.textContent = r.message;
          setpw.disabled = false;
          setpw.textContent = r.ok ? "Saved ✓" : "Save password";
          if (r.ok) newpw.value = "";
        });
      };
      setpw.onclick = save;
      newpw.onkeydown = function (e) { if (e.key === "Enter") save(); };
    }

    Promise.all([DB.signals(true), DB.listRuns(), DB.facts()]).then(function (res) {
      var s = res[0];
      var runs = res[1] || [];
      var facts = res[2] || {};
      signalsData = s;

      var doneBy = {};
      runs.forEach(function (r) {
        if (!doneBy[r.activity] || r.completed_at > doneBy[r.activity].completed_at) doneBy[r.activity] = r;
      });

      since.textContent = runs.length
        ? runs.length + (runs.length === 1 ? " activity completed" : " activities completed")
        : "Nothing completed yet. Pick one below";

      body.innerHTML = whyHTML(facts) +
        '<div data-f="nextstep"></div>' +
        trackHTML(doneBy) + readoutHTML(s);

      /* Why first, then the open commitment, then everything we have
         worked out about them. The order is deliberate: the two things
         they wrote themselves come before our reading of them. */
      var stepHost = body.querySelector('[data-f="nextstep"]');
      if (stepHost && global.YNSNextStep) global.YNSNextStep.mount(stepHost);
    });
  }

  /* Their why, first thing on the panel.

     Above the activity list and above what we have worked out about
     them, because it is the only thing here they wrote themselves and
     the only thing that answers the question they are actually asking
     when they open this on a bad week. Everything else on this panel is
     our reading of them; this is theirs.

     Never truncated and never paraphrased. It is one or two sentences.

     No half-life on `why_statement` either — a reason for wanting a
     better life does not expire on a 180-day timer, and asking someone
     to re-confirm it would be insulting. It changes when they change it. */
  function whyHTML(facts) {
    var why = facts && facts.why_statement;

    if (!why) {
      return '<div class="yns-why yns-why--empty">' +
        "<h3>Your why</h3>" +
        "<p>You have not written this one down yet. It takes two minutes, and it is the thing " +
        "worth having on the week you cannot remember why you started.</p>" +
        '<a class="yns-why__go" href="activity.html?a=why">Write it →</a></div>';
    }

    var test = facts.why_test;
    return '<div class="yns-why">' +
      '<h3>Your why</h3><blockquote>' + esc(String(why)) + "</blockquote>" +
      (test ? '<p class="yns-why__test"><b>You said you would know it worked when:</b> ' +
        esc(String(test)) + "</p>" : "") +
      '<a class="yns-why__go" href="activity.html?a=why">Change it →</a></div>';
  }

  function trackHTML(doneBy) {
    return '<ul class="yns-track">' + ACTIVITIES.map(function (a) {
      var run = doneBy[a.k];
      var when = run && run.completed_at
        ? new Date(run.completed_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : null;
      return "<li>" +
        '<span class="mark' + (run ? " done" : "") + '">' + (run ? "✓" : "") + "</span>" +
        '<span class="name">' + esc(a.name) +
          '<span class="meta" style="display:block">' + esc(a.blurb) + "</span></span>" +
        (run
          ? '<span class="meta">' + esc(when || "done") + "</span>"
          : '<a href="' + a.href + '">Start</a>') +
        "</li>";
    }).join("") + "</ul>";
  }

  /* What we know, said plainly. If someone is going to let us use their
     answers to steer the next activity, they should be able to read
     exactly what is being carried forward. */
  function readoutHTML(s) {
    if (!s || !s.runs_completed) {
      return '<div class="yns-readout"><h3>What we know so far</h3>' +
        "Nothing yet. Finish any activity and this fills in, and every activity after " +
        "that starts from it instead of from a blank page.</div>";
    }

    var lines = [];
    if (s.level && LEVEL_NAMES[s.level]) {
      lines.push("You told us you are <b>" + esc(LEVEL_NAMES[s.level]) + "</b>, so we only show " +
                 "you roles that are actually within reach.");
    }
    if (s.top_categories && s.top_categories.length) {
      var names = s.top_categories.map(function (k) { return CAT_NAMES[k] || k; });
      lines.push("Across your answers you keep pointing at <b>" + esc(names[0]) + "</b>" +
                 (names[1] ? ", then " + esc(names[1]) : "") + ".");
    }
    if (s.allocation) {
      var top = Object.keys(s.allocation).sort(function (a, b) { return s.allocation[b] - s.allocation[a]; })[0];
      var VAL = { pay: "pay ceiling", flex: "flexibility and time", impact: "impact on people",
                  stable: "stability", growth: "growth", craft: "craft and mastery" };
      if (top && VAL[top]) {
        lines.push("Given 100 points to spend, most of them went on <b>" + esc(VAL[top]) + "</b>.");
      }
    }

    var bars = "";
    if (s.category_affinity) {
      var keys = Object.keys(s.category_affinity)
        .sort(function (a, b) { return s.category_affinity[b] - s.category_affinity[a]; })
        .slice(0, 5);
      bars = '<div class="yns-bars">' + keys.map(function (k) {
        var pct = Math.round((s.category_affinity[k] || 0) * 100);
        return "<div><span>" + esc(CAT_NAMES[k] || k) + "</span>" +
          '<span class="rail"><i style="width:' + pct + '%"></i></span>' +
          '<span class="pct">' + pct + "%</span></div>";
      }).join("") + "</div>";
    }

    return '<div class="yns-readout"><h3>What we know so far</h3>' +
      lines.join(" ") + bars + "</div>";
  }

  function confirmWipe(msg) {
    var el = openModal(
      "<h2>Delete everything?</h2>" +
      "<p>This removes your saved results, your Career ABCs document, your reflections and " +
      "everything we have worked out about you. It cannot be undone, and it does not delete " +
      "the sign-in itself, so you can start fresh straight afterwards.</p>" +
      '<p style="font-size:.8rem"><a href="data-deletion.html" target="_blank" rel="noopener">' +
      "Exactly what gets deleted, and what doesn't →</a></p>" +
      '<div class="yns-modal__actions">' +
        '<button class="yns-btn yns-btn--danger" data-f="yes">Yes, delete it all</button>' +
        '<button class="yns-btn yns-btn--bare" data-yns-close>Keep my data</button>' +
      "</div>" +
      '<div class="yns-msg" data-f="m" role="status" hidden></div>'
    );

    var m = el.querySelector('[data-f="m"]');
    el.querySelector('[data-f="yes"]').onclick = function () {
      var b = this;
      b.disabled = true;
      b.textContent = "Deleting…";
      DB.client.rpc("delete_my_data").then(function (res) {
        m.hidden = false;
        if (res.error) {
          m.className = "yns-msg yns-msg--err";
          m.textContent = "Could not delete: " + res.error.message;
          b.disabled = false;
          b.textContent = "Yes, delete it all";
          return;
        }
        m.className = "yns-msg yns-msg--ok";
        m.textContent = "Deleted. Signing you out.";
        DB.logEvent("data_deleted", currentActivity, {});
        setTimeout(function () { DB.signOut().then(function () { closeModal(); location.reload(); }); }, 1200);
      });
    };
  }

  /* -------------------------------------------------------- the bar */

  function dotsHTML(done) {
    return '<span class="yns-dots" title="Your progress through the four activities">' +
      ACTIVITIES.map(function (a) {
        var cls = a.k === currentActivity ? "here" : (done.indexOf(a.k) >= 0 ? "on" : "");
        return '<i class="' + cls + '"></i>';
      }).join("") + "</span>";
  }

  function paint(el, u, opts) {
    opts = opts || {};
    /* Inside the hub, the hub is the chrome. A second Back, a second Home,
       a second theme toggle and a row of progress dots that start in the
       middle only confuse the person. */
    if (window.parent !== window) { el.innerHTML = ""; return; }
    var done = (signalsData && signalsData.activities_completed) || [];

    var right;
    if (!DB.configured) {
      right = "";
    } else if (u) {
      right = '<button class="yns-avatar" data-f="profile" aria-label="Your profile" ' +
        'title="' + esc(u.email || "Your profile") + '">' + esc(initials(u.email)) + "</button>";
    } else {
      /* Two doors, because they are two different people. Someone who
         has never signed in needs the value proposition; someone coming
         back just wants the way in, and should not have to read a pitch
         to find it. */
      right = '<button class="yns-btn yns-btn--bare" data-f="login">Log in</button>' +
              '<button class="yns-btn yns-btn--quiet" data-f="signin">Save my progress</button>';
    }

    var hint;
    if (u) {
      hint = done.length
        ? "Saved. " + done.length + " of " + ACTIVITIES.length + " done"
        : "Saved to your account";
    } else if (DB.configured) {
      hint = "Not saved. This device only";
    } else {
      hint = "";
    }

    // Inline mode drops the wordmark and the spacer: the host page
    // already has a brand and its own layout, and we are a guest in it.
    /* Every activity needs a visible way out, in two flavours.

       Back steps within the activity when the running activity offers a
       step to go back to (see YNSStepBack below), and otherwise leaves
       for the hub. Either way it does the most useful thing available
       and is never a dead control.

       Home always goes to the hub, with no cleverness, because a person
       who is lost needs one button whose behaviour they can predict.

       The bar is not sticky, so it scrolls away on a long question. That
       is why the activity runtime ALSO renders a Back under each
       question: same action, two places, whichever you reach first. */
    var nav = currentActivity
      ? '<button type="button" class="yns-bar__back" data-f="navback" title="Back">' +
          '<span aria-hidden="true">\u2190</span> Back</button>' +
        '<a class="yns-bar__home" href="../index.html" target="_top" title="All activities">' +
          '<span aria-hidden="true">\u2302</span> Home</a>'
      : "";

    el.innerHTML =
      '<div class="yns-bar' + (opts.inline ? " yns-bar--inline" : "") + '">' +
        (opts.inline ? "" :
          '<a class="yns-bar__brand" href="../index.html" target="_top" aria-label="Your Next Step, all activities">' +
          (logoMarkup || "Your Next Step") + "</a>") +
        nav +
        dotsHTML(done) +
        (opts.inline ? "" : '<span class="yns-bar__spacer"></span>') +
        '<span class="yns-bar__hint">' + esc(hint) + "</span>" +
        '<span data-f="theme"></span>' +
        right +
      "</div>";

    /* The theme control lives in the account bar because that is the one
       piece of chrome on every page. Mounted rather than templated, so
       yns-theme.js owns its icon, its label and its three states — the
       bar just says where it goes.

       Optional: a page that does not load yns-theme.js still paints. */
    var themeSlot = el.querySelector('[data-f="theme"]');
    if (themeSlot && global.YNSTheme) global.YNSTheme.mountToggle(themeSlot);

    var navback = el.querySelector('[data-f="navback"]');
    if (navback) navback.onclick = function () {
      var sb = global.YNSStepBack;
      if (sb && sb.can && sb.can()) { sb.go(); return; }
      /* Nothing to step back to. Leave, preferring history so somebody
         who arrived from a search result goes back there rather than
         being deposited somewhere they have never been. */
      if (global.history && history.length > 1) history.back();
      else global.top.location.href = "../index.html";
    };

    var si = el.querySelector('[data-f="signin"]');
    if (si) si.onclick = function () { openSignIn(null, "signup"); };
    var li = el.querySelector('[data-f="login"]');
    if (li) li.onclick = function () { openSignIn(null, "login"); };
    var pr = el.querySelector('[data-f="profile"]');
    if (pr) pr.onclick = openProfile;
  }

  /* Mounts the account bar into `el`. Safe to call on every page.
     opts.inline drops the wordmark for pages that already have a header. */
  function mount(el, activity, opts) {
    if (!el) return;
    barEl = el;
    currentActivity = activity || currentActivity;

    DB.onAuth(function (u) {
      DB.signals(true).then(function (s) {
        signalsData = s;
        paint(el, u, opts);
      });
      paint(el, u, opts);
      onRegistry(function () { paint(el, DB.user(), opts); });
      loadLogo().then(function (m) { if (m) paint(el, DB.user(), opts); });
      checkReturnFailure(u);
    });
  }

  /* Runs once per page load, after auth has settled. Catches the two ways
     an email link can dump someone back here without a session. */
  var returnChecked = false;
  function checkReturnFailure(u) {
    if (returnChecked) return;

    var err = DB.consumeAuthError();
    var stranded = DB.strandedCode();
    if (!err && !stranded) return;   // nothing to report; leave the flag unset

    returnChecked = true;
    if (u) return;                   // it worked in the end — say nothing

    DB.logEvent("signin_link_failed", currentActivity, {
      code: (err && err.code) || (stranded ? "code_not_exchanged" : "unknown")
    });

    openLinkRecovery(
      err && err.description ? err.description
        : err ? "The link came back with an error (" + err.code + ")."
        : "You came back from the link, but we couldn't complete the sign-in."
    );
  }

  /* Upgrade the plain strip, so quiz-shared.js and career-abcs both get
     the branded bar without knowing this file exists. */
  DB.mountAuthBar = mount;

  loadRegistry();

  global.YNSProfile = {
    mount: mount,
    /* Shared so other components can put something in a dialog without
       each growing their own scrim, escape handling and focus trap. */
    openModal: openModal,
    closeModal: closeModal,
    openSignIn: openSignIn,
    openProfile: openProfile,
    onRegistry: onRegistry,
    registry: function () { return registry; },
    get ACTIVITIES() { return ACTIVITIES; }
  };
})(window);
