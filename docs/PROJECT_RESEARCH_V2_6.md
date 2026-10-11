# Pemeriksaan sumber proyek — 10 Oktober 2026

Isi halaman dan bundle JavaScript publik diambil melalui HTTP GET, tanpa login, pengiriman formulir, aktivasi akun, atau input data pribadi. Deskripsi adalah rangkuman alur yang terlihat pada sumber; bukan jaminan backend berfungsi. Mesin pencarian gagal membuka dua domain tambahan; HTTP langsung berhasil dengan 200, sehingga proyek tidak ditentukan dari hasil pencarian situs lain yang namanya mirip.

| Proyek / URL | Bukti yang diperiksa | Hasil untuk deskripsi dan stack |
| --- | --- | --- |
| https://finorajourney.my.id/ | HTML HTTP 200, Next immutable chunks, bundle aplikasi | Keuangan pribadi/bisnis, transaksi, utang, goals, limits, reports, simulasi, ruang agent; React/Next dan Dexie/IndexedDB teridentifikasi. Halaman awal hanya splash; teks fitur diperiksa dari bundle. |
| https://am-proaktif.vercel.app/ | HTML HTTP 200, form dan script inline | Input email, magic link, status/respons JSON, log aktivasi Alight Motion; HTML/CSS/JavaScript/fetch. Footer menyebut Node.js/API/AM.js; source server tidak tersedia, jadi backend tersebut tidak disajikan sebagai stack terverifikasi. |
| https://artikel-ocr.vercel.app/ | HTML dan bundle index-MHS-PWx8.js | Veritas: artikel PDF/URL, OCR, metodologi, bias, ringkasan, diskusi dokumen; React dan iLovePDF integration di source. Klaim marketing bebas halusinasi tidak disalin sebagai jaminan. |
| https://tierlist-maker-gamma.vercel.app/ | HTML HTTP 200, library CDN dan script inline | Upload/tier/drag/tap/theme/export; JavaScript/Tailwind/html2canvas. |
| https://anime-quote-six.vercel.app/ | HTML dan bundle index-RUxODLme.js | Quotes Editor dengan karakter, kutipan, dan PNG; React. |
| https://analyze-tanaman.vercel.app/welcome | HTML HTTP 200 | Flora.AI: Gemini, identifikasi penyakit daun, laporan PDF, riwayat; JS/Tailwind/Vercel API dicantumkan halaman. Banner maintenance juga terlihat. |
| https://hd-upscale-nine.vercel.app/ | HTML HTTP 200 dan fetch inline | Spark Upscaler, upload maksimal 10 MB, opsi 4K/6K/8K, face enhance, preview/download; JS/Tailwind/API. |
| https://auto-reporistory-githb.vercel.app/ | HTML dan bundle index-PfH_oF9j.js | Upload ZIP/files dan manager repository GitHub; React/JSZip/IndexedDB/API GitHub. Deskripsi pemetaan repository/boilerplate sebelumnya tidak cocok. |
| https://fake-loby-ml-nine.vercel.app/ | HTML HTTP 200 | Lobi fiktif dengan nama/rank/border/canvas/download; JS/HTML Canvas/Tailwind. |
| https://tugas-ku4.vercel.app/ | HTTP 404 | Arsip sebelumnya dipertahankan; tidak mengganti deskripsi dengan klaim baru tanpa sumber. |
| https://tugasku3-lite.netlify.app/ | HTML HTTP 200 dan about produk | Tugas sekolah, deadline/prioritas, jadwal, catatan, tema, localStorage; Chart.js dari source. |
| https://screenshot-web-omega.vercel.app/ | HTML HTTP 200 | URL, viewport presets/custom, scale 1x–3x, full page, capture/download; JS/CSS/fetch API. Engine server tidak dapat dibuktikan dari halaman, jadi tidak ditulis sebagai Puppeteer pasti. |
| https://cek-provider-six.vercel.app/ | HTML HTTP 200 | DOMPUL CEK khusus XL/AXIS: pulsa, status, masa aktif/tenggang/paket; JS/API. Bukan deteksi semua operator melalui regex prefix. |
| https://nexssuspage.vercel.app | HTML HTTP 200 | Nexus Gate, penghubung IndoSawit.news & Sanexus.ai; news/deep search. Harga CPO dan dashboard sawit tidak terlihat di URL ini. |
| https://image-to-promt-livid.vercel.app/ | HTTP 404 | Arsip sebelumnya dipertahankan tanpa klaim baru. |
| QuickFake, Soundify, Web Anime | Tidak memiliki URL demo di sumber awal | Data arsip tetap dipertahankan. |

Status proyek yang halaman publiknya diakses tetap `ONLINE_UNVERIFIED`: ini membedakan keberadaan halaman dari keberhasilan fungsi backend. Struktur cerita lama tetap tersimpan pada data dan salinan historis `project-data-before-v2.6.json`; dialog dan indeks tanpa JS menggunakan deskripsi baru, tidak memakai spekulasi cerita lama.

## Komunitas dan ikon

- HIRASAWA.ID: https://chat.whatsapp.com/GJrFX9GSOJiBLyJmJNNixi — HTTP GET mengembalikan og:title HIRASAWA.ID, invite_link_type_v2 PARENT, dan og:image asli. Gambar tersebut disimpan lokal sebagai `public/images/hirasawa-community.jpg`; URL CDN sementara tidak dipakai runtime. Tidak melakukan join atau mengirim pesan.
- Penanda WhatsApp dan ikon React/TypeScript/Upstash/Node.js berasal dari SVG proyek Simple Icons (CC0): https://github.com/simple-icons/simple-icons/tree/develop/icons. Ikon Vite dari https://vite.dev/logo.svg. Brand tetap milik masing-masing pemilik.
- Dokumentasi komunitas primer: https://about.fb.com/news/2022/04/our-vision-for-communities-on-whatsapp/ dan https://faq.whatsapp.com/438859978317289/ . Ikon komunitas pribadi berbeda dari logo produk WhatsApp; UI menampilkan keduanya sebagai identitas dan penanda platform.
- Kimi light mode adalah varian lokal dengan K gelap; file SVG asli tetap byte-identical. Perubahan tidak mengganti titik brand.
