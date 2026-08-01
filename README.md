# Website Desa Glagah

Website statis untuk **Desa Glagah, Kecamatan Pakuniran, Kabupaten Probolinggo**.
Dibangun dengan HTML, JavaScript (vanilla), dan Tailwind CSS (via CDN) — tanpa
proses build, tanpa backend/database server. Semua data bersumber dari file
JSON di folder `data/` (arsitektur data berbasis Git).

## Status Data Saat Ini

| Halaman | Status | Catatan |
|---|---|---|
| Beranda | ✅ Siap | |
| Informasi Desa | ✅ Siap | Data kependudukan sudah data asli |
| Profil Desa | ✅ Siap | 13 perangkat sudah nama & foto asli |
| Berita Desa | ✅ Siap | 2 berita sudah asli lengkap dengan foto |
| Lowongan Pekerjaan | ⚠️ Perlu diedit | 4 lowongan di `data/jobs.json` masih data contoh/fiktif dan nomor `whatsapp`-nya masih dummy — ganti dengan lowongan asli (lihat bagian "Menambahkan/Mengedit Lowongan Pekerjaan") |
| Katalog UMKM | ⚠️ Perlu diedit | Hanya "Cahaya Cake" yang sudah asli (foto + deskripsi); 5 produk lain di `data/umkm.json` masih contoh tanpa foto. **Semua 6 produk** (termasuk Cahaya Cake) masih pakai nomor `whatsapp` dummy `621234567890` — perlu diganti nomor asli pemilik usaha |

Nomor WhatsApp admin desa (`DG_ADMIN_WHATSAPP` di `js/pages/lowongan.js`)
sudah diisi nomor resmi kantor desa.

## Struktur Proyek

```
desa-glagah/
├── index.html              # Shell utama + navigasi + outlet router + favicon
├── css/
│   └── style.css           # Watermark hero, fokus keyboard, kartu, dsb.
├── js/
│   ├── app.js               # Router hash (#/lowongan, #/informasi, #/profil, #/umkm, #/berita, #/berita/:id)
│   ├── data.js               # Ambil data JSON + localStorage untuk lowongan baru
│   ├── whatsapp.js            # Sanitasi nomor & pembuat link wa.me
│   ├── render.js               # Komponen kartu lowongan, UMKM, berita (dipakai bersama)
│   └── pages/
│       ├── home.js              # Hero + pencarian gabungan + preview berita terkini
│       ├── lowongan.js           # Papan lowongan + formulir "Pasang Lowongan" + notifikasi WA admin
│       ├── informasi.js           # Letak geografis + data kependudukan
│       ├── profil.js               # Visi & misi + struktur perangkat desa
│       ├── umkm.js                  # Katalog UMKM + filter kategori
│       └── berita.js                 # Daftar berita (filter kategori) + halaman detail per berita (#/berita/:id)
├── data/
│   ├── jobs.json             # Data lowongan (sumber kebenaran)
│   ├── umkm.json              # Data produk UMKM (sumber kebenaran)
│   └── berita.json             # Data berita desa (sumber kebenaran)
├── assets/
│   ├── logo_desa.png         # Logo Desa Glagah (header, footer, favicon)
│   ├── logo_kabupaten.png    # Logo Kabupaten Probolinggo (header)
│   ├── logo_unair.png        # Logo Universitas Airlangga (header + footer)
│   ├── logo_bbk8.jpeg        # Logo BBK 8 Universitas Airlangga (footer)
│   ├── berita/               # Foto berita desa
│   ├── perangkat/            # Foto perangkat desa
│   └── umkm/                 # Foto produk UMKM
└── .nojekyll                # Mencegah GitHub Pages memproses folder via Jekyll
```

## Menjalankan secara lokal (PyCharm)

1. Buka folder ini sebagai proyek di PyCharm.
2. Karena situs memakai `fetch()` untuk membaca file JSON, situs **tidak bisa**
   dibuka langsung dari `file://` — jalankan lewat server lokal:
   - Klik kanan `index.html` → **Open in Browser**, atau
   - Jalankan server sederhana dari terminal PyCharm:
     ```bash
     python3 -m http.server 8000
     ```
     lalu buka `http://localhost:8000`.

## Deploy ke GitHub Pages

1. Push seluruh isi folder ini ke branch `main` repositori GitHub Anda.
2. Buka **Settings → Pages** pada repositori, pilih source **Deploy from a
   branch**, branch `main`, folder `/ (root)`.
