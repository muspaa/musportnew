> Laporan historis V2.0. Untuk revisi terbaru baca [QA_V2_1.md](QA_V2_1.md).

# R_HMT V2 — Laporan QA

Pengujian dilakukan 8 Oktober 2026; pengemasan akhir 9 Oktober 2026 WIB. Status di bawah membedakan implementasi, bukti uji, dan keterbatasan lingkungan. Paket siap di-build/import ke Vercel, tetapi belum pernah dideploy dari sesi ini.

## Lingkungan

- Node.js 24.19.0, npm 11.9.0, Vite 6.4.4; TypeScript strict.
- Cloud Chrome 154.0.0.0, user agent melaporkan macOS 10.15.7.
- Pengujian responsive menggunakan iframe same-origin dengan viewport CSS yang ditentukan. Ini bukan pengujian pada empat perangkat fisik.
- WebGL/GPU tidak tersedia di browser ini. Semua screenshot hero/orbit menampilkan fallback yang benar-benar dirender.
- Interaksi diuji pada dev server yang memakai adapter API lokal. Menu dan pencarian/dialog juga diuji ulang pada JavaScript produksi di static preview setelah prerender.

## Build dan kontrak API

| Pemeriksaan | Hasil | Bukti / batas |
| --- | --- | --- |
| `npm ci` dari lockfile | Lulus | Instalasi bersih berhasil |
| `npm run build` | Lulus | TypeScript, Vite, dan prerender berhasil; `build-output.txt` |
| `npm test` | Lulus, 7/7 | `test-output.txt` |
| `npm audit` | 0 temuan | `npm-audit.json`, snapshot pada tanggal pengujian |
| HTML produksi | Lulus | 60.843 byte; satu H1; konten utama sudah dirender; indeks noscript memuat 16 nama proyek |
| Asset references build | Lulus | Semua path gambar/font/bundle yang dirujuk HTML tersedia di dist |
| Rahasia server di bundle | Lulus pemeriksaan terbatas | Nama `CHAT_API_KEY` tidak ditemukan pada JS frontend; env server tidak memakai prefix `VITE_` |
| Hydration React produksi | Lulus smoke test | Menu terbuka/tertutup, pencarian Anime Quote dan dialog bekerja; tidak ada log error React yang ditemukan |
| Deploy Vercel / domain / Google indexing | Belum diuji | Tidak ada deployment atau perubahan DNS dilakukan |

Tes API meliputi profil publik bersama, validasi role/panjang/body, parsing field jawaban, penerusan follow-up, penolakan HTML/JSON invalid/metadata, method/content-type/cross-site/rate limit, dan abort upstream yang menggantung menjadi 504. Fixture sukses bukan bukti layanan AI live berhasil.

## Layout

| Iframe CSS | Lebar konten terukur | Overflow horizontal | Gambar rusak | H1 / section utama |
| --- | ---: | --- | --- | --- |
| 360×780 | 360 px | Tidak ditemukan | 0 | 1 / 9 |
| 390×844 | 390 px | Tidak ditemukan | 0 | 1 / 9 |
| 768×1024 | 753 px | Tidak ditemukan | 0 | 1 / 9 |
| 1440×900 | 1425 px | Tidak ditemukan | 0 | 1 / 9 |

Selisih 15 px pada tablet/desktop adalah scrollbar. Konten diinspeksi pada hero, journey, ecosystem, arsip, chat, jejaring, personal, dan footer. Heading penutup mobile diperbaiki agar “a conversation.” tidak terpecah menjadi baris “a” tersendiri, lalu diperiksa kembali pada 360/390.

`screenshots/capture-meta.json` mencatat geometri pengambilan screenshot. Iframe 768 dan 1440 ditampilkan dengan skala sekitar 0,836 dan 0,933 agar muat pada jendela browser. Ini tidak mengubah viewport CSS internal. Screenshot dicrop hanya untuk membuang toolbar QA; tidak ada render konseptual yang dipasarkan sebagai screenshot produk.

## Interaksi

