import { fmt } from '@site/lib/useNetworkPulse';
import type { UseCase } from '@site/content/how';
import type { RoundTrip } from '@site/lib/roundTrip';

/* Only steps the browser actually ran carry a measured time; network steps are drawn, not run. */
export type Line = { text: string; mono?: string; ms?: number; real?: boolean };
/** browsers round timers to about 0.1 ms, so anything faster reads "<0.1 ms", never a misleading 0.0 */
export const fmtMs = (n: number) => (n < 0.1 ? '<0.1 ms' : n < 100 ? `${n.toFixed(1)} ms` : `${Math.round(n).toLocaleString('en-US')} ms`);
export const shortAddr = (a: string) => `${a.slice(0, 10)}…${a.slice(-8)}`;
export function stepLines(S: number, rt: RoundTrip | null, uc: UseCase, height: number | null): Line[] {
  const r = rt;
  if (S === 0)
    return [
      { text: 'A makes its own key pair, on the device', mono: 'RSA-4096', ms: r?.identity.keygenA, real: true },
      { text: 'Its address is derived from the public key', mono: r ? `v1 · SHA-512² · Base58 → ${shortAddr(r.identity.a)}` : 'v1 · SHA-512² · Base58', real: true },
      { text: 'The S2 network picks them up. No sign-up, no registry' },
    ];
  if (S === 1)
    return [
      { text: 'A sends B a random challenge', mono: '32 random bytes', real: true },
      { text: 'B signs it with the key behind its address', mono: r ? `RSA-4096 · PKCS#1 v1.5 · SHA-512 · ${r.proof.sig}…` : 'RSA-4096 · PKCS#1 v1.5 · SHA-512', ms: r?.proof.sign, real: true },
      { text: r && !r.proof.ok ? 'A checks the signature: invalid' : 'A checks the signature against B’s key: valid', ms: r?.proof.verify, real: true },
      { text: 'B can check A the same way' },
    ];
  if (S === 2)
    return [
      { text: 'A hashes B’s address to find its sector', mono: r ? `SHA3-512 → sector ${r.find.sector}` : 'SHA3-512 → sector', ms: r?.find.hash, real: true },
      { text: 'The relays for that sector return B’s signed presence', mono: 'valid for 300 s' },
      { text: 'A reaches B by its address. No IP, no DNS' },
    ];
  if (S === 3)
    return [
      { text: 'A and B agree keys with a hybrid exchange', mono: 'ECDH P-521 + ML-KEM-1024 + RSA-4096', ms: r ? r.talk.ecdh + r.talk.kem + r.talk.rsa : undefined, real: true },
      { text: 'Two session keys from all three secrets', mono: 'HKDF-SHA3-512', ms: r?.talk.hkdf, real: true },
      { text: 'The message is sealed in two independent layers', mono: 'AES-256-GCM inside ChaCha20-Poly1305', ms: r?.talk.seal, real: true },
      { text: 'They connect directly; a relay steps in only behind a firewall, and sees ciphertext', mono: r ? r.talk.cipher.replace(/(.{4})(?=.)/g, '$1·') : undefined },
      { text: r && !r.talk.ok ? 'B could not open it' : 'B opens both layers. Only the two ends hold the keys', ms: r?.talk.open, real: true },
    ];
  return [
    { text: `A signs a transaction: ${uc.amount} to B’s address`, mono: 'RSA-4096 · SHA-512', ms: r?.pay.sign, real: true },
    { text: 'The relay passes it to the Ixian DLT' },
    { text: height != null ? `It settles in the next block, #${fmt(height + 1)}` : 'It settles in the next block', mono: 'about 30 s per block' },
    { text: `B checks the signature and receives ${uc.amount}`, ms: r?.pay.verify, real: true },
  ];
}

