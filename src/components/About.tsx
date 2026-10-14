import { Braces, Smartphone } from 'lucide-react';
import { PROFILE } from '../data';
import { Chapter, Mark } from './Primitives';
import RelayMark from './RelayMark';

export default function About() {
  return <section className="about section-pad" id="about" aria-labelledby="about-title"><div className="wrap about-grid">
    <div data-reveal>
      <Chapter number="03">BEYOND THE CODE</Chapter>
      <h2 id="about-title">How it started.<br/><em>Sedikit konteks.</em></h2>
      <div className="crew-card" data-tilt="10">
        <div className="crew-top"><Mark/><div><small>CREW ID / 001</small><strong>A. MUSTOFA YUSUF</strong></div></div>
        <dl className="crew-rows"><div><dt>CALLSIGN</dt><dd>MUSFA</dd></div><div><dt>ROLE</dt><dd>{PROFILE.role}</dd></div><div><dt>BASE</dt><dd>Indonesia</dd></div><div><dt>STATUS</dt><dd>Learning in progress</dd></div></dl>
        <span className="crew-barcode" aria-hidden="true"/>
      </div>
      <div className="about-values"><span><Smartphone size={18}/>Mobile beginnings</span><span><Braces size={18}/>Learning by building</span><span><RelayMark/>Human × AI</span></div>
    </div>
    <div className="about-copy" data-reveal><p className="lead">{PROFILE.about}</p><p>{PROFILE.motivation}</p><p>{PROFILE.approach}</p></div>
  </div></section>;
}
