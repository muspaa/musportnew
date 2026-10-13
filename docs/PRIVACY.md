# Data publik dan perilaku layanan

UI dan AI Relay memakai `shared/content.json` dan `shared/profile.json`: profil, fase perjalanan, 8 proyek dan ringkasannya, nama tools, serta tautan sosial publik pemilik. Data pribadi seperti nomor telepon, usia, sekolah, atau alamat tidak dimasukkan ke pengetahuan AI.

**Chat Relay.** Riwayat hanya ada di memori halaman dan hilang saat reload. Browser mengirim teks ke `/api/chat`; function meneruskan profil publik dan riwayat terbatas (maksimal 8 pesan, 1.200 karakter per pesan) ke penyedia AI lewat HTTPS dengan parameter GET `text`, sehingga layanan upstream bisa mencatat prompt. Jangan kirim data rahasia. Function tidak mencatat isi chat. Ada batas 8 permintaan per menit per instance (best effort).

**Rating pengunjung.** Jika dua env Upstash diisi, `/api/ratings` menyimpan nama tampilan, bintang, komentar opsional, UUID rating, dan waktu kirim di Redis milik pemilik situs. Nama dan komentar tampil publik; tanpa akun atau email. IP tidak disimpan mentah (HMAC pada key). `localStorage` menyimpan UUID browser acak dan waktu kirim sukses untuk form. Moderasi dan penghapusan lewat dashboard Redis.

**CV.** `public/cv/CV-MUSFA.pdf` adalah berkas statis yang dapat diunduh siapa pun. Ia hanya memuat informasi yang sudah publik di situs ini.

**Aset.** Foto, font, dan ikon dilayani lokal. Tautan eksternal dibuka dengan `noopener noreferrer`. `/api/contact` mengembalikan 410 dan tidak mengklaim ada pesan terkirim.
