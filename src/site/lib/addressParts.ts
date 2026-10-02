import { sha512 } from '@noble/hashes/sha2.js';
import { sha3_512 } from '@noble/hashes/sha3.js';
import { base58Decode, hex } from './sha3';

/**
 * Splits an address into version, payload and checksum. Synchronous and pure so it can render on the server.
 *
 *   v0: 0x00 + 32-byte payload + 3-byte checksum = 36 bytes
 *   v1: 0x01 + 44-byte payload + 3-byte checksum = 48 bytes
 *   v2: 0x02 + 44-byte payload + 3-byte checksum = 48 bytes
 *
 * Checksum: first 3 bytes of a double hash over version + payload. Ixian-Core (Address.cs)
 * uses double SHA-512 for every version while the docs say SHA3-512 for v2, so v2 tries both.
 */

const ALPHABET = /[^1-9A-HJ-NP-Za-km-z]/;

export type Parts =
  | { ok: false; kind: 'empty' }
  | { ok: false; kind: 'char'; char: string; at: number }
  | { ok: false; kind: 'version'; version: number }
  | { ok: false; kind: 'length'; version: number; want: number; got: number }
  | {
      ok: true;
      version: number;
      bytes: number;
      versionHex: string;
      payloadHex: string;
      checksumHex: string;
      expectedHex: string;
      valid: boolean;
      hash: 'SHA-512' | 'SHA3-512';
    };

export function addressParts(input: string): Parts {
  const s = input.trim().split('_')[0];
  if (!s) return { ok: false, kind: 'empty' };
  const bad = s.match(ALPHABET);
  if (bad) return { ok: false, kind: 'char', char: bad[0], at: bad.index ?? 0 };
  const b = base58Decode(s);
  if (!b || b.length === 0) return { ok: false, kind: 'empty' };
  const v = b[0];
  if (v > 2) return { ok: false, kind: 'version', version: v };
  const want = v === 0 ? 36 : 48;
  if (b.length !== want) return { ok: false, kind: 'length', version: v, want, got: b.length };
  const body = b.slice(0, b.length - 3);
  const given = hex(b.slice(b.length - 3));
  const core = hex(sha512(sha512(body)).slice(0, 3));
  let expected = core;
  let hash: 'SHA-512' | 'SHA3-512' = 'SHA-512';
  if (v === 2 && core !== given) {
    const docs = hex(sha3_512(sha3_512(body)).slice(0, 3));
    if (docs === given) {
      expected = docs;
      hash = 'SHA3-512';
    }
  }
  return {
    ok: true,
    version: v,
    bytes: b.length,
    versionHex: hex(b.slice(0, 1)),
    payloadHex: hex(b.slice(1, b.length - 3)),
    checksumHex: given,
    expectedHex: expected,
    valid: expected === given,
    hash,
  };
}

/** Change one character in the middle of an address, to a different valid Base58 one. */
export function typo(s: string, seed = 0): string {
  if (s.length < 10) return s;
  const i = Math.floor(s.length / 2) + (seed % 7);
  const pool = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const cur = pool.indexOf(s[i]);
  const next = pool[(cur + 1 + (seed % 5)) % pool.length];
  return s.slice(0, i) + next + s.slice(i + 1);
}
