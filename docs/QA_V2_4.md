# QA V2.4 — 10 Oktober 2026, Asia/Jakarta

Pengembangan mengikuti konsep tech cerah yang disetujui. Susunan bagian, isi portofolio, foto/avatar asli, galeri karakter, video banner dengan satu kontrol audio, Relay, serta sistem rating tetap dipertahankan.

## Perubahan implementasi

- Splash: avatar lingkaran di dalam bezel mesh chrome/ceramic dan arc blue fisik; rakitan fragmen, kesiapan renderer/fallback, dan exit tetap terhubung.
- Hero: UV crop pada tekstur foto asli, urutan masuk empat frame, inventaris sesuai sumber data, readout Vibe coding, serta frame Elaina dari aset galeri. Tidak dibuat potret pengganti.
- Journey: ponsel asal, laptop dengan engsel, keyboard/trackpad, dua set layar sesuai fase, dan enam modul 3D yang berubah susunan. Kamera mengikuti posisi section; detail perjalanan tetap elemen HTML.
- Orbit: empat TubeGeometry rail, runner sphere, tile berketebalan, dan material rail sesuai kategori. Seluruh 19 logo serta target klik yang terproyeksi tetap digunakan.
- My Work: posisi/kecepatan scroll horizontal mengatur yaw/depth frame; karya yang fokus bergerak ke depan. Slider posisi native melengkapi swipe, drag, keyboard, serta panah.
- Room: shader sinyal berjalan pada sambungan lantai, panel kaca yang berubah sudut, serta kamera berdasarkan chapter. Motion off/reduced motion menghentikan gerak idle; save-data tidak menambah loop kontinu khusus room.
- Fallback: stage tidak menyembunyikan gambar native sebelum teksturnya siap; kegagalan loading mempertahankan fallback. Pembacaan bounds dibatch sebelum style target klik diperbarui; adaptive DPR resize tidak menjadwalkan loop render kedua. Statistik renderer menjumlahkan seluruh viewport per frame.

## Pemeriksaan

- TypeScript diperiksa melalui production build. Build Vite/prerender dijalankan; log `build-output-v2.4.txt`.
- `npm test`: 28 tes, terdiri dari 24 tes sebelumnya dan empat tes choreography; log `test-output-v2.4.txt`.
- Tes numerik menggunakan geometri/matriks Three.js aktual dengan bounding model konservatif. Workspace/engsel/modul/platform melalui chapter transitions, kamera pada lebar stage 284–570 px, work frame pada aspect ratio 1.46/1.64/1.9, serta kombinasi fokus, pointer dan kecepatan swipe diperiksa terhadap frustum.
- Tes awal menemukan ujung platform dan tepi work frame di luar frustum. Ukuran fit kamera diperbaiki; semua kombinasi yang diuji kemudian lolos.
- Data shared dan API dibandingkan byte per byte dengan paket V2.3.1: 16 karya, enam fase, 19 tools, 14 orang, enam komunitas. Seluruh 102 file public dibandingkan dengan baseline yang sama.
- HTML prerender, referensi aset lokal, SVG, rahasia dalam bundle, versi paket, dan integritas ZIP diperiksa. Hasil `static-validation-v2.4.json` serta `CONTENT_PRESERVATION.json`.

## Batas verifikasi

Browser QA yang diwajibkan workflow belum tersedia. [Sites SKILL.md](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) menyatakan: “If `$control-browser` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Karena itu tidak dibuat preview server, browser alternatif, atau screenshot V2.4.

Tes numerik memeriksa framing, batas gerak, dan kontrak kode. Tes tersebut tidak membuktikan layout browser, hasil material/refleksi, shader pada GPU, kemiripan 100% dengan gambar konsep, FPS perangkat, touch fisik, autoplay/audio, dan recovery context aktual. Semua ini masih membutuhkan QA browser/perangkat.

Gambar konsep dan artwork OG bukan screenshot. Screenshot yang tetap disertakan berasal dari versi lama. Provider Nexray live, database Upstash nyata, deployment Vercel, DNS, dan Search Console belum terverifikasi.
