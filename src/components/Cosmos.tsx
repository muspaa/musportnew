import { useEffect, useRef } from 'react';
import { mountNebula } from '../space/nebula';
import { mountStars } from '../space/stars';

/** Latar semesta: nebula WebGL beresolusi rendah + starfield 3D yang bergerak mengikuti scroll dan pointer. */
export default function Cosmos({ paused }: { paused: boolean }) {
  const nebulaRef = useRef<HTMLCanvasElement>(null), starsRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const nebulaCanvas = nebulaRef.current, starCanvas = starsRef.current; if (!nebulaCanvas || !starCanvas) return;
    const root = document.documentElement;
    const input = { px: 0, py: 0, tx: 0, ty: 0 }, light = () => (root.dataset.theme === 'light' ? 1 : 0);
    const small = matchMedia('(max-width: 720px)').matches;
    let time = 0, last = 0, frame = 0, tick = 0, visible = !document.hidden;
    const clock = () => time;
    const nebula = mountNebula(nebulaCanvas, () => ({ time: clock(), scroll: scrollY, mx: input.px, my: input.py, light: light() }), small ? 0.32 : 0.42);
    const stars = mountStars(starCanvas, () => ({ time: clock(), scroll: scrollY, px: input.px, py: input.py, light: light() }), small ? 640 : 1300);
    root.dataset.cosmos = nebula ? 'webgl' : 'css';
    const draw = (full: boolean) => { stars?.render(); if (full) nebula?.render(); };
    const loop = (now: number) => {
      frame = 0; if (paused || !visible) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now; time += dt;
      input.px += (input.tx - input.px) * 0.06; input.py += (input.ty - input.py) * 0.06;
      draw(tick++ % 2 === 0);
      frame = requestAnimationFrame(loop);
    };
    const wake = () => { cancelAnimationFrame(frame); frame = 0; last = 0; if (paused || !visible) { draw(true); return; } frame = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => { input.tx = (e.clientX / innerWidth - 0.5) * 2; input.ty = (e.clientY / innerHeight - 0.5) * 2; };
    const vis = () => { visible = !document.hidden; wake(); };
    const redraw = () => { if (paused) draw(true); };
    const theme = new MutationObserver(redraw); theme.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    addEventListener('pointermove', move, { passive: true }); addEventListener('resize', redraw); addEventListener('scroll', redraw, { passive: true }); document.addEventListener('visibilitychange', vis);
    wake();
    return () => { cancelAnimationFrame(frame); theme.disconnect(); removeEventListener('pointermove', move); removeEventListener('resize', redraw); removeEventListener('scroll', redraw); document.removeEventListener('visibilitychange', vis); nebula?.destroy(); delete root.dataset.cosmos; };
  }, [paused]);
  return <div className="cosmos" aria-hidden="true"><canvas ref={nebulaRef} className="cosmos-nebula"/><canvas ref={starsRef} className="cosmos-stars"/><span className="shooting-star s1"/><span className="shooting-star s2"/><span className="shooting-star s3"/></div>;
}
