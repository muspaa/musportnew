# Data publik dan perilaku layanan

UI dan AI memakai `shared/content.json` serta `shared/profile.json`. Profil AI berisi alias publik, narasi belajar mandiri/Oppo A3s, filosofi, fase perjalanan, ringkasan proyek dan statusnya, nama tools, anime favorit, nama jejaring/komunitas, dan tautan sosial publik pemilik.

Nomor telepon, tautan kontak pribadi milik orang lain, usia, sekolah, alamat rumah, dan detail pribadi dari prompt lama tidak dimasukkan ke pengetahuan AI. Tautan sosial orang/komunitas yang sudah ada dalam sumber tetap tersedia pada dialog UI. Tinjau kembali bila pemilik tautan meminta penghapusan.

Riwayat chat berada di memori halaman, hilang setelah reload/tutup. Tidak ada penyimpanan database atau localStorage untuk chat, analytics, atau cookie tracking. Rating memiliki penyimpanan terpisah sebagaimana dijelaskan di bawah. Tombol hapus mengosongkan riwayat chat lokal. Maksimum 8 pesan terbaru dikirim, masing-masing 1.200 karakter; respons lama dipotong jika perlu. Gagal kirim tidak menghasilkan jawaban palsu.

Saat pengguna mengirim chat, browser mengirim teks ke `/api/chat`. Function meneruskan profil publik dan riwayat terbatas ke Nexray melalui HTTPS menggunakan parameter GET `text`, sesuai kontrak provider. Karena berbentuk query, layanan upstream/infrastruktur dapat mencatat URL/prompt. Kebijakan retensi pihak tersebut berada di luar aplikasi ini. Jangan kirim data rahasia. UI menyampaikan pemberitahuan sebelum chat.

Function tidak mencatat isi chat atau key. Hash IP dan penghitung sementara dipakai untuk batas 8 permintaan per menit per warm instance. Ini best effort, bukan batas global/durable lintas instance. Tambahkan kontrol Vercel Firewall sesuai kebutuhan deployment. Tidak ada jaminan kebal prompt injection: semua pengetahuan yang diberikan memang publik dan AI tidak memiliki tool aksi.

Gambar/avatar dan font dilayani lokal. Video dimuat dari Cloudinary saat banner terlihat dan mencoba autoplay muted/loop; tidak menunggu tombol play. Ini menyebabkan request ke layanan itu. Video dijeda ketika keluar viewport atau tab tersembunyi. Tautan eksternal terbuka dengan `noopener noreferrer`. Form kontak pengiriman email tidak tersedia; kontak langsung mengikuti layanan yang dipilih pengunjung. `/api/contact` mengembalikan 410 dan tidak mengklaim ada pesan terkirim.

## Rating pengunjung V2.3

Jika diaktifkan, `/api/ratings` menyimpan nama tampilan, bintang, komentar opsional, UUID rating, dan waktu pengiriman di database Upstash Redis milik pemilik situs. Nama dan komentar tampil publik. Tidak meminta akun atau email. Daftar disimpan sampai 250 kesan terbaru; 20 ditampilkan. Agregat jumlah/bintang tetap tersimpan dan tidak mempunyai TTL otomatis.

LocalStorage menyimpan UUID browser acak dan waktu pengiriman sukses untuk pengalaman form. UUID/HMAC tersebut dipakai untuk rate limit; tidak menyimpan chat atau identitas login. Server memperoleh IP dari header Vercel tepercaya lalu memakai HMAC pada key Redis, tanpa menyimpan IP mentah di key/record. Upstash/infrastruktur hosting tetap mempunyai kebijakan logging masing-masing.

Key cooldown/penghitung/idempotensi memiliki TTL satu menit sampai 24 jam. Token challenge bertanda tangan berlaku 30 menit, terikat pada IP dan UUID browser. Pengiriman ulang dengan ID dan isi sama tidak dihitung dua kali selama 24 jam. Kredensial Redis hanya ada pada function server dan tidak dikirim ke frontend.

Database belum diaktifkan pada paket sumber ini. Sebelum dua env diisi, form menampilkan rating belum tersedia. Penghapusan/moderasi data dilakukan oleh pemilik melalui dashboard Redis; tidak ada fitur admin atau mekanisme penghapusan otomatis yang diklaim tersedia.

`docs/legacy` berisi sumber lama untuk audit, bukan file publik dalam `dist`. Jangan menaruh rahasia dalam file sumber atau mempublikasikan arsip lama tanpa review tersendiri. Tidak ada kredensial baru yang ditambahkan ke paket V2.
