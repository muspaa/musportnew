import { useState } from 'react';
import { ArrowUpRight, Menu, Pause, Play, Sun, Moon } from 'lucide-react';
import { PROFILE } from './data';
import { Chapter, ExternalLink, Mark, Modal } from './components/Primitives';
import Cosmos from './components/Cosmos';
import Hero from './components/Hero';
import About from './components/About';
import Archive from './components/Archive';
import Journey from './components/Journey';
import Ecosystem from './components/Ecosystem';
import Certificates from './components/Certificates';
import AiSandbox from './components/AiSandbox';
import Ratings from './components/Ratings';
import SplashScreen from './components/SplashScreen';
import { useMotion } from './hooks/useMotion';
import { useSpaceFx } from './hooks/useSpaceFx';
import { useTheme } from './hooks/useTheme';

const links = [{ id: 'home', name: 'Home' }, { id: 'about', name: 'About' }, { id: 'archive', name: 'Work' }, { id: 'journey', name: 'Journey' }, { id: 'ecosystem', name: 'Tools' }, { id: 'certificates', name: 'Sertifikat' }, { id: 'lab', name: 'Relay' }, { id: 'contact', name: 'Contact' }];
const primary = ['home', 'about', 'archive', 'certificates', 'contact'];

export default function App() {
  const reduced = useMotion(), [motionPaused, setMotionPaused] = useState(false), { theme, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const still = reduced || motionPaused;
  const current = useSpaceFx(!still);
  return <>
    <Cosmos paused={still}/>
    <SplashScreen/>
    <a className="skip-link" href="#main">Lewati ke konten</a>
    <span className="read-progress" aria-hidden="true"/>
    <header className="site-header"><div className="header-inner">
      <a href="#home" className="brand" aria-label="MUSFA, kembali ke awal"><Mark/><span>MUSFA</span></a>
      <nav className="desktop-nav" aria-label="Navigasi utama">{links.filter(l => primary.includes(l.id)).map(l => <a className={current === l.id ? 'nav-active' : ''} href={`#${l.id}`} key={l.id} aria-current={current === l.id ? 'location' : undefined}>{l.name}</a>)}</nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggle} aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button>
        <button className="global-motion" aria-label={motionPaused ? 'Aktifkan animasi halaman' : 'Jeda animasi halaman'} aria-pressed={motionPaused} onClick={() => setMotionPaused(x => !x)}>{motionPaused ? <Play size={16}/> : <Pause size={16}/>}</button>
        <button className="menu-button" onClick={() => setMenu(true)} aria-label="Buka menu navigasi" aria-expanded={menu}><Menu size={22}/></button>
      </div>
    </div></header>
    <nav className="sector-dots" aria-label="Posisi halaman">{links.map(l => <a key={l.id} href={`#${l.id}`} className={current === l.id ? 'active' : ''} aria-label={l.name} aria-current={current === l.id ? 'location' : undefined}><span>{l.name}</span></a>)}</nav>
    {menu && <Modal label="Menu navigasi" onClose={() => setMenu(false)} className="navigation-modal"><p className="eyebrow">MUSFA / EXPLORE THE UNIVERSE</p><nav aria-label="Semua bagian">{links.map((l, i) => <a key={l.id} href={`#${l.id}`} onClick={() => setMenu(false)}><span>{String(i + 1).padStart(2, '0')}</span>{l.name}<ArrowUpRight size={22}/></a>)}</nav></Modal>}
    <main id="main">
      <Hero paused={still}/>
      <Archive still={still}/>
      <About/>
      <Journey/>
      <Ecosystem paused={still}/>
      <Certificates/>
      <AiSandbox/>
      <section className="ethos section-pad" id="ethos" aria-labelledby="ethos-title"><div className="wrap" data-reveal><Chapter number="07">THE ETHOS</Chapter><p className="eyebrow" id="ethos-title">A NOTE TO MYSELF</p><blockquote><span className="ethos-line">“Masih belajar.</span><span className="ethos-line">Masih <em>mencoba.</em>”</span></blockquote><div className="ethos-bottom"><span className="about-signature">MUSFA.</span><p>{PROFILE.ethos}</p></div></div></section>
      <Ratings paused={still}/>
      <footer className="footer section-pad" id="contact"><div className="wrap" data-reveal>
        <p className="eyebrow">IDE, PERTANYAAN, ATAU SEKADAR MENYAPA?</p>
        <div className="footer-heading"><h2>Let’s start<br/><em>a conversation.</em></h2><a href={PROFILE.socials[1].url} className="contact-circle" target="_blank" rel="noopener noreferrer" aria-label="Hubungi MUSFA melalui Telegram"><ArrowUpRight size={34}/></a></div>
        <div className="footer-socials">{PROFILE.socials.map(s => <ExternalLink href={s.url} key={s.name}><span>{s.name}</span><small>{s.handle}</small></ExternalLink>)}</div>
        <div className="footer-bottom"><a href="#home" className="brand"><Mark/><span>MUSFA</span></a><p>© {new Date().getFullYear()} MUSFA OFC.<br/>Catatan proyek dan proses belajar.</p><a href="#home" className="back-top">Kembali ke awal<ArrowUpRight size={16}/></a></div>
      </div></footer>
    </main>
  </>;
}
