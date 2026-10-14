import { ArrowRight, Download } from 'lucide-react';
import { ECOSYSTEM, JOURNEY_STEPS, PROFILE, PROJECTS } from '../data';
import { Chapter } from './Primitives';

export const CV_URL = '/cv/CV-MUSFA.pdf';
const learning = Array.from(new Set(JOURNEY_STEPS.flatMap(j => j.techKeywords))).filter(k => ['HTML', 'CSS', 'JavaScript', 'AI Collaboration', 'Prompt Engineering', 'Vibe Coding', 'API Integration', 'Cloud Deployment'].includes(k));

/** Bagian 01 (tepat di bawah hero): tentang saya, foto PKL dalam bingkai 3D, dan tombol unduh CV. */
export default function Profile() {
  const toolCount = ECOSYSTEM.reduce((n, g) => n + g.items.length, 0);
  const [lead, ...rest] = PROFILE.bio;
  const facts = [{ value: 'TKJ', label: 'Teknik Komputer Jaringan' }, { value: PROJECTS.length, label: 'Proyek web live' }, { value: toolCount, label: 'Tools dieksplorasi' }, { value: JOURNEY_STEPS.length, label: 'Fase perjalanan' }];
  return <section className="profile section-pad" id="profile" aria-labelledby="profile-title"><div className="wrap profile-grid">
    <div className="profile-visual" data-reveal>
      <div className="portrait-3d" data-tilt="11">
        <span className="portrait-orbit portrait-orbit-a" aria-hidden="true"/><span className="portrait-orbit portrait-orbit-b" aria-hidden="true"/>
        <figure className="portrait-frame"><img src="/images/pp.webp" width={1086} height={1448} alt="Foto MUS saat pkl" loading="lazy" decoding="async"/><span className="portrait-glare" aria-hidden="true"/></figure>
        <div className="portrait-chip portrait-chip-a"><small>CALLSIGN</small><strong>MUSFA</strong></div>
        <div className="portrait-chip portrait-chip-b"><small>PENDIDIKAN</small><strong>SMK · TKJ</strong></div>
      </div>
    </div>
    <div className="profile-copy" data-reveal>
      <Chapter number="01">ABOUT ME / MISSION PROFILE</Chapter>
      <h2 id="profile-title">Self-taught.<br/><em>Always curious.</em></h2>
      <p className="lead">{lead}</p>
      {rest.map(p => <p className="profile-note" key={p}>{p}</p>)}
      <dl className="profile-facts">{facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>
      <div className="tag-group"><small>KEAHLIAN</small><div className="tag-list">{PROFILE.skills.map(k => <span key={k}>{k}</span>)}</div></div>
      <div className="tag-group"><small>SEDANG DIPELAJARI</small><div className="tag-list">{learning.map(k => <span key={k}>{k}</span>)}</div></div>
      <div className="profile-actions"><a className="button button-primary cv-button" href={CV_URL} download="CV-A-Mustofa-Yusuf.pdf"><Download size={18}/>Download CV<small>PDF</small></a><a className="text-link" href="#contact">Hubungi saya<ArrowRight size={16}/></a></div>
    </div>
  </div></section>;
}
