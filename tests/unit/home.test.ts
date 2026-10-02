import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { makeEye, eyePaths, EYE } from '../../src/site/sections/HowItWorks/net';
import { stepLines } from '../../src/site/sections/HowItWorks/log';
import { runRoundTrip } from '../../src/site/lib/roundTrip';
import { HOW_STEPS, USE_CASES } from '../../src/site/content/how';
import { stage } from '../../src/site/content/spixiStage';

/** Homepage rules that are easy to break quietly. */

const ROOT = join(import.meta.dirname, '../../src');
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(f) ? [p] : [];
  });

const twoDecimals = (n: number) => Math.round(n * 100) / 100 === n;

test('the How it works drawings are deterministic and rounded (SSR hydration)', () => {
  const a = makeEye();
  assert.deepEqual(a, makeEye(), 'two builds differ');
  assert.ok(a.ring.length > 40 && a.disc.length > 10, 'too few points');
  assert.ok(a.sector.some(Boolean), 'the discovery sector is empty');
  for (const p of [...a.ring, ...a.disc]) assert.ok(twoDecimals(p.x) && twoDecimals(p.y), `unrounded point ${p.x},${p.y}`);
  // every path is plain numbers: no NaN, nothing unrounded
  for (const d of Object.values(eyePaths(a.R))) for (const n of d.match(/-?\d+(\.\d+)?/g) ?? []) assert.ok(twoDecimals(Number(n)), `unrounded ${n} in ${d}`);
  assert.ok(EYE.card.w > 0);
});

test('the How it works round trip really runs: keys, proof, sector, hybrid exchange, two layers, payment', async () => {
  const rt = await runRoundTrip();
  assert.equal(rt.proof.ok, true, 'signature check');
  assert.equal(rt.talk.ok, true, 'B opened both layers with keys derived on its own side');
  assert.equal(rt.pay.ok, true, 'transaction signature');
  assert.match(rt.identity.a, /^[1-9A-HJ-NP-Za-km-z]{60,70}$/);
  assert.notEqual(rt.identity.a, rt.identity.b);
  assert.match(rt.find.sector, /^[0-9a-f]{20}$/);
  const times = [rt.identity.keygenA, rt.proof.sign, rt.proof.verify, rt.find.hash, rt.talk.ecdh, rt.talk.kem, rt.talk.rsa, rt.talk.hkdf, rt.talk.seal, rt.talk.open, rt.pay.sign, rt.pay.verify];
  assert.ok(times.every((t) => Number.isFinite(t) && t >= 0), 'every step is timed');
});

test('the How it works log stays honest: only what ran here is timed; relays and the DLT are drawn', async () => {
  const rt = await runRoundTrip();
  for (let S = 0; S < HOW_STEPS.length; S++) {
    const lines = stepLines(S, rt, USE_CASES[0], 6278700);
    for (const l of lines) {
      if (!l.real) assert.equal(l.ms, undefined, `a drawn line carries a time: "${l.text}"`);
      if (/relay|DLT|block|S2 network/i.test(l.text) && !/signs|checks/i.test(l.text)) assert.ok(!l.real, `a network step is marked as run here: "${l.text}"`);
      if (l.real && l.ms !== undefined) assert.ok(Number.isFinite(l.ms), `"${l.text}" has no measured time`);
    }
  }
});

test('technical statements in How it works link to docs.ixian.io', () => {
  const hrefs = [...HOW_STEPS.map((s) => s.more.href), ...USE_CASES.map((u) => u.docs.href)];
  const off = hrefs.filter((h) => !h.startsWith('https://docs.ixian.io/'));
  assert.deepEqual(off, []);
});

test('the Spixi stage never shows example data as live', () => {
  const text = JSON.stringify(stage).toLowerCase();
  for (const word of ['online', ' live', 'real-time', 'right now']) assert.ok(!text.includes(word), `stage copy says "${word.trim()}"`);
});

test('no calc() in SVG stroke widths (Safari ignores it)', () => {
  const off = files(ROOT).filter((f) => /stroke-?[wW]idth\s*[:=]\s*[{'"`]?[^;\n]*calc\(/.test(readFileSync(f, 'utf8')));
  assert.deepEqual(off, []);
});

test('the quickstart never binds wide, never skips TLS, and uses one placeholder convention', async () => {
  const q = await import('../../src/site/content/quickstart');
  const all = JSON.stringify([q.steps, q.leave, q.trouble, q.live]);
  assert.ok(!/0\.0\.0\.0/.test(all), '0.0.0.0 on the quickstart');
  assert.ok(!/(^|\s)(-k|--insecure)(\s|$)/.test(all), 'an insecure flag on the quickstart');
  assert.ok(!/localhost/.test(all), 'use 127.0.0.1, not localhost');
  // every dependency multiplies the failure surface: .NET, Git and curl only
  const cmds = JSON.stringify([...q.steps.flatMap((st) => st.cmds), q.live.cmd, q.leave.stopCmd, q.leave.removeCmd].map((c) => c.lines));
  assert.ok(!/python|\bpy\b|\bjq\b|\bpip\b|\bnpm\b|\bnode\b/i.test(cmds), 'a command needs something beyond .NET, Git and curl');
  const ph = new Set(all.match(/YOUR_[A-Z_]+/g));
  assert.deepEqual([...ph].sort(), ['YOUR_ADDRESS', 'YOUR_API_KEY']);
  // one path: every step has a time and at least one command
  for (const st of q.steps) assert.ok(st.time && st.cmds.length > 0, `step ${st.id} has no time or command`);
  // every problem comes with a fix, and errors are quoted as the program prints them (straight quotes)
  for (const t of q.trouble) {
    assert.ok(t.fix.trim(), `no fix for "${t.error}"`);
    assert.ok(!/[\u2018\u2019\u201C\u201D]/.test(t.error), `a typographic quote in "${t.error}"`);
  }
});

test('the 404 suggests the right page for common slips, and nothing for noise', async () => {
  const { closest } = await import('../../src/site/lib/nearestRoute');
  assert.equal(closest('/quickstrat')?.href, '/quickstart');
  assert.equal(closest('/platform')?.href, '/technology');
  assert.equal(closest('/developers/')?.href, '/build');
  assert.equal(closest('/abuot')?.href, '/about-us');
  assert.equal(closest('/xq7zz9kk2'), null);
  assert.equal(closest('/'), null);
});