3. Situs akan tersedia di `https://<username>.github.io/<nama-repo>/`.
4. File `.nojekyll` sudah disertakan agar GitHub Pages tidak menjalankan
   proses Jekyll bawaan (yang bisa mengabaikan file/folder berawalan `_`).

Routing memakai **hash routing** (`#/lowongan`, `#/informasi`, `#/umkm`)
secara sengaja — dengan begitu me-refresh halaman apa pun tidak akan pernah
menghasilkan 404, karena server selalu hanya diminta memuat `index.html`.

## Alur data "Git-based"

Situs ini statis dan tidak memiliki server backend, sehingga formulir
**"Pasang Lowongan Sekarang"** tidak bisa langsung menulis ke `data/jobs.json`.
Sebagai gantinya:

1. Pengunjung mengisi formulir → data tersimpan sementara di `localStorage`
   browser pengunjung dan langsung tampil di daftar dengan label
   **"Menunggu Verifikasi Admin"**.
2. WhatsApp otomatis terbuka berisi ringkasan lowongan yang dikirim ke
   **nomor kantor desa** (`+62 852-3697-0941`), sehingga admin langsung
   mendapat notifikasi tanpa perlu mengecek localStorage secara manual.
3. Pengelola website (admin desa) meninjau data tersebut, lalu menambahkannya
   secara manual ke `data/jobs.json` dan melakukan `git commit` + `git push`
   agar lowongan resmi tampil bagi semua pengunjung.

Nomor tujuan notifikasi ini diatur lewat konstanta `DG_ADMIN_WHATSAPP` di
`js/pages/lowongan.js` — saat ini sudah diisi nomor resmi kantor desa. Kalau
nomor admin berganti di kemudian hari, cukup ubah nilai konstanta ini
(format `62xxxxxxxxxx`, tanpa `+` atau `0` di depan).

Ini konsisten dengan arsitektur "Git-based data" tanpa database — jika ke
depan dibutuhkan alur yang lebih otomatis, `data.js` sudah terisolasi
sehingga cukup diganti untuk memanggil layanan backend/Google Form/Sheet API.

## Kustomisasi Nomor WhatsApp

Nomor WhatsApp pada `data/jobs.json` dan `data/umkm.json` **masih memakai
data contoh** (`621234567890`) di seluruh entri saat ini — termasuk pada
produk UMKM "Cahaya Cake" yang datanya sendiri sudah asli. Ganti dengan
nomor asli pemilik usaha/pemberi kerja masing-masing sebelum publikasi.
Format yang diterima: diawali `0` (mis. `0812xxxx`, otomatis dikonversi ke
`62`) atau langsung `62812xxxx`.

## Foto Perangkat Desa

Foto perangkat desa diatur di `js/pages/profil.js`, pada array `DG_STRUKTUR`.
Data saat ini sudah diisi dengan 13 perangkat beserta foto masing-masing di
`assets/perangkat/`:

| Jabatan | Nama | File Foto |
|---|---|---|
| Kepala Desa | Abdurrahman | `abdurrahman_kepala desa.jpeg` |
| Sekretaris Desa | Peni Aripin | `peni aripin_sekertaris desa.jpeg` |
| Kepala Urusan Keuangan | Gita Ratnasari | `gita ratnasari_kepala urusan_keuangan.jpeg` |
| Kepala Urusan Umum | Misnari | `misnari_kepala urusan_umum.jpeg` |
| Kepala Urusan Perencanaan | Lin Qomariyah | `lin qomariyah_kepala urusan_perencanaan.jpeg` |
| Kepala Urusan Krajan | Mulyadi | `mulyadi_kepala urusan_krajan.jpeg` |
| Kepala Seksi Kesejahteraan | Nurul Hasan | `nurul hasan_kepala seksi_kesejahteraan.jpeg` |
| Kepala Seksi Pelayanan | Rudy Hartono | `rudy hartono_kepala seksi_pelayanan.jpeg` |
| Kepala Dusun Nyanto 1 | Abd Gani | `abd gani_kepala dusun_nyanto.jpeg` |
| Kepala Dusun Nyanto 2 | Suli | `suli_kepala dusun_nyanto_2.jpeg` |
| Kepala Dusun Bukolan 1 | Patro | `patro_kepala dusun_bukolan_1.jpeg` |
| Kepala Dusun Bukolan 2 | Buradi Suharji | `buradi suharji_kepala dusun_bukolan_2.jpeg` |
| Staff | Nasidah | `nasidah_staff.jpeg` |

