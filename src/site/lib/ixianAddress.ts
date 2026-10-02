import { base58Encode, hex } from './sha3';

/**
 * A real Ixian identity, made in the browser with Web Crypto: an RSA-4096
 * key pair and the address the network derives from it. Follows Ixian-Core
 * exactly (Crypto/CryptoLibs/BouncyCastle.cs rsaKeyToBytes, Address/Address.cs):
 *
 *   publicKey = [keyVersion 1] [int32 LE 0] [int32 LE |n|] [n, big-endian] [int32 LE |e|] [e]
 *   address   = 0x01 + trunc44( SHA-512(SHA-512( publicKey without its first byte )) )
 *   checksum  = trunc3( SHA-512(SHA-512( address )) )
 *   text      = Base58( address + checksum )
 *
 * Version 1 is what Ixian wallets create today (WalletStorage generates keys
 * with version 1). Signatures are RSA PKCS#1 v1.5 with SHA-512, as Ixian
 * signs. The private key is not extractable and lives only in this tab.
 */

export interface BrowserIdentity {
  address: string;
  publicKeyBytes: Uint8Array;
  keys: CryptoKeyPair;
  ms: number;
}

const ALG: RsaHashedKeyGenParams = {
  name: 'RSASSA-PKCS1-v1_5',
  modulusLength: 4096,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: 'SHA-512',
};

export async function createIdentity(): Promise<BrowserIdentity> {
  const t0 = performance.now();
  const keys = await crypto.subtle.generateKey(ALG, false, ['sign', 'verify']);
  const jwk = await crypto.subtle.exportKey('jwk', keys.publicKey);
  const publicKeyBytes = ixianPublicKey(b64url(jwk.n!), b64url(jwk.e!));
  const address = await addressFromPublicKey(publicKeyBytes);
  return { address, publicKeyBytes, keys, ms: Math.round(performance.now() - t0) };
}

/** Ixian's serialisation of an RSA public key (key version 1). */
export function ixianPublicKey(modulus: Uint8Array, exponent: Uint8Array): Uint8Array {
  const out = new Uint8Array(1 + 4 + 4 + modulus.length + 4 + exponent.length);
  const view = new DataView(out.buffer);
  let o = 0;
  out[o++] = 1; // key / address version
  view.setInt32(o, 0, true); // public key format version
  o += 4;
  view.setInt32(o, modulus.length, true);
  o += 4;
  out.set(modulus, o);
  o += modulus.length;
  view.setInt32(o, exponent.length, true);
  o += 4;
  out.set(exponent, o);
  return out;
}

/** Version 1 address, with checksum, in Base58. */
export async function addressFromPublicKey(publicKey: Uint8Array): Promise<string> {
  const raw = new Uint8Array(45);
  raw[0] = 1;
  raw.set((await sha512sq(publicKey.subarray(1))).subarray(0, 44), 1);
  const withChecksum = new Uint8Array(48);
  withChecksum.set(raw);
  withChecksum.set((await sha512sq(raw)).subarray(0, 3), 45);
  return base58Encode(withChecksum);
}

/** Sign a UTF-8 message the way Ixian does (RSA PKCS#1 v1.5, SHA-512); returns hex. */
export async function signMessage(id: BrowserIdentity, message: string): Promise<string> {
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', id.keys.privateKey, new TextEncoder().encode(message));
  return hex(new Uint8Array(sig));
}

export async function verifyMessage(id: BrowserIdentity, message: string, signatureHex: string): Promise<boolean> {
  const bytes = new Uint8Array(signatureHex.match(/../g)!.map((h) => parseInt(h, 16)));
  return crypto.subtle.verify('RSASSA-PKCS1-v1_5', id.keys.publicKey, bytes, new TextEncoder().encode(message));
}

async function sha512sq(data: Uint8Array): Promise<Uint8Array> {
  const once = await crypto.subtle.digest('SHA-512', data as BufferSource);
  return new Uint8Array(await crypto.subtle.digest('SHA-512', once));
}

function b64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
