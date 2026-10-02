'use client';

import { useState } from 'react';
import { createIdentity, signMessage, verifyMessage } from '@site/lib/ixianAddress';
import { build, buildV2 as c } from '@site/content/platform';
import s from './Round4.module.css';

// Three stops: make a real address in this tab, then two copyable steps for your machine.

type Made = { phase: 'idle' } | { phase: 'working' } | { phase: 'error' } | { phase: 'done'; address: string; ms: number; ok: boolean };

function Copy({ lines }: { lines: string[] }) {
  const [done, setDone] = useState(false);
  const text = lines.filter((l) => !l.startsWith('#')).map((l) => l.replace(/^\$ /, '')).join('\n');
  return (
    <button
      type="button"
      className={s.copy}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(
          () => {
            setDone(true);
            window.setTimeout(() => setDone(false), 1600);
          },
          () => {}
        );
      }}
    >
      {done ? c.copied : c.copy}
    </button>
  );
}

function Code({ lines }: { lines: string[] }) {
  return (
    <pre className={s.code} tabIndex={0} aria-label="Code example">
      {lines.map((l) => (
        <code key={l} data-comment={l.trim().startsWith('#') || undefined}>
          {l.startsWith('$ ') ? (
            <>
              <i>$</i>
              {l.slice(1)}
            </>
          ) : (
            l
          )}
        </code>
      ))}
    </pre>
  );
}

export default function BuildPath() {
  const [st, setSt] = useState<Made>({ phase: 'idle' });
  const run = async () => {
    if (st.phase === 'working') return;
    if (!globalThis.crypto?.subtle) return setSt({ phase: 'error' });
    setSt({ phase: 'working' });
    try {
      const id = await createIdentity();
      const msg = `hello from ${id.address}`;
      const ok = await verifyMessage(id, msg, await signMessage(id, msg));
      setSt({ phase: 'done', address: id.address, ms: id.ms, ok });
    } catch {
      setSt({ phase: 'error' });
    }
  };
  const lit = st.phase === 'done' ? 1 : 0;
  const [here, runQ, send] = c.stops;
  const b = build.here;

  return (
    <div className={s.path} data-lit={lit}>
      <div className={s.pathLine} aria-hidden>
        <i />
      </div>
      <ol className={s.stops}>
        <li className={s.stop} data-on>
          <span className={s.stopNode} aria-hidden />
          <span className={s.stopWhere}>01 · {here.where}</span>
          <h3>{here.title}</h3>
          <p>{here.body}</p>
          <Code lines={b.code} />
          <div className={s.stopAct}>
            <button type="button" className={s.run} onClick={run} disabled={st.phase === 'working'}>
              <i aria-hidden />
              {st.phase === 'working' ? b.running : st.phase === 'done' ? b.again : b.run}
            </button>
            <span className={s.stopNote}>{st.phase === 'done' ? b.doneNote((st.ms / 1000).toFixed(1)) : st.phase === 'error' ? b.failed : b.idle}</span>
          </div>
          <dl className={s.resp} data-on={st.phase === 'done' || undefined} aria-live="polite">
            <div>
              <dt>{b.fields.address}</dt>
              <dd className={s.respAddr}>{st.phase === 'done' ? st.address : '–'}</dd>
            </div>
            <div>
              <dt>{b.fields.signed}</dt>
              <dd>{st.phase === 'done' ? (st.ok ? b.fields.yes : b.fields.no) : '–'}</dd>
            </div>
          </dl>
        </li>

        <li className={s.stop} data-on={lit > 0 || undefined}>
          <span className={s.stopNode} aria-hidden />
          <span className={s.stopWhere}>02 · {runQ.where}</span>
          <h3>{runQ.title}</h3>
          <p>{runQ.body}</p>
          <Code lines={runQ.code!} />
          <div className={s.stopAct}>
            <Copy lines={runQ.code!} />
          </div>
        </li>

        <li className={s.stop} data-on={lit > 0 || undefined}>
          <span className={s.stopNode} aria-hidden />
          <span className={s.stopWhere}>03 · {send.where}</span>
          <h3>{send.title}</h3>
          <p>{send.body}</p>
          <Code lines={build.machine.code} />
          <div className={s.stopAct}>
            <Copy lines={build.machine.code} />
            <a href={build.machine.source.href} target="_blank" rel="noreferrer" className={s.stopLink}>
              {build.machine.source.label} ↗
            </a>
          </div>
          <p className={s.stopNote}>{build.machine.note}</p>
        </li>
      </ol>
    </div>
  );
}
