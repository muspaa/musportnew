# MUSFA V3.0 — Space Archive

Portofolio React, TypeScript, dan Vite bertema **luar angkasa** dengan 3D. Isi: **8 proyek live, 6 fase perjalanan, 19 tools, dan profil dengan tombol Download CV**.

## Yang berubah di V3.0

- **Tampilan total baru.** Latar semesta (nebula shader WebGL + starfield 3D yang "terbang" mengikuti scroll dan melebar jadi garis warp saat scroll cepat), planet 3D prosedural di hero (kontinen, awan, lampu kota malam, atmosfer, cincin berbayangan, bulan), kartu dengan tilt 3D, dan header kaca. Tersedia mode gelap (default) dan terang.
- **Karya = ring 3D dengan screenshot asli.** Delapan proyek menjadi delapan kartu pada karusel putar; tiap kartu dan modal memakai screenshot situsnya (`public/images/projects/<id>.webp`) dengan lencana planet kecil. Drag/swipe, panah keyboard, tombol, filter, pencarian, dan deep link `#work-<id>` tetap ada.
- **Profil dipindah ke bawah hero.** Bagian *About me / Mission profile* (Self-taught. Always curious.) kini tepat di bawah *Learning in Progress*, memakai teks tentang saya (lulusan SMK TKJ), foto PKL dalam bingkai 3D, keahlian, dan tombol **Download CV**. 05 THE PERSONAL UNIVERSE dan THE TROPHY ORBIT sudah dihapus.
- **07 PEOPLE & COMMUNITIES dan The community dihapus**, termasuk data dan aset gambarnya. Nomor bagian: 01 Profil & CV, 02 Works, 03 About, 04 Journey, 05 Tools, 06 Relay, 07 Ethos, 08 Rating.
- **Proyek diganti** dengan delapan URL baru (WhatsApp React, MusMusify, Netflix Token, WebtoAPK, AM Find, Download Media, TempMail, Alight Motion Pro). Deskripsi dari teks yang kamu berikan; khusus Netflix Token dan Alight Motion Pro memakai redaksi netral.
- **Dipertahankan:** hero (teks dan statistik), About, Journey (6 fase), orbit 19 tools + tech stack, Relay (chat AI), Ethos, rating pengunjung, footer, splash, toggle tema, serta seluruh API.
- **Bulan HD** (`public/images/moon.webp`, 720 px: kawah dengan tepi dan puncak tengah, lautan basal, sinar kawah, terminator lembut) mengorbit planet hero secara 3D dan bisa bersembunyi di balik planet dan cincin. Gambar selalu menghadap kamera sehingga tetap bulat.
- Tambahan 3D: satelit yang mengorbit planet hero (bisa tertutup planet), konstelasi bintang di dekat kursor, warna nebula yang berubah per bagian halaman, parallax scroll, bingkai foto dengan cincin orbit, dan penurunan resolusi otomatis di perangkat lambat.
- Efek 3D memakai WebGL/Canvas buatan sendiri (sekitar 10 KB). Tanpa library 3D di bundle pengunjung. `three` tetap tercantum di `package.json` agar `package-lock.json` tidak berubah, tetapi tidak dipakai.
- Tanpa WebGL atau saat *reduced motion*: latar jatuh ke gradien CSS, planet hero ke planet CSS, dan animasi berhenti pada satu frame. Tombol jeda ada di header.

## Foto

Semua foto memakai foto PKL: `public/images/pp.webp` (potret penuh) dan `public/images/pp-avatar.webp` (crop persegi untuk logo header, splash, hero, dan ikon). Favicon, apple-touch-icon, dan `og-image.jpg` dibuat dari foto yang sama. Ingin mengganti foto? Timpa `pp.webp`, lalu buat ulang avatar persegi dengan nama `pp-avatar.webp`.

## CV

Tombol **Download CV** mengunduh `public/cv/CV-MUSFA.pdf`. Berkas itu dibuat otomatis dari data portofolio (profil, pendidikan SMK TKJ, keahlian, 8 proyek, perjalanan, tools, kontak) dan **tidak memuat pengalaman kerja atau sertifikat**, karena datanya belum ada. Ada dua cara memperbarui:

1. Pakai CV buatanmu sendiri: timpa `public/cv/CV-MUSFA.pdf` dengan nama yang sama.
2. Buat ulang dari data: `pip install reportlab pillow && python3 scripts/build-cv.py`.

## Ganti atau tambah proyek

Edit `PROJECTS` di `shared/content.json`. Field `image` menunjuk screenshot 16:10 (disarankan 1280×800 WebP) di `public/images/projects/`; `theme` (`hue`, `hue2`, `ring`, `glyph`) menentukan warna lencana planetnya. **Screenshot yang berisi alamat IP, email, atau token sebaiknya disamarkan sebelum dipublikasikan.**

## Teks profil

Teks tentang saya, pendidikan, dan keahlian ada di `shared/profile.json` (`bio`, `education`, `skills`). Isi yang sama dipakai oleh bagian profil, CV (`scripts/build-cv.py`), dan pengetahuan Relay.

## Jalankan lokal

Gunakan Node 22 atau 24. Jalankan dari folder yang berisi `package.json`:

```sh
npm ci
npm run dev
```

