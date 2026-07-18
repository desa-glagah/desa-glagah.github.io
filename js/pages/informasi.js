// js/pages/informasi.js

const DG_DEMOGRAFI = [
  { label: 'Total Penduduk', value: '3.482 jiwa', icon: 'users' },
  { label: 'Kepala Keluarga', value: '1.024 KK', icon: 'home' },
  { label: 'Mata Pencaharian Utama', value: 'Petani & Buruh Tani', icon: 'sprout' },
  { label: 'Luas Wilayah', value: '± 4,2 km²', icon: 'map' },
];

const DG_ICONS = {
  users: '<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 10-4-4 4 4 0 004 4zm6-2a3 3 0 11-3-3"/>',
  home: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9 9 9M5 10v10h14V10"/>',
  sprout: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 22v-8m0 0c-4 0-7-3-7-7 4 0 7 3 7 7zm0 0c0-5 3-8 7-8-1 5-3 8-7 8z"/>',
  map: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>',
};

async function dgRenderInformasi(container) {
  container.innerHTML = `
    <section class="hero-photo-header">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p class="dg-badge text-amber-400 mb-2">Profil Wilayah</p>
        <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">Informasi Desa Glagah</h1>
        <p class="text-emerald-100 max-w-2xl text-sm sm:text-base">
          Desa Glagah, Kecamatan Pakuniran, Kabupaten Probolinggo — mengenal wilayah dan data warga.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h2 class="font-display text-xl font-bold text-emerald-950 mb-4">Letak Geografis</h2>
      <div class="grid md:grid-cols-5 gap-5 mb-12">
        <div class="md:col-span-3 rounded-xl overflow-hidden border border-emerald-100 shadow-sm aspect-video">
          <iframe
            title="Peta lokasi Kantor Desa Glagah, Kecamatan Pakuniran, Kabupaten Probolinggo"
            class="w-full h-full"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Kantor+Desa+Glagah,+Pakuniran,+Probolinggo&output=embed">
          </iframe>
        </div>
        <div class="md:col-span-2 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm text-sm text-gray-600 space-y-3">
          <p>Desa Glagah terletak di Kecamatan Pakuniran, Kabupaten Probolinggo, Provinsi Jawa Timur, dengan topografi dataran yang didominasi lahan pertanian dan permukiman warga.</p>
          <p>Desa ini berbatasan dengan desa-desa tetangga di wilayah Kecamatan Pakuniran dan dilalui akses jalan penghubung antar dusun.</p>
        </div>
      </div>

      <h2 class="font-display text-xl font-bold text-emerald-950 mb-4">Data Kependudukan</h2>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${DG_DEMOGRAFI.map((d) => `
          <div class="dg-card rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div class="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${DG_ICONS[d.icon]}</svg>
            </div>
            <p class="text-2xl font-display font-extrabold text-emerald-950">${dgEscapeHTML(d.value)}</p>
            <p class="text-sm text-gray-500 mt-0.5">${dgEscapeHTML(d.label)}</p>
          </div>
        `).join('')}
      </div>

      <p class="mt-8 text-sm text-gray-500">
        Ingin tahu lebih jauh tentang visi, misi, dan jajaran perangkat desa?
        Kunjungi halaman <a href="#/profil" class="text-emerald-800 font-medium hover:text-amber-600 transition-colors">Profil Desa</a>.
      </p>
    </section>
  `;
}
