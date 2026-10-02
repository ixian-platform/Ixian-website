import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { sha3_512, base58Encode, base58Decode, hex } from '../../src/site/lib/sha3';
import { createIdentity, ixianPublicKey, addressFromPublicKey, signMessage, verifyMessage } from '../../src/site/lib/ixianAddress';

test('SHA3-512 matches node:crypto (Platform page address lookup)', () => {
  for (const text of ['', 'abc', 'x'.repeat(71), 'x'.repeat(72), 'x'.repeat(200)]) {
    const want = createHash('sha3-512').update(text).digest('hex');
    assert.equal(hex(sha3_512(new TextEncoder().encode(text))), want, `input of length ${text.length}`);
  }
});

test('Base58 round trip, leading zeros included', () => {
  for (const bytes of [new Uint8Array([0, 0, 1, 2, 3]), new Uint8Array(48).fill(7), new Uint8Array([255])]) {
    assert.deepEqual(base58Decode(base58Encode(bytes)), bytes);
  }
  assert.equal(base58Decode('0OIl'), null);
});

test('the docs example addresses carry a valid (SHA-512)² checksum', () => {
  for (const a of ['1EXSqPpj49ZmKiWF8stsMsMXVnSfkee7EzTaBakwNn9sJdaWm', '16NBHjLGJnmWGWjoRj1Tz5TebgwhAtN2ewDThrDp1HfKuhJBo']) {
    const raw = base58Decode(a)!;
    const body = raw.subarray(0, raw.length - 3);
    const sq = createHash('sha512').update(createHash('sha512').update(body).digest()).digest();
    assert.deepEqual([...sq.subarray(0, 3)], [...raw.subarray(raw.length - 3)], a);
  }
});

test('address derivation follows Ixian-Core (v1: version byte excluded from the hash)', async () => {
  const modulus = new Uint8Array(512).map((_, i) => (i * 37 + 11) & 255);
  modulus[0] |= 0x80;
  const pk = ixianPublicKey(modulus, new Uint8Array([1, 0, 1]));
  assert.equal(pk.length, 528);
  assert.deepEqual([...pk.subarray(0, 9)], [1, 0, 0, 0, 0, 0, 2, 0, 0]); // version, format 0, length 512 (LE)

  const sq = (b: Uint8Array) => createHash('sha512').update(createHash('sha512').update(b).digest()).digest();
  const raw = Buffer.concat([Buffer.from([1]), sq(pk.subarray(1)).subarray(0, 44)]);
  const want = base58Encode(Buffer.concat([raw, sq(raw).subarray(0, 3)]));
  assert.equal(await addressFromPublicKey(pk), want);
});

test('a browser identity is a valid v1 address and signs like Ixian (PKCS#1 v1.5, SHA-512)', async () => {
  const id = await createIdentity();
  const raw = base58Decode(id.address)!;
  assert.equal(raw.length, 48);
  assert.equal(raw[0], 1);
  const sig = await signMessage(id, 'hello');
  assert.equal(sig.length, 1024); // 512 bytes, hex
  assert.equal(await verifyMessage(id, 'hello', sig), true);
  assert.equal(await verifyMessage(id, 'hullo', sig), false);
});
