import React from 'react';
import { X, Printer, ShieldCheck, Building2, CheckCircle2, Award, Calendar, CheckSquare } from 'lucide-react';
import { BprsCicilanOrder } from '../../types/customGold';
import { formatRupiah } from '../../utils/pointCalculator';

interface BprsNotaReiModalProps {
  order: BprsCicilanOrder;
  onClose: () => void;
  onCompleteHandover?: (orderId: string, reiOfficer: string, bprsOfficer: string, notes: string) => void;
}

export const BprsNotaReiModal: React.FC<BprsNotaReiModalProps> = ({
  order,
  onClose,
  onCompleteHandover,
}) => {
  const [reiOfficer, setReiOfficer] = React.useState(order.handoverReiOfficer || 'Ahmad Fauzi (Khazanah REI)');
  const [bprsOfficer, setBprsOfficer] = React.useState(order.handoverBprsOfficer || order.customerName);
  const [notes, setNotes] = React.useState(order.handoverNotes || 'Fisik emas diserahkan dalam keadaan tersegel baik dan nomor seri sesuai.');

  const handlePrint = () => {
    window.print();
  };

  const handleSaveHandover = () => {
    if (onCompleteHandover) {
      onCompleteHandover(order.id, reiOfficer, bprsOfficer, notes);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-amber-200 overflow-hidden my-8 print:border-none print:shadow-none print:m-0">
        {/* Header toolbar */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-700 via-amber-800 to-yellow-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-300 text-amber-950 font-black flex items-center justify-center text-xs shadow-md">
              REI
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Nota Serah Terima Khazanah Fisik Emas REI</h3>
              <p className="text-[11px] text-amber-200">No. Nota: {order.notaReiNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Nota</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nota Content */}
        <div className="p-8 text-gray-800 space-y-6 print:p-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-amber-500 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-amber-950">
                  RAJA EMAS INDONESIA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  DIVISI KHAZANAH BRANKAS
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Berita Acara & Nota Serah Terima Fisik Logam Mulia Syariah
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-amber-900 font-semibold bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 inline-flex">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>Unit Cabang Penyerah: {order.branchRei}</span>
              </div>
            </div>

            <div className="text-right">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${
                order.isHandoverCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}>
                {order.isHandoverCompleted ? '✓ SUDAH SERAH TERIMA' : 'SIAP SERAH TERIMA'}
              </div>
              <div className="text-xs text-gray-500">Nomor Nota REI:</div>
              <div className="text-xs font-mono font-bold text-gray-900">{order.notaReiNumber}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Tanggal: {order.notaHandoverDate || order.fakturDate}
              </div>
            </div>
          </div>

          {/* Statement of Handover */}
          <div className="text-xs text-gray-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-200">
            Pada hari ini, telah dilakukan serah terima fisik Logam Mulia dari Khazanah Cabang <span className="font-bold text-amber-950">{order.branchRei}</span> kepada perwakilan/nasabah mitra <span className="font-bold text-blue-900">{order.bprsName}</span> dengan rincian identitas sebagai berikut:
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                PIHAK PERTAMA (PENGELOLA KHAZANAH REI)
              </span>
              <div className="font-bold text-gray-900">{order.branchRei}</div>
              <div className="text-gray-600 mt-1">Petugas: <span className="font-semibold text-gray-800">{order.handoverReiOfficer || reiOfficer}</span></div>
              <div className="text-gray-500 text-[11px]">PT Emas Murni Asli (Raja Emas Indonesia)</div>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
                PIHAK KEDUA (BPRS / NASABAH PENERIMA)
              </span>
              <div className="font-bold text-gray-900">{order.customerName}</div>
              <div className="text-gray-600 mt-0.5 font-mono">NIK: {order.customerNik}</div>
              <div className="text-gray-600">Mitra: <span className="font-semibold text-blue-900">{order.bprsName}</span></div>
              <div className="text-gray-500 text-[11px] font-mono mt-0.5">No. Akad: {order.contractNumber}</div>
            </div>
          </div>

          {/* Physical Gold Item Detail with Serial Numbers */}
          <div className="border-2 border-amber-300 rounded-xl overflow-hidden bg-white">
            <div className="bg-amber-100/70 px-4 py-2 border-b border-amber-200 flex items-center justify-between">
              <span className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-700" />
                Daftar Fisik Keping Emas & Nomor Seri (ID Barcode)
              </span>
              <span className="text-[11px] font-bold text-amber-900">
                Total: {order.goldGram} Gram Fine Gold
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-dashed border-gray-200 pb-2">
                <div>
                  <div className="font-bold text-gray-900">Logam Mulia Batangan Raja Emas Indonesia</div>
                  <div className="text-[11px] text-gray-500">Standar Kemurnian: {order.goldPurity} (Sertifikat Tersegel)</div>
                </div>
                <div className="text-right">
                  <span className="font-black text-amber-700 text-sm">{order.goldGram}g</span>
                  <div className="text-[10px] text-gray-400">Total {order.goldSerialNumbers.length} keping</div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-700 block mb-1.5">
                  Nomor Seri / ID Kode LM Terverifikasi:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {order.goldSerialNumbers.map((sn, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-center font-mono font-bold text-xs text-amber-950">
                      {sn}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form edit handover (only when not completed and screen view) */}
          {!order.isHandoverCompleted && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-xs space-y-3 print:hidden">
              <span className="font-bold text-amber-950 block">Formulir Verifikasi Serah Terima Fisik:</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-gray-600 block mb-1">Nama Petugas Khazanah REI:</label>
                  <input
                    type="text"
                    value={reiOfficer}
                    onChange={(e) => setReiOfficer(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-600 block mb-1">Nama Petugas BPRS / Nasabah:</label>
                  <input
                    type="text"
                    value={bprsOfficer}
                    onChange={(e) => setBprsOfficer(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-600 block mb-1">Catatan Pemeriksaan Fisik:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-200 text-xs text-center">
            <div>
              <p className="text-gray-500 mb-14">Pihak Pertama (Petugas Khazanah REI):</p>
              <div className="font-bold text-gray-900 border-b border-gray-300 pb-1 mx-8">
                {order.handoverReiOfficer || reiOfficer}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">{order.branchRei}</div>
            </div>
            <div>
              <p className="text-gray-500 mb-14">Pihak Kedua (Petugas BPRS / Nasabah):</p>
              <div className="font-bold text-gray-900 border-b border-gray-300 pb-1 mx-8">
                {order.handoverBprsOfficer || bprsOfficer}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">{order.bprsName}</div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 text-center pt-2">
            Nota Serah Terima ini adalah dokumen sah pembuktian fisik emas telah beralih penguasaan dari brankas konsorsium REI kepada pemegang akad BPRS.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between print:hidden">
          {!order.isHandoverCompleted && onCompleteHandover && (
            <button
              onClick={handleSaveHandover}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Tandatangani Serah Terima</span>
            </button>
          )}
          {order.isHandoverCompleted && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Serah Terima Telah Selesai ({order.notaHandoverDate})
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
