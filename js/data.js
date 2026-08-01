// js/data.js
// Data access layer for Desa Glagah's Git-based JSON data architecture.
//
// The site has no backend server. The files in /data are the source of truth
// and are meant to be edited and committed by a village admin. Job postings
// submitted from the browser are sent straight to the admin via a pre-filled
// WhatsApp message (see js/pages/lowongan.js) — they are NOT stored locally,
// so nothing about them lingers in the visitor's browser and nothing can end
// up duplicated once the admin adds the entry to data/jobs.json.

// One-time cleanup: earlier versions of this site cached submitted job
// postings in localStorage under this key, which could cause duplicate
// "Menunggu Verifikasi Admin" cards. Remove any leftover cache so it can
// never resurface.
try {
  localStorage.removeItem('dg_pending_jobs');
} catch (err) {
  // localStorage may be unavailable (e.g. private browsing); safe to ignore.
}

async function dgFetchJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Gagal memuat data dari ${path} (status ${res.status})`);
  }
  return res.json();
}

async function dgLoadJobs() {
  try {
    return await dgFetchJSON('data/jobs.json');
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function dgLoadUMKM() {
  try {
    return await dgFetchJSON('data/umkm.json');
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function dgLoadBerita() {
  try {
    const berita = await dgFetchJSON('data/berita.json');
    return [...berita].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  } catch (err) {
    console.error(err);
    return [];
  }
}

function dgGenerateId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
