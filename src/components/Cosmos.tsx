import { useEffect, useRef } from 'react';
import { mountNebula } from '../space/nebula';
import { mountStars } from '../space/stars';
import { quality } from '../space/quality';

/** Warna nebula per bagian halaman (pengali RGB); berpindah halus saat bagian berganti. */
const TINTS: Record<string, [number, number, number]> = {
  home: [1, 1, 1], archive: [0.82, 0.98, 1.3], about: [0.8, 1.2, 1.15], journey: [1.28, 0.82, 1.15], ecosystem: [0.8, 1.15, 1.3],
  profile: [1.3, 1.05, 0.8], lab: [1.05, 0.9, 1.3], ethos: [1.3, 0.85, 1.05], rating: [1.1, 0.95, 1.25], contact: [1.15, 0.9, 1.3]
};

/** Latar semesta: nebula WebGL + starfield 3D yang bergerak mengikuti scroll, pointer (konstelasi), dan bagian aktif. */
export default function Cosmos({ paused }: { paused: boolean }) {
  const nebulaRef = useRef<HTMLCanvasElement>(null), starsRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const nebulaCanvas = nebulaRef.current, starCanvas = starsRef.current; if (!nebulaCanvas || !starCanvas) return;
    const root = document.documentElement;
    const input = { px: 0, py: 0, tx: 0, ty: 0, mx: -999, my: -999, hot: 0, moved: 0 }, tint: [number, number, number] = [1, 1, 1];
    const light = () => (root.dataset.theme === 'light' ? 1 : 0);
    const small = matchMedia('(max-width: 720px)').matches, baseScale = small ? 0.32 : 0.42;
    let time = 0, last = 0, frame = 0, tick = 0, visible = !document.hidden;
    const nebula = mountNebula(nebulaCanvas, () => ({ time, scroll: scrollY, mx: input.px, my: input.py, light: light(), tint }), () => baseScale * quality.value);
    const stars = mountStars(starCanvas, () => ({ time, scroll: scrollY, px: input.px, py: input.py, light: light(), mx: input.mx, my: input.my, hot: input.hot }), small ? 640 : 1300);
    root.dataset.cosmos = nebula ? 'webgl' : 'css';
    const draw = (full: boolean) => { stars?.render(); if (full) nebula?.render(); };
    const loop = (now: number) => {
      frame = 0; if (paused || !visible) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now; time += dt; if (dt) quality.sample(dt);
      input.px += (input.tx - input.px) * 0.06; input.py += (input.ty - input.py) * 0.06;
      input.hot = time - input.moved < 1.4 ? Math.min(1, input.hot + dt * 4) : Math.max(0, input.hot - dt * 1.2);
      const target = TINTS[root.dataset.chapter || 'home'] || TINTS.home;
      for (let i = 0; i < 3; i++) tint[i] += (target[i] - tint[i]) * Math.min(1, dt * 1.6);
      draw(tick++ % 2 === 0);
      frame = requestAnimationFrame(loop);
    };
    const wake = () => { cancelAnimationFrame(frame); frame = 0; last = 0; quality.reset(); if (paused || !visible) { draw(true); return; } frame = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => { input.tx = (e.clientX / innerWidth - 0.5) * 2; input.ty = (e.clientY / innerHeight - 0.5) * 2; if (e.pointerType === 'mouse') { input.mx = e.clientX; input.my = e.clientY; input.moved = time; } };
    const vis = () => { visible = !document.hidden; wake(); };
    const redraw = () => { if (paused) draw(true); };
    const theme = new MutationObserver(redraw); theme.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    addEventListener('pointermove', move, { passive: true }); addEventListener('resize', redraw); addEventListener('scroll', redraw, { passive: true }); document.addEventListener('visibilitychange', vis);
    wake();
    return () => { cancelAnimationFrame(frame); theme.disconnect(); removeEventListener('pointermove', move); removeEventListener('resize', redraw); removeEventListener('scroll', redraw); document.removeEventListener('visibilitychange', vis); nebula?.destroy(); delete root.dataset.cosmos; };
  }, [paused]);
  return <div className="cosmos" aria-hidden="true"><canvas ref={nebulaRef} className="cosmos-nebula"/><canvas ref={starsRef} className="cosmos-stars"/><span className="shooting-star s1"/><span className="shooting-star s2"/><span className="shooting-star s3"/></div>;
}
