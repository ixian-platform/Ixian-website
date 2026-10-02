import { ml_kem1024 } from '@noble/post-quantum/ml-kem.js';
import { chacha20poly1305 } from '@noble/ciphers/chacha.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha3_512 as sha3 } from '@noble/hashes/sha3.js';
import { addressFromPublicKey, ixianPublicKey } from './ixianAddress';
import { sha3_512, base58Decode, hex } from './sha3';

/**
 * A timed, in-browser round trip between two endpoints using Ixian's primitives.
 * Same primitives, not a byte-compatible Ixian handshake; nothing leaves the browser.
 */

export type RoundTrip = {
  total: number;
  identity: { a: string; b: string; keygenA: number; keygenB: number };
  proof: { sign: number; verify: number; ok: boolean; sig: string };
  find: { hash: number; sector: string };
  talk: { ecdh: number; kem: number; rsa: number; hkdf: number; seal: number; open: number; ok: boolean; cipher: string };
  pay: { sign: number; verify: number; ok: boolean };
};

const enc = new TextEncoder();
const RSA: RsaHashedKeyGenParams = { name: 'RSASSA-PKCS1-v1_5', modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-512' };
const ms = (t0: number) => Math.round((performance.now() - t0) * 10) / 10;
const buf = (u: Uint8Array) => u as unknown as BufferSource;

function b64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function endpoint(extractable: boolean) {
  const t0 = performance.now();
  const keys = await crypto.subtle.generateKey(RSA, extractable, ['sign', 'verify']);
  const jwk = await crypto.subtle.exportKey('jwk', keys.publicKey);
  const address = await addressFromPublicKey(ixianPublicKey(b64url(jwk.n!), b64url(jwk.e!)));
  return { keys, jwk, address, ms: ms(t0) };
}

export async function runRoundTrip(): Promise<RoundTrip> {
  const start = performance.now();

  // 1 identity: both ends make their own keys; B's are extractable so the RSA leg of the exchange can reuse them
  const [A, B] = await Promise.all([endpoint(false), endpoint(true)]);

  // 2 proof: challenge, signature, check against B's key
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  let t = performance.now();
  const sig = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', B.keys.privateKey, buf(challenge)));
  const sign = ms(t);
  t = performance.now();
  const proofOk = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', B.keys.publicKey, buf(sig), buf(challenge));
  const verify = ms(t);

  // 3 find: B's sector from the hash of its address
  t = performance.now();
  const raw = base58Decode(B.address)!;
  const sector = sha3_512(raw.slice(0, raw.length - 3)).slice(0, 10);
  const hash = ms(t);

  // 4 talk: three key agreements, one derivation, two layers
  const P521 = { name: 'ECDH', namedCurve: 'P-521' } as const;
  t = performance.now();
  const [ea, eb] = await Promise.all([crypto.subtle.generateKey(P521, false, ['deriveBits']), crypto.subtle.generateKey(P521, false, ['deriveBits'])]);
  const ecdhA = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: eb.publicKey }, ea.privateKey, 528));
  const ecdhB = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: ea.publicKey }, eb.privateKey, 528));
  const ecdh = ms(t);

  t = performance.now();
  const kemKeys = ml_kem1024.keygen();
  const { cipherText: kemCt, sharedSecret: kemA } = ml_kem1024.encapsulate(kemKeys.publicKey);
  const kemB = ml_kem1024.decapsulate(kemCt, kemKeys.secretKey);
  const kem = ms(t);

  t = performance.now();
  const priv = await crypto.subtle.exportKey('jwk', B.keys.privateKey);
  const oaepAlg = { name: 'RSA-OAEP', hash: 'SHA-256' } as const;
  const oaepPub = await crypto.subtle.importKey('jwk', { ...B.jwk, alg: 'RSA-OAEP-256', key_ops: ['encrypt'] }, oaepAlg, false, ['encrypt']);
  const oaepPriv = await crypto.subtle.importKey('jwk', { ...priv, alg: 'RSA-OAEP-256', key_ops: ['decrypt'] }, oaepAlg, false, ['decrypt']);
  const rsaA = crypto.getRandomValues(new Uint8Array(32));
  const rsaCt = await crypto.subtle.encrypt(oaepAlg, oaepPub, buf(rsaA));
  const rsaB = new Uint8Array(await crypto.subtle.decrypt(oaepAlg, oaepPriv, rsaCt));
  const rsa = ms(t);

  const derive = (a: Uint8Array, b: Uint8Array, c: Uint8Array) => {
    const ikm = new Uint8Array(a.length + b.length + c.length);
    ikm.set(a);
    ikm.set(b, a.length);
    ikm.set(c, a.length + b.length);
    return hkdf(sha3, ikm, undefined, enc.encode('ixian.io round trip'), 64);
  };
  t = performance.now();
  const kA = derive(ecdhA, kemA, rsaA);
  const hk = ms(t);
  const kB = derive(ecdhB, kemB, rsaB);

  const message = enc.encode('Hello from A. Only B can read this.');
  const nonce = (n: number) => crypto.getRandomValues(new Uint8Array(n));
  t = performance.now();
  const aesKeyA = await crypto.subtle.importKey('raw', buf(kA.slice(0, 32)), 'AES-GCM', false, ['encrypt']);
  const iv = nonce(12);
  const inner = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: buf(iv) }, aesKeyA, buf(message)));
  const n2 = nonce(12);
  const outer = chacha20poly1305(kA.slice(32, 64), n2).encrypt(inner);
  const seal = ms(t);

  t = performance.now();
  const innerB = chacha20poly1305(kB.slice(32, 64), n2).decrypt(outer);
  const aesKeyB = await crypto.subtle.importKey('raw', buf(kB.slice(0, 32)), 'AES-GCM', false, ['decrypt']);
  const opened = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf(iv) }, aesKeyB, buf(innerB)));
  const open = ms(t);
  const talkOk = hex(opened) === hex(message);

  // 5 pay: a signed transaction to B's address
  const tx = enc.encode(JSON.stringify({ from: A.address, to: B.address, amount: '1', nonce: hex(nonce(8)) }));
  t = performance.now();
  const txSig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', A.keys.privateKey, buf(tx));
  const pSign = ms(t);
  t = performance.now();
  const payOk = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', A.keys.publicKey, txSig, buf(tx));
  const pVerify = ms(t);

  return {
    total: ms(start),
    identity: { a: A.address, b: B.address, keygenA: A.ms, keygenB: B.ms },
    proof: { sign, verify, ok: proofOk, sig: hex(sig.slice(0, 6)) },
    find: { hash, sector: hex(sector) },
    talk: { ecdh, kem, rsa, hkdf: hk, seal, open, ok: talkOk, cipher: hex(outer.slice(0, 8)) },
    pay: { sign: pSign, verify: pVerify, ok: payOk },
  };
}
