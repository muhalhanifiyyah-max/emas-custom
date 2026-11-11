import React from 'react';
import { X, Printer, Building2, CheckCircle2 } from 'lucide-react';
import { BprsCicilanOrder } from '../../types/customGold';
import { formatRupiah } from '../../utils/pointCalculator';

const STATUS_CLASS: Record<BprsCicilanOrder['status'], string> = {
  Aktif: 'bg-blue-50 text-blue-700 border-blue-200',
  Lunas: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Jatuh Tempo': 'bg-red-50 text-red-700 border-red-200',
};

interface BprsFakturWebModalProps {
  order: BprsCicilanOrder;
  onClose: () => void;
}

export const BprsFakturWebModal: React.FC<BprsFakturWebModalProps> = ({
  order,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex p-4 overflow-y-auto print:static print:block print:p-0 print:bg-white print:overflow-visible">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-purple-100 overflow-hidden m-auto print:max-w-none print:rounded-none print:border-none print:shadow-none print:m-0">
        {/* Header toolbar */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-400 text-blue-950 font-black flex items-center justify-center text-xs shadow-md">
              WEB
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Faktur Digital Website Cicilan Emas BPRS</h3>
              <p className="text-[11px] text-blue-200">No. Faktur: {order.fakturWebNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Faktur</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Faktur Content */}
        <div className="p-8 text-gray-800 space-y-6 print:p-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-blue-950">
                  PORTAL PEMBIAYAAN EMAS BPRS
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                  FAKTUR WEBSITE RESMI
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Kolaborasi Khazanah: <span className="font-semibold text-gray-800">PT Raja Emas Indonesia</span> & <span className="font-semibold text-blue-900">{order.bprsName}</span>
              </p>
              <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-gray-800">Cabang Khazanah REI:</span> {order.branchRei}
              </p>
            </div>

            <div className="text-right">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${STATUS_CLASS[order.status]}`}>
                STATUS AKAD: {order.status}
              </div>
              <div className="text-xs text-gray-500">No. Faktur Website:</div>
              <div className="text-xs font-mono font-bold text-gray-900">{order.fakturWebNumber}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Tanggal Faktur: {order.fakturDate}</div>
            </div>
          </div>

          {/* Customer & Akad Meta Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <div className="text-gray-500 font-medium">Data Nasabah BPRS:</div>
              <div className="font-bold text-gray-900 text-sm mt-0.5">{order.customerName}</div>
              <div className="text-gray-600 font-mono mt-0.5">NIK: {order.customerNik}</div>
              <div className="text-gray-600 font-mono">No. WA: {order.customerPhone}</div>
              <div className="text-gray-500 text-[11px] mt-1">{order.customerAddress}</div>
            </div>
            <div>
              <div className="text-gray-500 font-medium">Lembaga Pembiayaan:</div>
              <div className="font-bold text-blue-900 text-sm mt-0.5">{order.bprsName}</div>
              <div className="text-gray-600 font-mono mt-0.5">No. Akad: {order.contractNumber}</div>
              <div className="text-gray-500 font-medium mt-1">Rencana Pengambilan Fisik:</div>
              <div className="font-semibold text-gray-800">{order.branchRei}</div>
            </div>
          </div>

          {/* Details Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase font-bold tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Spesifikasi Logam Mulia</th>
                  <th className="p-3 text-center">Tenor Cicilan</th>
                  <th className="p-3 text-right">Uang Muka (DP)</th>
                  <th className="p-3 text-right">Angsuran / Bulan</th>
                  <th className="p-3 text-right">Total Nilai Akad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3">
                    <div className="font-bold text-gray-900">Logam Mulia Batangan SNI Raja Emas Indonesia</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Gramasi: <span className="font-bold text-blue-900">{order.goldGram} Gram</span> • Kadar: {order.goldPurity}
                    </div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      ID Serial Emas: <span className="font-mono font-bold text-purple-900">{order.goldSerialNumbers.join(', ')}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-blue-900">
                    {order.tenorMonths} Bulan
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-gray-700">
                    {formatRupiah(order.downPayment)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">
                    {formatRupiah(order.monthlyInstallment)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-gray-900">
                    {formatRupiah(order.totalValue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Progress Summary */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-blue-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Kemajuan Angsuran Nasabah:
              </div>
              <div className="text-gray-600 text-[11px] mt-0.5">
                Telah terbayar <span className="font-bold text-blue-900">{order.installmentsPaid} dari {order.totalInstallments} bulan angsuran</span>.
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-gray-500">Total Akumulasi Pembayaran:</div>
              <div className="font-mono font-bold text-blue-950 text-sm">
                {formatRupiah(Math.min(order.totalValue, order.downPayment + order.monthlyInstallment * order.installmentsPaid))}
              </div>
            </div>
          </div>

          {/* Serial LM IDs Highlight */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
            <span className="font-bold text-amber-900 block mb-1">Daftar Kode ID Emas Khazanah Terkunci:</span>
            <div className="flex flex-wrap gap-2">
              {order.goldSerialNumbers.map((sn, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 font-mono font-bold text-amber-950 text-[11px] shadow-sm">
                  {sn}
                </span>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-200 text-xs text-center">
            <div>
              <p className="text-gray-500 mb-12">Petugas Pembiayaan BPRS:</p>
              <div className="font-bold text-gray-900">{order.bprsName}</div>
              <div className="text-[10px] text-gray-400">Verifikator Akad Website</div>
            </div>
            <div>
              <p className="text-gray-500 mb-12">Nasabah Pembiayaan Emas:</p>
              <div className="font-bold text-gray-900">{order.customerName}</div>
              <div className="text-[10px] text-gray-400">Pemilik Akad Pembiayaan</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between print:hidden">
          <span className="text-xs text-gray-500">
            Faktur website dapat dicetak atau disimpan sebagai arsip PDF resmi.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
