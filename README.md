# Platform Emas-Custom & Cicilan BPRS — Raja Emas Indonesia

Aplikasi web standalone terpadu untuk pengelolaan **Pemesanan Custom Logam Mulia Perorangan dari Cabang REI** serta **Pembiayaan Cicilan Emas Konsorsium Lembaga BPRS**, terhubung secara real-time dengan database Supabase milik **Dasbor Mitra** & **CRM**.

---

## 🔐 Sistem Login & Multi-User Role

Aplikasi ini dilengkapi gerbang login multi-role yang terhubung langsung dengan tabel `partners` pada database pusat Supabase (Mitra & CRM) serta direktori role internal REI:

| Role | Label | Hak Akses & Ruang Lingkup |
| --- | --- | --- |
| `admin` | **Super Admin Pusat REI** | Akses penuh seluruh cabang REI, buat order, verifikasi DP/Lunas, update progres, BPRS & tandatangan Nota REI. |
| `cabang_rei` | **PIC Cabang REI** | Otomatis terfilter ke cabang REI terkait (Depok, Tebet, dll), buat order custom cabang, update pengiriman/resi, & tandatangan Nota REI. |
| `desainer_produksi` | **Tim Desain & Produksi** | Kelola file desain cetak dan update tahap pengerjaan (`Desain` ➔ `Produksi` ➔ `Pengiriman Helper/JNE + Resi` ➔ `Selesai`). |
| `finance` | **Finance & Verifikasi** | Verifikasi & konfirmasi pembayaran **Invoice DP** dan **Invoice Lunas**, serta audit Faktur Web BPRS. |
| `bprs` | **Mitra BPRS / HIMBARSI** | Autentikasi langsung via tabel `partners` Supabase (sinkron dengan akun Dasbor Mitra), akses daftar cicilan BPRS, filter cabang REI, cetak **Faktur Web** & **Nota REI**. |

---

## 🔗 Integrasi Database (Mitra, CRM, Emas-Custom)

Ketiga platform berbagi database Supabase yang sama (`partners`, `transactions`, `gold_products`, `notifications`):
- **Harga Emas Live**: Harga dasar per gram otomatis ditarik dari katalog `gold_products` (`prod-rei-1`).
- **Daftar Mitra BPRS Live**: Mitra BPRS yang terdaftar di tabel `partners` (termasuk BPRS HIK Insan Cita Depok, BPRS HIK Ciledug, HIMBARSI, dll) langsung tersinkronisasi dan dapat login menggunakan kredensial Dasbor Mitra.
- **Sinkronisasi Pesanan**: Pesanan custom yang dibuat atau diperbarui di `emas-custom` otomatis tersinkronisasi ke tabel `transactions` & `notifications` sehingga tampil di Dasbor Mitra dan CRM.

---

## 📌 Fitur Utama

### A. Pemesanan Custom Perorangan dari Cabang REI
1. **Invoice DP (Uang Muka)** — Nomor invoice resmi (`INV-DP/REI/...`), rekening REI, cetak PDF, verifikasi DP oleh Finance/Admin.
2. **Detail Request-an LM** — Data pemesan, WhatsApp, cabang REI, gramasi, kadar 999.9, dan detail grafir.
3. **File Final Design** — Preview visual & unduh file cetak resolusi tinggi.
4. **Proses Pengerjaan** — Stepper (`Desain` ➔ `Produksi` ➔ `Pengiriman` ➔ `Selesai`). Pengiriman mendukung **Helper REI** maupun **JNE** (dengan kolom nomor resi & upload foto resi).
5. **Invoice Lunas** — Perhitungan sisa tagihan otomatis (`Total - DP`), stempel **LUNAS**, cetak PDF.

### B. Pemesanan Cicilan Emas Lewat BPRS
1. **List BPRS Seluruhnya** — Daftar BPRS konsorsium + data live dari Supabase `partners`.
2. **Filter Cabang REI** — Penyaringan transaksi berdasarkan cabang REI pemroses fisik emas.
3. **Faktur Website** — Dokumen tagihan elektronik cicilan emas.
4. **Nota REI** — Berita Acara Serah Terima fisik emas cabang lengkap dengan **Kode ID / Serial Number LM**.

---

## 🚀 Menjalankan Secara Lokal & Deploy

```bash
npm install
npm run dev     # http://localhost:3003
npm run build   # Output di dist/
```

### Deploy ke Vercel:
1. Import repository `emas-custom` ke Vercel.
2. Framework preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`.
3. Opsional atur Environment Variables dari `.env.example` (jika ingin override URL/API key Supabase & URL link Dasbor Mitra/CRM).
