/** Batas ukuran file agar masih muat disimpan di localStorage (~5MB total). */
export const MAX_UPLOAD_BYTES = 1.5 * 1024 * 1024;

/**
 * Baca file sebagai data URL agar tetap valid setelah reload
 * (blob: URL dari URL.createObjectURL hilang saat halaman di-refresh).
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      reject(new Error(`Ukuran file maksimal ${(MAX_UPLOAD_BYTES / 1024 / 1024).toFixed(1)} MB.`));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsDataURL(file);
  });
}

/** True bila URL bisa ditampilkan lewat <img> (bukan PDF/file lain hasil upload). */
export function isImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  if (url.startsWith('data:')) return url.startsWith('data:image/');
  return !/\.pdf($|\?)/i.test(url);
}
