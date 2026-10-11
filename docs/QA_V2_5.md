# QA — R_HMT V2.5

Tanggal: 10 Oktober 2026. Hasil ini untuk source dan build yang ada dalam paket Vercel terbaru.

## Pemeriksaan yang lulus

- TypeScript dan production build/prerender selesai tanpa error.
- 42 tes lulus, tanpa failure, skip, atau cancellation; log lengkap tersedia di `test-output-v2.5.txt`.
- Empat tes baru menguji seluruh 19 target orbit selama putaran, momentum konsisten 30/60/120 Hz, penghentian animasi berdasarkan state/visibility, dan rail yang terbatas.
- Native shelf dan backend memakai suite yang sudah ada. Tes geometri Three.js lama tetap lulus untuk source historis; bukan bukti visual CSS baru.
- 16 karya, enam fase, 19 tools, 14 orang, enam komunitas. Semua karya dan orang juga masuk HTML/indeks tanpa JavaScript.
- 102 aset publik lama tetap byte-identik. Empat API serta adapter knowledge tetap identik. Source foto/avatar, karakter, video, dan tautan sosial dipertahankan.
- Perubahan `content.json` hanya mengganti “nggak” menjadi “tidak”. About dan motivasi dirapikan mengikuti sumber pengguna; fakta personal, Oppo A3s, tugas kelas 10 P5, dan pemicu awal tetap tersedia.
- Satu H1, tanpa ID duplikat, tanpa aset lokal hilang, 38 SVG publik valid.
- Satu video dengan autoplay, muted, loop; tidak ada native controls. Source/rotasi tetap sama.
- Badge versi dihapus; intro tersedia pada prerender dan tidak memakai session gating/deep-link skip.
- Kings & Queen memakai image contain; source image utuh tersedia. Ini pemeriksaan source, belum screenshot browser.
- Entry aktif tidak mengimpor Three.js/world. Build menghasilkan satu file JS; seluruh latar memakai aset WebP lokal.

## Ukuran transfer

Perbandingan menggunakan gzip dari bytes ZIP sebelumnya dan build baru, bukan hasil browser.

| JS runtime | Sebelumnya | Sekarang |
| --- | ---: | ---: |
| Total gzip, semua chunk JS | 226.25 KB | 88.12 KB |
| Jumlah chunk | 3 | 1 |

Pengurangan sekitar 61%. CSS baru terkompresi sekitar 14.3 KB menurut Vite. Latar dark: 41.9 KB pada 960 px dan 96.4 KB pada 1680 px. Latar light: 47.4 KB dan 105.4 KB. Browser memilih ukuran melalui media query; sumber PNG hanya berada dalam dokumentasi.

Orbit memakai transform, batched bounds, observer, serta loop lokal sekitar 30 pembaruan per detik ketika terlihat dan aktif. Backdrop blur dibatasi ke header/dialog. Ini menjelaskan pembatasan biaya dalam source; tidak membuktikan FPS pada HP.

## Verifikasi yang belum dilakukan

- Screenshot/QA tampilan desktop, tablet, HP fisik, dan runtime gesture.
- FPS, GPU, Lighthouse, layout browser, izin autoplay/audio nyata.
- Database Upstash live dan respons Nexray live.
- Deployment publik Vercel.

Browser QA yang diwajibkan workflow tidak tersedia. [Sites SKILL.md](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) menyatakan: “If `$control-browser` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Tidak ada server preview/browser alternatif yang dibuat. Tidak ada klaim kemiripan 100%, FPS tertentu, atau hasil pengujian visual aktual.

Referensi `docs/design/glass/*-reference.png` adalah acuan. Background hasil imagegen dan OG adalah aset/artwork, bukan screenshot implementasi. Screenshot lama di dokumentasi diberi konteks historis dalam README.

## Bukti

- `build-output-v2.5.txt`
- `test-output-v2.5.txt`
- `static-validation-v2.5.json`
- `runtime-size-v2.5.json`
- `design/glass/ASSETS.md` untuk prompt dan aset

Deploy memakai panduan README. Rating membutuhkan dua env Upstash; paket tidak menyertakan token. Canonical masih `https://rhmt.biz.id/`.

