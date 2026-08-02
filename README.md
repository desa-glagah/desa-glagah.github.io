# Website Desa Glagah

Website statis untuk **Desa Glagah, Kecamatan Pakuniran, Kabupaten Probolinggo**.
Dibangun dengan HTML, JavaScript (vanilla), dan Tailwind CSS (via CDN) — tanpa
proses build, tanpa backend/database server. Semua data bersumber dari file
JSON di folder `data/` (arsitektur data berbasis Git).

## Struktur Proyek

```
desa-glagah/
├── index.html              # Shell utama + navigasi + outlet router + favicon
├── css/
│   └── style.css           # Watermark hero, fokus keyboard, kartu, dsb.
├── js/
│   ├── app.js               # Router hash (#/lowongan, #/informasi, #/profil, #/umkm, #/berita, #/berita/:id)
│   ├── data.js               # Ambil data JSON dari data/
│   ├── whatsapp.js            # Sanitasi nomor & pembuat link wa.me
│   ├── render.js               # Komponen kartu lowongan, UMKM, berita (dipakai bersama)
│   └── pages/
│       ├── home.js              # Hero + pencarian gabungan + preview berita terkini
│       ├── lowongan.js           # Papan lowongan + formulir "Pasang Lowongan" + notifikasi WA admin
│       ├── informasi.js           # Letak geografis + data kependudukan
│       ├── profil.js               # Visi & misi + struktur perangkat desa
│       ├── umkm.js                  # Katalog UMKM (filter kategori) + halaman detail per produk (#/umkm/:id)
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

1. Pengunjung mengisi formulir → begitu klik "Kirim Lowongan", WhatsApp
   otomatis terbuka berisi ringkasan lowongan yang dikirim ke **nomor kantor
   desa** (`+62 852-3697-0941`). Data ini **tidak disimpan** di mana pun di
   browser pengunjung — jadi tidak ada risiko duplikat atau data uji coba
   yang nyangkut di perangkat orang lain.
2. Pengelola website (admin desa) meninjau ringkasan yang masuk lewat
   WhatsApp, lalu menambahkannya secara manual ke `data/jobs.json` dan
   melakukan `git commit` + `git push` agar lowongan resmi tampil bagi
   semua pengunjung.

Nomor tujuan notifikasi ini diatur lewat konstanta `DG_ADMIN_WHATSAPP` di
`js/pages/lowongan.js` — saat ini sudah diisi nomor resmi kantor desa. Kalau
nomor admin berganti di kemudian hari, cukup ubah nilai konstanta ini
(format `62xxxxxxxxxx`, tanpa `+` atau `0` di depan).

Ini konsisten dengan arsitektur "Git-based data" tanpa database — jika ke
depan dibutuhkan alur yang lebih otomatis, `data.js` sudah terisolasi
sehingga cukup diganti untuk memanggil layanan backend/Google Form/Sheet API.

## Kustomisasi Nomor WhatsApp

Nomor WhatsApp pada `data/umkm.json` **sudah diisi nomor asli** pemilik
masing-masing usaha. Nomor WhatsApp pada `data/jobs.json` **masih memakai
data contoh** (`621234567890`) di seluruh entri — ganti dengan nomor asli
pemberi kerja sebelum publikasi. Format yang diterima: diawali `0` (mis.
`0812xxxx`, otomatis dikonversi ke `62`) atau langsung `62812xxxx`.

Setiap tombol WhatsApp di situs ini (kontak UMKM, lamar lowongan, notifikasi
admin) disertai link cadangan kecil "Buka lewat browser" yang mengarah ke
`web.whatsapp.com` (dibuat oleh `dgBuildWhatsAppWebLink` di `js/whatsapp.js`).
Ini jaga-jaga untuk perangkat/browser yang tidak punya aplikasi WhatsApp
terpasang, yang biasanya memunculkan error semacam "file ini tidak memiliki
aplikasi terkait" saat link `wa.me` dicoba dibuka langsung.

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

Semua berita yang tampil pada website diambil dari file:

```
data/berita.json
```

Website **tidak memiliki halaman admin** untuk menambah berita secara langsung. Oleh karena itu, setiap berita baru harus ditambahkan dengan mengedit file `berita.json`.

---

## Langkah 1. Siapkan bahan berita

Sebelum mulai mengedit file, siapkan terlebih dahulu informasi berikut.

- Judul berita
- Tanggal berita
- Kategori berita
- Ringkasan berita (1–2 kalimat)
- Isi berita lengkap
- Foto berita (jika ada)

Contoh:

**Judul**

```
Kerja Bakti Pembersihan Saluran Air Desa Glagah
```

**Tanggal**

```
2026-08-12
```

**Kategori**

```
Gotong Royong
```

**Ringkasan**

```
Pemerintah Desa bersama masyarakat melaksanakan kerja bakti membersihkan saluran air guna mencegah banjir saat musim hujan.
```

**Isi Berita**

```
Pemerintah Desa Glagah bersama masyarakat mengadakan kegiatan kerja bakti membersihkan saluran air di Dusun Krajan pada hari Rabu. Kegiatan ini diikuti oleh perangkat desa, RT/RW, Karang Taruna, dan warga sekitar. Melalui kegiatan ini diharapkan saluran air tetap lancar sehingga dapat mengurangi risiko banjir pada musim penghujan.
```

---

## Langkah 2. Siapkan foto berita

Apabila berita memiliki foto:

1. Simpan foto ke folder

```
assets/berita/
```

2. Gunakan nama file yang mudah dikenali.

Contoh:

```
kerja-bakti-2026.jpg
```

atau

```
musyawarah-desa.jpeg
```

**Disarankan**

- format JPG atau PNG
- ukuran maksimal sekitar 500 KB
- lebar minimal 1000 pixel agar hasilnya tetap jelas

---

## Langkah 3. Buka file berita

Buka file

```
data/berita.json
```

Di dalam file tersebut terdapat beberapa berita yang bentuknya seperti berikut.

```json
{
  "id": "berita-001",
  "judul": "...",
  "tanggal": "...",
  ...
}
```

Setiap blok seperti di atas adalah **1 berita**.

---

## Langkah 4. Tambahkan berita baru

Scroll hingga bagian paling bawah.

Tambahkan objek berita baru.

Jangan menghapus berita yang sudah ada.

Tambahkan **koma ( , )** setelah berita sebelumnya apabila diperlukan.

Contoh:

```json
[
   {
      berita pertama
   },

   {
      berita kedua
   },

   {
      berita baru
   }
]
```

Perhatikan bahwa setiap berita dipisahkan dengan tanda koma.

---

## Langkah 5. Isi ID berita

Setiap berita harus memiliki ID yang berbeda.

Contoh:

```
berita-001
berita-002
berita-003
```

Apabila berita terakhir adalah

```
berita-008
```

maka berita berikutnya menjadi

```
berita-009
```

Jangan menggunakan ID yang sama karena dapat menyebabkan berita tidak tampil dengan benar.

---

## Langkah 6. Isi Judul

Cari bagian

```json
"judul":
```

Kemudian isi dengan judul berita.

Contoh:

```json
"judul": "Kerja Bakti Membersihkan Saluran Air"
```

Judul ini akan tampil:

- pada halaman Berita Desa
- pada halaman utama
- pada halaman detail berita

---

## Langkah 7. Isi Tanggal

Cari bagian

```json
"tanggal":
```

Gunakan format:

```
YYYY-MM-DD
```

Contoh:

```json
"tanggal": "2026-08-12"
```

Jangan menulis seperti:

```
12 Agustus 2026
```

atau

```
12/08/2026
```

karena website tidak dapat mengurutkan berita dengan benar.

---

## Langkah 8. Isi Kategori

Cari bagian

```json
"kategori":
```

Contoh:

```json
"kategori": "Pembangunan"
```

atau

```json
"kategori": "Gotong Royong"
```

atau

```json
"kategori": "Pemerintahan"
```

Kategori akan muncul sebagai label pada kartu berita.

---

## Langkah 9. Isi Ringkasan

Cari bagian

```json
"ringkasan":
```

Isi dengan 1–2 kalimat pendek.

Contoh:

```json
"ringkasan": "Pemerintah Desa bersama warga melaksanakan kerja bakti membersihkan saluran air."
```

Ringkasan ini akan tampil pada kartu berita.

---

## Langkah 10. Isi Konten Berita

Cari bagian

```json
"konten":
```

Isi dengan isi berita lengkap.

Contoh:

```json
"konten": "Pemerintah Desa Glagah bersama masyarakat melaksanakan kerja bakti membersihkan saluran air di Dusun Krajan. Kegiatan ini diikuti oleh perangkat desa, RT, RW, Karang Taruna, dan warga sekitar. Melalui kegiatan tersebut diharapkan lingkungan menjadi lebih bersih dan saluran air tidak tersumbat."
```

Semakin lengkap isi berita, semakin baik informasi yang diterima masyarakat.

---

## Langkah 11. Menambahkan Foto

Jika berita memiliki foto, ubah bagian

```json
"foto": null
```

menjadi

```json
"foto": "assets/berita/kerja-bakti-2026.jpg"
```

Pastikan:

- nama file sama persis
- huruf besar dan kecil sama
- file benar-benar berada di folder

```
assets/berita/
```

Jika nama file berbeda sedikit saja, foto tidak akan muncul.

---

## Langkah 12. Simpan File

Tekan

```
Ctrl + S
```

untuk menyimpan perubahan.

---

## Langkah 13. Periksa Kembali

Sebelum mengunggah website, pastikan:

✅ Tidak ada tanda koma yang hilang.

✅ Semua tanda kutip lengkap.

✅ Nama file foto benar.

✅ Tanggal menggunakan format YYYY-MM-DD.

✅ ID berita tidak sama dengan berita lain.

---

## Contoh Berita Lengkap

```json
{
  "id": "berita-009",
  "judul": "Kerja Bakti Membersihkan Saluran Air",
  "tanggal": "2026-08-12",
  "kategori": "Gotong Royong",
  "ringkasan": "Pemerintah Desa bersama warga melaksanakan kerja bakti membersihkan saluran air.",
  "konten": "Pemerintah Desa Glagah bersama masyarakat melaksanakan kerja bakti membersihkan saluran air di Dusun Krajan. Kegiatan ini diikuti perangkat desa dan masyarakat untuk menjaga kebersihan lingkungan serta mencegah banjir.",
  "foto": "assets/berita/kerja-bakti-2026.jpg"
}
```

---

## Setelah Berita Ditambahkan

Setelah file disimpan dan website diperbarui, berita akan otomatis muncul pada:

- Halaman **Beranda** sebagai Berita Terkini.
- Halaman **Berita Desa**.
- Halaman **Detail Berita** ketika berita diklik.

Tidak perlu mengubah file lain selain `data/berita.json`, kecuali ingin menambahkan foto ke folder `assets/berita/`.
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

Setiap produk punya halaman detail sendiri di `#/umkm/<id>` (contoh:
`#/umkm/umkm-001`), berisi foto besar, deskripsi lengkap, lokasi, tombol
"Hubungi via WhatsApp" (dengan link cadangan "Buka lewat browser" kalau
aplikasi WhatsApp tidak terinstal), dan daftar produk sejenis lainnya.
Kartu di halaman katalog cukup diklik untuk membuka halaman detail ini.

**Penting soal nama file foto:** GitHub Pages bersifat *case-sensitive* —
`Cahaya-Cake.jpeg` dan `cahaya-cake.jpeg` dianggap dua file berbeda. Pastikan
huruf besar/kecil pada nama file yang diunggah ke `assets/umkm/` **persis
sama** dengan yang ditulis di field `foto` pada `umkm.json`, atau foto tidak
akan tampil sama sekali walau tidak ada pesan error yang terlihat.

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
6. Simpan file, lalu `git commit` + `git push` agar lowongan tampil di
   halaman **Lowongan Pekerjaan**.

**Alur lowongan dari pengunjung (via formulir "Pasang Lowongan"):** seperti
dijelaskan di bagian "Alur data Git-based" di atas, lowongan yang diisi
pengunjung lewat formulir di halaman Lowongan **tidak otomatis** masuk ke
`data/jobs.json` — admin menerima ringkasannya via WhatsApp, lalu perlu
menyalin isinya secara manual mengikuti struktur di atas dan melakukan
langkah 1-6 supaya lowongan tersebut resmi tampil bagi semua pengunjung.
Formulir pengunjung sendiri tidak punya field foto — cukup teks.
