import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Award } from 'lucide-react';
import { CERTIFICATES, CERTIFICATE_CATEGORIES, HAS_REAL_CERTIFICATES } from '../data';
import type { Certificate } from '../types';
import { Chapter, ExternalLink, Modal } from './Primitives';

/** Sisi depan sertifikat: gambar asli jika ada, kalau tidak atau gagal dimuat, kertas sertifikat buatan CSS. */
function CertFace({ cert, contain = false }: { cert: Certificate; contain?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (cert.image && !failed) return <div className={`cert-face cert-photo ${contain ? 'cert-contain' : ''}`}><img src={cert.image} alt={`Sertifikat ${cert.title} dari ${cert.issuer}`} loading="lazy" onError={() => setFailed(true)}/></div>;
  return <div className="cert-face cert-paper" role="img" aria-label={`Sertifikat ${cert.title}, ${cert.issuer}, ${cert.year}`}>
    <span className="cert-seal" aria-hidden="true"><Award size={22}/></span>
    <small>{cert.category.toUpperCase()}</small><strong>{cert.title}</strong><span className="cert-line" aria-hidden="true"/><em>{cert.issuer}</em><b>{cert.year}</b>
    {cert.demo && <span className="cert-ribbon">CONTOH</span>}
  </div>;
}

export default function Certificates() {
  const [filter, setFilter] = useState('all'), [open, setOpen] = useState<number | null>(null);
  const categories = useMemo(() => CERTIFICATE_CATEGORIES.filter(c => CERTIFICATES.some(x => x.category === c)), []);
  const list = CERTIFICATES.filter(c => filter === 'all' || c.category === filter);
  const active = open === null ? null : list[open] ?? null;
  const step = (d: number) => setOpen(i => (i === null ? null : (i + d + list.length) % list.length));
  return <section className="certificates section-pad" id="certificates" aria-labelledby="certificates-title"><div className="wrap">
    <div data-reveal><Chapter number="05">THE TROPHY ORBIT / SERTIFIKASI & LAINNYA</Chapter>
      <div className="section-heading"><h2 id="certificates-title">Galeri sertifikasi.<br/><em>Bukti langkah kecil.</em></h2><p>Sertifikasi, pelatihan, penghargaan, dan dokumen lain yang aku kumpulkan sepanjang perjalanan belajar. Klik kartu untuk melihatnya lebih besar.</p></div></div>
    <div className="archive-toolbar" data-reveal><div className="filter-list" role="group" aria-label="Filter sertifikat"><button className={filter === 'all' ? 'active' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>Semua</button>{categories.map(c => <button key={c} className={filter === c ? 'active' : ''} aria-pressed={filter === c} onClick={() => setFilter(c)}>{c}</button>)}</div><span className="micro-note cert-count" role="status">{list.length} DOKUMEN</span></div>
    {!HAS_REAL_CERTIFICATES && <p className="cert-demo-note" data-reveal>Tampilan contoh. Sertifikat asli ditambahkan lewat <code>shared/certificates.json</code>; kartu contoh otomatis hilang setelah itu.</p>}
    <div className="cert-grid">{list.map((c, i) => <button key={c.id} type="button" className="cert-card" data-tilt="12" data-reveal style={{ transitionDelay: `${Math.min(i, 8) * 60}ms` }} onClick={() => setOpen(i)} aria-label={`Lihat sertifikat ${c.title}`}>
      <CertFace cert={c}/>
      <span className="cert-glare" aria-hidden="true"/>
      <span className="cert-meta"><span><strong>{c.title}</strong><small>{c.issuer} · {c.year}</small></span><ArrowUpRight size={18}/></span>
    </button>)}</div>
    {active && <Modal label={`Sertifikat ${active.title}`} onClose={() => setOpen(null)} className="cert-modal">
      <CertFace cert={active} contain/>
      <div className="cert-info"><p className="eyebrow">{active.category.toUpperCase()} · {active.year}</p><h2>{active.title}</h2><p className="modal-summary">Diterbitkan oleh {active.issuer}.{active.note && !active.demo ? ` ${active.note}` : ''}</p>
        <div className="work-actions">{active.url && <ExternalLink href={active.url} className="visit-button">Verifikasi kredensial</ExternalLink>}{list.length > 1 && <div className="cert-nav"><button className="icon-button" onClick={() => step(-1)} aria-label="Sertifikat sebelumnya"><ArrowLeft size={18}/></button><span>{String((open ?? 0) + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span><button className="icon-button" onClick={() => step(1)} aria-label="Sertifikat berikutnya"><ArrowRight size={18}/></button></div>}</div></div>
    </Modal>}
  </div></section>;
}