| Fitur | Status | Yang benar-benar diamati |
| --- | --- | --- |
| Menu mobile / Escape | Diuji | Dialog tampil, ditutup dengan Escape, aria-expanded kembali false dan fokus kembali |
| Anchor dan CTA internal | Diuji | Navigasi menuju bagian terkait; footer dan kembali ke awal tersedia |
| Arsip | Diuji | Pencarian Anime Quote, hasil kosong/reset, seluruh 16 karya, kembali ke 4 pilihan, detail dialog dan Escape |
| Kelompok tools | Diuji | Node Codex memilih Builders; ArrowRight memilih Infrastructure; semua kategori dapat diakses lewat teks |
| Journey | Diuji | Enam fase tersedia, detail memakai accordion native |
| Orang / komunitas | Diuji | Seluruh 14 orang dapat ditampilkan; dialog komunitas memuat data sumber dan status belum terverifikasi |
| Anime | Diuji | Tiga karakter tampil; detail Elaina terbuka |
| Chat live | Terblokir upstream | Pertanyaan “Siapa R_HMT?” menghasilkan error jujur dan tombol coba lagi; pesan/error terbaca, clear bekerja |
| AI success / general Q&A / follow-up live | Belum terbukti | Adapter meneruskan konteks sesuai fixture, tetapi penyedia tidak memberi jawaban valid dari lingkungan ini |
| Video asli | Diuji | 720×1280, durasi 20,387 detik, readyState 4, play/pause, mute/unmute dan seek ke 0,1 detik |
| Orientasi video | Diuji visual | CSS translate + rotate(-90deg), frame 16:9, gambar upright dan kontrol horizontal |
| Auto-pause video | Diuji | Setelah berpindah ke hero, video berhenti; currentTime sekitar 0,532 detik |
| Fullscreen cadangan | Diuji | Request native ditolak lingkungan; kelas video-expanded memenuhi iframe 390×844, kontrol tutup bekerja |
| Native fullscreen / Safari iOS | Belum diuji | Memerlukan browser/perangkat pendukung |
| Video error/retry, offline UI, clipboard | Implemented; belum diuji lengkap | Handler tersedia; tidak ada simulasi jaringan/clipboard end-to-end yang diklaim lulus |
| WebGL fallback | Diuji | Poster dan daftar/kontrol teks tetap berfungsi tanpa canvas |
| 3D GPU, FPS, pointer depth, scroll reaction | Implemented; belum terverifikasi visual | Geometri/renderer ada, tetapi browser QA tidak mendukung WebGL2 |
| Reduced motion, save-data, low-memory | Implemented; source-reviewed | Cabang adaptasi tersedia; tidak diklaim telah diuji pada hardware nyata |
| Kontak | Source-reviewed | Tautan langsung, tanpa form fake-success; endpoint lama mengembalikan 410 |

## Kinerja

Bundle produksi: CSS 54,33 kB (12,39 kB gzip); JS utama 260,80 kB (81,19 kB gzip); engine 9,45 kB (3,99 kB gzip); Three.js 513,24 kB (130,00 kB gzip). Engine/Three di-load dinamis ketika scene mendekati viewport, bukan menjadi syarat render teks/poster pertama.

Vite memberi warning chunk Three.js >500 kB. Build tetap berhasil; warning dipertahankan. DPR dibatasi, rendering dihentikan di luar viewport/tab tersembunyi, dan tidak ada video download sebelum play.

Pengukuran PerformanceObserver bukan Lighthouse atau Core Web Vitals lapangan:

- Dev preview, reload dengan cache hangat, iframe 390×844: LCP tercatat 220 ms, CLS 0, error runtime yang ditangkap 0. Raw capture: `screenshots/browser-metrics-initial.json`.
- Static production preview, reload berikutnya: LCP 136 ms, CLS 0,002524; tidak ditemukan error runtime yang ditangkap. Pengukuran awal saat berpindah dari dev ke production mencatat CLS 1,002524, sehingga hasil belum cukup untuk menyatakan gate CLS/cold-load lulus.
- Angka selama rangkaian resize/scroll tidak dipakai sebagai metrik loading. Tidak dilakukan network throttling, Lighthouse, FPS benchmark, atau pengujian Android fisik.

## Konten dan sumber

16 proyek, 6 fase journey, 19 tools/4 grup, 14 orang, 6 komunitas dipertahankan. Pemeriksaan HTTP proyek menemukan 11 halaman yang merespons, tetapi fitur intinya tidak diuji, sehingga tetap `ONLINE_UNVERIFIED`. Dua URL 404 dan tiga entri tanpa URL menjadi `ARCHIVED`. Detail ada di `link-audit.json`.

Pixcraft dan Dewa Store tetap sebagai kandidat belum diterbitkan; data baru belum diverifikasi untuk portofolio ini. Tidak ada angka pengguna, status live, atau hasil bisnis yang dibuat-buat. Gambar anime merupakan referensi resmi dengan catatan hak, bukan aset bebas lisensi.

## Handoff

- Source, lockfile, aset, functions, konfigurasi Vercel, hasil static build, screenshot, dan dokumentasi termasuk dalam ZIP.
- Tidak menyertakan node_modules, file env rahasia, cache, atau server preview sementara.
- Setelah deploy, prioritas verifikasi: `/api/health`, satu chat dan follow-up nyata, tampilan 3D pada perangkat WebGL2, native fullscreen mobile, dan cold-load performance pada domain final.
- Seluruh fitur tidak diklaim lulus: keterbatasan AI, GPU, perangkat fisik, dan performance di atas tetap berlaku.
