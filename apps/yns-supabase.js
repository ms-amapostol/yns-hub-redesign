/* =====================================================================
   YNS — the shared Supabase layer.

   Used by all four activities:
     prototype-1-choose-your-own-adventure.html  (via quiz-shared.js)
     prototype-2-day-in-the-life.html            (via quiz-shared.js)
     prototype-3-budget-allocation.html          (via quiz-shared.js)
     career-abcs_v2.html                         (directly)

   Two rules shape everything here:

   1. Signing in is optional. Nothing in an activity may block on the
      network or on an account. If Supabase is unconfigured, blocked, or
      simply down, every call below resolves to a harmless value and the
      activity carries on against localStorage.

   2. Anonymous work is never lost. A run finished while signed out is
      queued in localStorage and adopted into the account the moment the
      person signs in — including on the redirect back from a magic-link
      email, which is a different page load.

   Load order in a page:
     <script src="yns-config.js"></script>
     <script src="yns-supabase.js"></script>
   ===================================================================== */
(function (global) {
  "use strict";

  /* supabase-js is vendored rather than pulled from a CDN at runtime:
     the activities have to work on a school or library network that may
     well block jsdelivr, and a third-party script that can see an
     authenticated page is a dependency worth not having. The CDN stays
     only as a fallback for the case where vendor/ did not get deployed. */
  var LIB_LOCAL = "vendor/supabase-js-2.58.0.min.js";
  var LIB_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.58.0/dist/umd/supabase.js";
  var LS_ANON = "yns_anon_id";
  var LS_QUEUE = "yns_pending_runs";
  var LS_EMAILQ = "yns_pending_emails";

  var cfg = global.YNS_CONFIG || {};
  var configured = !!(cfg.supabaseUrl && cfg.supabaseKey);

  var client = null;
  var currentUser = null;
  var signalsCache = null;
  var authListeners = [];
  var readyResolve;
  var ready = new Promise(function (r) { readyResolve = r; });

  /* ------------------------------------------------------ tiny helpers */

  function lsGet(k, fallback) {
    try {
      var raw = global.localStorage.getItem(k);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }

  function lsSet(k, v) {
    try { global.localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }

  function lsDel(k) {
    try { global.localStorage.removeItem(k); } catch (e) {}
  }

  function uuid() {
    if (global.crypto && global.crypto.randomUUID) return global.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === "x" ? r : ((r & 0x3) | 0x8)).toString(16);
    });
  }

  /* A stable id for this browser, so signed-out analytics can still be
     grouped into sessions. Not an identifier of a person. */
  function anonId() {
    var id = lsGet(LS_ANON, null);
    if (!id) { id = uuid(); lsSet(LS_ANON, id); }
    return id;
  }

  function warn(msg, err) {
    if (global.console && console.warn) console.warn("[YNS] " + msg, err || "");
  }

  /* ------------------------------------------------- library bootstrap */

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () {
        if (global.supabase && global.supabase.createClient) resolve(global.supabase);
        else reject(new Error("loaded " + src + " but it exported nothing"));
      };
      s.onerror = function () { reject(new Error("could not load " + src)); };
      document.head.appendChild(s);
    });
  }

  function loadLib() {
    if (global.supabase && global.supabase.createClient) return Promise.resolve(global.supabase);
    return loadScript(LIB_LOCAL).catch(function (err) {
      warn("vendored supabase-js unavailable, trying the CDN — " + err.message);
      return loadScript(LIB_CDN);
    });
  }

  /* Nothing downstream may wait on the network indefinitely. An activity
     whose first screen is gated on `ready` would otherwise never render
     at all on a blocked CDN, a captive portal, or a paused project — the
     exact situations where the person least deserves a blank page.

     On timeout we abandon the boot for good rather than letting a late
     arrival install a half-initialised client behind everyone's back. */
  var BOOT_TIMEOUT_MS = 6000;
  var settled = false;
  var abandoned = false;

  function settle(ok) {
    if (settled) return;
    settled = true;
    readyResolve(ok);
  }

  function init() {
    if (!configured) {
      settle(false);
      return;
    }

    setTimeout(function () {
      if (settled) return;
      abandoned = true;
      client = null;
      warn("Supabase did not come up within " + BOOT_TIMEOUT_MS + "ms — running local-only");
      settle(false);
    }, BOOT_TIMEOUT_MS);

    loadLib().then(function (lib) {
      if (abandoned) return;
      client = lib.createClient(cfg.supabaseUrl, cfg.supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          // Consumes the credentials the email link comes back with.
          detectSessionInUrl: true,

          /* Implicit, not PKCE — a deliberate trade, made after PKCE
             failed on the first real sign-in.

             PKCE keeps a code verifier in the localStorage of the browser
             that REQUESTED the link, so the returning ?code= can only be
             exchanged there. Any of these breaks it, silently:
               - the mail app opens links in a different browser
               - the person reads mail on their phone, started on a laptop
               - the provider prefetches the link to scan it, burning the
                 one-time token before the human clicks
             All three are common, and the last two are the norm for an
             audience reading mail on a phone.

             Implicit returns the tokens in the URL fragment instead, so
             the link works in whatever browser opens it. The cost: tokens
             briefly appear in the address bar and can reach browser
             history. supabase-js strips them from the URL as soon as it
             has the session. For an optional "save my results" account
             holding quiz answers, that trade is worth making — an auth
             method that fails for most of your users protects nobody.

             Revisit if this ever guards anything more sensitive. */
          flowType: "implicit"
        }
      });

      client.auth.onAuthStateChange(function (event, session) {
        var was = currentUser && currentUser.id;
        currentUser = (session && session.user) || null;
        signalsCache = null;

        // Adopt anything finished while signed out. Runs on the magic
        // link's return trip too, which is the common case.
        if (currentUser && currentUser.id !== was) flushQueues();

        authListeners.forEach(function (fn) {
          try { fn(currentUser); } catch (e) { warn("auth listener threw", e); }
        });
      });

      return client.auth.getSession().then(function (res) {
        if (abandoned) return;
        currentUser = (res && res.data && res.data.session && res.data.session.user) || null;
        if (currentUser) flushQueues();
        settle(true);
      });
    }).catch(function (err) {
      warn("running in local-only mode — " + err.message);
      client = null;
      settle(false);
    });
  }

  /* --------------------------------------------------- offline queues */

  function queueRun(payload) {
    var q = lsGet(LS_QUEUE, []);
    // client_run_id makes this idempotent, so replace rather than append.
    q = q.filter(function (r) { return r.client_run_id !== payload.client_run_id; });
    q.push(payload);
    if (q.length > 25) q = q.slice(-25);
    lsSet(LS_QUEUE, q);
  }

  function flushQueues() {
    if (!client || !currentUser) return Promise.resolve();

    var runs = lsGet(LS_QUEUE, []);
    var emails = lsGet(LS_EMAILQ, []);
    var jobs = [flushLocalFacts()];

    if (runs.length) {
      jobs.push(
        client.from("activity_runs")
          .upsert(runs.map(stampUser), { onConflict: "user_id,client_run_id" })
          .then(function (res) {
            if (res.error) throw res.error;
            lsDel(LS_QUEUE);
            signalsCache = null;
          })
      );
    }

    if (emails.length) {
      jobs.push(
        client.from("email_captures")
          .insert(emails.map(stampUser))
          .then(function (res) {
            if (res.error) throw res.error;
            lsDel(LS_EMAILQ);
          })
      );
    }

    return Promise.all(jobs).catch(function (err) {
      // Leave the queue in place; the next sign-in or save retries it.
      warn("could not sync queued work", err.message || err);
    });
  }

  function stampUser(row) {
    var out = {};
    for (var k in row) if (Object.prototype.hasOwnProperty.call(row, k)) out[k] = row[k];
    out.user_id = currentUser.id;
    return out;
  }

  /* --------------------------------------------------------- auth API */

  function user() { return currentUser; }
  function signedIn() { return !!currentUser; }
  function available() { return !!client; }

  function onAuth(fn) {
    authListeners.push(fn);
    // Fire once with the state as it stands, so callers do not have to
    // handle "before ready" separately.
    ready.then(function () { try { fn(currentUser); } catch (e) {} });
    return function off() {
      authListeners = authListeners.filter(function (f) { return f !== fn; });
    };
  }

  /* ------------------------------------------------- returning-link errors

     A magic link that fails leaves evidence in the URL and nowhere else.
     Supabase puts it in the query string or the hash depending on where
     the failure happened, and supabase-js consumes neither if the
     exchange did not complete. Without this the page just renders signed
     out with no explanation, which is exactly what happened on the first
     real sign-in attempt.

     Returns {code, description} or null, and scrubs the URL so a reload
     does not resurrect a stale error. */
  function consumeAuthError() {
    var out = null;
    try {
      var qs = new URLSearchParams(global.location.search);
      var hs = new URLSearchParams(String(global.location.hash || "").replace(/^#/, ""));
      var code = qs.get("error") || qs.get("error_code") || hs.get("error") || hs.get("error_code");
      var desc = qs.get("error_description") || hs.get("error_description");

      if (code) {
        out = { code: code, description: desc ? desc.replace(/\+/g, " ") : "" };
        ["error", "error_code", "error_description"].forEach(function (k) { qs.delete(k); });
        var clean = global.location.pathname + (qs.toString() ? "?" + qs.toString() : "");
        global.history.replaceState({}, "", clean);
      }
    } catch (e) { /* URL parsing is best effort */ }
    return out;
  }

  /* True when we came back from an email link but never got a session —
     the PKCE code could not be exchanged in this browser. */
  function strandedCode() {
    try {
      return !currentUser && new URLSearchParams(global.location.search).has("code");
    } catch (e) { return false; }
  }

  /* Sign in with the 6-digit code from the email instead of the link.

     This path has no code verifier, so it works in any browser and
     survives a link that was prefetched by a scanner — the failure modes
     that make magic links unreliable on phones and in in-app browsers. */
  function verifyOtp(email, token) {
    return ready.then(function () {
      if (!client) return { ok: false, message: "Saving is not switched on yet." };
      var clean = String(token || "").replace(/\D/g, "");
      if (!clean) return { ok: false, message: "Enter the code from the email." };

      return client.auth.verifyOtp({
        email: String(email || "").trim(),
        token: clean,
        type: "email"
      }).then(function (res) {
        if (res.error) return { ok: false, message: res.error.message };
        return { ok: true, message: "Signed in." };
      });
    }).catch(function (err) {
      return { ok: false, message: err.message || "That code did not work." };
    });
  }

  /* Password sign-in. Testing affordance only — gated by
     allowPasswordLogin in yns-config.js. Optional alternative to the
     emailed link, for people coming back on a different device. */
  function signInWithPassword(email, password) {
    return ready.then(function () {
      if (!client) return { ok: false, message: "Saving is not switched on yet." };
      if (!cfg.allowPasswordLogin) return { ok: false, message: "Password sign-in is disabled." };

      return client.auth.signInWithPassword({
        email: String(email || "").trim(),
        password: String(password || "")
      }).then(function (res) {
        if (res.error) return { ok: false, message: res.error.message };
        return { ok: true, message: "Signed in." };
      });
    }).catch(function (err) {
      return { ok: false, message: err.message || "Could not sign in." };
    });
  }

  /* Magic link.

     `opts.createUser` is the difference between "log in" and "sign up",
     and it matters for more than copy. With it false, Supabase refuses
     to create an account and returns an error — which lets us answer the
     question a returning person actually has: *do I already have an
     account with this address?* Sending a cheerful "check your email" to
     someone who has never signed up, and letting them wait for a link
     that never comes, is the worst outcome available.

     Resolves {ok, message, noAccount} — never rejects, because every
     caller is a form in the middle of an activity. */
  function signIn(email, opts) {
    opts = opts || {};
    var create = opts.createUser !== false;

    return ready.then(function () {
      if (!client) return { ok: false, message: "Saving is not switched on yet." };
      if (!email || email.indexOf("@") < 1) return { ok: false, message: "That email does not look right." };

      return client.auth.signInWithOtp({
        email: String(email).trim(),
        options: {
          emailRedirectTo: cfg.redirectTo || global.location.href.split("#")[0],
          shouldCreateUser: create
        }
      }).then(function (res) {
        if (res.error) {
          var m = String(res.error.message || "").toLowerCase();
          // Supabase's wording for "shouldCreateUser was false and there
          // is no such user" has changed more than once; match loosely.
          if (!create && (m.indexOf("signups not allowed") >= 0 ||
                          m.indexOf("user not found") >= 0 ||
                          m.indexOf("not found") >= 0)) {
            return {
              ok: false, noAccount: true,
              message: "We don't have an account for that email yet."
            };
          }
          if (m.indexOf("rate") >= 0 || m.indexOf("too many") >= 0) {
            return { ok: false, message: "Too many attempts just now — give it a minute and try again." };
          }
          return { ok: false, message: res.error.message };
        }
        return {
          ok: true,
          message: create
            ? "Check your email — we've sent a link that signs you straight in."
            : "Check your email — we've sent you a link to get back in."
        };
      });
    }).catch(function (err) {
      return { ok: false, message: err.message || "Something went wrong. Try again in a moment." };
    });
  }

  /* Google (or any OAuth provider Supabase has enabled).

     One tap, a verified email address, no password to forget and no
     dependence on email delivery. For most people this is simply the
     best door.

     The exception worth knowing: Google refuses OAuth inside embedded
     webviews and answers `disallowed_useragent` — fully enforced since
     July 2023. That covers the in-app browsers in Instagram, Facebook
     and TikTok. If social is a real acquisition channel, some share of
     arrivals cannot use this button at all, and the fallback in
     yns-config.js (authMethods) is what stops that being a dead end. */
  /* Is this an in-app browser (Instagram, Facebook, TikTok, …)?

     This matters more here than in most products, because Facebook and
     Instagram ads are an acquisition channel — so a large share of
     arrivals land inside Meta's WKWebView rather than a real browser.

     Google refuses OAuth in embedded webviews outright
     (`disallowed_useragent`, enforced since July 2023), so leading with
     the Google button for these visitors is leading with a dead end.
     Detection lets the dialog reorder itself instead. */
  var IN_APP_PATTERNS = [
    /FBAN|FBAV|FB_IAB/i,        // Facebook
    /Instagram/i,
    /\bLine\//i,
    /TikTok|BytedanceWebview|musical_ly/i,
    /Snapchat/i,
    /Twitter|TwitterAndroid/i,
    /Pinterest/i,
    /LinkedInApp/i
  ];

  function inAppBrowser() {
    var ua = (global.navigator && navigator.userAgent) || "";
    for (var i = 0; i < IN_APP_PATTERNS.length; i++) {
      if (IN_APP_PATTERNS[i].test(ua)) return true;
    }
    return false;
  }

  /* Which providers the project actually has switched on.

     Needed because signInWithOAuth navigates the browser IMMEDIATELY —
     it does not wait for a response. With the provider disabled, the
     person lands on a raw JSON error page
     ({"msg":"Unsupported provider..."}) with no way back, and any error
     handling here never runs because the page is already gone.

     So: check first, navigate second. /auth/v1/settings is public and
     cached for the session. */
  var providersPromise = null;
  function enabledProviders() {
    if (providersPromise) return providersPromise;
    providersPromise = fetch(cfg.supabaseUrl + "/auth/v1/settings", {
      headers: { apikey: cfg.supabaseKey }
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { return (d && d.external) || {}; })
      .catch(function () { return {}; });
    return providersPromise;
  }

  function signInWithProvider(provider) {
    provider = provider || "google";
    return ready.then(function () {
      if (!client) return { ok: false, message: "Saving is not switched on yet." };
      return enabledProviders();
    }).then(function (ext) {
      if (ext && ext[provider] === false) {
        return { ok: false, notEnabled: true,
                 message: "Google sign-in isn't switched on for this project yet." };
      }
      return client.auth.signInWithOAuth({
        provider: provider || "google",
        options: {
          redirectTo: cfg.redirectTo || global.location.href.split("#")[0],
          queryParams: { prompt: "select_account" }
        }
      }).then(function (res) {
        if (res.error) {
          var m = String(res.error.message || "").toLowerCase();
          if (m.indexOf("provider is not enabled") >= 0) {
            return { ok: false, notEnabled: true,
                     message: "Google sign-in isn't switched on for this project yet." };
          }
          return { ok: false, message: res.error.message };
        }
        return { ok: true };   // browser is navigating away
      });
    }).catch(function (err) {
      return { ok: false, message: err.message || "Could not start Google sign-in." };
    });
  }

  /* Create an account with a password and nothing else.

     The point of this path is that it touches email delivery ZERO times.
     Magic links are single-use and get burned by scanners; the 6-digit
     code needs a template edit Supabase blocks on free tier. A password
     signup works in every browser, including the in-app webviews where
     Google OAuth is refused outright.

     Requires "Confirm email" to be OFF in Supabase (Authentication ->
     Providers -> Email). With it on, signUp creates an unconfirmed user,
     returns no session, and waits for an email that may never arrive —
     so we detect exactly that and say so, rather than looking broken. */
  function signUpWithPassword(email, password) {
    return ready.then(function () {
      if (!client) return { ok: false, message: "Saving is not switched on yet." };
      if (!email || email.indexOf("@") < 1) return { ok: false, message: "That email does not look right." };
      if (!password || String(password).length < 8) {
        return { ok: false, message: "Pick a password of at least 8 characters." };
      }

      return client.auth.signUp({
        email: String(email).trim(),
        password: String(password)
      }).then(function (res) {
        if (res.error) {
          var m = String(res.error.message || "").toLowerCase();
          if (m.indexOf("already") >= 0 || m.indexOf("registered") >= 0) {
            return { ok: false, exists: true,
                     message: "There's already an account with that email — log in instead." };
          }
          if (m.indexOf("weak") >= 0 || m.indexOf("password") >= 0) {
            return { ok: false, message: res.error.message };
          }
          return { ok: false, message: res.error.message };
        }
        // Session present = confirmation is off and they are in.
        if (res.data && res.data.session) {
          return { ok: true, message: "You're in. Your progress will be saved from now on." };
        }
        return {
          ok: false, needsConfirm: true,
          message: "Account created, but it needs email confirmation before you can sign in."
        };
      });
    }).catch(function (err) {
      return { ok: false, message: err.message || "Could not create that account." };
    });
  }

  /* Let a signed-in person set a password, so they can get back in
     without depending on email at all. This is the durable answer to
     links being burned by scanners or opened in the wrong browser. */
  function setPassword(password) {
    return ready.then(function () {
      if (!client || !currentUser) return { ok: false, message: "You need to be signed in." };
      if (!password || String(password).length < 8) {
        return { ok: false, message: "Use at least 8 characters." };
      }
      return client.auth.updateUser({ password: String(password) }).then(function (res) {
        if (res.error) return { ok: false, message: res.error.message };
        return { ok: true, message: "Password saved. You can use it to sign in from now on." };
      });
    }).catch(function (err) {
      return { ok: false, message: err.message || "Could not save that password." };
    });
  }

  function signOut() {
    return ready.then(function () {
      if (!client) return;
      return client.auth.signOut();
    }).then(function () {
      currentUser = null;
      signalsCache = null;
    }).catch(function (e) { warn("sign out failed", e); });
  }

  /* --------------------------------------------------------- runs API */

  /* Save (or update) one run of one activity.

     payload: {
       activity, status, level, axes, allocation, answers,
       scores, top_categories, archetype, client_run_id, completed_at
     }

     Always resolves. If signed out or offline the run is queued and
     resolves {ok:false, queued:true}. */
  function saveRun(payload) {
    var row = {
      activity: payload.activity,
      status: payload.status || "complete",
      level: payload.level || null,
      axes: payload.axes || {},
      allocation: payload.allocation || null,
      answers: payload.answers || {},
      scores: payload.scores || {},
      top_categories: payload.top_categories || [],
      archetype: payload.archetype || null,
      client_run_id: payload.client_run_id || uuid(),
      completed_at: payload.status === "in_progress" ? null : (payload.completed_at || new Date().toISOString())
    };

    return ready.then(function () {
      if (!client || !currentUser) {
        queueRun(row);
        return { ok: false, queued: true, client_run_id: row.client_run_id };
      }
      return client.from("activity_runs")
        .upsert(stampUser(row), { onConflict: "user_id,client_run_id" })
        .select("id")
        .then(function (res) {
          if (res.error) throw res.error;
          signalsCache = null;
          return { ok: true, queued: false, id: res.data && res.data[0] && res.data[0].id, client_run_id: row.client_run_id };
        });
    }).catch(function (err) {
      queueRun(row);
      warn("run not saved, queued instead", err.message || err);
      return { ok: false, queued: true, error: err.message, client_run_id: row.client_run_id };
    });
  }

  function listRuns(activity) {
    return ready.then(function () {
      if (!client || !currentUser) return [];
      var q = client.from("activity_runs")
        .select("*")
        .eq("status", "complete")
        .order("completed_at", { ascending: false });
      if (activity) q = q.eq("activity", activity);
      return q.then(function (res) {
        if (res.error) throw res.error;
        return res.data || [];
      });
    }).catch(function (err) {
      warn("could not read runs", err.message || err);
      return [];
    });
  }

  /* -------------------------------------------------- reflections API

     Append-only by design — there is no update or delete, in the client
     or in RLS. Changing your mind is a new entry of kind "correction",
     which is what makes a truthful history page possible. */
  function saveReflection(row) {
    return ready.then(function () {
      if (!client || !currentUser) return { ok: false, message: "You need to be signed in." };
      return client.from("reflections").insert(stampUser({
        kind: row.kind,
        prompt_key: row.prompt_key,
        prompt_text: row.prompt_text,
        response: row.response || null,
        structured: row.structured || {},
        activity: row.activity || null,
        run_id: row.run_id || null
      })).then(function (res) {
        if (res.error) throw res.error;
        signalsCache = null;          // confidence and facts have moved
        return { ok: true };
      });
    }).catch(function (err) {
      warn("reflection not saved", err.message || err);
      return { ok: false, message: err.message };
    });
  }

  function listReflections(limit) {
    return ready.then(function () {
      if (!client || !currentUser) return [];
      return client.from("reflections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit || 50)
        .then(function (res) {
          if (res.error) throw res.error;
          return res.data || [];
        });
    }).catch(function () { return []; });
  }

  /* Current-state knowledge, as {key: value}. This is what future
     activities should read to decide what to skip, reorder or hide. */
  function facts() {
    return ready.then(function () {
      if (!client || !currentUser) return {};
      return client.from("facts").select("key, value, confidence, observed_at")
        .then(function (res) {
          if (res.error) throw res.error;
          var out = {};
          (res.data || []).forEach(function (f) { out[f.key] = f.value; });
          return out;
        });
    }).catch(function () { return {}; });
  }

  /* Same as facts(), but keeping observed_at — the activity runtime ages
     facts against a half-life, so it needs to know when each one was
     said, not just what was said. */
  function factsDetailed() {
    return ready.then(function () {
      if (!client || !currentUser) return {};
      return client.from("facts").select("key, value, confidence, observed_at")
        .then(function (res) {
          if (res.error) throw res.error;
          var out = {};
          (res.data || []).forEach(function (f) {
            out[f.key] = { value: f.value, confidence: f.confidence, observed_at: f.observed_at };
          });
          return out;
        });
    }).catch(function () { return {}; });
  }

  /* Write current-state facts.

     Goes through the assert_facts RPC rather than an insert, because
     facts is select-only for the client: the function is the only thing
     allowed to write, it forces source='stated', and it rejects keys that
     are not registered in fact_keys.

     Always resolves. A fact that fails to save must never break the
     activity someone is halfway through — yns-activity.js has already
     written it to localStorage by the time this is called, and
     flushLocalFacts() replays it after the next sign-in. */
  function assertFacts(map) {
    return ready.then(function () {
      if (!client || !currentUser) return { ok: false, local: true };
      return client.rpc("assert_facts", { p_facts: map }).then(function (res) {
        if (res.error) throw res.error;
        signalsCache = null;                    // facts feed the signals
        return { ok: true, written: res.data };
      });
    }).catch(function (err) {
      warn("facts not saved", err.message || err);
      return { ok: false, error: err.message };
    });
  }

  /* Replace facts rather than accumulate them. Calls set_facts, the
     sibling of assert_facts that overwrites arrays instead of unioning,
     so an item can be taken off a list. See migration 14. */
  function setFacts(map) {
    return ready.then(function () {
      if (!client || !currentUser) return { ok: false, local: true };
      return client.rpc("set_facts", { p_facts: map }).then(function (res) {
        if (res.error) throw res.error;
        signalsCache = null;
        return { ok: true, written: res.data };
      });
    }).catch(function (err) {
      warn("facts not replaced", err.message || err);
      return { ok: false, error: err.message };
    });
  }

  /* Facts asserted while signed out live in localStorage. On sign-in,
     replay them once so three activities' worth of answers are not lost
     by the person only making an account at the end. */
  var LS_FACTS = "yns_facts";

  function flushLocalFacts() {
    if (!client || !currentUser) return Promise.resolve();
    var map;
    try {
      var raw = global.localStorage.getItem(LS_FACTS);
      map = raw ? JSON.parse(raw) : null;
    } catch (e) { return Promise.resolve(); }
    if (!map || !Object.keys(map).length) return Promise.resolve();

    var flat = {};
    Object.keys(map).forEach(function (k) {
      if (map[k] && map[k].value !== undefined) flat[k] = map[k].value;
    });
    if (!Object.keys(flat).length) return Promise.resolve();

    return assertFacts(flat).then(function (r) {
      /* Only clear on a confirmed write. Dropping them after a failure
         would lose the answers this exists to protect. */
      if (r.ok) { try { global.localStorage.removeItem(LS_FACTS); } catch (e) {} }
    });
  }

  /* ----------------------------------------------------- signals API */

  /* The cross-activity summary an activity reads on load so it can skip
     questions it already knows the answer to and refer back to what the
     person told a different activity.

     Resolves null when signed out or when nothing has been completed
     yet — callers must treat null as "this is their first time". */
  function signals(force) {
    if (signalsCache && !force) return Promise.resolve(signalsCache);
    return ready.then(function () {
      if (!client || !currentUser) return null;
      return client.from("profile_signals")
        .select("*")
        .eq("user_id", currentUser.id)
        .maybeSingle()
        .then(function (res) {
          if (res.error) throw res.error;
          if (!res.data || !res.data.runs_completed) return null;
          signalsCache = res.data;
          return signalsCache;
        });
    }).catch(function (err) {
      warn("could not read signals", err.message || err);
      return null;
    });
  }

  /* ---------------------------------------------------- app_state API */

  var stateRevision = 0;

  function loadAppState(app) {
    return ready.then(function () {
      if (!client || !currentUser) return null;
      return client.from("app_state")
        .select("doc, revision")
        .eq("user_id", currentUser.id)
        .eq("app", app)
        .maybeSingle()
        .then(function (res) {
          if (res.error) throw res.error;
          if (!res.data) return null;
          stateRevision = res.data.revision;
          return res.data.doc;
        });
    }).catch(function (err) {
      warn("could not load saved state", err.message || err);
      return null;
    });
  }

  /* force:true skips the revision check, for "yes, use this device's
     copy" after a conflict. */
  function saveAppState(app, doc, force) {
    return ready.then(function () {
      if (!client || !currentUser) return { ok: false, reason: "signed_out" };
      return client.rpc("save_app_state", {
        p_app: app,
        p_doc: doc,
        p_revision: force ? 0 : stateRevision
      }).then(function (res) {
        if (res.error) {
          if (String(res.error.message || "").indexOf("stale_revision") >= 0) {
            return { ok: false, reason: "conflict" };
          }
          throw res.error;
        }
        stateRevision = res.data;
        return { ok: true, revision: res.data };
      });
    }).catch(function (err) {
      warn("could not save state", err.message || err);
      return { ok: false, reason: "error", error: err.message };
    });
  }

  /* --------------------------------------------------- capture + events */

  /* 23514 = check constraint (malformed or oversized address)
     PT429  = the per-address daily cap in the rate-limit trigger
     42501  = permission denied
     Anything else — a dropped connection, a 5xx — is worth another go. */
  var PERMANENT = { "23514": 1, "PT429": 1, "42501": 1, "23502": 1 };

  function isPermanentReject(err) {
    if (!err) return false;
    if (err.code && PERMANENT[String(err.code)]) return true;
    var s = Number(err.status);
    // 4xx other than 408/429-with-retry means the request itself is wrong.
    return s >= 400 && s < 500 && s !== 408;
  }

  function captureMessage(err) {
    var code = err && String(err.code);
    if (code === "PT429") {
      return "We've already got that address from a few submissions today.";
    }
    if (code === "23514") {
      return "That email address doesn't look right — mind checking it?";
    }
    return "We couldn't save that address. Try again?";
  }

  function captureEmail(email, activity, context) {
    var row = {
      email: String(email || "").trim(),
      activity: activity || null,
      context: context || {}
    };
    if (!row.email || row.email.indexOf("@") < 1) {
      return Promise.resolve({ ok: false, message: "That email does not look right." });
    }

    return ready.then(function () {
      if (!client) {
        var q = lsGet(LS_EMAILQ, []); q.push(row); lsSet(LS_EMAILQ, q);
        return { ok: true, queued: true };
      }
      var payload = currentUser ? stampUser(row) : row;
      return client.from("email_captures").insert(payload).then(function (res) {
        if (res.error) throw res.error;
        return { ok: true, queued: false };
      });
    }).catch(function (err) {
      // Only retry what is worth retrying. A rejected address — malformed,
      // too long, or over the daily cap — will be rejected identically
      // every time, so queueing it means retrying forever and telling the
      // person "on its way" on every page load. Those are terminal.
      if (isPermanentReject(err)) {
        warn("email capture rejected", err.message || err);
        return { ok: false, permanent: true, message: captureMessage(err) };
      }
      var q = lsGet(LS_EMAILQ, []); q.push(row); lsSet(LS_EMAILQ, q);
      warn("email capture queued for retry", err.message || err);
      return { ok: true, queued: true };
    });
  }

  /* Fire and forget. Never returns a rejected promise, never blocks. */
  function logEvent(name, activity, props) {
    if (cfg.analytics === false) return Promise.resolve();
    return ready.then(function () {
      if (!client) return;
      var row = {
        anon_id: anonId(),
        activity: activity || null,
        name: name,
        props: props || {}
      };
      if (currentUser) row.user_id = currentUser.id;
      return client.from("events").insert(row).then(function (res) {
        if (res.error) throw res.error;
      });
    }).catch(function () { /* analytics must never surface to a user */ });
  }

  /* --------------------------------------------------------- auth bar */

  var CSS = [
    ".yns-themerow{display:flex;justify-content:flex-end;margin:0 auto 10px;max-width:680px}",
    ".yns-authbar{max-width:680px;margin:0 auto 14px;display:flex;align-items:center;gap:10px;",
    "flex-wrap:wrap;padding:11px 15px;background:#fff;border:1px solid #e4e7f2;border-radius:12px;",
    "font:14px/1.45 'Poppins',ui-rounded,'Segoe UI',system-ui,-apple-system,sans-serif;color:#3b4256}",
    ".yns-authbar .yns-who{flex:1;min-width:180px}",
    ".yns-authbar .yns-who b{color:#101426}",
    ".yns-authbar input{flex:1;min-width:170px;padding:9px 11px;border:1px solid #e4e7f2;",
    "border-radius:9px;font:inherit;font-size:14px}",
    ".yns-authbar button{background:#2952e0;color:#fff;border:none;border-radius:9px;padding:9px 15px;",
    "font:inherit;font-weight:600;font-size:14px;cursor:pointer}",
    ".yns-authbar button:hover{background:#3a61f0}",
    ".yns-authbar button.ghost{background:none;color:#6b7280;padding:9px 6px;font-weight:500}",
    ".yns-authbar button.ghost:hover{color:#2952e0;background:none}",
    ".yns-authbar .yns-msg{flex-basis:100%;font-size:13px;color:#1b3aa8;line-height:1.5}",
    ".yns-authbar .yns-msg.err{color:#c2410c}"
  ].join("");

  var cssInjected = false;
  function injectCSS() {
    if (cssInjected) return;
    cssInjected = true;
    var s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* Renders a small sign-in / signed-in strip into `el`. Safe to call on
     a page where Supabase is not configured — it renders nothing. */
  function mountAuthBar(el, activity) {
    if (!el) return;
    injectCSS();

    /* The theme control goes outside the auth strip and outside the
       `configured` early-return below. Whether someone can sign in has
       nothing to do with whether they can read the page, and an
       unconfigured install used to return here having painted nothing —
       which would have left the three prototypes as the only pages in
       the product with no way to switch theme. */
    var themeHost = document.createElement("div");
    themeHost.className = "yns-themerow";
    el.parentNode ? el.parentNode.insertBefore(themeHost, el) : el.appendChild(themeHost);
    if (global.YNSTheme) global.YNSTheme.mountToggle(themeHost);

    if (!configured) { el.innerHTML = ""; return; }

    function paint(u) {
      if (u) {
        el.innerHTML =
          '<div class="yns-authbar"><span class="yns-who">Signed in as <b>' +
          escapeHTML(u.email || "you") +
          '</b>. Your results are being saved.</span>' +
          '<button type="button" class="ghost" data-yns="out">Sign out</button></div>';
        el.querySelector('[data-yns="out"]').onclick = function () { signOut(); };
      } else {
        el.innerHTML =
          '<div class="yns-authbar"><span class="yns-who">Want to keep your results? ' +
          'Sign in and each activity can build on the last.</span>' +
          '<input type="email" placeholder="you@email.com" data-yns="email" autocomplete="email">' +
          '<button type="button" data-yns="in">Email me a link</button>' +
          '<div class="yns-msg" data-yns="msg" role="status" hidden></div></div>';

        var input = el.querySelector('[data-yns="email"]');
        var btn = el.querySelector('[data-yns="in"]');
        var msg = el.querySelector('[data-yns="msg"]');

        function go() {
          btn.disabled = true;
          btn.textContent = "Sending…";
          signIn(input.value).then(function (r) {
            msg.hidden = false;
            msg.textContent = r.message;
            msg.className = "yns-msg" + (r.ok ? "" : " err");
            btn.disabled = false;
            btn.textContent = r.ok ? "Sent" : "Email me a link";
            logEvent(r.ok ? "signin_requested" : "signin_failed", activity, {});
          });
        }
        btn.onclick = go;
        input.onkeydown = function (e) { if (e.key === "Enter") go(); };
      }
    }

    onAuth(paint);
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ------------------------------------------------------------ export */

  global.YNS = {
    ready: ready,
    configured: configured,
    available: available,
    anonId: anonId,
    uuid: uuid,

    user: user,
    signedIn: signedIn,
    onAuth: onAuth,
    signIn: signIn,
    verifyOtp: verifyOtp,
    signInWithPassword: signInWithPassword,
    signUpWithPassword: signUpWithPassword,
    signInWithProvider: signInWithProvider,
    inAppBrowser: inAppBrowser,
    setPassword: setPassword,
    signOut: signOut,
    mountAuthBar: mountAuthBar,
    consumeAuthError: consumeAuthError,
    strandedCode: strandedCode,

    saveRun: saveRun,
    listRuns: listRuns,
    signals: signals,
    saveReflection: saveReflection,
    listReflections: listReflections,
    facts: facts,
    factsDetailed: factsDetailed,
    assertFacts: assertFacts,
    setFacts: setFacts,

    loadAppState: loadAppState,
    saveAppState: saveAppState,

    captureEmail: captureEmail,
    logEvent: logEvent,

    escapeHTML: escapeHTML,
    get client() { return client; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})(window);
