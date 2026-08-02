// js/app.js
// Lightweight hash-based router. Hash routing is used deliberately so the
// site works as a Single Page Application on GitHub Pages without any
// server-side rewrite rules — refreshing on any "page" never 404s because
// the server only ever sees a request for index.html.

const DG_ROUTES = {
  '/': dgRenderHome,
  '/lowongan': dgRenderLowongan,
  '/informasi': dgRenderInformasi,
  '/profil': dgRenderProfil,
  '/umkm': dgRenderUMKM,
  '/berita': dgRenderBerita,
};

function dgCurrentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

async function dgRoute() {
  const path = dgCurrentPath();
  const outlet = document.getElementById('dg-app-content');

  // Dynamic routes: an individual news article or UMKM product page,
  // e.g. #/berita/berita-001 or #/umkm/umkm-001
  const beritaMatch = path.match(/^\/berita\/(.+)$/);
  const umkmMatch = path.match(/^\/umkm\/(.+)$/);

  let renderFn = DG_ROUTES[path] || DG_ROUTES['/'];
  let renderArg;
  if (beritaMatch) {
    renderFn = dgRenderBeritaDetail;
    renderArg = decodeURIComponent(beritaMatch[1]);
  } else if (umkmMatch) {
    renderFn = dgRenderUMKMDetail;
    renderArg = decodeURIComponent(umkmMatch[1]);
  }

  document.querySelectorAll('.dg-nav-link').forEach((link) => {
    const linkPath = link.getAttribute('href').replace(/^#/, '');
    const isActive = linkPath === path || (linkPath !== '/' && path.startsWith(`${linkPath}/`));
    link.classList.toggle('active', isActive);
  });

  outlet.setAttribute('aria-busy', 'true');
  try {
    await renderFn(outlet, renderArg);
  } catch (err) {
    console.error('Gagal merender halaman:', err);
    outlet.innerHTML = `
      <div class="max-w-2xl mx-auto px-6 py-20 text-center">
        <p class="font-display text-xl font-bold text-emerald-950 mb-2">Terjadi kesalahan</p>
        <p class="text-sm text-gray-500">Halaman gagal dimuat. Silakan muat ulang halaman ini.</p>
      </div>`;
  }
  outlet.setAttribute('aria-busy', 'false');
  window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });

  const mobileMenu = document.getElementById('dg-mobile-menu');
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }
}

function dgInitNav() {
  const toggle = document.getElementById('dg-mobile-menu-toggle');
  const menu = document.getElementById('dg-mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('hidden'));
  }
}

window.addEventListener('hashchange', dgRoute);
window.addEventListener('DOMContentLoaded', () => {
  dgInitNav();
  dgRoute();
});
