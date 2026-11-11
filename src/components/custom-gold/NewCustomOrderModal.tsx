import React, { useState } from 'react';
import { X, Sparkles, Upload, FileText, Building2, User, Phone, CheckCircle2 } from 'lucide-react';
import { CustomOrderItem } from '../../types/customGold';
import { REI_BRANCHES, generateCustomOrderNumber, generateInvoiceDpNumber, generateInvoiceLunasNumber } from '../../services/customGoldService';
import { formatRupiah } from '../../utils/pointCalculator';
import { addDaysISO, nowStamp } from '../../utils/date';
import { isImageUrl, readFileAsDataUrl } from '../../utils/file';

interface NewCustomOrderModalProps {
  onClose: () => void;
  onSubmit: (newOrder: CustomOrderItem) => void;
  defaultBranch?: string;
  defaultPricePerGram?: number;
}

const DEFAULT_SAMPLE_DESIGNS = [
  {
    name: 'Edisi Wedding Eksklusif',
    url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
    filename: 'Sample_Wedding_Gold_Card.pdf',
  },
  {
    name: 'Edisi Baby Born / Akikah',
    url: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80',
    filename: 'Sample_Baby_Born_Card.png',
  },
  {
    name: 'Edisi Corporate / Komunitas',
    url: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=800&q=80',
    filename: 'Sample_Corporate_Gold_Bar.pdf',
  },
];

