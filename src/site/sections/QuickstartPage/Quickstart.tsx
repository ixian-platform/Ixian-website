'use client';

import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Icon from '@site/components/Icon';
import {
  hero,
  setup,
  steps,
  live,
  next,
  happened,
  trouble,
  help,
  leave,
  media,
  doneLine,
  type Cmd,
  type OS,
  type Out,
} from '@site/content/quickstart';
import QsVisual from './QsVisual';
import QsSpixi from './QsSpixi';
import s from './Quickstart.module.css';

/* The address and API key are kept in localStorage so a reload doesn't break commands
   already run. Nothing is sent anywhere. */

type Ctx = { os: OS; address: string; key: string; quixi: string };
const Fill = createContext<Ctx>({
  os: 'unix',
  address: '',
  key: '',
  quixi: '',
});

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const newKey = () => {
  const b = new Uint8Array(20);
  crypto.getRandomValues(b);
  return Array.from(b, (n) => B58[n % 58]).join('');
};
/** a base58 address, with the optional `_` suffix Spixi and `mywallet` show */
const looksLikeAddress = (a: string) => /^[1-9A-HJ-NP-Za-km-z]{40,80}(_[1-9A-HJ-NP-Za-km-z]{1,40})?$/.test(a);
const store = {
  get(k: string) {
    try {
      return window.localStorage.getItem(`ix-qs-${k}`);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      window.localStorage.setItem(`ix-qs-${k}`, v);
    } catch {
      /* private mode: the values live for this visit only */
    }
  },
};

/** split a line into text and placeholders, filled where we can */
function tokens(line: string, c: Ctx) {
  const parts = line.split(/(YOUR_ADDRESS|YOUR_API_KEY)/);
  return parts.map((p) => {
    if (p === 'YOUR_ADDRESS')
      return { t: c.address || p, ph: true, filled: !!c.address };
    if (p === 'YOUR_API_KEY')
      return { t: c.key || p, ph: true, filled: !!c.key };
    return { t: p, ph: false, filled: false };
  });
}
const linesFor = (cmd: Cmd, os: OS) =>
  Array.isArray(cmd.lines) ? cmd.lines : cmd.lines[os];

function Snip({
  cmd,
  out,
  confirm,
}: {
  cmd: Cmd;
  out?: Out;
  confirm?: ReactNode;
}) {
  const c = useContext(Fill);
  const lines = linesFor(cmd, c.os);
  const shell = !cmd.file;
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const plain = lines
    .map((l) => l.replace(/^[$>] /, ''))
    .map((l) =>
      tokens(l, c)
        .map((x) => x.t)
        .join('')
    )
    .join('\n');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: the text stays selectable */
    }
  };
  return (
    <figure className={s.snip}>
      <figcaption className={s.snipHead}>
        <span className={s.file}>
          {cmd.file ?? (c.os === 'windows' ? 'PowerShell' : 'Terminal')}
        </span>
        {cmd.lang && <span className={s.lang}>{cmd.lang}</span>}
        <button
          type="button"
          className={s.copy}
          data-done={copied || undefined}
          onClick={copy}
          aria-label={`Copy ${cmd.file ?? 'the command'}`}
        >
          <Icon name={copied ? 'check' : 'copy'} size={13} />
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </figcaption>
      <pre className={s.pre} tabIndex={0}>
        <code>
          {lines.map((l, i) => {
            const prompt = shell && /^[$>] /.test(l) ? l.slice(0, 1) : null;
            const body = prompt ? l.slice(2) : l;
            const comment = body.trimStart().startsWith('#');
            return (
              <span
                key={i}
                className={s.line}
                data-comment={comment || undefined}
              >
                {prompt && (
                  <span className={s.prompt} aria-hidden>
                    {prompt}{' '}
                  </span>
                )}
                {tokens(body, c).map((x, j) =>
                  x.ph ? (
                    <mark
                      key={j}
                      className={s.ph}
                      data-filled={x.filled || undefined}
                    >
                      {x.t}
                    </mark>
                  ) : (
                    <span key={j}>{x.t}</span>
                  )
                )}
                {'\n'}
              </span>
            );
          })}
        </code>
      </pre>
      {out && (
        <div className={s.out}>
          <p className={s.outHead}>
            <span>You should see</span>
            {out.note && <span className={s.outNote}>{out.note}</span>}
          </p>
          <pre className={s.pre} data-out tabIndex={0}>
            <code>
              {out.lines.map((l, i) => {
                const text = tokens(l, c)
                  .map((x) => x.t)
                  .join('');
                const cut = text.search(/\s\/\/\s/); // a note, not a URL
                return (
                  <span key={i} className={s.line}>
                    {cut < 0 ? text : text.slice(0, cut)}
                    {cut >= 0 && (
                      <span className={s.note}>{text.slice(cut)}</span>
                    )}
                    {'\n'}
                  </span>
                );
              })}
            </code>
          </pre>
          {confirm}
        </div>
      )}
    </figure>
  );
}

