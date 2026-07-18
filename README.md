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
│   ├── app.js               # Router hash (#/lowongan, #/informasi, #/profil, #/umkm, #/berita)
│   ├── data.js               # Ambil data JSON + localStorage untuk lowongan baru
│   ├── whatsapp.js            # Sanitasi nomor & pembuat link wa.me
│   ├── render.js               # Komponen kartu lowongan, UMKM, berita (dipakai bersama)
│   └── pages/
│       ├── home.js              # Hero + pencarian gabungan + preview berita terkini
│       ├── lowongan.js           # Papan lowongan + formulir "Pasang Lowongan"
│       ├── informasi.js           # Letak geografis + data kependudukan
│       ├── profil.js               # Visi & misi + struktur perangkat desa
│       ├── umkm.js                  # Katalog UMKM + filter kategori
│       └── berita.js                 # Daftar berita desa + filter kategori + modal baca
├── data/
│   ├── jobs.json             # Data lowongan (sumber kebenaran)
│   ├── umkm.json              # Data produk UMKM (sumber kebenaran)
│   └── berita.json             # Data berita desa (sumber kebenaran)
├── assets/
│   └── perangkat/            # Foto perangkat desa
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
2. WhatsApp otomatis terbuka berisi ringkasan lowongan yang dikirim ke nomor
   admin desa, sehingga admin langsung mendapat notifikasi tanpa perlu
   mengecek localStorage secara manual.
3. Pengelola website (admin desa) meninjau data tersebut, lalu menambahkannya
   secara manual ke `data/jobs.json` dan melakukan `git commit` + `git push`
   agar lowongan resmi tampil bagi semua pengunjung.

**Penting:** ganti nomor WhatsApp admin di `js/pages/lowongan.js`, konstanta
`DG_ADMIN_WHATSAPP` (masih placeholder `6281234500000`), dengan nomor asli
sebelum publikasi — kalau tidak, notifikasi lowongan baru tidak akan sampai
ke siapa pun.

Ini konsisten dengan arsitektur "Git-based data" tanpa database — jika ke
depan dibutuhkan alur yang lebih otomatis, `data.js` sudah terisolasi
sehingga cukup diganti untuk memanggil layanan backend/Google Form/Sheet API.

## Kustomisasi Nomor WhatsApp

Nomor WhatsApp pada `data/jobs.json` dan `data/umkm.json` memakai data contoh
(`6281234567xxx`). Ganti dengan nomor asli pemilik usaha/pemberi kerja sebelum
publikasi. Format yang diterima: diawali `0` (mis. `0812xxxx`, otomatis
dikonversi ke `62`) atau langsung `62812xxxx`.

## Menambahkan Foto Perangkat Desa

Foto perangkat desa diatur di `js/pages/profil.js`, pada array `DG_STRUKTUR`.
Setiap jabatan **sudah punya path foto siap pakai** — kamu tinggal
menyimpan file foto dengan nama yang sesuai ke folder `assets/perangkat/`,
tidak perlu mengedit kode sama sekali:

| Jabatan | Path yang harus diisi |
|---|---|
| Kepala Desa | `assets/perangkat/kepala-desa.jpg` |
| Sekretaris Desa | `assets/perangkat/sekretaris-desa.jpg` |
| Kepala Urusan Keuangan | `assets/perangkat/kaur-keuangan.jpg` |
| Kepala Urusan Umum | `assets/perangkat/kaur-umum.jpg` |
| Kepala Seksi Pemerintahan | `assets/perangkat/kasi-pemerintahan.jpg` |
| Kepala Seksi Kesejahteraan | `assets/perangkat/kasi-kesejahteraan.jpg` |
| Kepala Dusun Krajan | `assets/perangkat/kadus-krajan.jpg` |
| Kepala Dusun Sumberejo | `assets/perangkat/kadus-sumberejo.jpg` |

**Catatan:** foto baru akan tampil untuk jabatan yang `nama`-nya sudah diisi
(bukan `-`). Kalau nama masih `-` ("Belum terisi"), situs sengaja
menampilkan avatar placeholder walau file foto sudah ada di folder — supaya
tidak menampilkan foto orang di jabatan yang belum resmi terisi. Jadi urutan
kerjanya: isi `nama` di `DG_STRUKTUR` dulu, lalu taruh foto dengan nama file
sesuai tabel di atas, foto akan otomatis muncul.

Tidak perlu foto dengan ukuran/rasio persis sama — foto akan otomatis
dipotong jadi bulat (`object-cover`). Disarankan foto persegi (mis. 400x400px)
dan ukuran file di bawah 200KB per foto agar halaman tetap cepat dimuat.

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
