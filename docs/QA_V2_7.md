# QA V2.7 — 10 Oktober 2026

Visual yang telah disetujui dipertahankan. Fokus revisi: choreography intro, jalur stack kaca, interaksi foto/teknologi/Journey, dan tiga rating contoh.

## Hasil pemeriksaan

- TypeScript dan build Vite/prerender berhasil.
- 52 tes lulus, 0 gagal. Tiga tes baru memeriksa progres intro ketika aset cached, kesiapan terlambat/deadline, dan reduced motion. Tes backend/Lua tetap lulus; sebagian tes geometri berasal dari renderer historis dan tidak membuktikan layout CSS aktif.
- Seluruh 117 file public, 4 API, dan 3 file shared dari V2.6.1 dipertahankan byte-identik. Isi: 18 proyek, 6 fase, 19 tools, 14 orang, 5 komunitas.
- HTML produksi: satu H1, tidak ada ID duplikat, 65 referensi aset lokal tersedia, 47 SVG valid XML, JSON-LD valid, robots/sitemap tersedia, dan OG persis URL pengguna.
- Tiga rating contoh lima bintang tersedia pada HTML prerender dan rail horizontal. Label Contoh ditampilkan. Nilai contoh tidak masuk Redis atau aggregate rating pengunjung.
- Tidak ada dependency baru, world WebGL baru, atau env wajib ketiga. `.env.example` berisi hanya dua nilai Upstash.
- Timer alur visual mempunyai cleanup dan pembekuan durasi saat offscreen, tab hidden, intro/dialog, serta motion pause. Swipe foto hanya mengambil intent horizontal >45px; vertical scroll tetap native. Panah keyboard memindahkan fokus ke foto depan baru.
- Garis stack dipotong pada tepi node/hub melalui SVG mask; transform keseluruhan tetap mengikuti pointer. Kartu menggunakan gradient kaca di atas dasar solid. Avatar intro berada pada lapisan depan panel.

Data ukuran bundle dan detail pelestarian tersedia di `static-validation-v2.7.json`. Build log tersedia; test log adalah ringkasan output yang benar-benar diamati.

## Batas verifikasi

Browser yang didukung workflow tidak tersedia, sehingga belum ada pengukuran FPS, screenshot runtime, pengujian swipe pada perangkat nyata, atau rekaman video. Mengikuti [Sites SKILL.md](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md): “If `$control-browser` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.”

Belum deploy ke Vercel, belum mengajukan Google Search Console, dan belum memverifikasi Upstash/Nexray dengan akun produksi. Source dan dist siap untuk langkah deploy yang dijelaskan di README. Canonical lokal memakai fallback rhmt.biz.id; saat build Vercel, hostname production dipilih otomatis jika env domain custom tidak diisi. Index Google tidak dijamin oleh metadata.
