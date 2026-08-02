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
  const waWebLink = dgBuildWhatsAppWebLink(job.whatsapp, applyMsg);

  return `
    <article class="dg-card rounded-xl border border-emerald-100 bg-white p-5 shadow-sm flex flex-col">
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
        <div class="shrink-0 flex flex-col items-end gap-1">
          <a href="${waLink}" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
            Lamar
          </a>
          <a href="${waWebLink}" target="_blank" rel="noopener noreferrer"
             class="text-xs text-gray-400 hover:text-emerald-700 transition-colors">
            Tidak ada aplikasi WhatsApp? Buka lewat browser
          </a>
        </div>
      </div>
    </article>
  `;
}

const DG_UMKM_KATEGORI_STYLES = {
  Kuliner: 'bg-amber-100 text-amber-800',
  Pertanian: 'bg-emerald-100 text-emerald-800',
  Kerajinan: 'bg-indigo-100 text-indigo-800',
};

const DG_UMKM_PLACEHOLDER_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4V4zm4 4h8v8H8V8z"/></svg>
`;

function dgUmkmThumbError(imgEl, sizeClass) {
  const wrapper = imgEl.parentElement;
  wrapper.innerHTML = '';
  const div = document.createElement('div');
  div.className = `${sizeClass} w-full bg-emerald-50 flex items-center justify-center text-emerald-300`;
  div.innerHTML = DG_UMKM_PLACEHOLDER_ICON;
  wrapper.appendChild(div);
}

function dgUmkmThumbHTML(item, sizeClass) {
  if (item.foto) {
    return `<img src="${dgEscapeHTML(item.foto)}" alt="${dgEscapeHTML(item.nama)}"
              class="${sizeClass} w-full object-cover"
              onerror="dgUmkmThumbError(this, '${sizeClass}')" />`;
  }
  return `<div class="${sizeClass} w-full bg-emerald-50 flex items-center justify-center text-emerald-300">${DG_UMKM_PLACEHOLDER_ICON}</div>`;
}

function dgUmkmCardHTML(item) {
  const kategoriStyle = DG_UMKM_KATEGORI_STYLES[item.kategori] || 'bg-emerald-100 text-emerald-800';
  return `
    <a href="#/umkm/${encodeURIComponent(item.id)}" class="dg-card block rounded-xl border border-emerald-100 bg-white overflow-hidden shadow-sm flex flex-col" data-kategori="${dgEscapeHTML(item.kategori)}">
      <div class="overflow-hidden">
        ${dgUmkmThumbHTML(item, 'h-36')}
      </div>
      <div class="p-4 flex flex-col flex-1">
        <span class="dg-badge inline-block mb-2 w-fit rounded-full px-2.5 py-1 ${kategoriStyle}">${dgEscapeHTML(item.kategori)}</span>
        <h3 class="font-display font-bold text-emerald-950 leading-snug mb-1">${dgEscapeHTML(item.nama)}</h3>
        <p class="text-sm text-gray-600 mb-3 line-clamp-3">${dgEscapeHTML(item.deskripsi)}</p>
        <div class="mt-auto pt-3 border-t border-emerald-50 flex items-center justify-between gap-3">
          <p class="text-sm font-semibold text-amber-600">${dgEscapeHTML(item.harga)}</p>
          <span class="shrink-0 text-sm font-semibold text-emerald-800">Lihat detail &rarr;</span>
        </div>
      </div>
    </a>
  `;
}

const DG_BERITA_KATEGORI_STYLES = {
  Pembangunan: 'bg-sky-100 text-sky-800',
  Ekonomi: 'bg-amber-100 text-amber-800',
  Kesehatan: 'bg-rose-100 text-rose-800',
  Pertanian: 'bg-emerald-100 text-emerald-800',
  Lingkungan: 'bg-teal-100 text-teal-800',
  Pendidikan: 'bg-indigo-100 text-indigo-800',
};

const DG_BERITA_PLACEHOLDER_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6M9 16h6M9 8h2"/></svg>
`;

function dgBeritaThumbError(imgEl, sizeClass) {
  const wrapper = imgEl.parentElement;
  wrapper.innerHTML = '';
  const div = document.createElement('div');
  div.className = `${sizeClass} w-full bg-emerald-50 flex items-center justify-center text-emerald-300`;
  div.innerHTML = DG_BERITA_PLACEHOLDER_ICON;
  wrapper.appendChild(div);
}

function dgBeritaThumbHTML(berita, sizeClass) {
  if (berita.foto) {
    return `<img src="${dgEscapeHTML(berita.foto)}" alt="${dgEscapeHTML(berita.judul)}"
              class="${sizeClass} w-full object-cover"
              onerror="dgBeritaThumbError(this, '${sizeClass}')" />`;
  }
  return `<div class="${sizeClass} w-full bg-emerald-50 flex items-center justify-center text-emerald-300">${DG_BERITA_PLACEHOLDER_ICON}</div>`;
}

function dgBeritaCardHTML(berita) {
  const tanggal = dgFormatDate(berita.tanggal);
  const kategoriStyle = DG_BERITA_KATEGORI_STYLES[berita.kategori] || 'bg-gray-100 text-gray-700';
  return `
    <a href="#/berita/${encodeURIComponent(berita.id)}" class="dg-card block rounded-xl border border-emerald-100 bg-white overflow-hidden shadow-sm flex flex-col">
      <div class="overflow-hidden">
        ${dgBeritaThumbHTML(berita, 'h-36')}
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
    </a>
  `;
}

