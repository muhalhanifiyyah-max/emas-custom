import React from 'react';
import { X, Printer, CheckCircle2, Clock, ShieldCheck, Download, Building2 } from 'lucide-react';
import { CustomOrderItem } from '../../types/customGold';
import { formatRupiah } from '../../utils/pointCalculator';

interface CustomDpInvoiceModalProps {
  order: CustomOrderItem;
  onClose: () => void;
  onConfirmDp?: (orderId: string) => void;
}

export const CustomDpInvoiceModal: React.FC<CustomDpInvoiceModalProps> = ({
  order,
  onClose,
  onConfirmDp,
}) => {
  const isPaid = order.dpInvoice.status === 'terkonfirmasi';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-purple-100 overflow-hidden my-8 print:border-none print:shadow-none print:m-0">
        {/* Header toolbar - hidden when printing */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-purple-950 font-black flex items-center justify-center text-xs shadow-md">
              DP
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Invoice Uang Muka (DP) Custom Emas</h3>
              <p className="text-[11px] text-purple-200">No: {order.dpInvoice.invoiceNumber}</p>
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
        <div className="p-8 text-gray-800 space-y-6 print:p-6">
          {/* Header & Logo */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-purple-900">
                  RAJA EMAS INDONESIA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  OFFICIAL CUSTOM DIVISION
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                PT Emas Murni Asli • Sentra Produksi & Khazanah Logam Mulia Custom Syariah
              </p>
              <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-semibold text-purple-950">Cabang Pemroses:</span> {order.branchRei}
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
                isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'
              }">
                {isPaid ? '✓ DP LUNAS' : 'MENUNGGU DP'}
              </div>
              <div className="text-xs text-gray-500">Nomor Dokumen:</div>
              <div className="text-xs font-mono font-bold text-gray-900">{order.dpInvoice.invoiceNumber}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Tanggal: {order.createdAt.split(' ')[0]}</div>
            </div>
          </div>

          {/* Customer & Order Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-purple-50/50 p-4 rounded-xl border border-purple-100">
            <div>
              <div className="text-gray-500 font-medium">Ditagihkan Kepada:</div>
              <div className="font-bold text-gray-900 text-sm mt-0.5">{order.customerName}</div>
              <div className="text-gray-600 mt-0.5 font-mono">WA: {order.customerPhone}</div>
              <div className="text-purple-700 mt-1 font-semibold">Tipe: Pemesanan Custom Cabang REI</div>
            </div>
            <div>
              <div className="text-gray-500 font-medium">No. Pesanan Induk:</div>
              <div className="font-bold font-mono text-gray-900 mt-0.5">{order.orderNumber}</div>
              <div className="text-gray-500 mt-1 font-medium">Batas Waktu DP:</div>
              <div className="font-bold text-amber-700">{order.dpInvoice.dueDate}</div>
            </div>
          </div>

          {/* Specification Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Deskripsi Custom Logam Mulia</th>
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
                      Gramasi: <span className="font-semibold text-purple-900">{order.goldGram}g</span> • Kemurnian: {order.goldPurity}
                    </div>
                    <div className="text-[11px] text-purple-700 italic mt-1 bg-purple-50/80 p-1.5 rounded">
                      "Detail Grafir: {order.requestDetails}"
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold">{order.quantity} pcs</td>
                  <td className="p-3 text-right font-mono">{formatRupiah(order.pricePerGram * order.goldGram)}</td>
                  <td className="p-3 text-right font-mono font-bold">{formatRupiah(order.pricePerGram * order.goldGram * order.quantity)}</td>
                </tr>
                <tr>
                  <td className="p-3" colSpan={3}>
                    <div className="font-medium text-gray-700">Biaya Desain Khusus & Master Cetak Layout</div>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-purple-900">
                    {formatRupiah(order.customDesignFee)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & DP Summary */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Total Estimasi Pesanan:</span>
                <span className="font-mono font-bold text-gray-900">{formatRupiah(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-purple-900 font-semibold border-t border-purple-100 pt-2">
                <span>Ketentuan DP ({order.dpInvoice.dpPercentage}%):</span>
                <span className="font-mono font-bold text-base text-purple-900">
                  {formatRupiah(order.dpInvoice.dpAmount)}
                </span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Sisa Pelunasan Nanti:</span>
                <span className="font-mono">{formatRupiah(order.totalPrice - order.dpInvoice.dpAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions / Proof */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-xs">
            <div className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Rekening Resmi Pembayaran DP (Atas Nama: PT Emas Murni Asli):
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-600 mt-2 font-mono text-[11px]">
              <div className="p-2 rounded bg-white border border-gray-200">
                <span className="font-bold text-purple-900">BSI (Bank Syariah Indonesia):</span>
                <div>7001-9988-2341 (PT Emas Murni Asli)</div>
              </div>
              <div className="p-2 rounded bg-white border border-gray-200">
                <span className="font-bold text-purple-900">BCA Syariah:</span>
                <div>0889-1122-3344 (PT Emas Murni Asli)</div>
              </div>
            </div>
            {isPaid && order.dpInvoice.paidAt && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold">Pembayaran DP telah terverifikasi ({order.dpInvoice.paidAt})</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-[10px] text-gray-400 text-center border-t border-gray-200 pt-3">
            Faktur DP ini sah dikeluarkan secara digital oleh Sistem Dasbor Kemitraan Raja Emas Indonesia.
            Pengerjaan desain dan produksi dimulai segera setelah DP terkonfirmasi.
          </div>
        </div>

        {/* Footer Actions (Screen only) */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between print:hidden">
          {!isPaid && onConfirmDp && (
            <button
              onClick={() => onConfirmDp(order.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Konfirmasi Pelunasan DP Ini</span>
            </button>
          )}
          {isPaid && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> DP Sudah Terbayar Penuh
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
