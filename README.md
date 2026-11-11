# Platform Emas-Custom & Cicilan BPRS — Raja Emas Indonesia

Aplikasi web standalone terpadu untuk pengelolaan **Pemesanan Custom Logam Mulia Perorangan dari Cabang REI** serta **Pembiayaan Cicilan Emas Konsorsium Lembaga BPRS**, siap dideploy secara terpisah (misal di Vercel, Netlify, atau Cloudflare Pages).

---

## 📌 Fitur Utama

### A. Pemesanan Custom Perorangan dari Cabang REI
1. **Invoice DP (Uang Muka)**:
   - Terbit otomatis dengan nomor invoice resmi (`INV-DP/REI/...`).
   - Rincian DP (persentase/nominal), batas tempo, verifikasi pembayaran, cetak faktur PDF.
2. **Detail Request-an untuk LM**:
   - Data pemesan, kontak WhatsApp, cabang REI asal.
   - Gramasi (0.5g - 100g), kadar 999.9 (24 Karat), jenis kemasan/custom bar, detail teks grafir.
3. **File Final Design untuk Dicetak**:
   - Preview visual mockup desain cetak beresolusi tinggi.
   - Status approval & tombol unduh file cetak untuk operator grafir.
4. **Proses Pengerjaan (Pipeline Stepper)**:
   - `Pengerjaan Design` ➔ `Pengerjaan Produksi` ➔ `Pengiriman` ➔ `Done`.
   - Pada tahap pengiriman:
     - Opsi **Helper REI** (nama & kontak helper pengantar).
     - Opsi **Ekspedisi JNE** (kolom nomor resi + fitur upload foto bukti resi JNE).
5. **Invoice Lunas**:
   - Otomatis menghitung sisa tagihan akhir setelah DP.
   - Dokumen pelunasan resmi dengan stempel **LUNAS**, tanda tangan serah terima, dan cetak PDF.

### B. Pemesanan Cicilan Emas Lewat BPRS
1. **List BPRS Seluruhnya**:
   - Master list instansi BPRS mitra (BPRS HIK Depok, HIK Pusat, HIK Parahyangan, Patriot Bekasi, AlSalaam, Botani, Amanah Ummah, BDS, dll).
2. **Filter Cabang REI**:
   - Filter transaksi berdasarkan cabang REI pemroses fisik emas (Tebet, Depok, Serpong, Bekasi, Cengkareng, Bandung, Bogor).
3. **Faktur Website**:
   - Dokumen tagihan elektronik resmi website untuk pembiayaan cicilan emas murabahah.
4. **Nota REI**:
   - Berita Acara Serah Terima (BAST) fisik emas dari Khazanah Cabang REI.
   - Memuat **Kode ID / Nomor Seri Logam Mulia** (*serial numbers*) yang diserahkan.

---

## 🚀 Panduan Menjalankan Secara Lokal

```bash
# 1. Masuk ke direktori
cd emas-custom

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev
# Akses di http://localhost:3003
```

## 📦 Panduan Build & Deploy

```bash
# Build untuk produksi
npm run build

# Preview hasil build
npm run preview
```

### Deploy ke Vercel:
1. Hubungkan repository GitHub `emas-custom` ke Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
