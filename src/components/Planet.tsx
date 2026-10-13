import { useEffect, useRef } from 'react';
import { mountPlanet } from '../space/planet';
import { quality } from '../space/quality';

/** Planet 3D (shader WebGL). Fallback CSS tampil saat SSR, tanpa WebGL, atau sebelum frame pertama. */
export default function Planet({ paused }: { paused: boolean }) {
  const wrap = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current, box = wrap.current; if (!el || !box) return;
    const input = { rx: 0, ry: 0, tx: 0, ty: 0 }, root = document.documentElement;
    let time = 0, last = 0, frame = 0, visible = false;
    const planet = mountPlanet(el, () => ({ time, rx: input.rx, ry: input.ry, light: root.dataset.theme === 'light' ? 1 : 0 }), () => 1.6 * quality.value);
    if (!planet) { box.dataset.ready = 'false'; return; }
    const loop = (now: number) => {
      frame = 0; if (paused || !visible || document.hidden) return;
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now; time += dt;
      input.rx += (input.tx - input.rx) * 0.05; input.ry += (input.ty - input.ry) * 0.05;
      planet.render(); frame = requestAnimationFrame(loop);
    };
    const wake = () => { cancelAnimationFrame(frame); frame = 0; last = 0; planet.render(); box.dataset.ready = 'true'; if (!paused && visible && !document.hidden) frame = requestAnimationFrame(loop); };
    const move = (e: PointerEvent) => { input.tx = (e.clientX / innerWidth - 0.5) * 2; input.ty = (e.clientY / innerHeight - 0.5) * 2; };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); }, { rootMargin: '80px' }); io.observe(box);
    const ro = new ResizeObserver(wake); ro.observe(box);
    const theme = new MutationObserver(() => { if (paused) wake(); }); theme.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    addEventListener('pointermove', move, { passive: true }); document.addEventListener('visibilitychange', wake);
    return () => { cancelAnimationFrame(frame); io.disconnect(); ro.disconnect(); theme.disconnect(); removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', wake); planet.destroy(); };
  }, [paused]);
  return <div className="planet" ref={wrap} data-ready="false" aria-hidden="true"><div className="planet-fallback"><span className="planet-fallback-ring"/></div><canvas ref={canvas} className="planet-canvas"/></div>;
}
