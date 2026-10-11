# Aset V2.3 — 10 Oktober 2026

## Identitas dan referensi yang dipertahankan

`pp.png`, `pp-dev.png`, turunan WebP, 19 logo tools, dan lima JPG anime pilihan pengguna tetap disertakan. Foto profil yang dirender pada halaman berasal dari file asli, bukan wajah yang dibuat ulang. Detail sumber dan lisensi tetap ada di `ASSETS_V2_2.md`, `ASSETS.md`, serta folder license.

Referensi Pinterest tidak lagi tampil di UI anime. Catatan provenance tetap disimpan di dokumentasi ini/versi sebelumnya. Galeri menampilkan deskripsi karakter singkat, tanpa label anime edit.

Background pegunungan lama tetap disertakan untuk preservasi aset, tetapi tidak digunakan oleh runtime V2.3. Background aktif merupakan scene geometri Three.js dalam `src/scenes/world.ts`, bukan bitmap pemandangan atau CSS gradient.

## Komponen khusus

- `public/components/works/*.svg`: 16 cover ilustratif khusus sesuai ID/nama karya asli. Dibuat secara programatik melalui `scripts/generate-components.mjs`. Pola mengikuti fungsi masing-masing proyek: OCR, tier rows, kutipan, tanaman, upscale, repo graph, lobby, tasks, capture, kartu, news, prompt, pesan, audio, dan katalog anime. Label illustrative study membedakannya dari screenshot produk.
- `public/icons/relay.svg` dan `src/components/RelayMark.tsx`: frame dan jalur signal khusus untuk Relay. Bukan generic sparkle atau template mark.
- Material brushed silver memakai normal map kecil yang dibuat oleh kode. Canvas texture pada layar Journey diturunkan dari enam fase asli. Seluruh frame, jalur orbit, perangkat, platform, lantai, dan panel ruang digital dibuat sebagai geometri saat runtime.

## Gambar konsep yang disetujui

`docs/design/approved-tech-concept.png` adalah salinan gambar arah visual yang disetujui pengguna: putih/silver/electric blue, browser frame berlapis, ruang digital, orbit, karya horizontal, dan contoh mobile. Gambar ini bukan screenshot implementasi. Nama proyek yang hanya muncul sebagai contoh dalam konsep tidak menggantikan inventaris karya asli.

## Banner Open Graph

`public/og-tech.png` — 1730 × 909 px, artwork statis untuk sharing. Dibuat dengan ImageGen; komposisinya menyatukan arsitektur tech terang, frame silver, electric blue, potret/avatar berdasarkan referensi, dan tulisan Learning in Progress. Artwork ini bukan screenshot website atau bukti tampilan WebGL. Identitas di runtime tetap memakai aset asli.

Sumber generasi pada sesi kerja: `generated_images/exec-ece1ad0e-ef6e-403f-ac1d-e4c62e8da1c5.png`. File asli disalin tanpa mengubah piksel. Prompt arah: banner portfolio R_HMT, bright cool-white digital architecture, physical brushed silver/browser frames, electric-blue accents, authentic portrait/avatar reference, “Learning in Progress.” dan “Kode, eksperimen, dan proses belajar.” Hindari nature scenery, generic neon, sparkle, atau template bento.

Metadata OG/Twitter menunjuk `/og-tech.png`; banner lama `/og-image.jpg` tetap ada sebagai aset historis. Artwork sharing tidak dipakai sebagai pengganti background 3D halaman.
