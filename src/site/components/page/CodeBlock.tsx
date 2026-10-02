'use client';

import { useEffect, useRef, useState } from 'react';
import s from './code.module.css';

/** Code or command block with Copy; a leading "$ " prompt is shown dimmed and never copied. */
export default function CodeBlock({
  lines,
  file,
  lang,
  source,
  compact,
}: {
  lines: string[];
  file?: string;
  lang?: string;
  source?: { label: string; href: string };
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const plain = lines.map((l) => l.replace(/^\$ /, '')).join('\n');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: the code stays selectable */
    }
  };
  return (
    <figure className={s.block} data-compact={compact || undefined}>
      <figcaption className={s.head}>
        <span className={s.file}>{file ?? 'Terminal'}</span>
        {lang && <span className={s.lang}>{lang}</span>}
        <button type="button" className={s.copy} onClick={copy} aria-label={`Copy ${file ?? 'command'}`}>
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </figcaption>
      <pre className={s.pre} tabIndex={0} aria-label={`${lang ?? 'Shell'} example`}>
        <code>
          {lines.map((line, i) => (
            <Line key={i} text={line} />
          ))}
        </code>
      </pre>
      {source && (
        <p className={s.source}>
          Reference:{' '}
          <a href={source.href} target="_blank" rel="noreferrer">
            {source.label}
          </a>
        </p>
      )}
    </figure>
  );
}

const STRING = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
function Line({ text }: { text: string }) {
  const t = text.trimStart();
  if (t.startsWith('#') || t.startsWith('//')) {
    return (
      <span className={s.line}>
        <span className={s.cm}>{text}</span>
        {'\n'}
      </span>
    );
  }
  const prompt = text.startsWith('$ ');
  const body = prompt ? text.slice(2) : text;
  const parts = body.split(STRING);
  return (
    <span className={s.line}>
      {prompt && (
        <span className={s.prompt} aria-hidden>
          ${' '}
        </span>
      )}
      {parts.map((p, i) => (i % 2 ? <span key={i} className={s.str}>{p}</span> : p))}
      {'\n'}
    </span>
  );
}
