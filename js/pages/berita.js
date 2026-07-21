// js/pages/berita.js

async function dgRenderBerita(container) {
  container.innerHTML = `
    <section class="hero-photo-header">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p class="dg-badge text-amber-400 mb-2">Kabar Desa</p>
        <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">Berita Desa</h1>
        <p class="text-emerald-100 max-w-2xl text-sm sm:text-base">
          Kabar dan kegiatan terkini dari Desa Glagah, Kecamatan Pakuniran, Kabupaten Probolinggo.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div id="dg-berita-filters" class="flex flex-wrap gap-2 mb-6"></div>
      <div id="dg-berita-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${Array.from({ length: 6 }).map(() => `<div class="dg-skeleton h-64 rounded-xl"></div>`).join('')}
      </div>
    </section>
  `;

  const filtersEl = container.querySelector('#dg-berita-filters');
  const gridEl = container.querySelector('#dg-berita-grid');

  const beritaList = await dgLoadBerita();
  const kategoris = ['Semua', ...Array.from(new Set(beritaList.map((b) => b.kategori)))];
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
    const filtered = active === 'Semua' ? beritaList : beritaList.filter((b) => b.kategori === active);
    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="col-span-full rounded-xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center">
          <p class="text-emerald-900 font-medium">Belum ada berita pada kategori ini</p>
        </div>`;
      return;
    }
    gridEl.innerHTML = filtered.map(dgBeritaCardHTML).join('');
  }

  if (beritaList.length === 0) {
    filtersEl.innerHTML = '';
    gridEl.innerHTML = `
      <div class="col-span-full rounded-xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <p class="text-emerald-900 font-medium">Belum ada berita saat ini</p>
      </div>`;
    return;
  }

  renderFilters();
  renderGrid();
}

async function dgRenderBeritaDetail(container, id) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div class="dg-skeleton h-72 rounded-xl mb-6"></div>
      <div class="dg-skeleton h-8 rounded-lg mb-3 w-3/4"></div>
      <div class="dg-skeleton h-4 rounded-lg mb-2 w-full"></div>
      <div class="dg-skeleton h-4 rounded-lg w-5/6"></div>
    </div>
  `;

  const beritaList = await dgLoadBerita();
  const berita = beritaList.find((b) => b.id === id);

  if (!berita) {
    container.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p class="font-display text-xl font-bold text-emerald-950 mb-2">Berita tidak ditemukan</p>
        <p class="text-sm text-gray-500 mb-6">Berita yang kamu cari mungkin sudah dihapus atau tautannya salah.</p>
        <a href="#/berita" class="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
          &larr; Kembali ke Berita
        </a>
      </div>`;
    return;
  }

  const tanggal = dgFormatDate(berita.tanggal);
  const kategoriStyle = DG_BERITA_KATEGORI_STYLES[berita.kategori] || 'bg-gray-100 text-gray-700';
  const lainnya = beritaList.filter((b) => b.id !== berita.id).slice(0, 3);

  container.innerHTML = `
    <article class="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <a href="#/berita" class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-amber-600 transition-colors mb-5">
        &larr; Kembali ke Berita
      </a>

      <div class="rounded-xl overflow-hidden border border-emerald-100 shadow-sm mb-6">
        ${dgBeritaThumbHTML(berita, 'h-56 sm:h-80')}
      </div>

      <div class="flex items-center gap-2 mb-3">
        <span class="dg-badge rounded-full px-2.5 py-1 ${kategoriStyle}">${dgEscapeHTML(berita.kategori)}</span>
        ${tanggal ? `<span class="text-xs text-gray-400">${tanggal}</span>` : ''}
      </div>

      <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-emerald-950 mb-6 leading-snug">
        ${dgEscapeHTML(berita.judul)}
      </h1>

      <div class="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
        ${dgEscapeHTML(berita.konten)}
      </div>
    </article>

    ${lainnya.length ? `
      <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <h2 class="font-display text-xl font-bold text-emerald-950 mb-5">Berita Lainnya</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          ${lainnya.map(dgBeritaCardHTML).join('')}
        </div>
      </section>
    ` : ''}
  `;
}
