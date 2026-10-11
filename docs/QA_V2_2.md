# QA V2.2 — 9 Oktober 2026 (UTC)

## Build dan konten

- `npm run build`: PASS, TypeScript + Vite + prerender lengkap. HTML aplikasi 76.4 KB sebelum CSS/indeks noscript.
- `node --test --test-isolation=none --test-reporter=spec tests/chat.test.mjs`: 7/7 PASS. Mencakup data publik, validasi input, Copilot GET path, riwayat, respons rusak/HTML, rate/size boundary dan timeout.
- Inventaris tetap: 16 proyek, 6 fase, 19 tools/4 kategori, 14 orang, 6 komunitas. Entri proyek/people/komunitas dan tools dipertahankan; copy perjalanan/profile dipoles sesuai file Aboutme.
- Foto pp dan ikon pp-dev asli tetap digunakan. 19 SVG valid, disertakan lokal. Kelima gambar Pinterest dari referensi pengguna tersedia; sumber dan batas atribusi dicatat.

## Browser dan responsive

Production build diuji melalui Chrome cloud, iframe viewport CSS berikut:

| Ukuran | Lebar dokumen vs client | Overflow tak disengaja | Gambar rusak | H1 |
|---|---|---|---|---|
| 360×780 | 360 / 360 | 0 | 0 | 1 |
| 390×844 | 390 / 390 | 0 | 0 | 1 |
| 768×1024 | 753 / 753 (scrollbar 15 px) | 0 | 0 | 1 |
| 1440×900 | 1425 / 1425 (scrollbar 15 px) | 0 | 0 | 1 |

Rak proyek adalah area horizontal yang sengaja scrollable; tidak dihitung sebagai overflow halaman. Anime-card mobile sempat melampaui lebar karena min-height + aspect-ratio; sudah diperbaiki dan audit ulang lulus.

## Interaksi yang diamati

- Splash dialog muncul saat kunjungan awal, lalu hilang; kunjungan ulang sesi yang sama langsung masuk halaman. Skip/Escape dan reduced-motion diimplementasikan; konfigurasi OS reduced-motion tidak diubah untuk pengujian ini.
- Stack: tombol touch/click pada 390 px dan keyboard pada desktop mengubah kelas expanded; tombol tutup mengembalikan stack.
- Journey: memilih fase 3 mengganti layar perangkat, caption menjadi AI Collaboration, dan detail teks fase yang sesuai.
- Orbit: 19 tombol. Memilih Vercel / Codex menampilkan nama, kategori dan deskripsi yang benar. Jeda lokal dan Motion global berganti state. Tidak membutuhkan WebGL.
- Archive: next berpindah 01/16 → 02/16. Detail Tierlist Maker terbuka lengkap; Escape kembali dengan posisi 02/16. Pencarian `repo` menghasilkan Repo Flow saja; reset mengembalikan semua.
- Personal: tiga gambar dan caption cocok; modal Elaina menampilkan deskripsi dan sumber. Duo Kings & Queen tersedia di bawah galeri.
- Video: tanpa menekan play, teramati `paused=false`, `muted=true`, `loop=true`, durasi 20.387007 s dan currentTime maju. Setelah seek melalui kontrol ke 20.3 s, video kembali ke 5.12845 s dengan `paused=false` (loop). Pindah ke hero menghasilkan `paused=true` (offscreen pause).
- Chat: pertanyaan publik melalui UI menghasilkan pesan layanan sementara tidak tersedia + tombol Coba lagi. Tidak ada respons AI palsu.

## Performa dan batas

Fresh warm load 390×844 tanpa resize: LCP 164 ms, CLS 0.0000564, error halaman 0 dari observer harness. Ini bukan Lighthouse, bukan field data, bukan pengujian koneksi lambat. Laporan lama yang mencakup perubahan ukuran viewport tidak dipakai untuk angka CLS final.

Browser ini menonaktifkan WebGL: aksen Three.js hero/FPS GPU tidak terverifikasi. Foto stack, orbit DOM dan semua fungsi inti tetap tampil. Pengujian Safari/iOS, Android fisik, FPS perangkat rendah, dan INP lapangan belum dilakukan. Autoplay browser dapat ditolak; fallback tombol play disediakan.

Live Copilot: probe terotorisasi mendapat HTTP 200 `text/html`, 195 byte “Site Unavailable / Unable to access this site”, bukan JSON AI. Adapter menolak respons itu secara jujur. Respons sukses/follow-up provider nyata belum terverifikasi. Kontrak sukses diperiksa dengan unit test terisolasi.

## Bukti

- `screenshots/v2.2/`: screenshot tampilan nyata desktop/mobile; hanya toolbar QA yang di-crop.
- `screenshots/v2.2/responsive.json` dan `performance-fresh-390.json`: hasil browser.
- `docs/design/og-layout.html` → `public/og-image.jpg`: OG native 1200×630.
- ZIP memuat source dan dist; tidak memuat node_modules, Git, environment rahasia, atau preview server internal.

Paket siap di-import ke Vercel. Tidak ada deployment publik, perubahan DNS, atau pendaftaran Search Console yang dilakukan.
