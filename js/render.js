// js/render.js
// Shared HTML-rendering helpers used by multiple pages.

function dgEscapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function dgFormatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

const DG_TIPE_STYLES = {
  Harian: 'bg-sky-100 text-sky-800',
  'Waktu Penuh': 'bg-emerald-100 text-emerald-800',
  'Paruh Waktu': 'bg-amber-100 text-amber-800',
};

function dgJobCardHTML(job) {
  const tipeStyle = DG_TIPE_STYLES[job.tipe] || 'bg-gray-100 text-gray-700';
  const batas = dgFormatDate(job.batas);
  const applyMsg = dgJobApplyMessage(job.judul, job.usaha);
  const waLink = dgBuildWhatsAppLink(job.whatsapp, applyMsg);

  return `
    <article class="dg-card rounded-xl border border-emerald-100 bg-white p-5 shadow-sm flex flex-col">
      ${job._pending ? `<span class="dg-badge inline-block mb-2 w-fit rounded-full bg-amber-100 text-amber-700 px-2.5 py-1">Menunggu Verifikasi Admin</span>` : ''}
      <div class="flex items-start justify-between gap-2 mb-1">
        <h3 class="font-display font-bold text-emerald-950 leading-snug">${dgEscapeHTML(job.judul)}</h3>
        <span class="dg-badge shrink-0 rounded-full px-2.5 py-1 ${tipeStyle}">${dgEscapeHTML(job.tipe)}</span>
      </div>
      <p class="text-sm text-emerald-800 font-medium mb-1">${dgEscapeHTML(job.usaha)}</p>
      <p class="text-sm text-gray-500 mb-3 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        ${dgEscapeHTML(job.lokasi)}
      </p>
      <p class="text-sm text-gray-600 mb-4 line-clamp-3">${dgEscapeHTML(job.deskripsi)}</p>
      <div class="mt-auto pt-3 border-t border-emerald-50 flex items-center justify-between gap-3">
        <div class="text-sm">
          ${job.gaji ? `<p class="font-semibold text-emerald-900">${dgEscapeHTML(job.gaji)}</p>` : '<p class="text-gray-400">Gaji: nego</p>'}
          ${batas ? `<p class="text-xs text-gray-400">Batas lamaran: ${batas}</p>` : ''}
        </div>
        <a href="${waLink}" target="_blank" rel="noopener noreferrer"
           class="shrink-0 inline-flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
          Lamar
        </a>
      </div>
    </article>
  `;
}

function dgUmkmCardHTML(item) {
  const waMsg = dgUmkmContactMessage(item.nama);
  const waLink = dgBuildWhatsAppLink(item.whatsapp, waMsg);
  return `
    <article class="dg-card rounded-xl border border-emerald-100 bg-white overflow-hidden shadow-sm flex flex-col" data-kategori="${dgEscapeHTML(item.kategori)}">
      <div class="h-36 bg-emerald-50 flex items-center justify-center text-emerald-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4V4zm4 4h8v8H8V8z"/></svg>
      </div>
      <div class="p-4 flex flex-col flex-1">
        <span class="dg-badge inline-block mb-2 w-fit rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1">${dgEscapeHTML(item.kategori)}</span>
        <h3 class="font-display font-bold text-emerald-950 leading-snug mb-1">${dgEscapeHTML(item.nama)}</h3>
        <p class="text-sm text-gray-600 mb-3 line-clamp-3">${dgEscapeHTML(item.deskripsi)}</p>
        <div class="mt-auto pt-3 border-t border-emerald-50 flex items-center justify-between gap-3">
          <p class="text-sm font-semibold text-amber-600">${dgEscapeHTML(item.harga)}</p>
          <a href="${waLink}" target="_blank" rel="noopener noreferrer"
             class="shrink-0 inline-flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.14-1.35a10 10 0 004.9 1.25h.01c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.15h-.01a8.16 8.16 0 01-4.16-1.14l-.3-.18-3.05.8.82-2.97-.2-.31a8.15 8.15 0 01-1.25-4.35c0-4.5 3.66-8.16 8.16-8.16a8.1 8.1 0 015.77 2.39 8.1 8.1 0 012.39 5.77c0 4.5-3.67 8.16-8.17 8.16zm4.47-6.12c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  `;
}

