/// <reference lib="webworker" />
import { runRoundTrip } from './roundTrip';

/* Runs the How it works round trip off the main thread, so RSA-4096 key
   generation (slow and variable, seconds on some phones) and the pure-JS
   ML-KEM never make the page stutter. Posts back the plain result. */
self.onmessage = async () => {
  try {
    self.postMessage({ ok: true, rt: await runRoundTrip() });
  } catch (e) {
    self.postMessage({ ok: false, error: String(e) });
  }
};
