'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@site/lib/motion';

const GLYPHS = '0123456789abcdefABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Text that resolves from random glyphs into its final value when `active`
 * turns true. Used for addresses, ciphertext → plaintext, etc.
 */
export default function Scramble({
  text,
  active = true,
  duration = 900,
  className,
  idle,
}: {
  text: string;
  active?: boolean;
  duration?: number;
  className?: string;
  /** What to show before activation (defaults to scrambled noise) */
  idle?: string;
}) {
  const [out, setOut] = useState(idle ?? text);
  const raf = useRef(0);

  useEffect(() => {
    if (!active) {
      setOut(idle ?? noise(text));
      return;
    }
    if (prefersReducedMotion()) {
      setOut(text);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(p * text.length);
      let s = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        s += i < reveal || ch === ' ' || ch === '·' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [active, text, duration, idle]);

  return (
    <span className={className}>
      <span className="ix-sr">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

function noise(t: string) {
  let s = '';
  for (let i = 0; i < t.length; i++) s += t[i] === ' ' ? ' ' : GLYPHS[(i * 7 + 3) % GLYPHS.length];
  return s;
}
