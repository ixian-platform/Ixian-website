'use client';

import { useRef, useState } from 'react';
import { createIdentity, signMessage, verifyMessage, type BrowserIdentity } from '@site/lib/ixianAddress';
import s from './Start.module.css';

/* Makes a real RSA-4096 identity with Web Crypto and derives the address as Ixian-Core does.
   Nothing is sent anywhere; the key is non-extractable and dies with the tab. */

type State =
  | { phase: 'idle' }
  | { phase: 'working' }
  | { phase: 'done'; id: BrowserIdentity; signed: boolean }
  | { phase: 'error'; message: string };

export default function TryAddress() {
  const [st, setSt] = useState<State>({ phase: 'idle' });
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  const run = async () => {
    if (st.phase === 'working') return;
    if (!globalThis.crypto?.subtle) {
      setSt({ phase: 'error', message: 'This browser has no Web Crypto here (it needs HTTPS).' });
      return;
    }
    setSt({ phase: 'working' });
    try {
      const id = await createIdentity();
      const message = `hello from ${id.address}`;
      const sig = await signMessage(id, message);
      const signed = await verifyMessage(id, message, sig);
      setSt({ phase: 'done', id, signed });
    } catch {
      setSt({ phase: 'error', message: 'Could not make a key pair in this browser. Try another one.' });
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: the address stays selectable */
    }
  };

  if (st.phase === 'done') {
    return (
      <div className={s.tryDone}>
        <button type="button" className={`${s.cmd} ${s.tryAddr}`} onClick={() => copy(st.id.address)} aria-label={`Copy your address ${st.id.address}`}>
          <code>{st.id.address}</code>
          <span className={s.copy} aria-live="polite">
            {copied ? 'Copied' : 'Copy'}
          </span>
        </button>
        <ul className={s.tryLog}>
          <li>RSA-4096 key pair made in this tab ({(st.id.ms / 1000).toFixed(1)} s)</li>
          <li>Address derived from the public key, checksum included</li>
          <li>{st.signed ? 'Signed a message and verified it with the key' : 'Signature check failed'}</li>
        </ul>
        <p className={s.tryNote}>
          The key never leaves this tab and is gone when you close it.{' '}
          <button type="button" className={s.tryAgain} onClick={run}>
            Make another
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      <button type="button" className={`${s.cmd} ${s.tryRun}`} onClick={run} disabled={st.phase === 'working'} aria-busy={st.phase === 'working'}>
        <code>{st.phase === 'working' ? 'Making an RSA-4096 key pair…' : 'Make my address'}</code>
        <span className={s.copy}>{st.phase === 'working' ? <i className={s.spin} aria-hidden /> : 'Run'}</span>
      </button>
      {st.phase === 'error' && <p className={s.tryNote}>{st.message}</p>}
    </>
  );
}
