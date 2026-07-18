// js/data.js
// Data access layer for Desa Glagah's Git-based JSON data architecture.
//
// The site has no backend server. The files in /data are the source of truth
// and are meant to be edited and committed by a village admin. To let visitors
// submit a job posting from the browser, new entries are kept locally
// (localStorage) as "pending" and are visually flagged until an admin copies
// them into data/jobs.json and pushes the change to the repository.

const DG_STORAGE_KEYS = {
  pendingJobs: 'dg_pending_jobs',
};

async function dgFetchJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Gagal memuat data dari ${path} (status ${res.status})`);
  }
  return res.json();
}

function dgGetPendingJobs() {
  try {
    const raw = localStorage.getItem(DG_STORAGE_KEYS.pendingJobs);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Gagal membaca lowongan lokal:', err);
    return [];
  }
}

function dgSavePendingJob(job) {
  const pending = dgGetPendingJobs();
  pending.unshift(job);
  localStorage.setItem(DG_STORAGE_KEYS.pendingJobs, JSON.stringify(pending));
  return pending;
}

function dgRemovePendingJob(id) {
  const pending = dgGetPendingJobs().filter((j) => j.id !== id);
  localStorage.setItem(DG_STORAGE_KEYS.pendingJobs, JSON.stringify(pending));
  return pending;
}

async function dgLoadJobs() {
  let seed = [];
  try {
    seed = await dgFetchJSON('data/jobs.json');
  } catch (err) {
    console.error(err);
  }
  const pending = dgGetPendingJobs().map((j) => ({ ...j, _pending: true }));
  // Pending (locally submitted, not yet committed) jobs surface first.
  return [...pending, ...seed];
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
