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
          <figure className="porthole"><span className="porthole-ring" aria-hidden="true"/><img src="/images/pp.webp" width={762} height={960} alt="Foto MUS saat pkl" fetchPriority="high"/><figcaption><strong>MUS</strong><span>Developer · Explorer</span></figcaption></figure>
          <div className="hud-chip chip-exploring"><Braces size={18}/><div><small>CURRENTLY EXPLORING</small><span>Web development<br/>& AI creative tech</span></div><ArrowUpRight size={15}/></div>
          <div className="hud-chip chip-location"><span aria-hidden="true" className="indonesia-flag"/><div><strong>INDONESIA</strong><span>Learning by building.</span></div></div>
          <p className="hero-universe-note">Different tools.<br/>Same curiosity.</p>
        </div>
      </div>
    </div>
    <a className="scroll-note" href="#archive"><ArrowDown size={14}/><span>EXPLORE AT YOUR OWN PACE</span></a>
  </section>;
}