function Media({
  slot,
  mode,
  label,
}: {
  slot: keyof typeof media;
  mode: 'send' | 'pair' | 'phone';
  label: string;
}) {
  const m = media[slot];
  if (m) {
    return m.video ? (
      <video
        className={s.media}
        src={m.src}
        aria-label={m.alt}
        muted
        playsInline
        autoPlay
        loop
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={s.media} src={m.src} alt={m.alt} />
    );
  }
  return <QsVisual mode={mode} label={label} />;
}

/** first four and last four characters of the address itself, without the `_` suffix */
const short = (a: string) => {
  const base = a.split('_')[0];
  return base.length > 12 ? `${base.slice(0, 4)}…${base.slice(-4)}` : base;
};

/** A step's visual confirmation: a screenshot from `media[slot]` if present, else the drawn phone. */
function Shot({
  slot,
  mode,
  label,
}: {
  slot: 'pair' | 'arrive';
  mode: 'phone' | 'phonePair';
  label: string;
}) {
  const c = useContext(Fill);
  const m = media[slot];
  const from = c.quixi ? short(c.quixi) : '';
  return (
    <div className={s.shot}>
      <div className={s.shotFrame}>
        {m ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={s.shotImg} src={m.src} alt={m.alt} />
        ) : (
          <div className={s.spixiFit}>
            <QsSpixi
              mode={mode === 'phonePair' ? 'request' : 'arrive'}
              label={label}
              from={from || undefined}
            />
          </div>
        )}
      </div>
      <p className={s.shotNote}>
        <b className={s.mono}>{from || '4hLm…c7Rq'}</b>
        {from
          ? ' is your QuIXI node, from step 2.'
          : ' stands for your QuIXI node. Paste its address in the bar above to see yours.'}
      </p>
    </div>
  );
}

function Anchor({ id, children }: { id: string; children: ReactNode }) {
  return (
    <a className={s.anchor} href={`#${id}`} aria-label="Link to this step">
      {children}
    </a>
  );
}

