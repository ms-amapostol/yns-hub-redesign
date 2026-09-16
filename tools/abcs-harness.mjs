#!/usr/bin/env node
/* Career ABCs harness.
 *
 *   node tools/abcs-harness.mjs            -> tools/harness-output/*.txt
 *   node tools/abcs-harness.mjs --label before
 *
 * Boots apps/career-abcs_v2.html headless, once per persona, and plays
 * A -> B -> C through the real UI. Everything the app writes for that
 * person lands in one text file for side-by-side reading.
 *
 * The two things that made hand testing slow are handled at the source:
 *   - The persona is written to localStorage BEFORE the bundle boots,
 *     with seen.welcome / seen.survey set, so onboarding never opens and
 *     the app's first load() reads the persona instead of saving a blank
 *     document over it. A sessionStorage flag stops reloads re-seeding.
 *   - Print windows are caught as popups, so the resume that reaches the
 *     page count is the exact HTML the person would print.
 *
 * Needs: playwright (npm i -g playwright). No network: external requests
 * (fonts, analytics, Supabase) are blocked so runs are fast and identical.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PERSONAS } from "./abcs-personas.mjs";
import { lintBullet, PASS_BAR } from "./abcs-bullet-rules.mjs";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

/* Playwright from a local install, or the global one. */
let chromium;
try { ({ chromium } = await import("playwright")); }
catch { ({ chromium } = createRequire(execSync("npm root -g").toString().trim() + "/")("playwright")); }

const here = path.dirname(fileURLToPath(import.meta.url));
const APPS = path.resolve(here, "../apps");
const labelArg = process.argv.indexOf("--label");
const LABEL = labelArg > 0 ? process.argv[labelArg + 1] : "latest";
const OUT = path.join(here, "harness-output", LABEL);
fs.mkdirSync(OUT, { recursive: true });

