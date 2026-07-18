// js/pages/home.js

async function dgRenderHome(container) {
  container.innerHTML = `
    <section class="hero-watermark relative overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
        <p class="dg-badge text-amber-400 mb-3">Kecamatan Pakuniran &middot; Kabupaten Probolinggo</p>
        <h1 class="font-display text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-4">GLAGAH</h1>
        <p class="text-emerald-50 text-base sm:text-lg max-w-xl mb-8">
          Gotong Royong Menuju Desa Mandiri, Humanis, dan Berkelanjutan
        </p>

        <form id="dg-search-form" class="w-full max-w-xl" role="search" aria-label="Pencarian situs desa">
          <label for="dg-search-input" class="sr-only">Cari lowongan, produk UMKM, atau informasi desa</label>
          <div class="flex items-center bg-amber-500 focus-within:bg-amber-400 rounded-full shadow-lg pl-5 pr-2 py-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-950 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.65 4.65a7.5 7.5 0 0011.99 11.99z" />
            </svg>
            <input
              id="dg-search-input"
              type="text"
              placeholder="Cari lowongan kerja, produk UMKM, atau informasi desa..."
              class="w-full bg-transparent border-0 focus:ring-0 outline-none px-3 py-2 text-sm sm:text-base text-emerald-950 placeholder-emerald-900/60"
            />
            <button type="submit" class="shrink-0 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
              Cari
            </button>
          </div>
        </form>
      </div>
    </section>

    <section id="dg-search-results" class="max-w-6xl mx-auto px-4 sm:px-6 -mt-1"></section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-5">
      <a href="#/lowongan" class="dg-card block rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div class="h-10 w-10 rounded-lg bg-emerald-900 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7h-3V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2H4a1 1 0 00-1 1v10a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM9 5h6v2H9V5z"/></svg>
        </div>
        <h3 class="font-display font-bold text-lg text-emerald-950 mb-1">Lowongan Pekerjaan</h3>
        <p class="text-sm text-gray-600">Info pekerjaan harian, paruh waktu, dan penuh waktu di sekitar Desa Glagah.</p>
      </a>
      <a href="#/informasi" class="dg-card block rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div class="h-10 w-10 rounded-lg bg-emerald-900 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zM12 8v5l3 3"/></svg>
        </div>
        <h3 class="font-display font-bold text-lg text-emerald-950 mb-1">Informasi Desa</h3>
        <p class="text-sm text-gray-600">Profil, data kependudukan, dan struktur perangkat Desa Glagah.</p>
      </a>
      <a href="#/umkm" class="dg-card block rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div class="h-10 w-10 rounded-lg bg-emerald-900 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h18M4 3v14a2 2 0 002 2h12a2 2 0 002-2V3M9 21V12h6v9"/></svg>
        </div>
        <h3 class="font-display font-bold text-lg text-emerald-950 mb-1">Katalog UMKM</h3>
        <p class="text-sm text-gray-600">Produk unggulan warga: kuliner, kerajinan, dan hasil pertanian.</p>
      </a>
    </section>
  `;

  const form = container.querySelector('#dg-search-form');
  const input = container.querySelector('#dg-search-input');
  const results = container.querySelector('#dg-search-results');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '';
      return;
    }
    results.innerHTML = `<div class="dg-skeleton h-24 rounded-xl my-6"></div>`;

    const [jobs, umkm] = await Promise.all([dgLoadJobs(), dgLoadUMKM()]);
    const matchedJobs = jobs.filter((j) =>
      `${j.judul} ${j.usaha} ${j.lokasi} ${j.deskripsi}`.toLowerCase().includes(q)
    );
    const matchedUmkm = umkm.filter((u) =>
      `${u.nama} ${u.kategori} ${u.deskripsi}`.toLowerCase().includes(q)
    );

    if (matchedJobs.length === 0 && matchedUmkm.length === 0) {
      results.innerHTML = `
        <div class="my-6 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center">
          <p class="text-emerald-900 font-medium">Tidak ada hasil untuk "${dgEscapeHTML(input.value)}"</p>
          <p class="text-sm text-gray-600 mt-1">Coba kata kunci lain, misalnya "kripik", "tani", atau "kasir".</p>
        </div>`;
      return;
    }

    results.innerHTML = `
      <div class="my-6 space-y-8">
        ${matchedJobs.length ? `
          <div>
            <h2 class="font-display font-bold text-emerald-950 mb-3">Lowongan (${matchedJobs.length})</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              ${matchedJobs.map(dgJobCardHTML).join('')}
            </div>
          </div>` : ''}
        ${matchedUmkm.length ? `
          <div>
            <h2 class="font-display font-bold text-emerald-950 mb-3">Produk UMKM (${matchedUmkm.length})</h2>
            <div class="grid sm:grid-cols-3 gap-4">
              ${matchedUmkm.map(dgUmkmCardHTML).join('')}
            </div>
          </div>` : ''}
      </div>
    `;
  });
}
