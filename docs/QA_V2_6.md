# QA V2.6 — 10 Oktober 2026

## Pemeriksaan yang dilakukan

- `npm run build` berhasil (TypeScript check, Vite production, SSR prerender).
- `npm test`: **46 lulus, 0 gagal**. Empat tes tambahan menguji progress cover/reversibility, pin hero HP panjang, prioritas origin canonical, dan penolakan canonical invalid. Tes API/rating/rail dan geometri historis juga tetap lulus; tes geometri Three.js lama bukan bukti tampilan scene CSS baru.
- HTML prerender: 18 proyek, 6 journey, 19 tools, 14 orang, 5 komunitas; satu H1, tanpa ID ganda, 65 referensi lokal tanpa aset hilang, 47 SVG dapat diparse.
- 106 aset publik V2.5 byte-identical; perubahan aset lama hanya sitemap yang diminta untuk SEO. Foto/avatar asli, seluruh gambar karakter, dan Kings & Queen identik. Empat file API byte-identical.
- JSON-LD valid dan canonical/OG URL/robots/sitemap cocok. Banner pengguna HTTP 200, JPEG 1734×907; kedua social image tags memakai URL persis tersebut.
- Satu video SSR, autoplay/loop/muted/playsinline, tanpa native controls. Fungsi autoplay/audio belum diuji di browser.
- Runtime graph 29 source files tidak mengimpor Three.js. JavaScript gzip 91,834 bytes (V2.5 88,124), tambahan sekitar 3.7 KB untuk interaksi baru. Ini ukuran bundle komputasional, bukan pengukuran FPS/kecepatan HP.
- Situs dan bundle proyek diperiksa lewat HTTP GET; fungsi upload, API kartu, pembayaran/aktivasi, dan penyimpanan finansial tidak dioperasikan. `ONLINE_UNVERIFIED` tidak mengklaim backend lulus.

## Batas verifikasi dan video preview

Browser control yang diizinkan tidak tersedia. Skill Sites (`skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md`) menyatakan: “If `$control-browser` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Maka tidak menjalankan server preview, browser alternatif, screenshot browser, atau rekaman kursor. **Video preview satu menit tidak dibuat**, bukan diganti dengan animasi mockup yang berpura-pura sebagai rekaman website.

Belum ada bukti runtime browser untuk FPS, posisi aktual semua breakpoint, transisi sticky di Safari/Android, ketepatan hit area stack, autopan komentar, audio/video, atau pointer tilt. Review kode, geometri numerik, dan HTML tidak menggantikan pengecekan tersebut. Koneksi Upstash/Nexray live juga belum diverifikasi.

Tidak melakukan deploy, DNS, join komunitas, atau pengajuan Google Search Console. GSC perlu akses akun/properti milik pengguna; langkah konkret ada di `SEO_DEPLOY.md`.

Hasil mesin: `static-validation-v2.6.json`, log build, dan log test. Dokumen versi sebelumnya tetap sebagai riwayat, bukan hasil validasi V2.6.
