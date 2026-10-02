import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addressParts, typo } from '../../src/site/lib/addressParts';
import { createIdentity } from '../../src/site/lib/ixianAddress';
import { prepare, sealMessage } from '../../src/site/lib/seal';
import { decompose } from '../../src/site/content/platform';

test('Identity decomposer: the docs example is a valid v0 address', () => {
  const p = addressParts(decompose.example.value);
  assert.ok(p.ok);
  if (!p.ok) return;
  assert.equal(p.version, 0);
  assert.equal(p.bytes, 36);
  assert.equal(p.payloadHex.length, 64);
  assert.equal(p.checksumHex, '03ecd2');
  assert.equal(p.valid, true);
});

test('Identity decomposer: a typo fails visibly, a bad character is named', () => {
  const bad = addressParts(typo(decompose.example.value, 1));
  assert.ok(!bad.ok || !bad.valid, 'one changed character must not validate');
  const ch = addressParts(decompose.example.value.slice(0, -2) + '0m');
  assert.equal(ch.ok, false);
  if (!ch.ok) assert.equal(ch.kind, 'char');
});

test('Identity decomposer: a browser-made v1 address validates', async () => {
  const id = await createIdentity();
  const p = addressParts(id.address);
  assert.ok(p.ok && p.valid && p.version === 1 && p.bytes === 48);
});

test('Seal: the other end opens what was sealed, and every step is timed', async () => {
  const k = await prepare();
  const r = await sealMessage(k, 'Only the other end can read this.');
  assert.equal(r.ok, true);
  assert.equal(r.bytes.inner, r.bytes.message + 16); // AES-GCM tag
  assert.equal(r.bytes.outer, r.bytes.inner + 16); // Poly1305 tag
  for (const t of [...r.legs, r.hkdf, r.inner, r.outer, r.open]) assert.ok(t >= 0);
});
