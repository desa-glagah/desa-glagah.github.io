// js/pages/umkm.js

async function dgRenderUMKM(container) {
  container.innerHTML = `
    <section class="hero-photo-header">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p class="dg-badge text-amber-400 mb-2">Belanja Produk Warga</p>
        <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">Katalog UMKM</h1>
        <p class="text-emerald-100 max-w-2xl text-sm sm:text-base">
          Produk unggulan hasil karya warga Desa Glagah. Hubungi penjual langsung lewat WhatsApp.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div id="dg-umkm-filters" class="flex flex-wrap gap-2 mb-6"></div>
      <div id="dg-umkm-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${Array.from({ length: 6 }).map(() => `<div class="dg-skeleton h-64 rounded-xl"></div>`).join('')}
      </div>
    </section>
  `;

  const filtersEl = container.querySelector('#dg-umkm-filters');
  const gridEl = container.querySelector('#dg-umkm-grid');

  const items = await dgLoadUMKM();
  const kategoris = ['Semua', ...Array.from(new Set(items.map((i) => i.kategori)))];
  let active = 'Semua';

  function renderFilters() {
    filtersEl.innerHTML = kategoris.map((k) => `
      <button type="button" data-kategori="${dgEscapeHTML(k)}"
        class="dg-filter-btn text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
          k === active
            ? 'bg-emerald-900 text-white border-emerald-900'
            : 'bg-white text-emerald-900 border-emerald-200 hover:border-emerald-400'
        }">
        ${dgEscapeHTML(k)}
      </button>
    `).join('');

    filtersEl.querySelectorAll('.dg-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        active = btn.dataset.kategori;
        renderFilters();
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const filtered = active === 'Semua' ? items : items.filter((i) => i.kategori === active);
    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="col-span-full rounded-xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center">
          <p class="text-emerald-900 font-medium">Belum ada produk pada kategori ini</p>
        </div>`;
      return;
    }
    gridEl.innerHTML = filtered.map(dgUmkmCardHTML).join('');
  }

  renderFilters();
  renderGrid();
}

async function dgRenderUMKMDetail(container, id) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div class="dg-skeleton h-72 rounded-xl mb-6"></div>
      <div class="dg-skeleton h-8 rounded-lg mb-3 w-3/4"></div>
      <div class="dg-skeleton h-4 rounded-lg mb-2 w-full"></div>
      <div class="dg-skeleton h-4 rounded-lg w-5/6"></div>
    </div>
  `;

  const items = await dgLoadUMKM();
  const item = items.find((i) => i.id === id);

  if (!item) {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p class="font-display text-xl font-bold text-emerald-950 mb-2">Produk tidak ditemukan</p>
        <p class="text-sm text-gray-500 mb-6">Produk yang kamu cari mungkin sudah dihapus atau tautannya salah.</p>
        <a href="#/umkm" class="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
          &larr; Kembali ke Katalog UMKM
        </a>
      </div>`;
    return;
  }

  const kategoriStyle = DG_UMKM_KATEGORI_STYLES[item.kategori] || 'bg-emerald-100 text-emerald-800';
  const waMsg = dgUmkmContactMessage(item.nama);
  const waLink = dgBuildWhatsAppLink(item.whatsapp, waMsg);
  const waWebLink = dgBuildWhatsAppWebLink(item.whatsapp, waMsg);
  const lainnya = items.filter((i) => i.id !== item.id && i.kategori === item.kategori).slice(0, 3);

  container.innerHTML = `
    <article class="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <a href="#/umkm" class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-amber-600 transition-colors mb-5">
        &larr; Kembali ke Katalog UMKM
      </a>

      <div class="rounded-xl overflow-hidden border border-emerald-100 shadow-sm mb-6">
        ${dgUmkmThumbHTML(item, 'h-56 sm:h-80')}
      </div>

      <span class="dg-badge inline-block mb-3 rounded-full px-2.5 py-1 ${kategoriStyle}">${dgEscapeHTML(item.kategori)}</span>

      <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-emerald-950 mb-2 leading-snug">
        ${dgEscapeHTML(item.nama)}
      </h1>

      <p class="text-lg font-semibold text-amber-600 mb-6">${dgEscapeHTML(item.harga)}</p>

      <div class="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line mb-6">
        ${dgEscapeHTML(item.deskripsi)}
      </div>

      ${dgUmkmMenuHTML(item.menu)}

      ${item.lokasi ? `
        <p class="text-sm text-gray-500 mb-6 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>${dgEscapeHTML(item.lokasi)}</span>
        </p>
      ` : ''}

      <a href="${waLink}" target="_blank" rel="noopener noreferrer"
         class="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.14-1.35a10 10 0 004.9 1.25h.01c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.15h-.01a8.16 8.16 0 01-4.16-1.14l-.3-.18-3.05.8.82-2.97-.2-.31a8.15 8.15 0 01-1.25-4.35c0-4.5 3.66-8.16 8.16-8.16a8.1 8.1 0 015.77 2.39 8.1 8.1 0 012.39 5.77c0 4.5-3.67 8.16-8.17 8.16zm4.47-6.12c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/></svg>
        Hubungi via WhatsApp
      </a>
      <a href="${waWebLink}" target="_blank" rel="noopener noreferrer"
         class="block mt-2 text-xs text-gray-400 hover:text-emerald-700 transition-colors">
        Tidak ada aplikasi WhatsApp? Buka lewat browser
      </a>
    </article>

    ${lainnya.length ? `
      <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <h2 class="font-display text-xl font-bold text-emerald-950 mb-5">Produk Sejenis Lainnya</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${lainnya.map(dgUmkmCardHTML).join('')}
        </div>
      </section>
    ` : ''}
  `;
}
