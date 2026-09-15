/* =====================================================================
   YNS — Supabase connection settings.

   Fill these two in from your Supabase dashboard:
     Project Settings → API
       URL              → YNS_CONFIG.supabaseUrl
       Publishable key  → YNS_CONFIG.supabaseKey
         (the one starting sb_publishable_… ; the older anon JWT also
          works if that is what your project shows)

   Both values are safe to commit and safe to serve to the browser. They
   identify the project, they do not grant access — every table in
   0001_yns_init.sql has row level security on, so a signed-out visitor
   can only insert an email capture or an analytics event, and a
   signed-in one can only ever touch their own rows.

   NEVER put the service_role key in this file. It bypasses RLS.

   Leaving these blank is a supported state: every activity still runs,
   stores to localStorage, and simply does not offer the "save my
   results" option.
   ===================================================================== */
window.YNS_CONFIG = {
  supabaseUrl: ""  /* REVIEW BUILD: blank on purpose so nothing writes to production. Restore from the live hub when wiring in. */,
  supabaseKey: "",

  /* Where the magic-link email should send people back to. Leave null to
     use whatever page they signed in from, which is what you want in
     almost every case. Set it explicitly only if you want every link to
     land on one specific page.

     Whatever origin you end up serving these files from must also be
     added in Supabase under Authentication → URL Configuration →
     Redirect URLs, or the links will bounce. */
  redirectTo: null,

  /* Set false to stop sending analytics events to the events table.
     Console logging of events is unaffected. */
  analytics: false,

  /* Does your Magic Link email actually contain a 6-digit code?

     The code-entry box is the most reliable way to sign in — it has no
     browser-bound verifier, so it survives links opened on another device
     and links prefetched by email scanners. But it only helps if the code
     is IN the email, which means the template must include {{ .Token }}.

     Since 3 June 2026 Supabase blocks template editing on free-tier
     projects using its built-in email provider, so this stays false until
     one of these is true:
       - you connect your own SMTP (Resend, Postmark, SES...), which
         re-enables template editing on any plan, or
       - you move to Pro.

     You will want custom SMTP before launch regardless: the built-in
     sender is rate-limited to a handful of emails an hour and is not
     intended for production traffic.

     When you do, add this to Authentication -> Emails -> Magic Link:
       <p>Or enter this code: <strong>{{ .Token }}</strong></p>
     then flip this to true. */
  otpCodeInEmail: false,

  /* Which ways in to offer, in the order shown.

     Values: "google" | "facebook" | "password" | "magiclink"

     Making this a list rather than a set of booleans means the sign-in
     dialog is one decision, changed in one place, with no code edit —
     including reverting it if the data says you were wrong.

       ["google"]                       one button, nothing else
       ["google", "password"]           Google first, email behind a link
       ["google", "password", "magiclink"]  everything

     Worth knowing before choosing ["google"] alone: Google refuses OAuth
     inside embedded webviews (Instagram, Facebook and TikTok in-app
     browsers) and has done since July 2023. Those visitors get no way to
     create an account at all. Because every activity works signed out,
     they can still use the product — they just cannot save. Whether that
     is acceptable depends on how much traffic arrives from social.

     Anything after the first entry renders behind a "Trouble signing
     in?" link, so extra methods cost no visual clutter. */
  authMethods: ["google", "facebook", "password"]
};
