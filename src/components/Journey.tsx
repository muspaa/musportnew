import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { JOURNEY_STEPS } from '../data';
import { Chapter } from './Primitives';

const N = JOURNEY_STEPS.length, RADIUS = 40, CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const point = (i: number) => { const a = (-90 + (360 / N) * i) * Math.PI / 180; return { left: `${(50 + RADIUS * Math.cos(a)).toFixed(2)}%`, top: `${(50 + RADIUS * Math.sin(a)).toFixed(2)}%` }; };
const label = (phase: string) => phase.split('—')[1]?.trim() || phase;

export default function Journey() {
  const [phase, setPhase] = useState(0); const current = JOURNEY_STEPS[phase];
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setPhase(p => Math.min(N - 1, p + 1)); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setPhase(p => Math.max(0, p - 1)); }
  };
  return <section className="journey section-pad" id="journey" aria-labelledby="journey-title"><div className="wrap">
    <div data-reveal><Chapter number="04">THE EVOLUTION / 6 CHAPTERS</Chapter><div className="section-heading"><h2 id="journey-title">Dari tugas sekolah.<br/><em>Lalu keterusan.</em></h2><p>Pilih titik perjalanan untuk membuka konteksnya.<br/>Masih banyak yang perlu dipelajari.</p></div></div>
    <div className="journey-layout" data-reveal>
      <aside className="journey-art"><div className="journey-hud" data-phase={phase} data-tilt="7" onKeyDown={onKey}>
        <svg className="hud-svg" viewBox="0 0 100 100" aria-hidden="true"><circle className="hud-dash" cx="50" cy="50" r="48"/><circle className="hud-track" cx="50" cy="50" r={RADIUS}/><circle className="hud-progress" cx="50" cy="50" r={RADIUS} strokeDasharray={`${(phase / N) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}/><circle className="hud-inner" cx="50" cy="50" r="27"/></svg>
        <div className="hud-core" key={phase}><small>CHAPTER</small><strong>0{phase + 1}</strong><span>{label(current.phase)}</span></div>
        {JOURNEY_STEPS.map((j, i) => <button type="button" key={j.phase} className={`hud-node ${i <= phase ? 'reached' : ''} ${i === phase ? 'current' : ''}`} style={point(i) as CSSProperties} onClick={() => setPhase(i)} aria-label={`Buka fase ${i + 1}: ${j.title}`} aria-pressed={phase === i}><span>0{i + 1}</span><em>{j.techKeywords[0]}</em></button>)}
      </div>
      <div className="journey-device-note"><span>{current.environment?.device ? `${current.environment.device.toUpperCase()} / PERANGKAT AWAL` : `FASE 0${phase + 1} / ${label(current.phase).toUpperCase()}`}</span><div className="journey-steppers"><button className="icon-button" onClick={() => setPhase(p => Math.max(0, p - 1))} disabled={phase === 0} aria-label="Fase sebelumnya"><ArrowLeft size={16}/></button><button className="icon-button" onClick={() => setPhase(p => Math.min(N - 1, p + 1))} disabled={phase === N - 1} aria-label="Fase berikutnya"><ArrowRight size={16}/></button></div></div>
      <a className="text-link" href={phase < 3 ? '#ecosystem' : '#archive'}>{phase < 3 ? 'Jelajahi tools yang dicoba' : 'Lihat arsip eksperimen'}<ArrowRight size={15}/></a>
      </aside>
      <div className="journey-timeline">{JOURNEY_STEPS.map((j, i) => <details key={j.phase} className={`journey-step ${phase === i ? 'journey-selected' : ''} ${i < phase ? 'journey-done' : ''}`} open={phase === i}><summary onClick={e => { e.preventDefault(); setPhase(i); }}><span className="phase-number">0{i + 1}</span><span><small>{label(j.phase)}</small><h3>{j.title}</h3></span><span className="details-plus" aria-hidden="true">+</span></summary><div className="journey-details"><p className="journey-subtitle">{j.subtitle}</p><p>{j.description}</p><div className="tag-list">{j.techKeywords.map(t => <span key={t}>{t}</span>)}</div>{j.environment && <p className="device-note">Perangkat awal: {j.environment.device} · {j.environment.learning}</p>}</div></details>)}</div>
    </div>
  </div></section>;
}
