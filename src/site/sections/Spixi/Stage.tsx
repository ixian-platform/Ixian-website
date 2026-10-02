'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { TB } from '@site/components/tabler';
import { stage as defaultStage } from '@site/content/spixiStage';

/* the homepage's stories by default; other pages pass their own (same shape) */
export type StageContent = typeof defaultStage;
const Content = createContext<StageContent>(defaultStage);
import s from './stage.module.css';

/* Spixi stage: one conversation panel with callouts on hairline leaders. Scenes: Chat, Agents,
   Mini Apps. Each scene plays once, holds, then calls onDone; reduced motion shows the finished
   scene. All content is example content. */

type Props = {
  active: number;
  reduced: boolean;
  playing: boolean;
  onDone: () => void;
  skin?: 'panel' | 'spixi';
  idPrefix?: string;
  content?: StageContent;
};

/* 'spixi' skin: the same scenes, timing and callouts, with the panel drawn as the Spixi app itself */
const Skin = createContext<'panel' | 'spixi'>('panel');

/** reveal steps one by one: returns how many have happened */
function useSteps(
  times: number[],
  run: boolean,
  reduced: boolean,
  onEnd?: () => void,
  hold = 3400
) {
  const [k, setK] = useState(reduced ? times.length : 0);
  const end = useRef(onEnd);
  end.current = onEnd;
  useEffect(() => {
    if (reduced) {
      setK(times.length);
      return;
    }
    setK(0);
    if (!run) return;
    const ids = times.map((t, i) => window.setTimeout(() => setK(i + 1), t));
    ids.push(
      window.setTimeout(() => end.current?.(), times[times.length - 1] + hold)
    );
    return () => ids.forEach(window.clearTimeout);
    // times is a module constant per scene
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, reduced]);
  return k;
}

/** text that streams in, word by word */
function useStream(text: string, on: boolean, reduced: boolean, ms = 50) {
  const words = text.split(' ');
  const [n, setN] = useState(reduced ? words.length : 0);
  useEffect(() => {
    if (reduced) return setN(words.length);
    if (!on) return setN(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= words.length) window.clearInterval(id);
    }, ms);
    return () => window.clearInterval(id);
  }, [on, reduced, words.length, ms]);
  return { text: words.slice(0, n).join(' '), done: n >= words.length };
}

/* ------------------------------------------------------------------ icons
   Tabler outline (the set Spixi uses) at stroke 1.5. */
