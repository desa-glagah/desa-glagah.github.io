// js/pages/lowongan.js

const DG_MAX_FILE_BYTES = 1 * 1024 * 1024; // 1MB

// WhatsApp number of the village admin who reviews and publishes new job
// postings. Replace with the real number (format: 62xxxxxxxxxx, no "+" or
// leading zero) before deploying to production.
const DG_ADMIN_WHATSAPP = '62989898989';

async function dgRenderLowongan(container) {
  container.innerHTML = `
    <section class="hero-photo-header">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p class="dg-badge text-amber-400 mb-2">Papan Kerja Desa</p>
        <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">Lowongan Pekerjaan</h1>
        <p class="text-emerald-100 max-w-2xl text-sm sm:text-base">
          Informasi lowongan kerja terbuka dari warga dan pelaku usaha di sekitar Desa Glagah.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p id="dg-job-count" class="text-sm text-gray-500">Memuat lowongan...</p>
        <button id="dg-open-form-btn" type="button"
          class="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          Pasang Lowongan Sekarang
        </button>
      </div>

      <div id="dg-job-list" class="grid sm:grid-cols-2 gap-4">
        ${Array.from({ length: 4 }).map(() => `<div class="dg-skeleton h-48 rounded-xl"></div>`).join('')}
      </div>
    </section>

    <div id="dg-job-form-modal" class="fixed inset-0 z-50 hidden">
      <div class="absolute inset-0 bg-emerald-950/60" data-close-modal></div>
      <div class="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <div class="bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
          <button type="button" data-close-modal aria-label="Tutup formulir"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <h2 class="font-display text-xl font-bold text-emerald-950 mb-1">Pasang Lowongan Baru</h2>
          <p class="text-sm text-gray-500 mb-5">
            Setelah dikirim, WhatsApp akan otomatis terbuka berisi ringkasan
            lowongan ke admin desa untuk verifikasi. Lowongan akan tampil di
            daftar dengan label
            <span class="font-medium text-amber-600">"Menunggu Verifikasi Admin"</span>
            sampai resmi ditambahkan oleh pengelola website.
          </p>

          <form id="dg-job-form" class="space-y-4" novalidate>
            <div>
              <label for="f-judul" class="block text-sm font-medium text-gray-700 mb-1">Judul</label>
              <input id="f-judul" name="judul" type="text" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600" />
            </div>
            <div>
              <label for="f-usaha" class="block text-sm font-medium text-gray-700 mb-1">Nama Usaha/Pemberi Kerja</label>
              <input id="f-usaha" name="usaha" type="text" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600" />
            </div>
            <div>
              <label for="f-deskripsi" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea id="f-deskripsi" name="deskripsi" rows="3" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-y focus:border-emerald-600 focus:ring-emerald-600"></textarea>
            </div>
            <div>
              <label for="f-syarat" class="block text-sm font-medium text-gray-700 mb-1">Syarat</label>
              <textarea id="f-syarat" name="syarat" rows="3" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-y focus:border-emerald-600 focus:ring-emerald-600"></textarea>
            </div>
            <div>
              <label for="f-lokasi" class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
              <input id="f-lokasi" name="lokasi" type="text" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600" />
            </div>
            <div>
              <label for="f-tipe" class="block text-sm font-medium text-gray-700 mb-1">Tipe Kerja</label>
              <select id="f-tipe" name="tipe" required
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600">
                <option value="" disabled selected>Pilih tipe kerja</option>
                <option value="Harian">Harian</option>
                <option value="Waktu Penuh">Waktu Penuh</option>
                <option value="Paruh Waktu">Paruh Waktu</option>
              </select>
            </div>
            <div>
              <label for="f-whatsapp" class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input id="f-whatsapp" name="whatsapp" type="text" required placeholder="62812xxxx"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600" />
            </div>
            <div>
              <label for="f-gaji" class="block text-sm font-medium text-gray-700 mb-1">Gaji <span class="text-gray-400 font-normal">(opsional)</span></label>
              <input id="f-gaji" name="gaji" type="text"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600" />
            </div>
            <div>
              <label for="f-batas" class="block text-sm font-medium text-gray-700 mb-1">Batas Lamaran <span class="text-gray-400 font-normal">(opsional)</span></label>
              <input id="f-batas" name="batas" type="date"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600" />
            </div>
            <div>
              <label for="f-foto" class="block text-sm font-medium text-gray-700 mb-1">Foto <span class="text-gray-400 font-normal">(opsional, maks 1MB)</span></label>
              <input id="f-foto" name="foto" type="file" accept="image/*"
                class="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-800 file:text-sm file:font-medium" />
              <p id="f-foto-alert" class="hidden text-xs text-red-600 mt-1.5"></p>
            </div>

            <button type="submit"
              class="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#0f6c5f] hover:bg-emerald-800 text-white font-semibold text-sm py-3 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.76.46 3.48 1.34 5L2 22l5.14-1.35a10 10 0 004.9 1.25h.01c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.15h-.01a8.16 8.16 0 01-4.16-1.14l-.3-.18-3.05.8.82-2.97-.2-.31a8.15 8.15 0 01-1.25-4.35c0-4.5 3.66-8.16 8.16-8.16a8.1 8.1 0 015.77 2.39 8.1 8.1 0 012.39 5.77c0 4.5-3.67 8.16-8.17 8.16zm4.47-6.12c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/></svg>
              Kirim Lowongan
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  const modal = container.querySelector('#dg-job-form-modal');
  const openBtn = container.querySelector('#dg-open-form-btn');
  const closeEls = container.querySelectorAll('[data-close-modal]');
  const form = container.querySelector('#dg-job-form');
  const fotoInput = container.querySelector('#f-foto');
  const fotoAlert = container.querySelector('#f-foto-alert');

  const openModal = () => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openModal);
  closeEls.forEach((el) => el.addEventListener('click', closeModal));

  // Client-side validation: file size must not exceed 1MB.
  let fotoDataUrl = null;
  fotoInput.addEventListener('change', () => {
    fotoAlert.classList.add('hidden');
    fotoDataUrl = null;
    const file = fotoInput.files[0];
    if (!file) return;

    if (file.size > DG_MAX_FILE_BYTES) {
      fotoAlert.textContent = `Ukuran file (${(file.size / 1024 / 1024).toFixed(2)}MB) melebihi batas 1MB. Silakan pilih file lain.`;
      fotoAlert.classList.remove('hidden');
      fotoInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => { fotoDataUrl = reader.result; };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const job = {
      id: dgGenerateId('job'),
      judul: fd.get('judul').trim(),
      usaha: fd.get('usaha').trim(),
      deskripsi: fd.get('deskripsi').trim(),
      syarat: fd.get('syarat').trim(),
      lokasi: fd.get('lokasi').trim(),
      tipe: fd.get('tipe'),
      whatsapp: fd.get('whatsapp').trim(),
      gaji: fd.get('gaji').trim() || null,
      batas: fd.get('batas') || null,
      foto: fotoDataUrl,
      createdAt: new Date().toISOString(),
    };

    dgSavePendingJob(job);
    closeModal();
    form.reset();
    fotoDataUrl = null;
    dgToast('Lowongan berhasil dikirim. Membuka WhatsApp untuk konfirmasi ke admin...');
    dgRefreshJobList(container);
    dgNotifyAdmin(job);
  });

  await dgRefreshJobList(container);
}

function dgNotifyAdmin(job) {
  const batas = dgFormatDate(job.batas);
  const lines = [
    'Halo Admin, ada lowongan baru menunggu verifikasi di website Desa Glagah:',
    '',
    `Judul: ${job.judul}`,
    `Usaha/Pemberi Kerja: ${job.usaha}`,
    `Deskripsi: ${job.deskripsi}`,
    `Syarat: ${job.syarat}`,
    `Lokasi: ${job.lokasi}`,
    `Tipe Kerja: ${job.tipe}`,
    `Gaji: ${job.gaji || '-'}`,
    `Batas Lamaran: ${batas || '-'}`,
    `Kontak WhatsApp Pemberi Kerja: ${job.whatsapp}`,
    job.foto ? 'Foto: dilampirkan (lihat di daftar lowongan situs)' : 'Foto: -',
    '',
    'Mohon ditinjau lalu ditambahkan ke data/jobs.json jika sudah sesuai.',
  ];
  const waLink = dgBuildWhatsAppLink(DG_ADMIN_WHATSAPP, lines.join('\n'));
  window.open(waLink, '_blank', 'noopener,noreferrer');
}

async function dgRefreshJobList(container) {
  const listEl = container.querySelector('#dg-job-list');
  const countEl = container.querySelector('#dg-job-count');
  const jobs = await dgLoadJobs();

  countEl.textContent = `${jobs.length} lowongan tersedia`;

  if (jobs.length === 0) {
    listEl.innerHTML = `
      <div class="col-span-full rounded-xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <p class="text-emerald-900 font-medium">Belum ada lowongan saat ini</p>
        <p class="text-sm text-gray-600 mt-1">Jadilah yang pertama memasang lowongan lewat tombol di atas.</p>
      </div>`;
    return;
  }

  listEl.innerHTML = jobs.map(dgJobCardHTML).join('');
}

function dgToast(message) {
  const el = document.createElement('div');
  el.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 bg-emerald-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg z-[60]';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}