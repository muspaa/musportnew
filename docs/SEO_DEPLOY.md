# Vercel dan Google Search Console

## Build dan domain

Import root folder yang berisi `package.json` dan `api`, pilih Vite, `npm ci`, `npm run build`, output `dist`, Node 22.x/24.x. Dua env Upstash mengaktifkan rating; frontend tidak memerlukan database lain.

Build menyelaraskan canonical, OG URL, Person/WebSite/ProfilePage JSON-LD, robots, dan sitemap. Prioritas origin:

1. `PORTFOLIO_SITE_URL=https://domainmu/` (opsional; gunakan untuk domain custom).
2. `VERCEL_PROJECT_PRODUCTION_URL` otomatis dari Vercel, tanpa `VERCEL_URL` preview acak.
3. Fallback lokal `https://rhmt.biz.id/`.

URL harus HTTPS root tanpa password, query, atau fragment. Domain custom harus tersambung ke deployment yang benar sebelum diajukan ke Google. Sitemap memuat halaman utama saja; `#work-id` adalah modal/hash pada halaman yang sama, bukan halaman proyek terpisah. `lastmod` 10 Oktober 2026 mengikuti perubahan konten ini.

## SEO yang disertakan

- Konten Indonesia, satu H1, heading semantik, alt gambar, title dan description alami dengan nama Rohmatulloh/R_HMT OFC serta konteks pelajar MA.
- Variasi nama yang diminta pengguna tersimpan di Person `alternateName`: Rahmat, Ramat, R_HMT, R_HMT OFC, rhmt ofc, R_hmt ofc. Tidak ada keyword tersembunyi atau janji peringkat.
- Prerender seluruh 18 karya dan 19 tools; indeks noscript menyediakan deskripsi, stack, dan tautan karya tanpa cerita lama yang tidak terverifikasi.
- ProfilePage mainEntity Person, WebSite publisher, sameAs sosial asli; tidak memakai markup rating bisnis/produk untuk rating portofolio pribadi.
- Robots mengizinkan halaman publik dan menghindari endpoint API. Meta robots index/follow dan max-image-preview:large.
- OpenGraph/Twitter memakai URL gambar pengguna persis, sudah diambil dengan HTTP 200 dan diperiksa sebagai JPEG 1734×907:
  https://res.cloudinary.com/dhxfke7kq/image/upload/v1791627186/Ssstt/dsoqtqltngd5e2yg4cbw.jpg
- File `googleced8c5ac5a2976cb.html` asli dipertahankan. Ini hanya memverifikasi akun/metode yang sesuai dengan token lama.

## Daftarkan setelah deployment tersedia

1. Buka https://search.google.com/search-console/ dan tambahkan Domain property untuk domain custom; verifikasi DNS memakai TXT dari akun Google Anda. Untuk hostname Vercel, gunakan URL-prefix property dan metode verifikasi yang disediakan untuk akun tersebut. Jangan gunakan token akun lain.
2. Pastikan URL publik menerima HTTP 200, canonical menunjuk deployment tersebut, HTTPS aktif, dan halaman tidak memakai noindex/password.
3. Pada Sitemaps, kirim `https://domainmu/sitemap.xml`.
4. Pada URL Inspection, inspeksi URL utama, pilih Test Live URL, lalu Request Indexing bila dapat diakses.
5. Periksa JSON-LD melalui https://search.google.com/test/rich-results dan pantau Page Indexing serta Performance. Hubungkan profil publik asli ke domain yang sama bila sesuai.

Paket ini **belum didaftarkan melalui akun Search Console**: koneksi akun/akses properti tidak tersedia dalam sesi ini. Tidak ada perubahan DNS atau deployment yang dilakukan. Robots, sitemap, markup, dan alias membantu discovery serta pemahaman identitas; Google menentukan indexing dan peringkat. Pengajuan crawl tidak menjamin indexing.

Referensi primer, diperiksa 10 Oktober 2026:
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://developers.google.com/search/docs/essentials/technical