export const NewCustomOrderModal: React.FC<NewCustomOrderModalProps> = ({
  onClose,
  onSubmit,
  defaultBranch,
  defaultPricePerGram,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch || REI_BRANCHES[0].name);
  const [goldGram, setGoldGram] = useState<number>(5);
  const [goldType, setGoldType] = useState('Custom Card Logam Mulia');
  const [quantity, setQuantity] = useState<number>(1);
  const [pricePerGram, setPricePerGram] = useState<number>(defaultPricePerGram || 2565000);
  const [customDesignFee, setCustomDesignFee] = useState<number>(150000);
  const [requestDetails, setRequestDetails] = useState('');
  const [dpPercentage, setDpPercentage] = useState<number>(50);
  const [designUrl, setDesignUrl] = useState(DEFAULT_SAMPLE_DESIGNS[0].url);
  const [designFilename, setDesignFilename] = useState(DEFAULT_SAMPLE_DESIGNS[0].filename);

  // Calculations
  const goldSubtotal = goldGram * pricePerGram * quantity;
  const totalPrice = goldSubtotal + customDesignFee;
  const dpAmount = Math.round((totalPrice * dpPercentage) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Mohon isi nama pemesan dan nomor WhatsApp.');
      return;
    }

    const orderNumber = generateCustomOrderNumber();
    const dpInvoiceNumber = generateInvoiceDpNumber();
    const lunasInvoiceNumber = generateInvoiceLunasNumber();
    const formattedDate = nowStamp();

    const newOrder: CustomOrderItem = {
      id: `custom-ord-${Date.now()}`,
      orderNumber,
      orderType: 'perorangan_cabang',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      branchRei: selectedBranch,
      goldGram,
      goldPurity: '999.9 (24 Karat) Fine Gold',
      goldType,
      quantity,
      pricePerGram,
      customDesignFee,
      totalPrice,
      requestDetails: requestDetails || 'Custom grafir & layout cetak kartu sesuai instruksi pemesan',
      finalDesignUrl: designUrl,
      finalDesignFilename: designFilename,
      designStatus: 'draft',
      workProgress: {
        step: 'design',
        notes: 'Pesanan baru dibuat, menunggu pembayaran DP & approval desain cetak.',
        updatedAt: formattedDate,
      },
      dpInvoice: {
        invoiceNumber: dpInvoiceNumber,
        dpAmount,
        dpPercentage,
        dueDate: addDaysISO(3),
        status: 'pending',
      },
      lunasInvoice: {
        invoiceNumber: lunasInvoiceNumber,
        remainingAmount: totalPrice - dpAmount,
        dueDate: addDaysISO(7),
        status: 'pending',
      },
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    onSubmit(newOrder);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setDesignUrl(dataUrl);
      setDesignFilename(file.name);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex p-4 overflow-y-auto print:static print:block print:p-0 print:bg-white print:overflow-visible">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-purple-100 overflow-hidden m-auto print:max-w-none print:rounded-none print:border-none print:shadow-none print:m-0">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">

            <div>
              <h3 className="font-bold text-sm tracking-wide">Pemesanan Custom Emas Perorangan Cabang REI</h3>
              <p className="text-[11px] text-purple-200">Buat pesanan custom LM, invoice DP, dan file cetak</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-gray-700 max-h-[80vh] overflow-y-auto">
          {/* Cabang REI Pemroses */}
          <div>
            <label className="font-bold text-gray-900 flex items-center gap-1.5 mb-1.5">
              <Building2 className="w-4 h-4 text-purple-700" />
              Cabang REI Pemroses / Asal Pesanan:
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium"
            >
              {REI_BRANCHES.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                <User className="w-4 h-4 text-purple-700" />
                Nama Pemesan / Pelanggan:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Bpk. Rahmat Gunawan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
                <Phone className="w-4 h-4 text-purple-700" />
                No. WhatsApp / HP:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 081298765432"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Gold Specification */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-3">
            <span className="font-bold text-purple-950 block">Spesifikasi Custom Logam Mulia:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-gray-600 block mb-1">Gramasi Emas:</label>
                <select
                  value={goldGram}
                  onChange={(e) => setGoldGram(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-purple-200 bg-white font-bold text-purple-900"
                >
                  <option value={0.5}>0.5 Gram</option>
                  <option value={1}>1 Gram</option>
                  <option value={2}>2 Gram</option>
                  <option value={3}>3 Gram</option>
                  <option value={5}>5 Gram</option>
                  <option value={10}>10 Gram</option>
                  <option value={25}>25 Gram</option>
                  <option value={50}>50 Gram</option>
                  <option value={100}>100 Gram</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-gray-600 block mb-1">Tipe Produk Custom:</label>
                <select
                  value={goldType}
                  onChange={(e) => setGoldType(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-purple-200 bg-white font-medium text-gray-800"
                >
                  <option value="Custom Card Logam Mulia">Custom Card Logam Mulia</option>
                  <option value="Custom Engraved Gold Bar">Custom Engraved Gold Bar</option>
                  <option value="Custom Gift Box Edisi Wedding">Custom Gift Box Edisi Wedding</option>
                  <option value="Koin Dirham/Dinar Emas Custom">Koin Dirham/Dinar Emas Custom</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-gray-600 block mb-1">Jumlah Keping (Qty):</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-purple-200 bg-white font-bold"
                />
              </div>
            </div>

            {/* Request Details */}
            <div>
              <label className="text-[11px] text-gray-600 block mb-1">
                Detail Request-an Grafir & Teks LM:
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Tulisan 'Happy Wedding Rian & Sarah', tanggal 12 Des 2026, motif emas klasik"
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-xs"
              />
            </div>
          </div>

          {/* File Final Design */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-purple-700" />
                File Final Desain untuk Dicetak:
              </span>
              <span className="text-[11px] text-gray-500 font-mono truncate max-w-xs">{designFilename}</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File Desain Baru</span>
                <input
                  type="file"
                  accept="image/*,.pdf,.svg"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>

              <span className="text-gray-400 text-[11px]">atau pilih preset:</span>
              <div className="flex gap-1.5">
                {DEFAULT_SAMPLE_DESIGNS.map((s, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setDesignUrl(s.url);
                      setDesignFilename(s.filename);
                    }}
                    className={`px-2 py-1 rounded text-[10px] border transition-all ${designFilename === s.filename
                        ? 'bg-purple-100 border-purple-600 text-purple-900 font-bold'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                  >
                    Preset {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Design Preview */}
            <div className="relative rounded-xl overflow-hidden border border-gray-300 max-h-40 bg-gray-900 flex items-center justify-center">
              {isImageUrl(designUrl) ? (
                <img
                  src={designUrl}
                  alt="Preview Desain"
                  className="max-h-40 w-full object-contain"
                />
              ) : (
                <div className="h-28 flex flex-col items-center justify-center gap-1 text-gray-300 text-[11px]">
                  <FileText className="w-6 h-6" />
                  <span className="font-mono">{designFilename}</span>
                </div>
              )}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur-sm">
                Preview Desain Cetak
              </div>
            </div>
          </div>

          {/* Pricing & DP Breakdown */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <span className="font-bold text-emerald-950 block">Rincian Tagihan & Uang Muka (DP):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-emerald-100">
                <span className="text-gray-500 text-[10px] block">Subtotal Emas:</span>
                <span className="font-bold font-mono text-gray-900">{formatRupiah(goldSubtotal)}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-100">
                <span className="text-gray-500 text-[10px] block">Biaya Desain Cetak:</span>
                <span className="font-bold font-mono text-gray-900">{formatRupiah(customDesignFee)}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-emerald-100">
                <span className="text-gray-500 text-[10px] block">Total Pesanan:</span>
                <span className="font-extrabold font-mono text-purple-950">{formatRupiah(totalPrice)}</span>
              </div>
              <div className="bg-emerald-100/70 p-2 rounded-lg border border-emerald-300">
                <span className="text-emerald-800 text-[10px] font-bold block">DP {dpPercentage}%:</span>
                <span className="font-black font-mono text-emerald-900 text-sm">{formatRupiah(dpAmount)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-600">
              <span>Pilihan Persentase DP:</span>
              {[30, 50, 70].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  onClick={() => setDpPercentage(pct)}
                  className={`px-2 py-0.5 rounded text-xs font-bold border transition-colors ${dpPercentage === pct
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white border-emerald-300 text-emerald-800'
                    }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold shadow-lg shadow-purple-700/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Buat Pesanan & Terbitkan Invoice DP</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
