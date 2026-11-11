import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Building2, Stamp } from 'lucide-react';
import { CustomOrderItem } from '../../types/customGold';
import { formatRupiah } from '../../utils/pointCalculator';

interface CustomLunasInvoiceModalProps {
  order: CustomOrderItem;
  onClose: () => void;
  onConfirmLunas?: (orderId: string) => void;
}

export const CustomLunasInvoiceModal: React.FC<CustomLunasInvoiceModalProps> = ({
  order,
  onClose,
  onConfirmLunas,
}) => {
  const isPaid = order.lunasInvoice.status === 'terkonfirmasi';
  const isDpPaid = order.dpInvoice.status === 'terkonfirmasi';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex p-4 overflow-y-auto print:static print:block print:p-0 print:bg-white print:overflow-visible">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-purple-100 overflow-hidden m-auto print:max-w-none print:rounded-none print:border-none print:shadow-none print:m-0">
        {/* Header toolbar - hidden when printing */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 font-black flex items-center justify-center text-xs shadow-md">
              LUNAS
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Invoice Pelunasan Akhir Custom Emas</h3>
              <p className="text-[11px] text-emerald-200">No: {order.lunasInvoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Content */}
        <div className="p-8 text-gray-800 space-y-6 print:p-6 relative">
          {/* Lunas Watermark/Stamp when paid */}
          {isPaid && (
            <div className="absolute right-12 top-48 border-4 border-emerald-600/30 text-emerald-600/30 font-black text-4xl px-6 py-2 rounded-2xl -rotate-12 pointer-events-none select-none tracking-widest uppercase">
              LUNAS
            </div>
          )}

          {/* Header & Logo */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-emerald-900">
                  RAJA EMAS INDONESIA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                  INVOICE PELUNASAN RESMI
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                PT Emas Murni Asli • Divisi Custom Logam Mulia & Percetakan Khazanah
              </p>
              <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-gray-900">Cabang Penyerah:</span> {order.branchRei}
              </p>
            </div>

            <div className="text-right">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
                isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}>
                {isPaid ? '✓ LUNAS SEPENUHNYA' : 'MENUNGGU PELUNASAN'}
              </div>
              <div className="text-xs text-gray-500">Nomor Invoice Lunas:</div>
              <div className="text-xs font-mono font-bold text-gray-900">{order.lunasInvoice.invoiceNumber}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Tanggal: {order.updatedAt.split(' ')[0]}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
            <div>
              <div className="text-gray-500 font-medium">Ditagihkan Kepada:</div>
              <div className="font-bold text-gray-900 text-sm mt-0.5">{order.customerName}</div>
              <div className="text-gray-600 mt-0.5 font-mono">No. WA: {order.customerPhone}</div>
              <div className="text-emerald-800 mt-1 font-semibold">Status Pengerjaan: {order.workProgress.step.toUpperCase()}</div>
            </div>
            <div>
              <div className="text-gray-500 font-medium">No. Pesanan:</div>
              <div className="font-bold font-mono text-gray-900 mt-0.5">{order.orderNumber}</div>
              <div className="text-gray-500 mt-1 font-medium">No. Invoice DP Terdahulu:</div>
              <div className="font-bold font-mono text-purple-900">{order.dpInvoice.invoiceNumber} {isDpPaid ? '(Lunas)' : '(Belum Dibayar)'}</div>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Rincian Item & Spesifikasi LM</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Harga Satuan</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{order.goldType}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Gramasi: <span className="font-semibold text-emerald-900">{order.goldGram}g</span> • Kemurnian: {order.goldPurity}
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      Catatan Desain: {order.requestDetails}
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold">{order.quantity} pcs</td>
                  <td className="p-3 text-right font-mono">{formatRupiah(order.pricePerGram * order.goldGram)}</td>
                  <td className="p-3 text-right font-mono font-bold">{formatRupiah(order.pricePerGram * order.goldGram * order.quantity)}</td>
                </tr>
                <tr>
                  <td className="p-3" colSpan={3}>
                    <div className="font-medium text-gray-700">Biaya Desain Grafir Custom & Finishing Cetak</div>
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    {formatRupiah(order.customDesignFee)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Calculation Breakdown */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Total Biaya Keseluruhan:</span>
                <span className="font-mono font-bold text-gray-900">{formatRupiah(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Pembayaran DP Sebelumnya:</span>
                <span className="font-mono font-bold">-{formatRupiah(order.dpInvoice.dpAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-extrabold text-sm border-t border-gray-200 pt-2">
                <span>Sisa Yang Harus Dilunasi:</span>
                <span className="font-mono text-emerald-700">
                  {formatRupiah(order.lunasInvoice.remainingAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Status Proof */}
          {isPaid ? (
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold">Pelunasan Telah Dikonfirmasi Penuh</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Pesanan custom logam mulia ini telah dibayar lunas dan siap untuk diserahkan atau dikirimkan sesuai instruksi pemesan.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900">
              <div className="font-bold mb-1">Informasi Rekening Pelunasan:</div>
              <p className="text-[11px] text-amber-800">
                Mohon selesaikan pelunasan sebelum pesanan diserahterimakan ke nomor rekening BSI (7001-9988-2341) a.n PT Emas Murni Asli.
              </p>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-200 text-xs text-center">
            <div>
              <p className="text-gray-500 mb-12">Petugas Cabang REI Penyerah:</p>
              <div className="font-bold text-gray-900">{order.branchRei.split(' ')[0]} {order.branchRei.split(' ')[1] || ''}</div>
              <div className="text-[10px] text-gray-400">Bagian Khazanah & Operasional REI</div>
            </div>
            <div>
              <p className="text-gray-500 mb-12">Pelanggan Pemesan:</p>
              <div className="font-bold text-gray-900">{order.customerName}</div>
              <div className="text-[10px] text-gray-400">Penerima Logam Mulia Custom</div>
            </div>
          </div>
        </div>

        {/* Footer Actions (Screen only) */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between print:hidden">
          {!isPaid && onConfirmLunas && !isDpPaid && (
            <span className="text-xs text-amber-700 font-semibold">
              Konfirmasi pembayaran DP terlebih dahulu.
            </span>
          )}
          {!isPaid && onConfirmLunas && isDpPaid && (
            <button
              onClick={() => onConfirmLunas(order.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Konfirmasi Pelunasan Akhir</span>
            </button>
          )}
          {isPaid && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Pelunasan 100% Selesai
            </span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold ml-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
