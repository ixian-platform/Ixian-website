import { ml_kem1024 } from '@noble/post-quantum/ml-kem.js';
import { chacha20poly1305 } from '@noble/ciphers/chacha.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha3_512 as sha3 } from '@noble/hashes/sha3.js';
import { hex } from './sha3';

/**
 * The Platform page's seal: one message through the layers the docs
 * describe, run for real in the visitor's browser and timed step by step.
 *
 *   exchange  RSA-OAEP with an RSA-4096 key, ECDH on P-521 (secp521r1) and
 *             ML-KEM-1024 (FIPS 203), each giving the two ends the same secret
 *   hkdf      HKDF-SHA3-512 over all three secrets: 64 bytes, split into an
 *             AES key and a ChaCha key
 *   inner     AES-256-GCM around the message
 *   outer     ChaCha20-Poly1305 around that
 *   open      the other end peels both layers with its own copy of the keys
 *
 * The same primitives as How it works (lib/roundTrip.ts), not Ixian's
 * byte-exact handshake. Key pairs are made once per page view (`prepare`)
 * and timed separately, as a key pair is made once per contact. Nothing
 * leaves the browser.
 */

export type SealKeys = {
  rsa: CryptoKeyPair;
  ecA: CryptoKeyPair;
  ecB: CryptoKeyPair;
  kem: { publicKey: Uint8Array; secretKey: Uint8Array };
  ms: number;
};

export type SealResult = {
  legs: [number, number, number]; // rsa, ecdh, ml-kem, ms
  hkdf: number;
  inner: number;
  outer: number;
  open: number;
  total: number;
  innerHex: string;
  outerHex: string;
  bytes: { message: number; inner: number; outer: number };
  ok: boolean;
};

const enc = new TextEncoder();
const buf = (u: Uint8Array) => u as unknown as BufferSource;
const ms = (t0: number) => Math.round((performance.now() - t0) * 10) / 10;
const OAEP = { name: 'RSA-OAEP', modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' } as const;
const P521 = { name: 'ECDH', namedCurve: 'P-521' } as const;

export async function prepare(): Promise<SealKeys> {
  const t0 = performance.now();
  const [rsa, ecA, ecB] = await Promise.all([
    crypto.subtle.generateKey(OAEP, false, ['encrypt', 'decrypt']) as Promise<CryptoKeyPair>,
    crypto.subtle.generateKey(P521, false, ['deriveBits']) as Promise<CryptoKeyPair>,
    crypto.subtle.generateKey(P521, false, ['deriveBits']) as Promise<CryptoKeyPair>,
  ]);
  const kem = ml_kem1024.keygen();
  return { rsa, ecA, ecB, kem, ms: ms(t0) };
}

const cat = (...parts: Uint8Array[]) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
};

export async function sealMessage(k: SealKeys, text: string): Promise<SealResult> {
  const start = performance.now();
  const message = enc.encode(text);

  // the exchange: three independent ways to agree on a secret
  let t = performance.now();
  const rsaA = crypto.getRandomValues(new Uint8Array(32));
  const rsaCt = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, k.rsa.publicKey, buf(rsaA));
  const rsaB = new Uint8Array(await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, k.rsa.privateKey, rsaCt));
  const tRsa = ms(t);

  t = performance.now();
  const ecdhA = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: k.ecB.publicKey }, k.ecA.privateKey, 528));
  const ecdhB = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: k.ecA.publicKey }, k.ecB.privateKey, 528));
  const tEcdh = ms(t);

  t = performance.now();
  const { cipherText, sharedSecret: kemA } = ml_kem1024.encapsulate(k.kem.publicKey);
  const kemB = ml_kem1024.decapsulate(cipherText, k.kem.secretKey);
  const tKem = ms(t);

  // one derivation over all three: an attacker has to break every leg
  const info = enc.encode('ixian.io platform seal');
  t = performance.now();
  const keyA = hkdf(sha3, cat(rsaA, ecdhA, kemA), undefined, info, 64);
  const tHkdf = ms(t);
  const keyB = hkdf(sha3, cat(rsaB, ecdhB, kemB), undefined, info, 64);

  // two layers: AES-256-GCM inside ChaCha20-Poly1305
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const n2 = crypto.getRandomValues(new Uint8Array(12));
  t = performance.now();
  const aesA = await crypto.subtle.importKey('raw', buf(keyA.slice(0, 32)), 'AES-GCM', false, ['encrypt']);
  const inner = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: buf(iv) }, aesA, buf(message)));
  const tInner = ms(t);
  t = performance.now();
  const outer = chacha20poly1305(keyA.slice(32, 64), n2).encrypt(inner);
  const tOuter = ms(t);

  // the other end: its own keys, both layers off
  t = performance.now();
  const innerB = chacha20poly1305(keyB.slice(32, 64), n2).decrypt(outer);
  const aesB = await crypto.subtle.importKey('raw', buf(keyB.slice(0, 32)), 'AES-GCM', false, ['decrypt']);
  const opened = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf(iv) }, aesB, buf(innerB)));
  const tOpen = ms(t);

  return {
    legs: [tRsa, tEcdh, tKem],
    hkdf: tHkdf,
    inner: tInner,
    outer: tOuter,
    open: tOpen,
    total: ms(start),
    innerHex: hex(inner),
    outerHex: hex(outer),
    bytes: { message: message.length, inner: inner.length, outer: outer.length },
    ok: hex(opened) === hex(message),
  };
}
