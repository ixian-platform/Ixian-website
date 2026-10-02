'use client';

import { useMemo, useRef, useState } from 'react';
import { addressParts, typo } from '@site/lib/addressParts';
import { decompose as c } from '@site/content/platform';
import s from './Instruments.module.css';
import r4 from './Round4.module.css';

// Decoding is pure and synchronous, so the server renders the example decoded (the no-JS state).
// Invalid input is shown by form (struck bytes, dashed edge, cross), not by colour alone.

/** One spoke per byte, length set by its value; on a checksum mismatch the expected bytes show as ghosts. */
function Sigil({ v, pl, sum, expected, valid }: { v: string; pl: string; sum: string; expected: string; valid: boolean }) {
  const bytes = (h: string) => (h.match(/../g) ?? []).map((x) => parseInt(x, 16));
  const all = [...bytes(v).map((b) => ({ b, k: 'v' })), ...bytes(pl).map((b) => ({ b, k: 'p' })), ...bytes(sum).map((b) => ({ b, k: 'c' }))];
  const exp = bytes(expected);
  const n = all.length;
  const R0 = 46;
  const L = (b: number) => Math.round((8 + (b / 255) * 58) * 100) / 100;
  const deg = (i: number) => Math.round(((i / n) * 360) * 100) / 100;
  return (
    <svg viewBox="-120 -120 240 240" className={r4.sigil} data-valid={valid || undefined} aria-hidden>
      <circle r={R0 - 6} className={r4.sigilRing} />
      <circle r={R0 + 66} className={r4.sigilOuter} />
      {all.map((x, i) => (
        <g key={i} transform={`rotate(${deg(i)})`}>
          <rect x={-1.3} y={-(R0 + L(x.b))} width={2.6} height={L(x.b)} rx={1.3} className={r4.spoke} data-k={x.k} />
        </g>
      ))}
      {!valid &&
        exp.map((b, j) => (
          <g key={`e${j}`} transform={`rotate(${deg(n - 3 + j)})`}>
            <rect x={-1.3} y={-(R0 + L(b))} width={2.6} height={L(b)} rx={1.3} className={r4.ghostSpoke} />
          </g>
        ))}
      <rect x={-7} y={-7} width={14} height={14} className={r4.sigilKey} />
    </svg>
  );
}

const group = (h: string) => h.match(/.{1,2}/g)?.join(' ') ?? '';

export default function Decompose() {
  const [value, setValue] = useState(c.example.value);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const seed = useRef(0);
  const p = useMemo(() => addressParts(value), [value]);

  const generate = async () => {
    setBusy(true);
    try {
      const { createIdentity } = await import('@site/lib/ixianAddress');
      const id = await createIdentity();
      setValue(id.address);
      setNote(c.generate.note);
    } catch {
      setNote(c.generate.failed);
    } finally {
      setBusy(false);
    }
  };

  const error = !p.ok
    ? p.kind === 'empty'
      ? c.errors.empty
      : p.kind === 'char'
        ? c.errors.char(p.char)
        : p.kind === 'version'
          ? c.errors.version(p.version)
          : c.errors.length(p.version, p.want, p.got)
    : null;
  const state = !p.ok ? 'error' : p.valid ? 'valid' : 'invalid';

  return (
    <div className={s.dec} data-state={state}>
      <label className={s.fieldLabel} htmlFor="id-address">
        {c.label}
      </label>
      <input
        id="id-address"
        className={s.field}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setNote(null);
        }}
        placeholder={c.placeholder}
        spellCheck={false}
        autoComplete="off"
        aria-invalid={state !== 'valid' || undefined}
        aria-describedby="id-verdict"
      />
      <div className={s.chips}>
        <button type="button" onClick={() => { setValue(c.example.value); setNote(null); }} data-on={value === c.example.value || undefined}>
          {c.example.label}
        </button>
        <button type="button" onClick={generate} disabled={busy}>
          {busy ? c.generate.busy : c.generate.label}
        </button>
        <button type="button" onClick={() => { seed.current += 1; setValue((v) => typo(v, seed.current)); setNote(null); }} disabled={!p.ok}>
          {c.typo}
        </button>
      </div>

      {p.ok && (
        <figure className={r4.sigilFig}>
          <Sigil v={p.versionHex} pl={p.payloadHex} sum={p.checksumHex} expected={p.expectedHex} valid={p.valid} />
          <figcaption className={r4.shapeKey}>
            <span data-k="v">{c.parts.version} v{p.version}</span>
            <span data-k="p">
              {c.parts.payload} · {p.payloadHex.length / 2} bytes
            </span>
            <span data-k="c">{c.parts.checksum} · 3 bytes</span>
          </figcaption>
        </figure>
      )}
      {!p.ok && (
        <div className={s.bytesEmpty} aria-hidden>
          <span />
          <span />
          <span />
        </div>
      )}

      <div id="id-verdict" className={s.verdict} data-state={state} aria-live="polite">
        {p.ok ? (
          <>
            <p>
              {p.valid ? <b className={s.tick} aria-hidden /> : <b className={s.cross} aria-hidden />}
              <strong>{p.valid ? c.valid : c.invalid}</strong>
            </p>
            <span className={s.num} data-bad={!p.valid || undefined}>
              {p.valid ? group(p.checksumHex) : `${group(p.checksumHex)} ≠ ${group(p.expectedHex)}`}
            </span>
          </>
        ) : (
          <p>
            <b className={s.cross} aria-hidden />
            <strong>{error}</strong>
          </p>
        )}
      </div>
      <p className={s.caption}>{note ?? c.note}</p>
    </div>
  );
}
