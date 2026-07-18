// js/whatsapp.js
// Utilities for building https://wa.me links used across the job board and
// the UMKM catalog.

/**
 * Sanitizes a raw phone number into the format wa.me expects:
 * strips everything but digits, then converts a leading 0 to 62 (Indonesia).
 */
function dgSanitizePhone(raw) {
  if (!raw) return '';
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = '62' + digits.slice(1);
  } else if (digits.startsWith('620')) {
    // Guard against accidental "620..." double-prefix input.
    digits = '62' + digits.slice(3);
  }
  return digits;
}

/**
 * Builds a wa.me link with a pre-filled, encoded message.
 */
function dgBuildWhatsAppLink(rawPhone, message) {
  const sanitized = dgSanitizePhone(rawPhone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${sanitized}?text=${encoded}`;
}

function dgUmkmContactMessage(namaUsaha) {
  return `Halo, saya tertarik dengan produk ${namaUsaha} Anda yang tertera di website desa.`;
}

function dgJobApplyMessage(judul, usaha) {
  return `Halo, saya ingin melamar untuk lowongan "${judul}" di ${usaha} yang saya lihat di website Desa Glagah.`;
}