const DG_BERITA_KATEGORI_STYLES = {
  Pembangunan: 'bg-sky-100 text-sky-800',
  Ekonomi: 'bg-amber-100 text-amber-800',
  Kesehatan: 'bg-rose-100 text-rose-800',
  Pertanian: 'bg-emerald-100 text-emerald-800',
  Lingkungan: 'bg-teal-100 text-teal-800',
};

function dgBeritaCardHTML(berita) {
  const tanggal = dgFormatDate(berita.tanggal);
  const kategoriStyle = DG_BERITA_KATEGORI_STYLES[berita.kategori] || 'bg-gray-100 text-gray-700';
  return `
    <article class="dg-card rounded-xl border border-emerald-100 bg-white overflow-hidden shadow-sm flex flex-col cursor-pointer" data-berita-id="${dgEscapeHTML(berita.id)}">
      <div class="h-36 bg-emerald-50 flex items-center justify-center text-emerald-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6M9 16h6M9 8h2"/></svg>
      </div>
      <div class="p-4 flex flex-col flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="dg-badge rounded-full px-2.5 py-1 ${kategoriStyle}">${dgEscapeHTML(berita.kategori)}</span>
          ${tanggal ? `<span class="text-xs text-gray-400">${tanggal}</span>` : ''}
        </div>
        <h3 class="font-display font-bold text-emerald-950 leading-snug mb-1.5">${dgEscapeHTML(berita.judul)}</h3>
        <p class="text-sm text-gray-600 line-clamp-3 mb-3">${dgEscapeHTML(berita.ringkasan)}</p>
        <p class="mt-auto text-sm font-semibold text-emerald-800">Baca selengkapnya &rarr;</p>
      </div>
    </article>
  `;
}

/**
 * Wires up click handlers on any [data-berita-id] card inside `root` so it
 * opens a shared read-more modal. `beritaList` must contain the full items
 * (with `konten`) matching the ids rendered in `root`.
 */
function dgBindBeritaCards(root, beritaList) {
  root.querySelectorAll('[data-berita-id]').forEach((card) => {
    card.addEventListener('click', () => {
      const item = beritaList.find((b) => b.id === card.dataset.beritaId);
      if (item) dgOpenBeritaModal(item);
    });
  });
}

function dgOpenBeritaModal(berita) {
  const tanggal = dgFormatDate(berita.tanggal);
  const existing = document.getElementById('dg-berita-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'dg-berita-modal';
  modal.className = 'fixed inset-0 z-50';
  modal.innerHTML = `
    <div class="absolute inset-0 bg-emerald-950/60" data-close-berita-modal></div>
    <div class="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center">
      <div class="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        <button type="button" data-close-berita-modal aria-label="Tutup berita"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="flex items-center gap-2 mb-3">
          <span class="dg-badge rounded-full px-2.5 py-1 ${DG_BERITA_KATEGORI_STYLES[berita.kategori] || 'bg-gray-100 text-gray-700'}">${dgEscapeHTML(berita.kategori)}</span>
          ${tanggal ? `<span class="text-xs text-gray-400">${tanggal}</span>` : ''}
        </div>
        <h2 class="font-display text-2xl font-bold text-emerald-950 mb-4 leading-snug">${dgEscapeHTML(berita.judul)}</h2>
        <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">${dgEscapeHTML(berita.konten)}</p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  const close = () => {
    modal.remove();
    document.body.style.overflow = '';
  };
  modal.querySelectorAll('[data-close-berita-modal]').forEach((el) => el.addEventListener('click', close));
}
