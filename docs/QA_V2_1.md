# QA — R_HMT V2.1 / Origin

Tanggal: 9 Oktober 2026 WIB. Revisi ini memperbarui source V2, bukan mengganti isi portofolio dengan data baru.

## Terverifikasi

- Build produksi: TypeScript + Vite + prerender berhasil, tanpa error build. HTML memuat stylesheet hasil build secara inline agar tampilan awal sudah bergaya sebelum hidrasi.
- 7 pengujian API lulus: sumber publik, validasi, parsing jawaban, konteks percakapan, kegagalan upstream, batas request/rate limit, timeout. Lihat `test-output.txt`.
- Konten tetap: 16 proyek, 6 fase perjalanan, 19 tools / 4 kategori, 14 orang, 6 komunitas. File shared/content.json dan shared/profile.json tidak diubah pada revisi visual ini.
- Screenshot diambil dari build produksi yang diprerender, kemudian hanya dipotong untuk menghilangkan toolbar QA. Bukan gambar konsep.
- 360×780, 390×844, 768×1024, 1440×900: tidak ada horizontal overflow, tidak ada gambar rusak, satu H1, sembilan section utama. Tablet/desktop menggunakan scrollbar browser 15px.
- Identitas header/footer/orbit memakai turunan pp-dev.png asli. Hero memakai pp.png asli melalui pp.webp, dengan crop/framing CSS. Foto tidak diregenerasi.
- Menu interaktif setelah hidrasi; pencarian Anime Quote menghasilkan satu karya; reset memperlihatkan 16 karya; mode pilihan kembali empat karya; dialog proyek berfungsi.
- Node Codex membuka Builders, ArrowRight membuka Infrastructure. Detail journey bisa dibuka melalui Enter. Seluruh 14 orang dapat ditampilkan. Dialog Elaina dapat dibuka/ditutup.
- Tombol Motion mengubah keadaan jeda; input Mutasi mengaktifkan tombol kirim saat ada isi.
- Pemuatan akhir 390px pada browser QA tanpa throttling: LCP 224ms, CLS 0.004874, error halaman 0. Data mentah: `screenshots/v2.1/final-initial-metrics.json`. Ini satu sampel warm/QA, bukan klaim performa lapangan atau Lighthouse.

## Implementasi motion

Hero: susunan panel foto dengan perspektif CSS, tilt pointer ringan, lapisan frame Three.js, floating panel, scroll parallax. Perjalanan: vignette ponsel, garis progress, progressive disclosure. Halaman: progress baca, reveal section, hover karya, galeri berperspektif. Orbit: empat lintasan dan kedalaman WebGL; node HTML tetap fokusable. Semua dapat dijeda secara global; prefers-reduced-motion dihormati. Render WebGL berhenti saat tak terlihat atau tab tersembunyi.

## Batas pengujian

- Browser QA tidak menyediakan WebGL2: screenshot memperlihatkan fallback. Render GPU nyata, ketepatan framing kamera 3D dan FPS masih perlu diuji pada perangkat nyata; tidak diklaim lulus.
- Reduced-motion diimplementasikan, tetapi belum diuji lewat pengaturan OS nyata.
- Adapter Nexray tidak diubah. Pengujian API memakai fixture; respons AI live sukses belum terverifikasi. Preview static tidak menjalankan fungsi API. Audit V2 sebelumnya mendapatkan error upstream yang ditampilkan secara jujur.
- Video/rotasi/controls dipertahankan; hasil playback V2 terdokumentasi di QA_REPORT.md. Playback jaringan tidak diuji ulang pada revisi visual ini.
- Preview dev awal pada lingkungan terkelola sempat kosong; QA akhir memakai build produksi, termasuk hidrasi dan interaksi. npm run dev pada perangkat pengguna belum diuji.
- Belum deploy ke akun Vercel pengguna. Konfigurasi Vite/dist dan fungsi API Vercel dipertahankan. Belum ada URL publik baru.
- INP, Lighthouse mobile throttled, cold-load produksi, Safari/iOS dan Android perangkat nyata belum diuji.

## Lokasi screenshot

`docs/screenshots/v2.1/`: home empat ukuran, desktop orbit/arsip/personal, mobile lab/footer. Berkas screenshot V2.0 tetap dipertahankan sebagai riwayat dan tidak menjadi bukti revisi terbaru.
