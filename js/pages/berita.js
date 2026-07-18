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
    dgBindBeritaCards(gridEl, beritaList);
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
