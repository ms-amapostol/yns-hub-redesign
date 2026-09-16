/* What a sendable resume bullet looks like, as checks a machine can run.
   The harness applies these to every draft. PASS_BAR holds bullets a
   reviewer has signed off on; every rule must pass on every one of them,
   so a rule that would fail a good bullet is a broken rule. */

export const PASS_BAR = [
  // From the handoff: what the drive-thru story should become.
  "Served 100–150 customers a day across register and drive-thru, delivering orders in under five minutes with near-zero remakes.",
  /* Written in the pattern Anastasia marked as good: scope first (team,
     volume, money), the outcome as a number or a range, strong verbs like
     led, pioneered, exceeded. Present tense for a current job. Her own
     resume is reference only and does not live in this repo. */
  "Lead a closing crew of 8 across register, floor and stock, keeping 7 of the last 9 new hires past 90 days.",
  "Pioneered a markdown cart for end-of-day produce, cutting shrink 18% in one quarter.",
  "Handle 60–80 calls a day across three clinics, holding scheduling errors under 2% for 12 straight months.",
  "Exceeded weekly pick targets for 20 straight weeks, averaging 250–300 orders a shift at 99% scan accuracy.",
];

const WEAK_OPENERS = /^(responsible|duties|helped|assisted|worked|did|made sure|ensured|was|were|had|got|tasked|in charge)\b/i;
const FIRST_PERSON = /\b(i|i'm|i've|me|my|we|our|us)\b/i;
const FILLER = /\b(with a smile|customer satisfaction|very|really|pretty much|a lot of|stuff|things)\b/i;

/* opts.tense: "past" (default) or "present" for a job the person still holds. */
export function lintBullet(text, opts = {}) {
  const t = String(text || "").trim();
  const words = t ? t.split(/\s+/).length : 0;
  const problems = [];
  if (!t) return { words, problems: ["empty"] };
  const cap = opts.cap || 28;
  if (words > cap) problems.push(`${words} words (cap ${cap})`);
  const first = t.split(/\s+/)[0].replace(/[^A-Za-z-]/g, "");
  if (WEAK_OPENERS.test(t)) problems.push(`weak opener "${first}"`);
  else if (opts.tense === "present") {
    if (!/^(set|put|cut|read|spread|shut|hit)$/i.test(first) && (/ed$/i.test(first) || IRREGULAR_PAST.has(first.toLowerCase()))) problems.push(`opener "${first}" is past tense on a current job`);
  } else if (!/ed$/i.test(first) && !IRREGULAR_PAST.has(first.toLowerCase())) problems.push(`opener "${first}" is not a past-tense verb`);
  if (FIRST_PERSON.test(t)) problems.push("first person left in");
  if (/;/.test(t)) problems.push("semicolon: two sentences glued together");
  if (commaSplice(t)) problems.push("comma splice");
  if ((t.match(/,/g) || []).length > 3) problems.push("more than three commas");
  if (!/\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|dozen|half|every|all)\b/i.test(t)) problems.push("no number");
  if (FILLER.test(t)) problems.push(`filler "${t.match(FILLER)[0]}"`);
  if (/\b(\w+)\b.*\b\1\b.*\b\1\b/i.test(t.replace(/\b(the|a|an|and|to|of|in|on|for|by|with|at)\b/gi, ""))) problems.push("same word three times");
  const bad = t.match(/\b(maded|ranned|kepted|nevered|gotting|tooking|stooded|\w+ieded|\w+eded)\b/i);
  const realEded = /^(exceeded|needed|succeeded|proceeded|seeded|weeded|heeded|embedded|added|ended)$/i;
  if (bad && !realEded.test(bad[0])) problems.push(`broken word "${bad[0]}"`);
  if ((t.match(/,\s+and\b/g) || []).length > 1) problems.push("two ', and' joins");
  if (/\b(what|who|that)\s+(saw|did|had|made|told)\b/i.test(t)) problems.push("missing subject");
  if (/\b(\w+)\s+\1\b/i.test(t)) problems.push("doubled word");
  if (!/[.]$/.test(t)) problems.push("no closing period");
  return { words, problems };
}

/* A comma splice: a comma followed by a clause that starts with a subject
   and a verb, with no joining word. */
function commaSplice(t) {
  return /,\s+(our|the store|the team|they|it|he|she|we|i|my|this)\s+\w+/i.test(t) &&
    !/,\s+(which|so|and|but|while|where|when)\b/i.test(t);
}

export const IRREGULAR_PAST = new Set(["ran", "led", "built", "kept", "taught", "sold", "held", "cut", "set", "put", "won", "made", "took", "drove", "wrote", "brought", "found", "met", "paid", "caught", "spent", "got", "did", "rebuilt", "oversaw", "undertook", "stood", "told", "saw", "grew", "rose", "spoke"]);

// Self-check: every pass-bar bullet must be clean.
for (const b of PASS_BAR) {
  const r = lintBullet(b, { tense: /^(Lead|Handle)\b/.test(b) ? "present" : "past" });
  if (r.problems.length) throw new Error(`Rule fails a pass-bar bullet: "${b}" -> ${r.problems.join("; ")}`);
}
