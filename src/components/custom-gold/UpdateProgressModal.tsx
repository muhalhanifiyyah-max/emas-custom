import React, { useState } from 'react';
import { X, Truck, CheckCircle2, Upload, Camera, FileText, AlertCircle } from 'lucide-react';
import { CustomOrderItem, WorkProgressStep, ShippingMethod } from '../../types/customGold';

interface UpdateProgressModalProps {
  order: CustomOrderItem;
  onClose: () => void;
  onUpdate: (orderId: string, updatedProgress: CustomOrderItem['workProgress']) => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  order,
  onClose,
  onUpdate,
}) => {
  const [currentStep, setCurrentStep] = useState<WorkProgressStep>(order.workProgress.step);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(order.workProgress.shippingMethod || 'helper');
  const [helperName, setHelperName] = useState(order.workProgress.helperName || 'Doni Saputra (Helper REI)');
  const [helperPhone, setHelperPhone] = useState(order.workProgress.helperPhone || '0812-7788-9900');
  const [jneResiNumber, setJneResiNumber] = useState(order.workProgress.jneResiNumber || '');
  const [jneResiPhotoUrl, setJneResiPhotoUrl] = useState(order.workProgress.jneResiPhotoUrl || '');
  const [notes, setNotes] = useState(order.workProgress.notes || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setJneResiPhotoUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 'pengiriman' && shippingMethod === 'jne' && !jneResiNumber.trim()) {
      alert('Untuk pengiriman via JNE, nomor resi pengiriman wajib diisi.');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onUpdate(order.id, {
      step: currentStep,
      shippingMethod: currentStep === 'pengiriman' || currentStep === 'done' ? shippingMethod : undefined,
      helperName: shippingMethod === 'helper' ? helperName : undefined,
      helperPhone: shippingMethod === 'helper' ? helperPhone : undefined,
      jneResiNumber: shippingMethod === 'jne' ? jneResiNumber.trim() : undefined,
      jneResiPhotoUrl: shippingMethod === 'jne' ? jneResiPhotoUrl : undefined,
      notes: notes.trim(),
      updatedAt: formattedDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-purple-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm tracking-wide">Update Alur Pengerjaan & Pengiriman</h3>
              <p className="text-[11px] text-purple-200">No. Order: {order.orderNumber}</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-gray-700">
          {/* Step Selector */}
          <div>
            <label className="font-bold text-gray-900 block mb-2">
              Pilih Tahapan Pengerjaan Saat Ini:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep('design')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentStep === 'design'
                    ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold ring-2 ring-purple-600/30'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-purple-600">Tahap 1</div>
                <div className="font-bold text-xs mt-0.5">Pengerjaan Design</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Mockup & layout cetak</div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('produksi')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentStep === 'produksi'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-600/30'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-indigo-600">Tahap 2</div>
                <div className="font-bold text-xs mt-0.5">Pengerjaan Produksi</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Cetak kartu & grafir LM</div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('pengiriman')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentStep === 'pengiriman'
                    ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-600/30'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-blue-600">Tahap 3</div>
                <div className="font-bold text-xs mt-0.5">Pengiriman</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Helper REI / JNE Express</div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('done')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentStep === 'done'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-emerald-600">Tahap 4</div>
                <div className="font-bold text-xs mt-0.5">Done (Selesai)</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Diterima pemesan</div>
              </button>
            </div>
          </div>

          {/* Conditional Delivery Options: Helper vs JNE */}
          {(currentStep === 'pengiriman' || currentStep === 'done') && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
              <span className="font-bold text-blue-950 block">Metode Pengiriman Logam Mulia:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShippingMethod('helper')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                    shippingMethod === 'helper'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Kurir Helper REI
                </button>
                <button
                  type="button"
                  onClick={() => setShippingMethod('jne')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                    shippingMethod === 'jne'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Ekspedisi JNE (Upload Resi)
                </button>
              </div>

              {/* If Helper REI */}
              {shippingMethod === 'helper' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">Nama Helper Pengantar:</label>
                    <input
                      type="text"
                      value={helperName}
                      onChange={(e) => setHelperName(e.target.value)}
                      placeholder="Nama Helper Cabang REI"
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-gray-600 block mb-1">No. Kontak Helper:</label>
                    <input
                      type="text"
                      value={helperPhone}
                      onChange={(e) => setHelperPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* If JNE: Kolom upload / input resi */}
              {shippingMethod === 'jne' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-gray-800 block mb-1">
                      Nomor Resi JNE:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: JNE8892019921"
                      value={jneResiNumber}
                      onChange={(e) => setJneResiNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-blue-300 bg-white font-mono font-bold text-blue-950 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-800 block mb-1">
                      Upload Foto Bukti Resi Pengiriman JNE:
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Pilih Foto Resi</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setJneResiPhotoUrl('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80')}
                        className="px-2.5 py-1.5 rounded-lg border border-blue-300 text-blue-800 bg-white text-[11px] font-medium hover:bg-blue-50"
                      >
                        Gunakan Contoh Foto Resi
                      </button>
                    </div>

                    {jneResiPhotoUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-blue-200 max-h-36 bg-gray-900 flex items-center justify-center relative">
                        <img
                          src={jneResiPhotoUrl}
                          alt="Bukti Resi JNE"
                          className="max-h-36 w-full object-contain"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                          Foto Resi Terpasang
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="font-bold text-gray-900 block mb-1">
              Catatan Progres Pengerjaan:
            </label>
            <textarea
              rows={2}
              placeholder="Catatan update pengerjaan atau kondisi paket..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow-md shadow-purple-700/20 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Status Pengerjaan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