const I = ({
  d,
  size = 14,
  w = 1.5,
}: {
  d: string;
  size?: number;
  w?: number;
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d={d} />
  </svg>
);
const CHECK = TB.check;
const SEND = TB.arrowRight;
const AGENT = TB.robot;
const BOLT = TB.bolt;
const BACK = TB.arrowLeft;
const CALL = TB.phone;
const INFO = TB.infoCircle;
const PLUS = TB.circlePlus;
const PLANE = TB.send;
const CALL_MISSED = TB.phoneX;
const CALL_IN = TB.phoneIncoming;
const CHEV = TB.chevronRight;
const DOC = TB.fileText;





/* ------------------------------------------------------------ building blocks */






/** time and read ticks inside an outgoing Spixi bubble */
export function Meta({
  time = '12:58',
  read = true,
}: {
  time?: string;
  read?: boolean;
}) {
  const skin = useContext(Skin);
  if (skin !== 'spixi') return null;
  return (
    <span className={s.meta} aria-hidden>
      {time}
      {read && (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={TB.checks} />
        </svg>
      )}
    </span>
  );
}

function Panel({
  avatar,
  name,
  addr,
  status,
  extra,
  children,
  wide,
  history,
  overlay,
}: {
  avatar: ReactNode;
  name: string;
  addr: string;
  status?: ReactNode;
  /** a control in the header (the agent mode switch) */
  extra?: ReactNode;
  /** the thread already has history above today (Chat) */
  history?: boolean;
  /** a screen laid over the chat (the Apps screen the Mini App is launched from) */
  overlay?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  const skin = useContext(Skin);
  if (skin === 'spixi') {
    return (
      <div className={`${s.panel} ${s.phone}`} data-wide={wide || undefined}>
        <div className={s.head}>
          <span className={s.back}>
            <I d={BACK} size={18} />
          </span>
          <span className={s.avatar}>{avatar}</span>
          <span className={s.who}>
            <b>{name}</b>
            <small>Online</small>
          </span>
          <span className={s.headIcons}>
            <I d={CALL} size={17} />
            <I d={INFO} size={17} />
          </span>
        </div>
        {extra && <div className={s.subRow}>{extra}</div>}
        <div className={s.thread}>
          {!history && <p className={s.day}>Today</p>}
          {children}
        </div>
        <div className={s.composer} aria-hidden>
          <span className={s.field}>
            <I d={PLUS} size={17} />
            Message
          </span>
          <i>
            <I d={PLANE} size={15} />
          </i>
        </div>
        {overlay}
      </div>
    );
  }
  return (
    <div className={s.panel} data-wide={wide || undefined}>
      <div className={s.head}>
        <span className={s.avatar}>{avatar}</span>
        <span className={s.who}>
          <b>{name}</b>
          <small className={s.mono}>{addr}</small>
        </span>
        {status}
        {extra}
      </div>
      <div className={s.thread}>
        <p className={s.day}>Today</p>
        {children}
      </div>
      <div className={s.composer} aria-hidden>
        <span>Message</span>
        <i>
          <I d={SEND} size={14} />
        </i>
      </div>
    </div>
  );
}

/** the agent thinking: three dots on the page, no bubble */
const Thinking = () => (
  <div className={s.thinking} aria-hidden>
    <i />
    <i />
    <i />
  </div>
);

const Typing = () => (
  <div className={`${s.bubble} ${s.in} ${s.typing}`} aria-hidden>
    <i />
    <i />
    <i />
  </div>
);

/** a short note beside the panel, on a hairline leader */
function Callout({
  show,
  side,
  top,
  title,
  detail,
}: {
  show: boolean;
  side: 'l' | 'r';
  top: string;
  title: string;
  detail: string;
}) {
  return (
    <div
      className={s.callout}
      data-side={side}
      data-show={show || undefined}
      style={{ top }}
    >
      <b>{title}</b>
      <span>{detail}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ chat */
const CHAT_T = [300, 1200, 2100, 2800, 4000, 5000, 6200];
function Chat({
  run,
  reduced,
  onDone,
}: {
  run: boolean;
  reduced: boolean;
  onDone: () => void;
}) {
  const c = useContext(Content).chat;
  const k = useSteps(CHAT_T, run, reduced, onDone);
  const [l0, l1, l2, l3] = c.lines;
  return (
    <div className={s.scene}>
      <Panel
        avatar={c.name.slice(0, 1).toUpperCase()}
        name={c.name}
        addr={c.addr}
        status={<em className={s.status}>{c.status}</em>}
        history
      >
        {/* yesterday, already there: a message and two calls */}
        {c.history.map((h, i) =>
          'day' in h ? (
            <p key={i} className={s.day}>
              {h.day}
            </p>
          ) : 'out' in h ? (
            <div key={i} className={`${s.bubble} ${s.out} ${s.old}`}>
              {h.out}
              <Meta time={h.time} />
            </div>
          ) : (
            <CallCard key={i} {...h} />
          )
        )}
        {k >= 1 && (
          <div className={`${s.bubble} ${s.in}`}>
            {l0.text}
            <Meta time={l0.time} read={false} />
          </div>
        )}
        {k >= 2 && (
          <div className={`${s.bubble} ${s.out}`}>
            {l1.text}
            <Meta time={l1.time} />
          </div>
        )}
        {k === 3 && <Typing />}
        {k >= 4 && (
          <div className={`${s.bubble} ${s.in} ${s.long}`}>
            {l2.text}
            <Meta time={l2.time} read={false} />
          </div>
        )}
        {k >= 5 && <FileCard {...c.file} />}
        {k >= 6 && (
          <div className={`${s.card} ${s.out}`}>
            <span className={s.cardIcon}>
              <I d={CHECK} size={13} />
            </span>
            <span>
              <b>{c.payment.title}</b>
              <small>{c.payment.detail}</small>
            </span>
            <Meta time={c.payment.time} />
          </div>
        )}
        {k >= 7 && (
          <div className={`${s.bubble} ${s.in}`}>
            {l3.text}
            <Meta time={l3.time} read={false} />
          </div>
        )}
      </Panel>
      <Callout show={k >= 1} side="l" top="12%" {...c.notes[0]} />
      <Callout show={k >= 2} side="r" top="40%" {...c.notes[1]} />
      <Callout show={k >= 5} side="l" top="62%" {...c.notes[2]} />
    </div>
  );
}

/** a call in the thread, as the app draws it: icon, what happened, time, and the way back */




function CallCard({
  call,
  title,
  time,
  action,
  detail,
}: {
  call: 'missed' | 'voice';
  title: string;
  time: string;
  action: string;
  detail?: string;
}) {
  return (
    <div
      className={`${s.callCard} ${call === 'missed' ? s.out : s.in}`}
      data-kind={call}
    >
      <div className={s.callTop}>
        <span className={s.callIcon}>
          <I d={call === 'missed' ? CALL_MISSED : CALL_IN} size={14} />
        </span>
        <span className={s.callText}>
          <b>{title}</b>
          {detail && <small>{detail}</small>}
        </span>
        <small className={s.callTime}>{time}</small>
      </div>
      <span className={s.callAction}>
        {action}
        <I d={CHEV} size={12} />
      </span>
    </div>
  );
}

/** a file in the thread: type tile, name, size, time */
function FileCard({
  name,
  detail,
  time,
}: {
  name: string;
  detail: string;
  time: string;
}) {
  return (
    <div className={`${s.fileCard} ${s.in}`}>
      <span className={s.fileIcon}>
        <I d={DOC} size={16} />
      </span>
      <span className={s.fileText}>
        <b>{name}</b>
        <small>{detail}</small>
      </span>
      <Meta time={time} read={false} />
    </div>
  );
}

/* ----------------------------------------------------------------- agents */
const AGENT_T = [
  200, 700, 1300, 1800, 4300, 5400, 6400, 7400, 8200, 9000, 9900,
];
function Agents({
  run,
  reduced,
  onDone,
}: {
  run: boolean;
  reduced: boolean;
  onDone: () => void;
}) {
  const a = useContext(Content).agents;
  // mode on, request, typing, answer, tasks (running, done), payment request, approved, done message
  const k = useSteps(AGENT_T, run, reduced, onDone);
  const answer = useStream(a.answer, k >= 4, reduced);
  const done = useStream(a.done, k >= 11, reduced);
  const taskState = (i: number) => {
    const doneAt = 5 + i;
    if (i === 3) return k >= 9 ? 'done' : k >= 7 ? 'run' : 'wait'; // payment waits for approval
    if (i === 4) return k >= 10 ? 'done' : k >= 9 ? 'run' : 'wait';
    return k >= doneAt ? 'done' : k >= doneAt - 1 ? 'run' : 'wait';
  };
  const total = (a as { count?: number }).count ?? 40;
  const read = k >= 5 ? total : k >= 4 ? Math.round(total * 0.45) : 0;
  return (
    <div className={s.scene}>
      <Panel
        avatar={<I d={AGENT} size={15} />}
        name={a.name}
        addr={a.addr}
        extra={
          <em className={s.mode} data-on={k >= 1 || undefined}>
            <i />
            Agent mode
          </em>
        }
      >
        {k >= 2 && (
          <div className={`${s.bubble} ${s.out}`}>
            {a.request}
            <Meta time="10:14" />
          </div>
        )}
        {/* agent replies are plain streamed text, no bubble; only the payment request is a card */}
        {k === 3 && <Thinking />}
        {k >= 4 && (
          <p className={s.agentText}>
            {answer.text}
            {!answer.done && <span className={s.caret} />}
          </p>
        )}
        {k >= 7 && (
          <div className={`${s.card} ${s.in} ${s.request}`}>
            <span>
              <small>Payment request</small>
              <b>{a.price}</b>
            </span>
            <span className={s.approve} data-on={k >= 8 || undefined}>
              {k >= 8 ? (
                <>
                  <I d={CHECK} size={12} /> Paid
                </>
              ) : (
                'Approve'
              )}
            </span>
          </div>
        )}
        {k >= 11 && (
          <p className={s.agentText}>
            {done.text}
            {!done.done && <span className={s.caret} />}
          </p>
        )}
      </Panel>
      <aside className={s.tasks} data-show={k >= 4 || undefined}>
        <p className={s.tasksHead}>
          Tasks{' '}
          <span className={s.num}>
            {a.tasks.filter((_, i) => taskState(i) === 'done').length}/5
          </span>
        </p>
        <ol>
          {a.tasks.map((t, i) => {
            const st = taskState(i);
            return (
              <li key={t} data-st={st}>
                <i className={s.tick}>
                  {st === 'done' ? <I d={CHECK} size={10} /> : null}
                </i>
                <span>
                  {t}
                  {i === 0 && st !== 'wait' && (
                    <span className={s.bar}>
                      <span style={{ width: `${(read / total) * 100}%` }} />
                      <small className={s.num}>
                        {read}/{total}
                      </small>
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </aside>
      <Callout show={k >= 1} side="l" top="12%" {...a.notes[0]} />
      <span className={s.badge}>Design preview</span>
    </div>
  );
}

/* -------------------------------------------------------------- mini apps */
const APP_T = [300, 1100, 2300, 3000, 3900, 4800, 5900];
const TAP_WAIT = 2600; // ms the 80% button waits for a tap before it taps itself

/* After the readings the 80% button pulses and waits for a tap; after TAP_WAIT it taps
   itself so the tour still runs. */
function useTapSteps(
  times: number[],
  run: boolean,
  reduced: boolean,
  onEnd: () => void,
  hold = 3400
) {
  const [k, setK] = useState(reduced ? times.length : 0);
  const [waiting, setWaiting] = useState(false);
  const ids = useRef<number[]>([]);
  const end = useRef(onEnd);
  end.current = onEnd;
  const clear = () => {
    ids.current.forEach(window.clearTimeout);
    ids.current = [];
  };
  const tapRef = useRef<() => void>(() => {});
  useEffect(() => {
    clear();
    setWaiting(false);
    if (reduced) {
      setK(times.length);
      return;
    }
    setK(0);
    if (!run) return;
    const after = (from: number) => {
      // everything after the tap, at the scene's own spacing
      for (let i = 2; i < times.length; i++) {
        ids.current.push(
          window.setTimeout(() => setK(i + 1), times[i] - times[2] + from)
        );
      }
      ids.current.push(
        window.setTimeout(
          () => end.current?.(),
          times[times.length - 1] - times[2] + from + hold
        )
      );
    };
    let tapped = false;
    tapRef.current = () => {
      if (tapped) return;
      tapped = true;
      setWaiting(false);
      clear();
      after(0);
    };
    ids.current.push(window.setTimeout(() => setK(1), times[0]));
    ids.current.push(
      window.setTimeout(() => {
        setK(2);
        setWaiting(true);
        ids.current.push(window.setTimeout(() => tapRef.current(), TAP_WAIT));
      }, times[1])
    );
    return clear;
    // times is a module constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, reduced]);
  return { k, waiting, tap: () => tapRef.current() };
}
/** a small example output trace; the last point drops once the limit applies */
const TRACE = [30, 34, 31, 36, 40, 38, 43, 46, 44, 49, 52, 50];
function spark(values: number[]) {
  const max = 60;
  return values
    .map(
      (v, i) =>
        `${i ? 'L' : 'M'}${Math.round((i / (values.length - 1)) * 200)} ${Math.round(36 - (v / max) * 32)}`
    )
    .join('');
}
/* Spixi's Apps screen with example apps. The Grid control tile pulses until tapped, then the
   screen gives way to the chat where the app runs. */
const APPS = [
  {
    name: 'Grid control',
    by: 'Example · your device',
    hue: '#1f6f5c',
    glyph: TB.bolt,
    launch: true,
  },
  {
    name: 'Tic-tac-toe',
    by: 'Example',
    hue: '#6a2fd0',
    glyph: TB.ticTac,
  },
  {
    name: 'Split the bill',
    by: 'Example',
    hue: '#b0562b',
    glyph: TB.receipt,
  },
  {
    name: 'Whiteboard',
    by: 'Example',
    hue: '#2f67d8',
    glyph: TB.presentation,
  },
  {
    name: 'Poll',
    by: 'Example',
    hue: '#8a6a1f',
    glyph: TB.chartBar,
  },
  {
    name: 'Agent hub',
    by: 'Example',
    hue: '#2b6f8a',
    glyph: TB.robot,
  },
];
const TABS = [
  { name: 'Chats', d: TB.messages },
  {
    name: 'Apps',
    d: TB.apps,
  },
  {
    name: 'Wallet',
    d: TB.wallet,
  },
  {
    name: 'Account',
    d: TB.userCircle,
  },
];
function AppsScreen({
  tile,
  gone,
  hint,
  onLaunch,
}: {
  tile?: string;
  gone: boolean;
  hint: boolean;
  onLaunch: () => void;
}) {
  const apps = tile ? APPS.map((a) => (a.launch ? { ...a, name: tile } : a)) : APPS;
  return (
    <div className={s.appsScreen} data-gone={gone || undefined} inert={gone}>
      <p className={s.appsTitle}>Apps</p>
      <div className={s.appsSearch}>
        <I d={TB.search} size={13} />
        Find installed apps
      </div>
      <div className={s.appsBanner}>
        <span>Not sure where to start?</span>
        <b>
          Explore Spixi Mini Apps{' '}
          <I d={TB.arrowRight} size={13} />
        </b>
      </div>
      <div className={s.appsGrid}>
        {apps.map((a) => {
          const body = (
            <>
              <span className={s.appIcon} style={{ background: a.hue }}>
                <I d={a.glyph} size={18} />
              </span>
              <b>{a.name}</b>
              <small>{a.by}</small>
              <span className={s.appMore} aria-hidden>
                ···
              </span>
            </>
          );
          return a.launch ? (
            <button
              key={a.name}
              type="button"
              className={s.appTile}
              data-hint={hint || undefined}
              onClick={onLaunch}
              aria-label={`Open ${a.name}`}
            >
              {body}
            </button>
          ) : (
            <span key={a.name} className={s.appTile} aria-hidden>
              {body}
            </span>
          );
        })}
      </div>
      <nav className={s.tabBar} aria-hidden>
        {TABS.map((t) => (
          <span key={t.name} data-on={t.name === 'Apps' || undefined}>
            <I d={t.d} size={16} />
            {t.name}
          </span>
        ))}
      </nav>
    </div>
  );
}

function MiniApps({
  run,
  reduced,
  onDone,
}: {
  run: boolean;
  reduced: boolean;
  onDone: () => void;
}) {
  const m = useContext(Content).miniapp as StageContent['miniapp'] & { seg?: [string, string]; tile?: string };
  // first the Apps screen: the app is launched from it (tap, or it taps
  // itself after a moment); then the app opens in the chat with the device
  const [launched, setLaunched] = useState(reduced);
  const [hint, setHint] = useState(false);
  useEffect(() => {
    if (reduced) return setLaunched(true);
    setLaunched(false);
    setHint(false);
    if (!run) return;
    const a = window.setTimeout(() => setHint(true), 900);
    const b = window.setTimeout(() => setLaunched(true), 900 + TAP_WAIT);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [run, reduced]);
  // app opens, readings, you tap 80%, command out, device checks, applied, device confirms
  const { k, waiting, tap } = useTapSteps(
    APP_T,
    run && launched,
    reduced,
    onDone
  );
  const applied = k >= 6;
  const trace = applied ? [...TRACE, 42, 41] : k >= 2 ? [...TRACE, 53] : TRACE;
  return (
    <div className={s.scene}>
      <Panel
        avatar={<I d={BOLT} size={15} />}
        name={m.name}
        addr={m.addr}
        status={<em className={s.status}>{m.status}</em>}
        overlay={
          <AppsScreen
            tile={m.tile}
            gone={launched}
            hint={hint && !launched}
            onLaunch={() => setLaunched(true)}
          />
        }
      >
        {k >= 1 && (
          <div className={`${s.app} ${s.in}`}>
            <div className={s.appHead}>
              <b>{m.app}</b>
              <small>Mini App · example</small>
            </div>
            <div className={s.readings}>
              <div>
                <small>{m.readings[0].label}</small>
                <b className={s.num}>
                  {applied ? m.readings[0].after : m.readings[0].before}
                </b>
              </div>
              <div>
                <small>{m.readings[1].label}</small>
                <b className={s.num}>{m.readings[1].before}</b>
              </div>
              <svg viewBox="0 0 200 40" className={s.spark} aria-hidden>
                <path d={spark(trace)} />
              </svg>
            </div>
            <div className={s.control}>
              <span>{m.control}</span>
              <span className={s.seg}>
                <i data-on={!(k >= 3) || undefined}>{m.seg?.[0] ?? '100%'}</i>
                <button
                  type="button"
                  className={s.segBtn}
                  data-on={k >= 3 || undefined}
                  data-press={k === 3 || undefined}
                  data-wait={waiting || undefined}
                  disabled={!waiting}
                  onClick={tap}
                  aria-label={`${m.control}: ${m.seg?.[1] ?? '80%'}`}
                >
                  {m.seg?.[1] ?? '80%'}
                </button>
              </span>
            </div>
            <p
              className={s.appState}
              data-st={applied ? 'done' : k >= 4 ? 'wait' : undefined}
            >
              {applied
                ? m.state.done
                : k >= 4
                  ? m.state.wait
                  : waiting
                    ? m.state.tap
                    : m.state.idle}
            </p>
          </div>
        )}
        {k >= 4 && (
          <div className={`${s.cmd} ${s.out}`}>
            <span className={s.mono}>{m.command}</span>
            <small>{m.signed}</small>
          </div>
        )}
        {k >= 7 && <div className={`${s.bubble} ${s.in}`}>{m.reply}</div>}
      </Panel>
      <Callout
        show={hint && !launched}
        side="l"
        top="30%"
        title="Opened from Spixi"
        detail="no app store, no backend of your own"
      />
      <Callout show={k >= 1} side="l" top="12%" {...m.notes[0]} />
      <Callout show={k >= 4} side="r" top="48%" {...m.notes[1]} />
      <Callout show={k >= 5} side="r" top="66%" {...m.notes[2]} />
      <code className={s.sdk} data-show={k >= 4 || undefined}>
        {m.code}
      </code>
    </div>
  );
}

export default function Stage({
  active,
  reduced,
  playing,
  onDone,
  skin = 'panel',
  idPrefix = 'spixi',
  content = defaultStage,
}: Props) {
  const scenes = [Chat, Agents, MiniApps];
  return (
    <Content.Provider value={content}>
    <Skin.Provider value={skin}>
      <div className={s.stage} data-skin={skin}>
        <div className={s.bg} aria-hidden />
        {scenes.map((Scene, i) => (
          <div
            key={i}
            id={`${idPrefix}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${idPrefix}-tab-${i}`}
            className={s.layer}
            data-on={i === active || undefined}
            inert={i !== active}
          >
            <Scene
              run={playing && i === active}
              reduced={reduced}
              onDone={onDone}
            />
          </div>
        ))}
      </div>
    </Skin.Provider>
    </Content.Provider>
  );
}
