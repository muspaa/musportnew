import { useState } from 'react';
import { Play, Check } from 'lucide-react';
import { PROFILE } from '../data';
import { useStackSequence } from '../hooks/useStackSequence';
import ToolIcon from './ToolIcon';
const technologies = [
  { name: 'React', icon: 'react', role: 'INTERFACE', detail: 'Komponen, state interaksi, dan hydration dari HTML yang sudah diprerender.' },
  { name: 'Vite', icon: 'vite', role: 'BUILD', detail: 'Build produksi, bundling modul, dan pemrosesan aset portofolio.' },
  { name: 'TypeScript', icon: 'typescript', role: 'TYPES', detail: 'Tipe untuk komponen, data proyek, dan interaksi frontend.' },
  { name: 'CSS 3D + WebGL', icon: null, role: 'SPACE', detail: 'Planet, nebula, dan starfield memakai shader WebGL dan Canvas buatan sendiri tanpa library 3D. Karusel proyek, kartu, dan HUD memakai CSS 3D transform.' },
  { name: 'Upstash', icon: 'upstash', role: 'RATINGS', detail: 'Redis melalui REST untuk rating, komentar, dan pembatasan spam saat dikonfigurasi.' },
  { name: 'Node.js', icon: 'nodedotjs', role: 'FUNCTIONS', detail: 'Fungsi serverless untuk endpoint chat dan rating, serta script build/prerender.' },
  { name: 'Vercel', icon: 'vercel', role: 'DEPLOY', detail: 'Target deployment untuk frontend statis dan fungsi API portofolio.' },
  { name: 'REST API', icon: null, role: 'RELAY', detail: 'Fetch ke API chat dan rating; integrasi provider lewat endpoint sederhana.' }
];
const groups = [0, 1, 0, 0, 2, 1, 2, 1], phaseNames = ['Source', 'Build', 'Deploy'];
export default function TechnologyStack({ paused }: { paused: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const { stage, phase, start, running } = useStackSequence(paused);
  return <div className="technology-stack" data-paused={paused} data-flow-phase={phase}>
    <div className="tech-head"><span>BUILT INTO THIS PORTFOLIO</span>
      <div className="tech-pipeline" role="group" aria-label="Alur: Source, Build, Deploy">{phaseNames.map((name, i) => <span key={name} className={phase === i ? 'pipeline-active' : phase > i ? 'pipeline-done' : ''}><i aria-hidden="true"/>{String(i + 1).padStart(2, '0')} / {name.toUpperCase()}</span>)}</div></div>
    <div className="tech-stage" ref={stage}>
      <a className="tech-hub" href={PROFILE.socials[0].url} target="_blank" rel="noopener noreferrer" aria-label="Profil GitHub MUSFA"><ToolIcon name="GitHub"/><strong>GitHub</strong><span>SOURCE / MUSFA</span></a>
      <div className="tech-grid">{technologies.map((t, i) => <button className={`tech-tile ${selected === i ? 'tech-selected' : ''} ${phase === groups[i] ? 'tech-flow-active' : ''}`} key={t.name} onClick={() => setSelected(v => v === i ? null : i)} aria-pressed={selected === i} aria-label={`Peran ${t.name}`}>
        {t.icon ? <ToolIcon name={t.icon === 'nodedotjs' ? 'nodedotjs' : t.name}/> : <svg className="tech-code-symbol" viewBox="0 0 32 32" aria-hidden="true">{i === 3 ? <path d="m11 8-7 8 7 8m10-16 7 8-7 8M18 5l-4 22"/> : <><path d="M5 9h22M5 16h22M5 23h22"/><circle cx="10" cy="9" r="3"/><circle cx="23" cy="16" r="3"/><circle cx="14" cy="23" r="3"/></>}</svg>}
        <span>{t.name}</span><small>{t.role}</small></button>)}</div>
    </div>
    <div className="tech-stack-footer"><div className="tech-description" aria-live="polite"><strong>{selected === null ? 'Under the glass.' : technologies[selected].name}</strong><p>{selected === null ? 'Pilih teknologi untuk melihat perannya. Stack implementasi ini berbeda dari daftar tools yang pernah aku eksplorasi.' : technologies[selected].detail}</p></div>
      <button className="tech-run" onClick={start} disabled={running} aria-label="Putar animasi alur Source, Build, Deploy">{phase === 3 ? <Check size={14}/> : <Play size={14}/>} {running ? phaseNames[phase] : phase === 3 ? 'Putar lagi' : 'Jalankan alur'}</button></div>
    <span className="sr-only" aria-live="polite">{phase === 3 ? 'Alur visual Source, Build, Deploy selesai.' : running ? `Alur visual: ${phaseNames[phase]}.` : ''}</span>
  </div>;
}
