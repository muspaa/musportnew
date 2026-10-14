import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Search, X } from 'lucide-react';
import { PROJECTS, statusLabels } from '../data';
import type { Project } from '../types';
import { Chapter, Modal, VisitButton } from './Primitives';
import { useRing } from '../hooks/useRing';
import { ringLayout } from '../interaction/ring.mjs';

const categories = [{ id: 'all', name: 'Semua' }, { id: 'Creator', name: 'Creator tools' }, { id: 'Media', name: 'Media' }, { id: 'Utilities', name: 'Utilities' }, { id: 'Developer', name: 'Developer' }];
const pad = (n: number) => String(n).padStart(2, '0');

/** Planet CSS per proyek: warna, cincin, dan simbol datang dari data proyek. */
export function WorkPlanet({ work, large = false, mini = false }: { work: Project; large?: boolean; mini?: boolean }) {
  const { hue, hue2, ring, glyph } = work.theme;
  return <div className={`work-planet ${large ? 'work-planet-large' : ''} ${mini ? 'work-planet-mini' : ''}`} style={{ '--h': hue, '--h2': hue2 } as CSSProperties} data-ring={ring} role="img" aria-label={`Ilustrasi planet untuk ${work.name}`}>
    {ring && <span className="wp-ring wp-ring-back" aria-hidden="true"/>}
    <span className="wp-sphere" aria-hidden="true"><span className="wp-glyph">{glyph}</span></span>
    {ring && <span className="wp-ring wp-ring-front" aria-hidden="true"/>}
    {!mini && <img className="wp-moon" src="/images/moon.webp" width={96} height={96} alt="" aria-hidden="true" decoding="async" loading="lazy"/>}
  </div>;
}

