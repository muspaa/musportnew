# Deploy Vercel dan Google Search Console

## Build dan domain

Import folder yang berisi `package.json` dan `api`. Pilih Vite, Install `npm ci`, Build `npm run build`, Output `dist`, Node 22.x atau 24.x. Dua env Upstash mengaktifkan rating (lihat README); frontend tidak memerlukan database lain.

Saat build, canonical, OG URL, JSON-LD (Person, WebSite, ProfilePage), robots, dan sitemap diselaraskan. Urutan origin:

1. `PORTFOLIO_SITE_URL=https://domainmu/` (opsional, untuk domain custom).
2. `VERCEL_PROJECT_PRODUCTION_URL` dari Vercel.
3. Fallback `https://musfamus.my.id/`.

URL harus HTTPS root tanpa password, query, atau fragment. Sitemap hanya memuat halaman utama; `#work-id` adalah dialog pada halaman yang sama.

## SEO yang disertakan

- Satu H1, heading semantik, alt gambar, title dan description. Konten Indonesia.
- Prerender seluruh 8 proyek, 6 fase perjalanan, 19 tools, dan bagian profil. Indeks `noscript` memuat semua proyek beserta tautannya.
- JSON-LD memakai profil sosial asli dari `shared/profile.json`; tanpa markup rating bisnis untuk rating pribadi.
- Open Graph dan Twitter memakai `public/og-image.jpg` (1200×630, foto PKL).
- `googleced8c5ac5a2976cb.html` dipertahankan untuk verifikasi Search Console.

## Setelah deploy

1. Tambahkan properti di https://search.google.com/search-console/ dan verifikasi dengan akun Google kamu.
2. Pastikan URL publik HTTP 200, canonical sesuai, HTTPS aktif.
3. Kirim `https://domainmu/sitemap.xml` di menu Sitemaps, lalu Request Indexing lewat URL Inspection.
4. Uji JSON-LD di https://search.google.com/test/rich-results.

Pendaftaran Search Console tidak dilakukan dari paket ini. Google yang menentukan indexing dan peringkat.
