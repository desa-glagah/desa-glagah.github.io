# Website Desa Glagah

Website statis untuk **Desa Glagah, Kecamatan Pakuniran, Kabupaten Probolinggo**.
Dibangun dengan HTML, JavaScript (vanilla), dan Tailwind CSS (via CDN) — tanpa
proses build, tanpa backend/database server. Semua data bersumber dari file
JSON di folder `data/` (arsitektur data berbasis Git).

## Struktur Proyek

```
desa-glagah/
├── index.html              # Shell utama + navigasi + outlet router
├── css/
│   └── style.css           # Watermark hero, fokus keyboard, kartu, dsb.
├── js/
│   ├── app.js               # Router hash (#/lowongan, #/informasi, #/umkm)
│   ├── data.js               # Ambil data JSON + localStorage untuk lowongan baru
│   ├── whatsapp.js            # Sanitasi nomor & pembuat link wa.me
│   ├── render.js               # Komponen kartu lowongan & UMKM (dipakai bersama)
│   └── pages/
│       ├── home.js              # Hero + pencarian gabungan
│       ├── lowongan.js           # Papan lowongan + formulir "Pasang Lowongan"
│       ├── informasi.js           # Profil desa, demografi, struktur perangkat
│       └── umkm.js                 # Katalog UMKM + filter kategori
├── data/
│   ├── jobs.json             # Data lowongan (sumber kebenaran)
│   └── umkm.json              # Data produk UMKM (sumber kebenaran)
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
2. Pengelola website (admin desa) meninjau data tersebut, lalu menambahkannya
   secara manual ke `data/jobs.json` dan melakukan `git commit` + `git push`
   agar lowongan resmi tampil bagi semua pengunjung.

Ini konsisten dengan arsitektur "Git-based data" tanpa database — jika ke
depan dibutuhkan alur yang lebih otomatis, `data.js` sudah terisolasi
sehingga cukup diganti untuk memanggil layanan backend/Google Form/Sheet API.

## Kustomisasi Nomor WhatsApp

Nomor WhatsApp pada `data/jobs.json` dan `data/umkm.json` memakai data contoh
(`6281234567xxx`). Ganti dengan nomor asli pemilik usaha/pemberi kerja sebelum
publikasi. Format yang diterima: diawali `0` (mis. `0812xxxx`, otomatis
dikonversi ke `62`) atau langsung `62812xxxx`.