export default function Quickstart() {
  const [os, setOs] = useState<OS>('unix');
  const [address, setAddress] = useState('');
  const [draft, setDraft] = useState('');
  const [key, setKey] = useState('');
  const [quixi, setQuixi] = useState('');
  const [qDraft, setQDraft] = useState('');
  useEffect(() => {
    const o = store.get('os');
    if (o === 'unix' || o === 'windows') setOs(o);
    else if (/Windows/i.test(navigator.userAgent)) setOs('windows');
    const a = store.get('address') ?? '';
    setDraft(a);
    if (looksLikeAddress(a)) setAddress(a);
    const q = store.get('quixi') ?? '';
    setQDraft(q);
    if (looksLikeAddress(q)) setQuixi(q);
    let k = store.get('key');
    if (!k) {
      k = newKey();
      store.set('key', k);
    }
    setKey(k);
  }, []);
  const pickOs = (o: OS) => {
    setOs(o);
    store.set('os', o);
  };
  const onAddress = (v: string) => {
    const a = v.trim();
    setDraft(a);
    store.set('address', a);
    setAddress(looksLikeAddress(a) ? a : '');
  };
  const onQuixi = (v: string) => {
    const a = v.trim();
    setQDraft(a);
    store.set('quixi', a);
    setQuixi(looksLikeAddress(a) ? a : '');
  };
  const renew = () => {
    const k = newKey();
    store.set('key', k);
    setKey(k);
  };
  const bad = draft.length > 0 && !address;
  const qBad = qDraft.length > 0 && !quixi;

  return (
    <Fill.Provider value={{ os, address, key, quixi }}>
      <header id="top" className={s.hero}>
        <div className={s.wrap}>
          <div className={s.heroGrid}>
            <div className={s.heroCopy}>
              <p className={s.eyebrow}>
                <span>{hero.eyebrow}</span>
                <span className={s.time}>{hero.total}</span>
              </p>
              <h1 className={s.h1}>
                <span>{hero.title[0]}</span> <span>{hero.title[1]}</span>
              </h1>
              <p className={s.outcome}>{hero.outcome}</p>
              <ul className={s.needs} aria-label="You need">
                {hero.needs.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <p className={s.network}>
                <i aria-hidden />
                {hero.network}{' '}
                <a href={hero.spixi.href} target="_blank" rel="noreferrer">
                  {hero.spixi.label}
                  <Icon name="external" size={12} />
                </a>
              </p>
            </div>
            <div className={s.heroVisual}>
              {media.capture ? (
                <Media
                  slot="capture"
                  mode="send"
                  label="Your computer sends a message to your phone; it arrives and is read."
                />
              ) : (
                <QsVisual
                  mode="send"
                  label="Your computer sends a message to your phone; it arrives and is read."
                  backdrop
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* setup */}
      <div className={s.setupShell}>
        <div className={s.wrap}>
          <div className={s.setup} role="group" aria-label="Your setup">
            <div
              className={s.osSwitch}
              role="radiogroup"
              aria-label="Your computer"
            >
              {setup.os.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={os === o.id}
                  className={s.osItem}
                  onClick={() => pickOs(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <label
              className={s.field}
              data-bad={bad || undefined}
              data-ok={!!address || undefined}
            >
              <span className={s.fieldLabel}>
                {setup.address.label}
                <a href={setup.address.what.href}>{setup.address.what.label}</a>
              </span>
              <input
                value={draft}
                onChange={(e) => onAddress(e.target.value)}
                placeholder={setup.address.placeholder}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-describedby="qs-address-help"
              />
              <span id="qs-address-help" className={s.fieldHelp}>
                {bad ? setup.address.invalid : setup.address.help}
              </span>
            </label>
            {/* the node's address, shown in the screenshots so the reader can match it */}
            <label
              className={s.field}
              data-bad={qBad || undefined}
              data-ok={!!quixi || undefined}
            >
              <span className={s.fieldLabel}>{setup.quixi.label}</span>
              <input
                value={qDraft}
                onChange={(e) => onQuixi(e.target.value)}
                placeholder={setup.quixi.placeholder}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-describedby="qs-quixi-help"
              />
              <span id="qs-quixi-help" className={s.fieldHelp}>
                {qBad ? setup.address.invalid : setup.quixi.help}
              </span>
            </label>
            <div className={s.keyBox}>
              <span className={s.fieldLabel}>
                {setup.key.label}
                <button type="button" onClick={renew}>
                  {setup.key.renew}
                </button>
              </span>
              <code className={s.keyVal}>{key || '…'}</code>
              <span className={s.fieldHelp}>{setup.key.help}</span>
            </div>
          </div>
        </div>
      </div>

      {/* steps */}
      <div className={s.wrap}>
        <ol className={s.steps}>
          {steps.map((st, i) => (
            <li
              key={st.id}
              id={st.id}
              className={s.step}
              data-visual={st.visual}
            >
              <div className={s.rail}>
                <Anchor id={st.id}>
                  <span className={s.num}>{i + 1}</span>
                </Anchor>
              </div>
              <div className={s.stepHead}>
                <p className={s.time}>{st.time}</p>
                <h2 className={s.stepTitle}>{st.title}</h2>
                <p className={s.stepLead}>{st.lead}</p>
              </div>
              <div className={s.stepBody}>
                {st.cmds.map((c, j) => (
                  <Fragment key={j}>
                    {c.lead && <p className={s.cmdLead}>{c.lead}</p>}
                    <Snip
                      cmd={c}
                      out={
                        c.out ?? (j === st.cmds.length - 1 ? st.out : undefined)
                      }
                      confirm={
                        j === st.cmds.length - 1 && st.visual === 'pair' ? (
                          <Shot
                            slot="pair"
                            mode="phonePair"
                            label="QuIXI's contact request in Spixi, accepted"
                          />
                        ) : j === st.cmds.length - 1 &&
                          st.visual === 'arrive' ? (
                          <Shot
                            slot="arrive"
                            mode="phone"
                            label="Hello from my computer, arrived in Spixi"
                          />
                        ) : undefined
                      }
                    />
                  </Fragment>
                ))}
                {st.gate && (
                  <div className={s.gate} role="note">
                    <p className={s.gateTitle}>{st.gate.title}</p>
                    <p>{st.gate.body}</p>
                  </div>
                )}
                {st.after && (
                  <p className={s.after}>
                    <Icon name="arrow" size={14} />
                    {st.after}
                  </p>
                )}
                {st.fail && <p className={s.fail}>{st.fail}</p>}
                {st.id === 'receive' && (
                  <div className={s.subBlock}>
                    <h3>{live.title}</h3>
                    <p>{live.lead}</p>
                    <Snip cmd={live.cmd} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className={s.done}>
          <span className={s.doneMark} aria-hidden>
            <Icon name="check" size={14} />
          </span>
          <p>{doneLine}</p>
        </div>

        <section className={s.band} aria-labelledby="qs-happened">
          <h2 id="qs-happened" className={s.bandTitle}>
            {happened.title}
          </h2>
          <div>
            <ol className={s.happened}>
              {happened.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ol>
            <a className={s.textLink} href={happened.link.href}>
              {happened.link.label}
              <Icon name="arrow" size={14} />
            </a>
          </div>
        </section>

        <section className={s.band} aria-labelledby="qs-next">
          <h2 id="qs-next" className={s.bandTitle}>
            {next.title}
          </h2>
          <ul className={s.forks}>
            {next.items.map((n) => (
              <li key={n.title}>
                <a href={n.href} target="_blank" rel="noreferrer">
                  <b>{n.title}</b>
                  <span>{n.body}</span>
                  <em>
                    {n.label}
                    <Icon name="external" size={12} />
                  </em>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="troubleshooting"
          className={s.band}
          aria-labelledby="qs-trouble"
        >
          <h2 id="qs-trouble" className={s.bandTitle}>
            Troubleshooting
          </h2>
          <div>
            <dl className={s.trouble}>
              {trouble.map((t) => (
                <div key={t.error} className={s.issue}>
                  <dt>
                    <span className={s.when}>{t.when}</span>
                    <code tabIndex={0}>{t.error}</code>
                  </dt>
                  <dd>
                    {t.fix
                      .split('`')
                      .map((x, i) => (i % 2 ? <code key={i}>{x}</code> : x))}
                  </dd>
                </div>
              ))}
            </dl>
            <p className={s.help}>
              {help.title}
              {help.items.map((h) => (
                <a key={h.label} href={h.href} target="_blank" rel="noreferrer">
                  {h.label}
                  <Icon name="external" size={12} />
                </a>
              ))}
            </p>
          </div>
        </section>

        <section id="remove" className={s.band} aria-labelledby="qs-leave">
          <h2 id="qs-leave" className={s.bandTitle}>
            {leave.title}
          </h2>
          <div className={s.leave}>
            <p>{leave.stop}</p>
            <Snip cmd={leave.stopCmd} />
            <p>{leave.remove}</p>
            <Snip cmd={leave.removeCmd} />
            <p className={s.quiet}>{leave.spixi}</p>
          </div>
        </section>
      </div>
    </Fill.Provider>
  );
}