Buka `http://localhost:4173`. Salin `.env.example` ke `.env.local` jika ingin mengaktifkan rating atau mengganti konfigurasi chat. Restart dev server setelah perubahan env. API lokal tersedia untuk `/api/chat`, `/api/ratings`, `/api/health`, dan `/api/contact`.

```sh
npm run check
npm test
npm run build
```

Build menghasilkan `dist` dan HTML prerender. `npm run preview` hanya menyajikan static build; API membutuhkan dev server atau Vercel.

## Deploy Vercel

1. Ekstrak ZIP. Masukkan isi folder `R_HMT_V2` ke repository, lalu import ke Vercel.
2. Root Directory adalah folder yang berisi `package.json` dan `api`, bukan `dist`.
3. Pilih Vite, Install Command `npm ci`, Build Command `npm run build`, Output Directory `dist`, dan Node 22.x atau 24.x. `vercel.json` sudah tersedia.

Rating membutuhkan dua Environment Variables dari satu database Upstash Redis:

```dotenv
UPSTASH_REDIS_REST_URL=https://DATABASE.upstash.io
UPSTASH_REDIS_REST_TOKEN=TOKEN_DARI_UPSTASH
```

Gunakan REST token yang dapat menulis. Aktifkan pada Production dan redeploy; tidak memerlukan tabel, migrasi, atau SDK tambahan. Jangan memakai prefix `VITE_` dan jangan commit `.env.local`. Bila env belum tersedia, form tidak mengaku berhasil menyimpan.

Canonical, JSON-LD, OG URL, robots, dan sitemap dipasangkan saat build: `PORTFOLIO_SITE_URL` jika diisi; jika tidak, hostname Production Vercel; terakhir fallback `https://musfamus.my.id/`. Untuk domain custom, cukup isi satu env opsional `PORTFOLIO_SITE_URL=https://domainmu/` lalu redeploy. Prerender, Person/ProfilePage JSON-LD, sitemap, robots, dan file verifikasi Google tetap disertakan. Panduan Search Console ada di `docs/SEO_DEPLOY.md`.

Paket ini siap di-build untuk Vercel. Deployment publik dan database nyata belum dibuat atau diuji dari lingkungan ini.

## Rating dan Relay

Nama dan bintang 1–5 wajib; komentar opsional. Nama serta komentar tampil publik. Tanpa email atau akun. Rate limit, honeypot, same-origin, challenge HMAC, dan idempotensi tetap diperiksa pada server melalui skrip Lua atomik.

| Batas | Nilai |
| --- | --- |
| Rating berhasil per browser | 1 per 24 jam |
| Rating berhasil per IP | 1 per 10 menit; maksimal 3 per 24 jam |
| Percobaan kirim per IP | 12 per 10 menit |
| Rating berhasil seluruh situs | 500 per 24 jam |
| Pembacaan per IP / seluruh situs | 60 / 500 per menit |
| Nama / komentar | 50 / 600 karakter |
| Komentar tersimpan / ditampilkan | 250 / 20 terbaru |

Retry dengan ID dan isi yang sama tidak menambah hitungan selama 24 jam. Token Redis tetap di server. Moderasi melalui dashboard Redis; tidak ada sistem admin tambahan.

Relay memakai `/api/chat` → Nexray GET `text`, dengan konteks publik dari sumber data yang sama. Probe sebelumnya mendapat HTML Site Unavailable; respons live provider belum terverifikasi. UI menyediakan error, retry, dan stop, tanpa jawaban palsu. Riwayat hanya bertahan selama halaman terbuka.

## Lokasi perubahan

| Bagian | Lokasi |
| --- | --- |
| Proyek, journey, tools | `shared/content.json` |
| CV dan bagian profil | `public/cv/CV-MUSFA.pdf`, `scripts/build-cv.py`, `src/components/Profile.tsx` |
| Profil, pendidikan, keahlian, sosial | `shared/profile.json` |
| Gaya | `src/styles/base.css`, `sections.css`, `widgets.css` |
| Latar, planet, bintang, kualitas adaptif (WebGL/Canvas) | `src/space/`, `src/components/Cosmos.tsx`, `Planet.tsx` |
| Ring proyek 3D | `src/components/Archive.tsx`, `src/hooks/useRing.ts`, `src/interaction/ring.mjs` |
| Scroll, reveal, tilt | `src/hooks/useSpaceFx.ts` |
| Orbit tools | `src/components/ToolOrbit.tsx`, `src/interaction/orbit.mjs` |
| Rating / chat API | `api/ratings.js`, `api/chat.js` |

## Verifikasi dan batasnya

Diverifikasi saat pengerjaan: Tes Node lulus (API chat, rating, Lua, intro, review rail, orbit, ring 3D, SEO). Bundel dirakit dengan esbuild dan dijalankan di Chromium headless (WebGL aktif): tidak ada error JS, tanpa overflow horizontal di 1440 px dan 390 px, ring/modal/filter/CV/jeda animasi/mode terang diuji interaksinya, termasuk build development (StrictMode). Render SSR diperiksa tidak memuat konten yang dihapus.

Belum dijalankan di lingkungan pengerjaan: `npm run build` penuh (`tsc` + Vite + prerender) karena Vite dan paket npm tidak tersedia di sana. Jalankan `npm ci && npm run build` sebelum deploy. Frame rate di perangkat sungguhan belum diukur.
