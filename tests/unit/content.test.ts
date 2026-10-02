import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { links } from '../../src/site/content/links';

/** Content rules, enforced so they can't regress. */

const ROOT = join(import.meta.dirname, '../../src');
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|css)$/.test(f) ? [p] : [];
  });

test('no em dashes anywhere in the source', () => {
  const offenders = files(ROOT).filter((f) => readFileSync(f, 'utf8').includes('—'));
  assert.deepEqual(offenders, []);
});

// generic filler words and phrases; the blog is republished verbatim, so it is left out
const FILLER =
  /\b(delve|foster|leverag|utiliz|facilitat|empower|streamlin|robust|cutting-edge|paradigm shift|game.changer|tapestry|realm|beacon|multifaceted|meticulous|intricate|paramount|transformative|elevat(?:e|es|ed|ing)\b|embark|supercharg|harness|ever-evolving|it'?s worth noting|it is worth noting|important to note|at the end of the day|when it comes to|at its core|in today'?s world|in the age of|the reality is|the truth is|in order to|going forward|let'?s dive|here'?s the thing|nobody tells you|testament to|pivotal|plays a vital role|this changes everything)/i;

test('no filler words in the site copy', () => {
  const offenders = files(ROOT)
    .filter((f) => !/[\\/]content[\\/]blog/.test(f) && !f.endsWith('.css'))
    .flatMap((f) =>
      readFileSync(f, 'utf8')
        .split('\n')
        .flatMap((line, i) => (FILLER.test(line) ? [`${f.slice(ROOT.length + 1)}:${i + 1}: ${line.match(FILLER)?.[0]}`] : [])),
    );
  assert.deepEqual(offenders, []);
});

test('every external link is https', () => {
  const walk = (v: unknown, path: string): string[] =>
    typeof v === 'string'
      ? /^https?:/.test(v) && !v.startsWith('https://') ? [`${path}: ${v}`] : []
      : v && typeof v === 'object'
        ? Object.entries(v).flatMap(([k, x]) => walk(x, `${path}.${k}`))
        : [];
  assert.deepEqual(walk(links, 'links'), []);
});

// signed release files: never edited by hand; update the hashes only with a new signed release
const SIGNED: Record<string, string> = {
  'update.txt': 'b1800e945594a87a796dc567009180f8835752558ed7ffe8b57a42e91d4ba39a',
  'spixi-update.txt': '9e27f6db4d489e26a44f950e5f115be53049ed8eddc74de35ac5ceeee056ff0a',
  's2-update.txt': '3a2c72108056249f2f77161f395bf761b90c4088569ba785bf7e34332c8b8386',
  'test-account.ixi': '17965047923a23d6eea437988550007917e77f7e081d773b6855110606f0e566',
};

test('the signed files in public/ are byte for byte unchanged', () => {
  for (const [f, want] of Object.entries(SIGNED)) {
    const got = createHash('sha256').update(readFileSync(join(ROOT, '../public', f))).digest('hex');
    assert.equal(got, want, `public/${f} changed`);
  }
});
