// js/pages/profil.js

const DG_VISI = 'Terwujudnya Desa Glagah yang Mandiri, Humanis, dan Berkelanjutan melalui Semangat Gotong Royong.';

const DG_MISI = [
  'Meningkatkan tata kelola pemerintahan desa yang transparan, akuntabel, dan partisipatif.',
  'Mendorong pertumbuhan ekonomi desa melalui penguatan UMKM, pertanian, dan potensi lokal lainnya.',
  'Meningkatkan kualitas pelayanan kesehatan, pendidikan, dan kesejahteraan sosial bagi seluruh warga.',
  'Menjaga kelestarian lingkungan dan mengelola sumber daya alam secara berkelanjutan.',
  'Memperkuat nilai gotong royong dan kearifan lokal dalam setiap aspek pembangunan desa.',
];

const DG_STRUKTUR = [
  { jabatan: 'Kepala Desa', nama: 'Abdurrahman', foto: 'assets/perangkat/abdurrahman_kepala desa.jpeg' },
  { jabatan: 'Sekretaris Desa', nama: 'Peni Aripin', foto: 'assets/perangkat/peni aripin_sekertaris desa.jpeg' },
  { jabatan: 'Kepala Urusan Keuangan', nama: 'Gita Ratnasari', foto: 'assets/perangkat/gita ratnasari_kepala urusan_keuangan.jpeg' },
  { jabatan: 'Kepala Urusan Umum', nama: 'Misnari', foto: 'assets/perangkat/misnari_kepala urusan_umum.jpeg' },
  { jabatan: 'Kepala Urusan Perencanaan', nama: 'Lin Qomariyah', foto: 'assets/perangkat/lin qomariyah_kepala urusan_perencanaan.jpeg' },
  { jabatan: 'Kepala Urusan Krajan', nama: 'Mulyadi', foto: 'assets/perangkat/mulyadi_kepala urusan_krajan.jpeg' },
  { jabatan: 'Kepala Seksi Kesejahteraan', nama: 'Nurul Hasan', foto: 'assets/perangkat/nurul hasan_kepala seksi_kesejahteraan.jpeg' },
  { jabatan: 'Kepala Seksi Pelayanan', nama: 'Rudy Hartono', foto: 'assets/perangkat/rudy hartono_kepala seksi_pelayanan.jpeg' },
  { jabatan: 'Kepala Dusun Nyanto 1', nama: 'Abd Gani', foto: 'assets/perangkat/abd gani_kepala dusun_nyanto.jpeg' },
  { jabatan: 'Kepala Dusun Nyanto 2', nama: 'Suli', foto: 'assets/perangkat/suli_kepala dusun_nyanto_2.jpeg' },
  { jabatan: 'Kepala Dusun Bukolan 1', nama: 'Patro', foto: 'assets/perangkat/patro_kepala dusun_bukolan_1.jpeg' },
  { jabatan: 'Kepala Dusun Bukolan 2', nama: 'Buradi Suharji', foto: 'assets/perangkat/buradi suharji_kepala dusun_bukolan_2.jpeg' },
  { jabatan: 'Staff', nama: 'Nasidah', foto: 'assets/perangkat/nasidah_staff.jpeg' },
];

function dgOfficialAvatarError(imgEl, initial, isKosong) {
  const wrapper = imgEl.parentElement;
  wrapper.innerHTML = '';
  const div = document.createElement('div');
  div.className = `aspect-square w-full flex items-center justify-center text-3xl font-bold font-display ${
    isKosong ? 'bg-gray-100 text-gray-300' : 'bg-emerald-900 text-amber-400'
  }`;
  div.textContent = initial;
  wrapper.appendChild(div);
}

async function dgRenderProfil(container) {
  container.innerHTML = `
    <section class="hero-photo-header">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <p class="dg-badge text-amber-400 mb-2">Tentang Desa</p>
        <h1 class="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">Profil Desa Glagah</h1>
        <p class="text-emerald-100 max-w-2xl text-sm sm:text-base">
          Visi, misi, dan jajaran perangkat yang menjalankan pemerintahan Desa Glagah.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h2 class="font-display text-xl font-bold text-emerald-950 mb-4">Visi</h2>
      <div class="rounded-xl border-l-4 border-amber-500 bg-emerald-50/60 p-6 mb-12">
        <p class="text-emerald-950 font-medium text-base sm:text-lg leading-relaxed">
          &ldquo;${dgEscapeHTML(DG_VISI)}&rdquo;
        </p>
      </div>

      <h2 class="font-display text-xl font-bold text-emerald-950 mb-4">Misi</h2>
      <ol class="space-y-3 mb-12">
        ${DG_MISI.map((m, i) => `
          <li class="dg-card flex items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
            <span class="shrink-0 h-8 w-8 rounded-full bg-emerald-900 text-amber-400 flex items-center justify-center text-sm font-bold font-display">${i + 1}</span>
            <p class="text-sm sm:text-base text-gray-700 leading-relaxed pt-1">${dgEscapeHTML(m)}</p>
          </li>
        `).join('')}
      </ol>

      <h2 class="font-display text-xl font-bold text-emerald-950 mb-4">Struktur Perangkat Desa</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        ${DG_STRUKTUR.map((s) => {
          const isKosong = !s.nama || s.nama.trim() === '-';
          const inisial = isKosong
            ? '?'
            : s.nama.trim().split(' ').map((n) => n[0]).slice(0, 2).join('');
          const fotoFallback = `
            <div class="aspect-square w-full flex items-center justify-center text-3xl font-bold font-display ${
              isKosong ? 'bg-gray-100 text-gray-300' : 'bg-emerald-900 text-amber-400'
            }">
              ${dgEscapeHTML(inisial)}
            </div>`;
          const foto = (s.foto && !isKosong)
            ? `<img src="${dgEscapeHTML(s.foto)}" alt="Foto ${dgEscapeHTML(s.nama)}"
                  class="aspect-square w-full object-cover"
                  onerror="dgOfficialAvatarError(this, '${dgEscapeHTML(inisial)}', ${isKosong})" />`
            : fotoFallback;
          return `
            <div class="dg-card rounded-xl border border-emerald-100 bg-white shadow-sm overflow-hidden flex flex-col">
              <div class="overflow-hidden">${foto}</div>
              <div class="p-3 sm:p-4 text-center">
                <p class="font-display font-bold text-sm sm:text-base ${isKosong ? 'text-gray-400 italic' : 'text-emerald-950'}">
                  ${isKosong ? 'Belum terisi' : dgEscapeHTML(s.nama)}
                </p>
                <p class="mt-1.5 dg-badge inline-block text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">${dgEscapeHTML(s.jabatan)}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}