import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { activeIndex, clampCursor, rubberBand, shortestTarget, snapTarget, stepTowards } from '../interaction/ring.mjs';

/**
 * Kursor ring ditulis langsung ke CSS variable `--cur` (tanpa re-render per frame).
 * React hanya mengetahui indeks aktif. Drag memakai pointer events dan snap dengan inersia.
 */
export function useRing(count: number, wraps: boolean, reduced: boolean) {
  const ring = useRef<HTMLDivElement>(null);
  const cursor = useRef(0), target = useRef(0), raf = useRef(0), last = useRef(0), suppress = useRef(false);
  const drag = useRef<{ id: number; x: number; start: number; moved: boolean; prev: number; at: number; velocity: number } | null>(null);
  const [index, setIndex] = useState(0);

  const apply = useCallback(() => {
    ring.current?.style.setProperty('--cur', cursor.current.toFixed(4));
    const next = activeIndex(cursor.current, count);
    setIndex(current => (current === next ? current : next));
  }, [count]);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current); last.current = 0;
    if (reduced) { cursor.current = target.current; apply(); return; }
    const tick = (now: number) => {
      const dt = last.current ? (now - last.current) / 1000 : 1 / 60; last.current = now;
      cursor.current = stepTowards(cursor.current, target.current, dt); apply();
      raf.current = cursor.current === target.current ? 0 : requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [apply, reduced]);

  // Daftar berubah (filter/pencarian): mulai lagi dari kartu pertama.
  useEffect(() => { cancelAnimationFrame(raf.current); cursor.current = 0; target.current = 0; apply(); }, [count, apply]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const goTo = useCallback((i: number) => { target.current = shortestTarget(cursor.current, i, count, wraps); run(); }, [count, wraps, run]);
  const go = useCallback((delta: number) => { target.current = clampCursor(Math.round(target.current) + delta, count, wraps); run(); }, [count, wraps, run]);

  const handlers = {
    onPointerDown(e: ReactPointerEvent<HTMLElement>) {
      if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
      suppress.current = false;
      drag.current = { id: e.pointerId, x: e.clientX, start: cursor.current, moved: false, prev: cursor.current, at: performance.now(), velocity: 0 };
    },
    onPointerMove(e: ReactPointerEvent<HTMLElement>) {
      const d = drag.current; if (!d || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x;
      if (!d.moved) { if (Math.abs(dx) < 8) return; d.moved = true; cancelAnimationFrame(raf.current); try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ } }
      const perCard = Math.max(150, e.currentTarget.clientWidth * 0.26);
      const next = rubberBand(d.start - dx / perCard, count, wraps), now = performance.now();
      d.velocity = (next - d.prev) / Math.max(0.008, (now - d.at) / 1000); d.prev = next; d.at = now;
      cursor.current = next; apply();
    },
    onPointerUp(e: ReactPointerEvent<HTMLElement>) {
      const d = drag.current; if (!d || d.id !== e.pointerId) return; drag.current = null;
      if (!d.moved) return;
      suppress.current = true;
      target.current = snapTarget(cursor.current, performance.now() - d.at > 120 ? 0 : d.velocity, count, wraps); run();
    },
    onPointerCancel() { if (drag.current?.moved) { target.current = clampCursor(Math.round(cursor.current), count, wraps); run(); } drag.current = null; },
    onClickCapture(e: ReactMouseEvent<HTMLElement>) { if (suppress.current) { e.preventDefault(); e.stopPropagation(); suppress.current = false; } },
  };
  return { ring, index, go, goTo, handlers };
}
