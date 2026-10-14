import { ArrowDown, ArrowRight, ArrowUpRight, Braces } from 'lucide-react';
import { ECOSYSTEM, PROJECTS } from '../data';
import Planet from './Planet';

export default function Hero({ paused }: { paused: boolean }) {
  const toolCount = ECOSYSTEM.reduce((n, g) => n + g.items.length, 0);
  return <section className="hero" id="home" aria-labelledby="hero-title">
    <div className="wrap hero-grid">
      <div className="hero-copy">
        <p className="hero-eyebrow"><span className="tiny-square" aria-hidden="true"/>A PERSONAL DIGITAL ARCHIVE</p>
        <h1 id="hero-title">Learning<br/><em>in Progress.</em></h1>
        <p className="hero-description">saya A. mustofa yusuf. Belajar web development lewat proyek, eksperimen, dan kolaborasi bersama AI. Masih mencari pendekatan yang paling masuk akal, tapi selalu ingin berkembang.</p>
        <div className="hero-cta"><a className="button button-primary" href="#archive">Jelajahi karya<ArrowRight size={16}/></a><a href="#journey" className="text-link">Baca perjalanan<ArrowRight size={16}/></a></div>
        <div className="hero-inventory" aria-label="Isi portofolio">
          <a href="#archive"><strong>{PROJECTS.length}</strong><span>Karya & eksperimen</span></a>
          <a href="#ecosystem"><strong>{toolCount}</strong><span>Tools yang dicoba</span></a>
          <a href="#journey"><strong aria-hidden="true">∞</strong><span>Masih belajar<span className="sr-only">, perjalanan yang terus berlanjut</span></span></a>
        </div>
        <div className="hero-identity"><span className="identity-line"/><div><strong>SELF-TAUGHT. ALWAYS CURIOUS.</strong><span>A. mustofa yusuf</span></div></div>
      </div>
      <div className="hero-stage" data-tilt="9">
        <div className="hero-stage-inner">
          <Planet paused={paused}/>
          <div className="moon-orbit" aria-hidden="true"><div className="moon-spin"><div className="moon"><img className="moon-body" src="/images/moon.webp" width={720} height={720} alt="" decoding="async"/></div></div></div>
          <div className="satellite-orbit" aria-hidden="true"><div className="satellite-spin"><div className="satellite"><div className="satellite-body"><svg viewBox="0 0 64 40" width="88" height="55"><path d="M32 10V3" stroke="#c9d0ff" strokeWidth="1.4"/><circle cx="32" cy="2.6" r="1.8" fill="#ffb86b"/><rect x="24" y="10" width="16" height="20" rx="3" fill="#dfe3ff" stroke="#8fdcff"/><rect x="27" y="14" width="10" height="5" rx="1" fill="#3fd8f7"/><g fill="#2a3fa8" stroke="#8fdcff" strokeWidth="1"><rect x="1.5" y="12" width="20" height="16" rx="1.5"/><rect x="42.5" y="12" width="20" height="16" rx="1.5"/></g><path d="M22 20h2M40 20h2M8 12v16M14 12v16M1.5 20h20M49 12v16M55 12v16M42.5 20h20" stroke="#8fdcff" strokeWidth=".7" fill="none"/></svg></div></div></div></div>
          <figure className="porthole"><span className="porthole-ring" aria-hidden="true"/><img src="/images/pp-avatar.webp" width={512} height={512} alt="Foto MUS saat pkl" fetchPriority="high"/><figcaption><strong>MUS</strong><span>Developer · Explorer</span></figcaption></figure>
          <div className="hud-chip chip-exploring"><Braces size={18}/><div><small>CURRENTLY EXPLORING</small><span>Web development<br/>& AI creative tech</span></div><ArrowUpRight size={15}/></div>
          <div className="hud-chip chip-location"><span aria-hidden="true" className="indonesia-flag"/><div><strong>INDONESIA</strong><span>Learning by building.</span></div></div>
          <p className="hero-universe-note">Different tools.<br/>Same curiosity.</p>
        </div>
      </div>
    </div>
    <a className="scroll-note" href="#profile"><ArrowDown size={14}/><span>EXPLORE AT YOUR OWN PACE</span></a>
  </section>;
}