/* ---- a tiny static server so the app runs on http, like production ---- */
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".webp": "image/webp", ".json": "application/json" };
const server = http.createServer((req, res) => {
  const p = path.join(APPS, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(APPS) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const ORIGIN = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const summary = [];

for (const persona of PERSONAS) {
  const log = [];
  const say = (...s) => log.push(s.join(""));
  const hr = (t) => say("\n", "=".repeat(72), "\n", t, "\n", "=".repeat(72));
  const errors = [];

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.abort());
  await context.addInitScript((seed) => {
    try {
      if (!sessionStorage.getItem("__harness_seeded")) {
        localStorage.setItem("yns.abcs.v1", JSON.stringify(seed));
        sessionStorage.setItem("__harness_seeded", "1");
      }
      window.print = () => {};
    } catch (e) {}
  }, persona.state);
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("dialog", (d) => d.dismiss());

  const go = async (hash) => {
    await page.goto(`${ORIGIN}/career-abcs_v2.html#${hash}`);
    await page.waitForSelector("main, #main", { timeout: 15000 });
    await page.waitForTimeout(250);
  };
  const guidanceCount = () => page.evaluate(() => {
    const main = document.querySelector("#main") || document.body;
    const vis = (n) => n.offsetParent !== null;
    const notes = [...main.querySelectorAll(".note")].filter(vis).map((n) => (n.querySelector(".note-t") || {}).textContent || n.textContent.slice(0, 40));
    const reels = [...main.querySelectorAll(".reel")].filter(vis).length;
    const asides = [...main.querySelectorAll("aside")].filter(vis).length;
    return { notes, reels, asides };
  });
  const guidanceLine = async (where) => {
    const g = await guidanceCount();
    say(`${where}: ${g.notes.length} note(s), ${g.reels} reel block(s), ${g.asides} aside(s)`);
    g.notes.forEach((n) => say(`    - ${n.trim().replace(/\s+/g, " ").slice(0, 70)}`));
    return g;
  };

  hr(`${persona.label}`);
  say(`Persona key: ${persona.state.about.persona}   Role family: ${persona.state.build.roleFamily}`);

  /* ---- A: the stories as typed ---- */
  await go("a");
  hr("A. About You: stories as the person typed them");
  for (const s of persona.state.about.stories) {
    say(`\n[${s.title}]`);
    say(`  situation:    ${s.situation}`);
    say(`  what I did:   ${s.whatIDid}`);
    say(`  what changed: ${s.whatChanged}`);
    if (s.numbers.length) say(`  numbers:      ${s.numbers.map((n) => `${n.what} = ${n.value}`).join("; ")}`);
  }
  hr("Guidance on each screen");
  const guide = {};
  guide.a = await guidanceLine("A  About You");

  /* ---- B: every story through the builder ---- */
  await go("b");
  guide.resume = await guidanceLine("B1 Resume");
  hr("B. Story -> bullet");
  const bulletRows = [];
  for (const [storyId, jobId] of Object.entries(persona.pulls)) {
    const story = persona.state.about.stories.find((s) => s.id === storyId);
    await page.click(`[data-act="from-story"][data-id="${jobId}"]`);
    const idx = persona.state.about.stories.indexOf(story);
    await page.locator("#sb-list button").nth(idx).click();
    await page.waitForSelector("#xyz-final", { timeout: 5000 });
    const draft = await page.inputValue("#xyz-final");
    const boxes = {
      did: await page.inputValue("#xyz-z"),
      measure: await page.inputValue("#xyz-y"),
      result: await page.inputValue("#xyz-x"),
    };
    const variants = await page.$$eval("#sb-out .bullet-opt span", (ns) => ns.map((n) => n.firstChild ? n.firstChild.textContent : n.textContent));
    const extraNotes = await page.$$eval("#sb-out .note", (ns) => ns.filter((n) => n.offsetParent !== null).length);
    const job = persona.state.build.experience.find((j) => j.id === jobId) || {};
    const tense = String(job.to || "").trim() ? "past" : "present";
    const lint = lintBullet(draft, { tense });
    /* A story with no number in it cannot produce one; the app asks for it. */
    if (!(story.numbers || []).length && !/\d/.test(story.situation + story.whatChanged)) {
      lint.notes = lint.problems.filter((x) => x === "no number").map(() => "no number in the story (the app asks for one)");
      lint.problems = lint.problems.filter((x) => x !== "no number");
    }
    bulletRows.push({ story: story.title, draft, lint });
    say(`\n[${story.title}]`);
    say(`  boxes -> did: "${boxes.did}"`);
    say(`           measured by: "${boxes.measure}"`);
    say(`           result: "${boxes.result}"`);
    say(`  DRAFT (${lint.words} words): ${draft}`);
    say(`  checks: ${lint.problems.length ? lint.problems.join("; ") : "clean"}`);
    if (variants.length) {
      say(`  old parser variants still shown (${variants.length}):`);
      variants.forEach((v) => say(`    - ${v}`));
    } else say(`  old parser variants shown: none`);
    if (extraNotes) say(`  extra notes in the picker: ${extraNotes}`);
    await page.click("#xyz-add");
    await page.waitForTimeout(350);
  }

  /* ---- the resume, as printed ---- */
  hr("B. The resume");
  await page.waitForSelector("#r-preview");
  const draftBtn = await page.$('[data-act="draft-summary"]');
  if (draftBtn && !persona.state.build.summary) { await draftBtn.click(); await page.waitForTimeout(350); }
  else say("(no built-in summary button on this build)");
  const preview = await page.innerText("#r-preview");
  say(preview);
  const checks = await page.innerText("#r-checks").catch(() => "");
  say("\n-- Before you send it --\n" + checks);
  const [popup] = await Promise.all([
    context.waitForEvent("page", { timeout: 5000 }).catch(() => null),
    page.click('[data-act="print-resume"]'),
  ]);
  let pages = "?";
  if (popup) {
    await popup.waitForLoadState();
    const html = await popup.content();
    await popup.close();
    const pdfPage = await context.newPage();
    await pdfPage.setContent(html);
    const pdf = await pdfPage.pdf({ format: "Letter" });
    pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
    await pdfPage.close();
    fs.writeFileSync(path.join(OUT, `${persona.key}-resume.html`), html);
  }
  say(`\nPrinted length: ${pages} page(s) on US Letter`);
  const warnsLength = /fits on one page/i.test(checks);
  const lengthAgrees = pages === "?" ? "?" : (pages > 1) === warnsLength ? "yes" : "NO";
  say(`One-page warning shown: ${warnsLength ? "yes" : "no"}   agrees with the PDF: ${lengthAgrees}`);

  /* ---- cover letter ---- */
  await page.click('[data-tab="cover"]');
  await page.waitForTimeout(250);
  guide.cover = await guidanceLine("B3 Cover letter");
  await page.click('[data-act="draft-cover"]');
  await page.waitForSelector("#c-preview", { timeout: 5000 });
  hr("B. The cover letter");
  say(await page.innerText("#c-preview"));

  /* ---- C ---- */
  await go("c");
  guide.c = await guidanceLine("C  Carry It In");

  if (errors.length) { hr("Page errors"); errors.forEach((e) => say(e)); }

  fs.writeFileSync(path.join(OUT, `${persona.key}.txt`), log.join("\n") + "\n");
  summary.push({ persona: persona.key, bulletRows, pages, lengthAgrees, guide, errors: errors.length });
  await context.close();
}

await browser.close();
server.close();

/* ---- one-screen scorecard ---- */
const lines = [`Career ABCs harness: ${LABEL}   ${new Date().toISOString()}`, ""];
let clean = 0, total = 0;
for (const s of summary) {
  lines.push(`${s.persona}   resume pages: ${s.pages} (length check agrees: ${s.lengthAgrees})   page errors: ${s.errors}`);
  lines.push(`  guidance notes per screen: A ${s.guide.a.notes.length}, resume ${s.guide.resume.notes.length}, cover ${s.guide.cover.notes.length}, C ${s.guide.c.notes.length}`);
  lines.push(`  reel blocks per screen:    A ${s.guide.a.reels}, resume ${s.guide.resume.reels}, cover ${s.guide.cover.reels}, C ${s.guide.c.reels}`);
  for (const r of s.bulletRows) {
    total++; if (!r.lint.problems.length) clean++;
    lines.push(`  ${r.lint.problems.length ? "FIX " : "ok  "} ${r.draft}`);
    if (r.lint.problems.length) lines.push(`        ${r.lint.problems.join("; ")}`);
    if ((r.lint.notes || []).length) lines.push(`        note: ${r.lint.notes.join("; ")}`);
  }
  lines.push("");
}
lines.push(`Bullets passing the rules: ${clean} of ${total}`);
lines.push(`Pass bar examples loaded: ${PASS_BAR.length}`);
fs.writeFileSync(path.join(OUT, "SCORECARD.txt"), lines.join("\n") + "\n");
console.log(lines.join("\n"));
console.log(`\nFull output: ${OUT}`);
