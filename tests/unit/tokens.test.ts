import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { palette } from '../../src/site/styles/palette';

/** Design tokens: one source of truth, enforced. */

const ROOT = join(import.meta.dirname, '../../src');
const TOKENS = readFileSync(join(ROOT, 'site/styles/tokens.css'), 'utf8');
const css = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? css(p) : f.endsWith('.css') ? [p] : [];
  });

/** a token's value, following var(--…) chains */
function resolve(name: string, depth = 0): string {
  const m = TOKENS.match(new RegExp(`${name}:\\s*([^;]+);`));
  assert.ok(m, `${name} is defined in tokens.css`);
  const v = m![1].trim();
  const ref = v.match(/^var\((--[a-z0-9-]+)\)$/);
  return ref && depth < 8 ? resolve(ref[1], depth + 1) : v.toLowerCase();
}

test('palette.ts matches tokens.css', () => {
  const map: Record<keyof typeof palette, string> = {
    page: '--ix-page',
    text: '--ix-text',
    text2: '--ix-text-2',
    text3: '--ix-text-3',
    live: '--ix-live',
    route: '--ix-route',
    build: '--ix-build',
  };
  for (const [k, token] of Object.entries(map)) assert.equal(palette[k as keyof typeof palette], resolve(token), `${k} = ${token}`);
});

test('colour channels match their tokens', () => {
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(' ');
  assert.equal(resolve('--ix-ink-rgb'), hex(resolve('--ix-text')));
  assert.equal(resolve('--ix-action-rgb'), hex(resolve('--ix-action')));
  assert.equal(resolve('--ix-route-rgb'), hex(resolve('--ix-route')));
  assert.equal(resolve('--ix-build-rgb'), hex(resolve('--ix-build')));
});

test('no token colour written as a literal rgba() in CSS (use rgb(var(--ix-…-rgb) / a))', () => {
  const literal = /rgba?\(\s*(243,\s*247,\s*244|92,\s*201,\s*109|157,\s*185,\s*255|227,\s*166,\s*79)\b/;
  const offenders = css(ROOT).filter((f) => !f.endsWith('tokens.css') && literal.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, []);
});

test('no deprecated or self-referencing tokens', () => {
  for (const f of css(ROOT)) {
    const s = readFileSync(f, 'utf8');
    assert.doesNotMatch(s, /--(ix-[a-z0-9-]+):\s*var\(--\1\)/, `${f} sets a token to itself`);
    assert.doesNotMatch(s, /var\(--ix-(green|on-green|bg-base|surface-1|surface-3|line-3|r-pill)\)/, `${f} uses a removed token`);
  }
});

test('text sizes come from the type scale, never below 11px (Spixi phone mocks and SVG drawings excepted)', () => {
  const mock = /(Spixi[\\/](stage|phones)|QsSpixi)\.module\.css$/; // either path separator, so it also holds on Windows
  for (const f of css(ROOT)) {
    if (mock.test(f) || f.endsWith('tokens.css')) continue;
    // text inside an SVG drawing is in drawing units and scales with it
    const src = readFileSync(f, 'utf8').split('\n').filter((l) => !/\bsvg\b/.test(l)).join('\n');
    for (const m of src.matchAll(/font-size:\s*([\d.]+)(px|rem)/g)) {
      const px = m[2] === 'rem' ? +m[1] * 16 : +m[1];
      assert.ok(px > 14, `${f}: font-size ${m[1]}${m[2]}; use var(--ix-fs-…) for text of 14px and under`);
    }
  }
  assert.equal(resolve('--ix-fs-micro'), '0.6875rem');
});