Semua path menunjuk ke file asli persis seperti yang tersimpan di
`assets/perangkat/` (nama file mengandung spasi dan huruf kecil apa adanya —
biarkan seperti itu, jangan diubah, karena GitHub Pages **case-sensitive**
terhadap nama file, beda dengan Windows yang tidak membedakan huruf besar/kecil).

Untuk menambah atau mengganti perangkat di kemudian hari, cukup edit array
`DG_STRUKTUR` di `js/pages/profil.js` — tambah/ubah objek `{ jabatan, nama, foto }`
lalu simpan file fotonya di `assets/perangkat/` dengan nama yang sama persis
dengan nilai `foto`.

Tidak perlu foto dengan ukuran/rasio persis sama — foto akan otomatis
dipotong jadi bulat (`object-cover`). Disarankan foto persegi (mis. 400x400px)
dan ukuran file di bawah 200KB per foto agar halaman tetap cepat dimuat.

## Logo & Favicon

Ikon tab browser (favicon) diatur di `<head>` `index.html` lewat tag
`<link rel="icon">`, memakai `assets/logo_desa.png`. Format PNG dipilih
karena mendukung latar belakang transparan, sehingga logo tidak tampil
dengan kotak warna aneh di belakangnya — berbeda dari format JPEG yang
selalu punya latar belakang persegi solid.

Logo yang tampil di **header** (kiri atas, di samping nama "DESA GLAGAH"):
1. `assets/logo_desa.png` — Logo Desa Glagah
2. `assets/logo_kabupaten.png` — Logo Kabupaten Probolinggo
3. `assets/logo_unair.png` — Logo Universitas Airlangga

Logo yang tampil di **footer** (bagian bawah, di atas baris hak cipta),
disertai keterangan "Website ini merupakan hasil program kerja BBK 8
Universitas Airlangga":
1. `assets/logo_unair.png` — Logo Universitas Airlangga
2. `assets/logo_bbk8.jpeg` — Logo BBK 8 Universitas Airlangga (dirender
   bulat dengan class `rounded-full` karena bentuk aslinya sudah berupa
   badge lingkaran)

Semua `<img>` logo di atas memakai atribut `onerror` yang otomatis
menyembunyikan gambar (`this.remove()`) kalau file logo belum ada atau
gagal dimuat — jadi tidak akan tampil ikon gambar rusak di tengah header/
footer sebelum filenya diunggah.

Header situs memakai latar belakang **putih** (bukan hijau tua) supaya
logo-logo di atas tampil jelas tanpa kotak latar belakang yang mengganggu,
terutama untuk file logo berformat JPEG yang belum transparan.

## Menambahkan/Mengedit Berita Desa

Berita dikelola lewat `data/berita.json`. Setiap berita punya struktur:

```json
{
  "id": "berita-006",
  "judul": "Judul Berita",
  "tanggal": "2026-07-15",
  "kategori": "Pembangunan",
  "ringkasan": "Ringkasan singkat 1-2 kalimat, tampil di kartu.",
  "konten": "Isi lengkap berita, tampil saat kartu diklik (modal baca selengkapnya).",
  "foto": null
}
```

Berita otomatis diurutkan dari yang terbaru (berdasarkan `tanggal`) di halaman
Berita Desa maupun di preview "Berita Terkini" pada halaman utama (3 berita
terbaru). Kategori pada badge kartu mengikuti daftar warna di
`DG_BERITA_KATEGORI_STYLES` (`js/render.js`) — kategori baru di luar daftar
itu akan tetap tampil dengan warna abu-abu netral.

Setiap berita punya halaman sendiri di `#/berita/<id>` (contoh:
`#/berita/berita-001`), menampilkan foto utama diikuti isi berita lengkap.
Kalau field `foto` diisi dengan path gambar (mis.
`"foto": "assets/berita/musyawarah-jalan.jpg"`), foto itu yang dipakai
sebagai foto utama; kalau `foto: null`, halaman otomatis menampilkan ikon
placeholder alih-alih foto rusak.

## Menambahkan/Mengedit Katalog UMKM

Produk UMKM dikelola lewat `data/umkm.json`. Setiap produk punya struktur:

