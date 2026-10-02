'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@site/lib/motion';
import { TB } from '@site/components/tabler';
import s from './QsSpixi.module.css';

/* Spixi screen crops sized for the 240 px confirmation strip; play once when in view.
     request  QuIXI's contact request is accepted
     arrive   the step 3 message arrives in the chat */

const QX = '4hLm…c7Rq';

const Icon = ({ d, size = 16, w = 1.5 }: { d: string; size?: number; w?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);
const PERSON = TB.user;
const PEOPLE = TB.users;
const SEARCH = TB.search;
const CHECK = TB.check;
const BACK = TB.arrowLeft;
const CALL = TB.phone;
const INFO = TB.infoCircle;
const PLUS = TB.circlePlus;
const PLANE = TB.send;

function usePlay(reduced: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return setOn(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio > 0.6) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  return { ref, on };
}

export default function QsSpixi({ mode, label, from = QX }: { mode: 'request' | 'arrive'; label: string; from?: string }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(prefersReducedMotion()), []);
  const { ref, on } = usePlay(reduced);
  return (
    <div ref={ref} className={s.screen} data-mode={mode} data-play={on || undefined} data-still={reduced || undefined} role="img" aria-label={label}>
      {mode === 'request' ? (
        <>
          <div className={s.listHead}>
            <b className={s.brand}>Spixi</b>
            <span className={s.round}>
              <Icon d={PEOPLE} size={15} />
            </span>
          </div>
          <div className={s.search}>
            <Icon d={SEARCH} size={13} />
            Search chats
          </div>
          <div className={s.row}>
            <span className={s.avatarReq}>
              <Icon d={PERSON} size={16} />
            </span>
            <span className={s.rowText}>
              <b>{from}</b>
              <small className={s.wants}>Wants to connect</small>
              <small className={s.added}>Contact added · Online</small>
            </span>
            <span className={s.time}>now</span>
            <span className={s.actions}>
              <span className={s.decline}>Decline</span>
              <span className={s.accept}>
                <Icon d={CHECK} size={12} />
                Accept
              </span>
            </span>
          </div>
          <div className={`${s.row} ${s.ghostRow}`} aria-hidden>
            <span className={s.avatarGhost} />
            <span className={s.rowText}>
              <i />
              <i />
            </span>
          </div>
        </>
      ) : (
        <>
          <div className={s.chatHead}>
            <Icon d={BACK} size={17} />
            <span className={s.avatarChat}>
              <Icon d={PERSON} size={14} />
            </span>
            <span className={s.who}>
              <b>{from}</b>
              <small>Online</small>
            </span>
            <span className={s.icons}>
              <Icon d={CALL} size={15} />
              <Icon d={INFO} size={15} />
            </span>
          </div>
          <div className={s.thread}>
            <span className={s.day}>Today</span>
            <div className={s.bubble}>
              Hello from my computer
              <small>now</small>
            </div>
          </div>
          <div className={s.composer}>
            <span className={s.field}>
              <Icon d={PLUS} size={15} />
              Message
            </span>
            <i>
              <Icon d={PLANE} size={13} />
            </i>
          </div>
        </>
      )}
    </div>
  );
}
