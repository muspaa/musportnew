# QA V2.3 — 10 Oktober 2026 UTC

## Pemeriksaan otomatis

- TypeScript: `npm run check`.
- Production build dan prerender: `npm run build`.
- Backend/data: `npm test`, 17 tes. Meliputi tujuh tes konteks/chat, sembilan tes kontrak rating, dan satu tes eksekusi Lua dengan beberapa skenario.
- Rating: nama/bintang wajib, komentar opsional, payload boundary, same-origin, challenge bertanda tangan, server-only env, respons error, stable idempotency, dan HTTP 429/409 diuji.
- Skrip Lua produksi dijalankan dengan liblua5.4 dan model perintah Redis. Skenario meliputi 100 rating unik, pengiriman ulang, konflik ID, cooldown, batas harian/browser/IP/global, TTL, retensi 250, dan storage rusak. Model mengeksekusi Lua sebenarnya; tidak menguji concurrency/database Upstash nyata.
- Preservasi dibanding checkpoint source V2.2: PROJECTS, JOURNEY_STEPS, ECOSYSTEM, PEOPLE, COMMUNITIES, serta byte foto asli pp/pp-dev tidak berubah. Deskripsi anime serta nama asisten adalah perubahan yang diminta pengguna.
- Aset yang disebut oleh HTML/CSS runtime diperiksa lokal. 16 cover SVG dan 19 SVG tools diparse sebagai XML.
- ZIP source + dist diperiksa integritasnya. Tidak menyertakan node_modules, env rahasia, atau folder kontrol internal.

Hasil perintah final ada di `build-output-v2.3.txt`, `test-output-v2.3.txt`, dan `static-validation-v2.3.json`. Jangan memakai angka performa V2.2 sebagai hasil V2.3.

## Batas verifikasi saat ini

Browser QA tidak tersedia pada sesi ini. Skill Sites mewajibkan: “If `$control-browser` is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.” Karena itu tidak dibuat preview server, browser alternatif, atau screenshot yang diklaim sebagai V2.3.

Belum terverifikasi: kemiripan dengan gambar konsep, responsive aktual, stacking canvas/dialog pada browser nyata, WebGL materials/reflections/shadows, GPU FPS, touch inertia, autoplay video, Safari/iOS dan Android fisik. Target render 60/30 fps serta adaptive DPR adalah mekanisme kode, bukan benchmark.

Database Upstash belum terhubung: tidak ada kredensial pengguna dan tidak ada rating/network write nyata. UI menampilkan belum tersedia sebelum env diisi. Backend diuji dengan fetch fixture dan model Redis, tanpa membuat rating palsu dalam database produksi.

Provider AI live belum terverifikasi; probe versi sebelumnya mendapat HTML Site Unavailable. Tidak ada deployment, perubahan DNS, atau pendaftaran Search Console yang dilakukan.

## Pemeriksaan setelah deploy

| Area | Pemeriksaan yang diperlukan |
| --- | --- |
| Splash | Aset utama selesai, rakitan frame terlihat, skip/Escape, sekali per sesi, deep link dan reduced motion |
| Hero | Foto asli jelas, depth/camera/lighting terlihat, pointer tilt, open/close stack pada mouse/touch |
| Journey | Semua enam fase, layar berganti, selector tidak bertumpuk dengan teks pada 360/390/480 px |
| Orbit | 19 logo, kedalaman/occlusion, hit area mengikuti ikon, drag/inertia, pause/reset/keyboard |
| Karya | 16 entri, rak horizontal, frame perspective, search/filter, drag tanpa membuka dialog, Escape dan deep link |
| Galeri/video | Deskripsi karakter, video langsung setelah galeri, 16:9 desktop/mobile, autoplay/loop/audio, title hover/tap |
| Relay | Mark signal dan nama konsisten, respons/error/retry dari provider nyata |
| Rating | Nama/stars wajib, komentar kosong diterima, agregat/database nyata, retry tanpa double count, rate-limit lintas instance |
| Responsive | 360×780, 390×844, 480×900, 768×1024, 1440×900; tidak ada overflow halaman tak disengaja |
| Performa | WebGL2 aktif, satu context, material/shadow, FPS/GPU pada perangkat fisik, tab hidden dan context loss |
| SEO | Satu H1, canonical domain final, OG baru, robots/sitemap, konten HTML tanpa JavaScript |

`window.__RHMT_SPATIAL__` menyediakan diagnostik context, stage terlihat, pixel ratio, waktu render CPU, draw calls, dan triangles untuk pemeriksaan berikutnya. Waktu render CPU tersebut tidak sama dengan FPS/GPU benchmark.