```json
{
  "id": "umkm-007",
  "nama": "Nama Usaha/Produk",
  "kategori": "Kuliner",
  "deskripsi": "Deskripsi singkat produk, tampil di kartu katalog.",
  "harga": "Rp 20.000 / bungkus",
  "whatsapp": "6281234567890",
  "lokasi": "Dusun Krajan",
  "foto": null
}
```

Cara menambah produk baru:

1. Buka `data/umkm.json`.
2. Tambahkan objek baru di dalam array (jangan lupa koma pemisah antar objek),
   gunakan `id` unik yang belum dipakai (mis. `umkm-007` jika terakhir
   `umkm-006`).
3. Isi `whatsapp` dengan nomor WhatsApp pemilik usaha (format `62...`, boleh
   ditulis diawali `0` karena akan otomatis dikonversi — lihat bagian
   "Kustomisasi Nomor WhatsApp").
4. Kalau ada foto produk, simpan filenya di `assets/` (buat folder
   `assets/umkm/` kalau belum ada) lalu isi field `foto` dengan path-nya,
   mis. `"foto": "assets/umkm/kripik-sari.jpg"`. Kalau tidak ada foto,
   biarkan `"foto": null` — kartu akan otomatis menampilkan ikon placeholder.
5. Simpan file, lalu `git commit` + `git push` agar produk baru tampil di
   halaman **Katalog UMKM** bagi semua pengunjung.

Filter kategori pada halaman Katalog UMKM dibuat otomatis dari nilai
`kategori` yang ada di data — jadi kategori baru (mis. "Peternakan") akan
langsung muncul sebagai tombol filter tanpa perlu ubah kode.

Tombol "Hubungi via WhatsApp" pada setiap produk memakai `js/whatsapp.js`
untuk membuat link `wa.me` otomatis berisi pesan template perkenalan produk.

## Menambahkan/Mengedit Lowongan Pekerjaan

Lowongan resmi dikelola lewat `data/jobs.json`. Setiap lowongan punya struktur:

```json
{
  "id": "job-005",
  "judul": "Judul Lowongan",
  "usaha": "Nama Usaha/Pemberi Kerja",
  "deskripsi": "Deskripsi tugas dan kegiatan kerja.",
  "syarat": "Syarat pelamar: usia, jenis kelamin, pendidikan, dsb.",
  "lokasi": "Dusun/Blok, Desa Glagah",
  "tipe": "Paruh Waktu",
  "whatsapp": "6281234567890",
  "gaji": "Rp 700.000 - Rp 900.000 / bulan",
  "batas": "2026-08-15",
  "foto": null,
  "createdAt": "2026-07-20T08:00:00.000Z"
}
```

Cara menambah lowongan baru secara manual (sebagai admin):

1. Buka `data/jobs.json`.
2. Tambahkan objek baru di dalam array dengan `id` unik yang belum dipakai
   (mis. `job-005` jika terakhir `job-004`).
3. `tipe` sebaiknya konsisten dengan nilai yang sudah ada (`Harian`,
   `Paruh Waktu`, `Waktu Penuh`) supaya filter tipe di halaman Lowongan
   tetap rapi, tapi nilai baru di luar itu tetap akan tampil.
4. `batas` (tanggal batas lamaran) boleh diisi `null` kalau lowongan dibuka
   terus-menerus tanpa batas waktu.
5. `createdAt` dipakai untuk mengurutkan lowongan dari yang terbaru — isi
   dengan format ISO (`YYYY-MM-DDTHH:mm:ss.sssZ`), atau salin waktu saat
   ini dari lowongan lain sebagai contoh format.
6. Simpan file, lalu `git commit` + `git push` agar lowongan tampil resmi
   (tanpa label "Menunggu Verifikasi Admin") di halaman **Lowongan Pekerjaan**.

**Alur lowongan dari pengunjung (via formulir "Pasang Lowongan"):** seperti
dijelaskan di bagian "Alur data Git-based" di atas, lowongan yang diisi
pengunjung lewat formulir di halaman Lowongan **tidak otomatis** masuk ke
`data/jobs.json` — admin akan menerima ringkasannya via WhatsApp, lalu perlu
menyalin isinya secara manual mengikuti struktur di atas dan melakukan
langkah 1-6 supaya lowongan tersebut resmi tampil bagi semua pengunjung.
