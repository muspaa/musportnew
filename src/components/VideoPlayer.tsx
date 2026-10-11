import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { VIDEO } from '../data/anime';
export default function VideoPlayer() {
  const video = useRef<HTMLVideoElement>(null); const frame = useRef<HTMLDivElement>(null); const visible = useRef(false);
  const mouseInside = useRef(false);
  const hide = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [muted, setMuted] = useState(true); const [title, setTitle] = useState(false); const [playing, setPlaying] = useState(false); const [error, setError] = useState(false);
  function reveal() { clearTimeout(hide.current); setTitle(true); if (!mouseInside.current) hide.current = setTimeout(() => setTitle(false), 2600); }
  function toggleAudio() {
    const el=video.current;const next=el?!el.muted:!muted;
    if(el){el.muted=next;if(visible.current&&!document.hidden)void el.play().catch(()=>{});}
    setMuted(next);reveal();
  }
  useEffect(() => {
    const el = video.current; const surface = frame.current; if (!el) return;
    const resume = () => {
      if (!visible.current || document.hidden) return;
      if (!el.getAttribute('src')) { el.src = VIDEO.url; el.load(); }
      else if(el.error)el.load();
      void el.play().catch(() => { /* Browser can defer autoplay until its next allowed gesture. */ });
    };
    const io = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting&&entry.intersectionRatio>=.15; if (visible.current) resume(); else el.pause(); }, { threshold: .15 });
    if (frame.current) io.observe(frame.current);
    const change = () => { if (document.hidden) el.pause(); else resume(); };
    const gesture = () => { if (el.paused) resume(); };
    document.addEventListener('visibilitychange', change); surface?.addEventListener('pointerdown', gesture);
    return () => { io.disconnect(); clearTimeout(hide.current); document.removeEventListener('visibilitychange', change); surface?.removeEventListener('pointerdown', gesture); el.pause(); };
  }, []);
  return <div className="video-banner" ref={frame} onPointerEnter={e => { if (e.pointerType === 'mouse') { mouseInside.current = true; clearTimeout(hide.current); setTitle(true); } }} onPointerLeave={e => { if (e.pointerType === 'mouse') { mouseInside.current = false; clearTimeout(hide.current); setTitle(false); } }} onPointerDown={e => { if (e.pointerType !== 'mouse') reveal(); }}>
    <div className="cote-frame"><img className={`video-poster ${playing ? 'poster-hidden' : ''}`} src={VIDEO.poster} alt="Classroom of the Elite" width="1280" height="720" loading="lazy"/><video ref={video} className="cote-video" style={{ transform: `translate(-50%, -50%) rotate(${VIDEO.rotation}deg)` }} autoPlay loop playsInline muted={muted} preload="none" controls={false} disablePictureInPicture disableRemotePlayback aria-label={`Video ${VIDEO.title}, diputar otomatis dan berulang`} onPlaying={() => { setPlaying(true); setError(false); }} onError={() => { setError(true); setPlaying(false); }}/></div>
    <div className={`video-title ${title ? 'video-title-visible' : ''}`}><h3>{VIDEO.title}</h3></div>
    <button className="video-audio" onClick={toggleAudio} onFocus={reveal} aria-pressed={!muted} aria-label={muted ? 'Aktifkan audio video' : 'Bisukan audio video'}>{muted ? <VolumeX size={20}/> : <Volume2 size={20}/>}</button>
    {error && <span className="video-status" role="status">Video sedang tidak tersedia.</span>}
  </div>;
}