export default function Archive({ still }: { still: boolean }) {
  const [filter, setFilter] = useState('all'), [query, setQuery] = useState(''), [active, setActive] = useState<Project | null>(null), [cardWidth, setCardWidth] = useState(280);
  const stage = useRef<HTMLDivElement | null>(null);
  const list = useMemo(() => PROJECTS.filter(w => (filter === 'all' || w.category === filter) && `${w.name} ${w.summary} ${w.ecosystem.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [filter, query]);
  const layout = ringLayout(list.length || 1, cardWidth);
  const { ring, index, go, goTo, handlers } = useRing(list.length, layout.wraps, still);
  const current = list[Math.min(index, list.length - 1)];

  useEffect(() => {
    const sync = () => {
      if (!location.hash.startsWith('#work-')) { setActive(null); return; }
      const found = PROJECTS.find(p => `#work-${p.id}` === location.hash) || null;
      if (found) { setFilter(f => (f === 'all' || f === found.category ? f : 'all')); setQuery(''); }
      setActive(found);
    };
    sync(); addEventListener('hashchange', sync); return () => removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => { if (active) { const i = list.findIndex(p => p.id === active.id); if (i >= 0) goTo(i); } }, [active, list, goTo]);
  useEffect(() => {
    const el = stage.current; if (!el) return;
    const measure = () => { const card = el.querySelector<HTMLElement>('.ring-card'); if (card && card.offsetWidth) setCardWidth(card.offsetWidth); };
    measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  }, [list.length]);

  const open = (work: Project) => { location.hash = `#work-${work.id}`; };
  const close = () => { setActive(null); history.replaceState(null, '', '#archive'); };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(list.length - 1); }
    else if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget && current) { e.preventDefault(); open(current); }
  };
  const atStart = !layout.wraps && index <= 0, atEnd = !layout.wraps && index >= list.length - 1;

  return <section className="archive section-pad" id="archive" aria-labelledby="archive-title">
    <div className="wrap">
      <div data-reveal>
        <Chapter number="02">THE DIGITAL ARCHIVE</Chapter>
        <div className="section-heading"><h2 id="archive-title">Selected Works.<br/><em>Build. Learn. Repeat.</em></h2><div><p>Kumpulan tools web yang aku bangun dan jalankan sendiri. Setiap proyek punya kartunya sendiri dengan tampilan aslinya: putar ring-nya, pilih satu, lalu buka demo langsungnya.</p><p className="micro-note">DRAG / SWIPE UNTUK MEMUTAR · KLIK KARTU DI DEPAN UNTUK DETAIL</p></div></div>
      </div>
      <div className="archive-toolbar" data-reveal><div className="filter-list" role="group" aria-label="Filter karya">{categories.map(c => <button key={c.id} onClick={() => setFilter(c.id)} aria-pressed={filter === c.id} className={filter === c.id ? 'active' : ''}>{c.name}</button>)}</div>
        <div className="search-box"><Search size={18}/><input type="text" placeholder="Cari karya..." value={query} onChange={e => setQuery(e.target.value)} aria-label="Cari proyek berdasarkan nama atau teknologi"/><button hidden={!query} onClick={() => setQuery('')} aria-label="Bersihkan pencarian"><X size={18}/></button></div></div>
      <p className="sr-only" role="status">{list.length} karya ditemukan</p>

      {list.length > 0 && <div className="ring-wrap" data-reveal>
        <div ref={el => { stage.current = el; }} className="ring-stage" tabIndex={0} role="group" aria-roledescription="karusel 3D" aria-label={`Karusel ${list.length} proyek. Gunakan panah kiri dan kanan, atau geser.`} onKeyDown={onKey} {...handlers}>
          <div className="ring-orbit" aria-hidden="true"/>
          <div className="ring" ref={ring} style={{ '--step': layout.step, '--r': `${layout.radius}px` } as CSSProperties}>
            {list.map((work, i) => <div className="ring-card" key={work.id} style={{ '--i': i, '--h': work.theme.hue } as CSSProperties} data-active={index === i}>
              <button type="button" tabIndex={-1} className="planet-card" onClick={() => (index === i ? open(work) : goTo(i))} aria-label={index === i ? `Baca cerita ${work.name}` : `Tampilkan ${work.name}`}>
                <span className="shot"><img src={work.image} width={1280} height={800} alt={work.imageAlt} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" draggable={false}/><span className="shot-sheen" aria-hidden="true"/><span className="shot-badge"><WorkPlanet work={work} mini/></span></span>
                <span className="planet-card-meta"><span>{pad(i + 1)}</span><span>{work.category}</span></span>
                <strong className="planet-card-title">{work.name}</strong>
                <span className="planet-card-summary">{work.summary}</span>
                <span className="planet-card-status"><i aria-hidden="true"/>{statusLabels[work.status]}</span>
                <span className="planet-card-open" aria-hidden="true"><ArrowUpRight size={18}/></span>
              </button>
            </div>)}
          </div>
        </div>
        <div className="ring-controls"><button className="icon-button" onClick={() => go(-1)} disabled={atStart} aria-label="Karya sebelumnya"><ArrowLeft size={18}/></button>
          <div className="ring-index" role="group" aria-label="Pilih karya">{list.map((w, i) => <button key={w.id} onClick={() => goTo(i)} aria-pressed={index === i} aria-label={`Karya ${i + 1}: ${w.name}`} className={index === i ? 'active' : ''}>{pad(i + 1)}</button>)}</div>
          <button className="icon-button" onClick={() => go(1)} disabled={atEnd} aria-label="Karya berikutnya"><ArrowRight size={18}/></button></div>
        {current && <div className="work-detail" key={current.id} aria-live="polite">
          <div className="work-detail-main"><span className="eyebrow">{pad(index + 1)} / {pad(list.length)} · {current.category.toUpperCase()}</span><h3>{current.name}</h3><p>{current.summary}</p><div className="tag-list">{current.ecosystem.map(t => <span key={t}>{t}</span>)}</div></div>
          <div className="work-detail-actions"><VisitButton href={current.url}>Buka live demo</VisitButton><button className="text-link" onClick={() => open(current)}>Baca cerita lengkap<ArrowUpRight size={15}/></button><small className="work-status"><i aria-hidden="true"/>{statusLabels[current.status]}</small></div>
        </div>}
      </div>}

      {!list.length && <div className="empty-state"><Search size={30}/><h3>Belum ketemu.</h3><p>Coba nama karya, teknologi, atau kata yang berbeda.</p><button className="text-link" onClick={() => { setQuery(''); setFilter('all'); }}>Bersihkan pencarian</button></div>}
      <div className="archive-bottom"><span>Semua {PROJECTS.length} proyek tetap di arsip.</span><span className="micro-note">TIAP KARTU = SATU PROYEK LIVE</span></div>

      {active && <Modal label={active.name} onClose={close} className="work-modal">
        <div className="modal-shot"><img src={active.image} width={1280} height={800} alt={active.imageAlt} decoding="async"/><span className="modal-badge"><WorkPlanet work={active} mini/></span></div>
        <p className="eyebrow">{active.category.toUpperCase()} · {statusLabels[active.status].toUpperCase()}</p>
        <h2>{active.name}</h2><p className="modal-summary">{active.description}</p>
        <div className="story-grid"><div><small>MASALAH</small><p>{active.problem}</p></div><div><small>EKSPLORASI</small><p>{active.exploration}</p></div><div><small>HASIL</small><p>{active.outcome}</p></div></div>
        <div className="work-stack"><strong>Stack & fitur:</strong><div className="tag-list">{active.ecosystem.map(t => <span key={t}>{t}</span>)}</div></div>
        <div className="work-actions"><VisitButton href={active.url}>Kunjungi Website</VisitButton></div>
      </Modal>}
    </div>
  </section>;
}
