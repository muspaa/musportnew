import { useEffect, useState } from 'react';

/**
 * Efek halaman yang ringan dan bisa dimatikan: progres baca, reveal saat scroll, tilt 3D kartu
 * ([data-tilt]) dengan kilau mengikuti kursor, spotlight kursor, dan pelacak bagian aktif.
 */
export function useSpaceFx(enabled: boolean) {
  const [current, setCurrent] = useState('home');
  useEffect(() => {
    const root = document.documentElement; root.dataset.js = 'on'; root.dataset.motion = enabled ? 'on' : 'off';
    let frame = 0;
    const progress = () => { frame = 0; const total = root.scrollHeight - innerHeight; root.style.setProperty('--read-progress', String(total > 0 ? Math.min(1, scrollY / total) : 0)); root.style.setProperty('--sy', String(Math.round(scrollY))); };
    const request = () => { if (!frame) frame = requestAnimationFrame(progress); };
    addEventListener('scroll', request, { passive: true }); addEventListener('resize', request); progress();

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reveal = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add('in-view'); reveal.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    // Saat gerak mati, CSS menampilkan semua elemen; reveal hanya aktif ketika motion on.
    if (enabled) targets.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('in-view', 'no-delay'); else if (!el.classList.contains('in-view')) reveal.observe(el); });

    const sections = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { setCurrent(e.target.id); root.dataset.chapter = e.target.id; } }), { rootMargin: '-18% 0px -62% 0px' });
    document.querySelectorAll('main section[id],footer[id]').forEach(el => sections.observe(el));

    let hovered: HTMLElement | null = null, pending: PointerEvent | null = null, tiltFrame = 0;
    const clear = (el: HTMLElement | null) => { if (!el) return; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); el.style.setProperty('--gx', '50%'); el.style.setProperty('--gy', '50%'); el.removeAttribute('data-tilting'); };
    const applyTilt = () => {
      tiltFrame = 0; const e = pending; pending = null; if (!e) return;
      root.style.setProperty('--mx', `${e.clientX}px`); root.style.setProperty('--my', `${e.clientY}px`);
      const el = (e.target as Element | null)?.closest?.('[data-tilt]') as HTMLElement | null;
      if (el !== hovered) { clear(hovered); hovered = el; }
      if (!el) return;
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height, max = Number(el.dataset.tilt) || 8;
      el.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`); el.style.setProperty('--ry', `${((x - 0.5) * max * 1.25).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`); el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`); el.dataset.tilting = 'true';
    };
    const move = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; pending = e; if (!tiltFrame) tiltFrame = requestAnimationFrame(applyTilt); };
    const leave = () => { clear(hovered); hovered = null; };
    if (enabled) { addEventListener('pointermove', move, { passive: true }); document.documentElement.addEventListener('pointerleave', leave); }

    const visibility = () => { root.dataset.pageHidden = document.hidden ? 'true' : 'false'; };
    document.addEventListener('visibilitychange', visibility); visibility();
    return () => {
      cancelAnimationFrame(frame); cancelAnimationFrame(tiltFrame); reveal.disconnect(); sections.disconnect(); clear(hovered);
      removeEventListener('scroll', request); removeEventListener('resize', request); removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', visibility);
    };
  }, [enabled]);
  return current;
}
