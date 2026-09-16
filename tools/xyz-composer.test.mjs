#!/usr/bin/env node
/* Unit test for the impact-statement composer (XYZ).
 *
 *   node tools/xyz-composer.test.mjs
 *
 * Reads the composer straight out of apps/career-abcs_v2.html (between
 * the XYZ-COMPOSER markers), so the test always runs against what ships.
 * Fails if any persona story or edge case produces a bullet that breaks
 * the rules in abcs-bullet-rules.mjs, or if a pass-bar bullet is flagged
 * by the app's own check().
 */
import fs from "node:fs";
import { PERSONAS } from "./abcs-personas.mjs";
import { lintBullet, PASS_BAR } from "./abcs-bullet-rules.mjs";

const html = fs.readFileSync(new URL("../apps/career-abcs_v2.html", import.meta.url), "utf8");
const m = html.match(/\/\* XYZ-COMPOSER:BEGIN \*\/([\s\S]*?)\/\* XYZ-COMPOSER:END \*\//);
if (!m) { console.error("Composer markers not found in career-abcs_v2.html"); process.exit(1); }
const XYZ = new Function(m[1] + "\nreturn XYZ;")();

/* Problems a story can legitimately leave in: the person gave no number. */
const allowed = (story, problems) => problems.filter((p) => !(p === "no number" && !(story.numbers || []).length && !/\d/.test(story.situation + story.whatChanged)));

const EDGE = [
  ["customer_facing", { action: "served customers", measure: "100 to 150 customers a day; each order in five minutes or less", result: "" }, "Served 100–150 customers a day"],
  ["hands_on", { action: "i pick orders in the warehouse and load the trucks", measure: "250-300 orders a shift", result: "my scan accuracy is above 99%" }, "Picked 250–300 orders a shift"],
  ["office_admin", { action: "I answer the phones and schedule appointments for three doctors", measure: "60 calls a day", result: "no double bookings since I started" }, "averaging 60 calls a day"],
  ["leading_people", { action: "I trained and scheduled a team of 12 cashiers", measure: "", result: "customer complaints dropped by half" }, "cutting customer complaints by half"],
  ["technical_trades", { action: "fixed HVAC units on service calls", measure: "5-6 calls a day", result: "we got callbacks down from 9 a month to 5" }, "cutting callbacks from 9 a month to 5"],
  ["customer_facing", { action: "Made the order, took the order at the drive thru, and ensured customer satisfaction", measure: "between 100-150 people a day; each order in five minutes or less", result: "our store is one of the most popular in our location because we have efficient service with a smile" }, "Prepared and took orders at the drive-thru for 100–150 customers a day"],
];

let fails = 0;
const fail = (msg) => { fails++; console.log("FAIL " + msg); };

for (const p of PERSONAS) for (const s of p.state.about.stories) {
  const fam = p.state.build.roleFamily;
  const job = p.state.build.experience.find((j) => j.id === p.pulls[s.id]) || {};
  const tense = String(job.to || "").trim() ? "past" : "present";
  const out = XYZ.compose(XYZ.prefill(s, fam), fam, { tense });
  const probs = allowed(s, lintBullet(out, { tense }).problems);
  if (probs.length) fail(`${p.key} / ${s.title}: ${out}\n     ${probs.join("; ")}`);
  else console.log(`ok   ${out}`);
}
for (const [fam, boxes, mustContain] of EDGE) {
  const out = XYZ.compose(boxes, fam);
  const probs = lintBullet(out).problems.filter((x) => x !== "no number");
  if (probs.length) fail(`${out}\n     ${probs.join("; ")}`);
  else if (!out.includes(mustContain)) fail(`expected "${mustContain}" in: ${out}`);
  else console.log(`ok   ${out}`);
}
if (XYZ.compose({ action: "", measure: "", result: "" }, "any") !== "") fail("empty boxes should give an empty bullet");
/* Present tense on a current job, past on an old one. */
const cur = XYZ.compose({ action: "I led the closing crew and made the schedule", measure: "8 people on the crew", result: "" }, "leading_people", { tense: "present" });
if (!/^Lead the closing crew/.test(cur) || !/\bmake the schedule\b/.test(cur)) fail(`present tense: ${cur}`); else console.log(`ok   ${cur}`);
const pct = XYZ.compose({ action: "I lead a team of student workers", measure: "", result: "retention stayed at 87% - 92% term over term" }, "leading_people", { tense: "present" });
if (!/87\u201392%/.test(pct)) fail(`percent range: ${pct}`); else console.log(`ok   ${pct}`);
for (const b of PASS_BAR) {
  const issues = XYZ.check(b);
  if (issues.length) fail(`app check() flags a pass-bar bullet: ${b} -> ${issues.join(" ")}`);
}
if (!XYZ.check("I made the order; our store is great").length) fail("check() missed an obviously bad bullet");

console.log(fails ? `\n${fails} failing` : "\nAll composer checks pass");
process.exit(fails ? 1 : 0);
