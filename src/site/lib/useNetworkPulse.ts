'use client';

import { useEffect, useState } from 'react';
import { NODE_STATUS_URL } from '@site/content/metrics';

/**
 * Real network readings from nodeStatus.txt (CORS-enabled, refreshed by the
 * network about once per block). Nothing here is simulated: if the fetch fails,
 * `ok` stays false and the UI shows no live values.
 *   BH = block height · M = DLT nodes · R = S2 nodes
 */
export type Pulse = {
  ok: boolean;
  height: number | null;
  dlt: number | null;
  s2: number | null;
  /** ms timestamp of the last successful read */
  at: number | null;
  /** how many new blocks arrived since the page loaded */
  newBlocks: number;
};

const EMPTY: Pulse = { ok: false, height: null, dlt: null, s2: null, at: null, newBlocks: 0 };

/* one shared poller for every component on the page */
let state: Pulse = EMPTY;
let first: number | null = null;
let timer: number | null = null;
const subs = new Set<(p: Pulse) => void>();

async function read() {
  try {
    const r = await fetch(NODE_STATUS_URL, { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    const j = await r.json();
    const height = typeof j.BH === 'number' ? j.BH : null;
    if (first == null && height != null) first = height;
    state = {
      ok: height != null,
      height,
      dlt: typeof j.M === 'number' ? j.M : null,
      s2: typeof j.R === 'number' ? j.R : null,
      at: Date.now(),
      newBlocks: height != null && first != null ? height - first : 0,
    };
    subs.forEach((f) => f(state));
  } catch {
    /* keep the last good reading; never invent one */
  }
}

export function useNetworkPulse(intervalMs = 10_000): Pulse {
  // start empty on every render path so server and client markup match
  const [p, setP] = useState<Pulse>(EMPTY);
  useEffect(() => {
    subs.add(setP);
    if (state.ok) setP(state);
    if (timer == null) {
      read();
      timer = window.setInterval(() => {
        if (document.visibilityState === 'visible') read();
      }, intervalMs);
    } else setP(state);
    return () => {
      subs.delete(setP);
      if (subs.size === 0 && timer != null) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, [intervalMs]);
  return p;
}

/** Seconds since the last reading, ticking once a second. */
export function useAge(at: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return at == null ? null : Math.max(0, Math.round((now - at) / 1000));
}

export const fmt = (n: number | null) => (n == null ? '' : new Intl.NumberFormat('en').format(n));
