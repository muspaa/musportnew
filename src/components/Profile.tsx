import { ArrowRight, Download } from 'lucide-react';
import { ECOSYSTEM, JOURNEY_STEPS, PROJECTS } from '../data';
import { Chapter } from './Primitives';

export const CV_URL = '/cv/CV-MUSFA.pdf';
const keywords = Array.from(new Set(JOURNEY_STEPS.flatMap(j => j.techKeywords))).slice(0, 12);

/** Bagian 05: tentang saya, foto PKL dalam bingkai 3D, dan tombol unduh CV. */
export default function Profile() {
  const toolCount = ECOSYSTEM.reduce((n, g) => n + g.items.length, 0);
  const facts = [{ value: PROJECTS.length, label: 'Proyek web live' }, { value: toolCount, label: 'Tools dieksplorasi' }, { value: JOURNEY_STEPS.length, label: 'Fase perjalanan' }, { value: '10', label: 'Kelas pertama kali membuat website' }];
  return <section className="profile section-pad" id="profile" aria-labelledby="profile-title"><div className="wrap profile-grid">
    <div className="profile-visual" data-reveal>
      <div className="portrait-3d" data-tilt="11">
        <span className="portrait-orbit portrait-orbit-a" aria-hidden="true"/><span className="portrait-orbit portrait-orbit-b" aria-hidden="true"/>
        <figure className="portrait-frame"><img src="/images/pp.webp" width={1086} height={1448} alt="Foto MUS saat pkl" loading="lazy" decoding="async"/><span className="portrait-glare" aria-hidden="true"/></figure>
        <div className="portrait-chip portrait-chip-a"><small>CALLSIGN</small><strong>MUSFA</strong></div>
        <div className="portrait-chip portrait-chip-b"><small>STATUS</small><strong>Learning in progress</strong></div>
      </div>
    </div>
    <div className="profile-copy" data-reveal>
      <Chapter number="05">ABOUT ME / MISSION PROFILE</Chapter>
      <h2 id="profile-title">Self-taught.<br/><em>Always curious.</em></h2>
      <p className="lead">Aku A. Mustofa Yusuf, atau MUSFA. Belajar web development dari nol lewat proyek nyata, eksperimen, dan kolaborasi bersama AI.</p>
      <p className="profile-note">Tidak ada tim dan tidak ada klaim berlebihan. Setiap proyek di arsip bisa dibuka dan dicoba langsung; CV di bawah merangkum perjalanan, proyek, dan tools yang aku pelajari.</p>
      <dl className="profile-facts">{facts.map(f => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>
      <div className="tag-list" aria-label="Teknologi dan topik yang dipelajari">{keywords.map(k => <span key={k}>{k}</span>)}</div>
      <div className="profile-actions"><a className="button button-primary cv-button" href={CV_URL} download="CV-A-Mustofa-Yusuf.pdf"><Download size={18}/>Download CV<small>PDF</small></a><a className="text-link" href="#contact">Hubungi aku<ArrowRight size={16}/></a></div>
    </div>
  </div></section>;
}
