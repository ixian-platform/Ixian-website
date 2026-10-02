'use client';

import { useEffect, useState } from 'react';

/* Consent covers external content only (no cookies, no analytics). It expires after
   twelve months; bump VERSION when a category is added so everyone is asked again. */

export const CONSENT_KEY = 'ix-consent';
const VERSION = 1;
const MAX_AGE = 365 * 24 * 3600 * 1000;

export type Consent = { v: number; at: number; external: boolean };

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.v !== VERSION || Date.now() - c.at > MAX_AGE) return null;
    return c;
  } catch {
    return null;
  }
}

export function writeConsent(patch: Partial<Pick<Consent, 'external'>>) {
  const prev = readConsent();
  const next: Consent = { v: VERSION, at: Date.now(), external: patch.external ?? prev?.external ?? false };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(next));
  } catch {
    /* storage blocked: the choice holds for this page view */
  }
  window.dispatchEvent(new CustomEvent('ix-consent', { detail: next }));
  return next;
}

export const openPrivacySettings = () => window.dispatchEvent(new Event('ix-privacy-open'));

/** the current choice; null until read (and while no choice has been made) */
export function useConsent() {
  const [c, setC] = useState<Consent | null>(null);
  useEffect(() => {
    setC(readConsent());
    const on = (e: Event) => setC((e as CustomEvent<Consent>).detail);
    window.addEventListener('ix-consent', on);
    return () => window.removeEventListener('ix-consent', on);
  }, []);
  return c;
}
