import { links } from '@site/content/links';
import SectionBoundary from '@site/components/SectionBoundary';
import s from './MiniAppsBand.module.css';

// A tilted, drifting plane of real Mini App cards (icons in public/site/miniapps/). CSS-only animation;
// reduced motion holds the plane still.

type App = { name: string; by: string; line: string; tag: string; icon: string; grey?: boolean };
const APPS: App[] = [
  { name: 'Tic-Tac-Toe', by: 'IXI Labs', line: 'A quick game with anyone in the chat', tag: '2 players', icon: 'tictactoe' },
  { name: 'Gate Control', by: 'IXI Labs', line: 'Open a gate from your phone, by address', tag: 'IoT · 2 users', icon: 'gate-control' },
  { name: 'Whiteboard', by: 'IXI Labs', line: 'Draw together, live, peer to peer', tag: 'Up to 3', icon: 'whiteboard' },
  { name: 'Starwind Arena', by: 'IXI Labs', line: 'A two-player space duel', tag: '2 players', icon: 'starwind-arena' },
  { name: 'Spixi Authenticator', by: 'IXI Labs', line: 'Sign in and sign transactions with your address', tag: 'Tools', icon: 'auth' },
  { name: 'AI Assistant', by: 'Community', line: 'An AI helper inside the conversation', tag: 'AI', icon: 'ai-assistant' },
  { name: 'DoomWASM', by: 'Community', line: 'A retro shooter, compiled to WebAssembly', tag: 'Games', icon: 'doomwasm' },
  // community apps from the Baracuda hub (dronko.si)
  { name: 'Protocol: Eclipse', by: 'Baracuda', line: 'A two-player co-op escape: one on the ground, one in command', tag: '2 players', icon: 'protocol-eclipse' },
  { name: 'Coin Flip', by: 'Baracuda', line: 'Settle it with a flip, together', tag: 'Games', icon: 'coinflip' },
  { name: 'Kalker', by: 'Baracuda', line: 'A calculator for the maths in the chat', tag: 'Tools', icon: 'kalker' },
  { name: 'Dentist Mystery', by: 'Baracuda Community', line: 'A detective mystery adventure', tag: 'Games', icon: 'dentistgame' },
  { name: 'Pong', by: 'Baracuda', line: 'The classic, head to head', tag: '2 players', icon: 'pong' },
  { name: 'Survival Manual', by: 'Baracuda Community', line: 'A survival guide that works offline', tag: 'Tools', icon: 'survivalmanual' },
];

function Card({ a }: { a: App }) {
  return (
    <div className={s.card}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/site/miniapps/${a.icon}.png`} alt="" width={96} height={96} className={s.icon} data-grey={a.grey || undefined} loading="lazy" decoding="async" />
      <div className={s.cardText}>
        <b>{a.name}</b>
        <span>{a.by}</span>
        <p>{a.line}</p>
      </div>
      <div className={s.cardFoot}>
        <i>{a.tag}</i>
        <em>Open</em>
      </div>
    </div>
  );
}

/* rows of cards, each row shifted so the plane never shows a seam */
const ROWS = 6;
const row = (r: number) => Array.from({ length: 12 }, (_, i) => APPS[(i + r * 5) % APPS.length]);

export default function MiniAppsBand() {
  return (
    <section id="mini-apps" className={s.band} aria-labelledby="mini-apps-title">
      <SectionBoundary />
      <div className={s.wrap}>
        <div className={s.stage}>
          <div className={s.plane} aria-hidden>
            {Array.from({ length: ROWS }, (_, r) => (
              <div key={r} className={s.row} style={{ ['--r' as string]: r }}>
                {row(r).map((a, i) => (
                  <Card key={i} a={a} />
                ))}
              </div>
            ))}
          </div>
          <div className={s.copy}>
            <p className={s.eyebrow}>Spixi Mini Apps</p>
            <h2 id="mini-apps-title" className={s.title}>
              Apps you open together, inside a chat.
            </h2>
            <p className={s.lead}>Games, shared boards, a gate you open from your phone. Mini Apps are HTML and JavaScript, run inside Spixi and keep their state between the people in the conversation, peer to peer.</p>
            <div className={s.actions}>
              <a href={links.docs.quickstart.miniApp} target="_blank" rel="noreferrer" className={s.btn}>
                Build a Mini App ↗
              </a>
              <a href={links.github.miniAppsExamples} target="_blank" rel="noreferrer" className={s.link}>
                See the examples ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
