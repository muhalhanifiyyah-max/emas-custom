import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Coins,
  Building2,
  FileText,
  Printer,
  Search,
  Filter,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  Download,
  AlertCircle,
  Phone,
  Calendar,
  Layers,
  Award,
  RefreshCw,
  Sun,
  Moon,
  Home,
  Check,
} from 'lucide-react';
import { CustomOrderItem, BprsCicilanOrder, WorkProgressStep } from './types/customGold';
import {
  REI_BRANCHES,
  BPRS_INSTITUTIONS,
  loadCustomOrders,
  saveCustomOrders,
  loadBprsCicilanOrders,
  saveBprsCicilanOrders,
} from './services/customGoldService';
import { CustomDpInvoiceModal } from './components/custom-gold/CustomDpInvoiceModal';
import { CustomLunasInvoiceModal } from './components/custom-gold/CustomLunasInvoiceModal';
import { BprsFakturWebModal } from './components/custom-gold/BprsFakturWebModal';
import { BprsNotaReiModal } from './components/custom-gold/BprsNotaReiModal';
import { NewCustomOrderModal } from './components/custom-gold/NewCustomOrderModal';
import { UpdateProgressModal } from './components/custom-gold/UpdateProgressModal';
import { formatRupiah } from './utils/pointCalculator';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'custom_perorangan' | 'cicilan_bprs'>('custom_perorangan');

  // Orders State
  const [customOrders, setCustomOrders] = useState<CustomOrderItem[]>([]);
  const [bprsCicilanOrders, setBprsCicilanOrders] = useState<BprsCicilanOrder[]>([]);

  // Filter States - Custom Perorangan
  const [customSearch, setCustomSearch] = useState('');
  const [customBranchFilter, setCustomBranchFilter] = useState('ALL');
  const [customStepFilter, setCustomStepFilter] = useState('ALL');

  // Filter States - Cicilan BPRS
  const [bprsSearch, setBprsSearch] = useState('');
  const [bprsInstitutionFilter, setBprsInstitutionFilter] = useState('ALL');
  const [bprsBranchFilter, setBprsBranchFilter] = useState('ALL'); // Sesuai ketentuan: filter cabang REI

  // Modals State
  const [selectedDpModalOrder, setSelectedDpModalOrder] = useState<CustomOrderItem | null>(null);
  const [selectedLunasModalOrder, setSelectedLunasModalOrder] = useState<CustomOrderItem | null>(null);
  const [selectedProgressModalOrder, setSelectedProgressModalOrder] = useState<CustomOrderItem | null>(null);
  const [selectedFakturWebOrder, setSelectedFakturWebOrder] = useState<BprsCicilanOrder | null>(null);
  const [selectedNotaReiOrder, setSelectedNotaReiOrder] = useState<BprsCicilanOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [previewDesignUrl, setPreviewDesignUrl] = useState<string | null>(null);

  // Load Data on Mount
  useEffect(() => {
    setCustomOrders(loadCustomOrders());
    setBprsCicilanOrders(loadBprsCicilanOrders());
  }, []);

  const handleAddNewCustomOrder = (newOrder: CustomOrderItem) => {
    const updated = [newOrder, ...customOrders];
    setCustomOrders(updated);
    saveCustomOrders(updated);
    setIsNewOrderModalOpen(false);
    setSelectedDpModalOrder(newOrder);
  };

  const handleConfirmDpPayment = (orderId: string) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const updated = customOrders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          dpInvoice: {
            ...ord.dpInvoice,
            status: 'terkonfirmasi' as const,
            paidAt: `${formattedDate} WIB`,
          },
          designStatus: 'siap_cetak' as const,
          updatedAt: formattedDate,
        };
      }
      return ord;
    });
    setCustomOrders(updated);
    saveCustomOrders(updated);
    if (selectedDpModalOrder?.id === orderId) {
      setSelectedDpModalOrder(updated.find((o) => o.id === orderId) || null);
    }
  };

  const handleConfirmLunasPayment = (orderId: string) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const updated = customOrders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          lunasInvoice: {
            ...ord.lunasInvoice,
            status: 'terkonfirmasi' as const,
            paidAt: `${formattedDate} WIB`,
          },
          workProgress: {
            ...ord.workProgress,
            step: 'done' as const,
            updatedAt: formattedDate,
          },
          updatedAt: formattedDate,
        };
      }
      return ord;
    });
    setCustomOrders(updated);
    saveCustomOrders(updated);
    if (selectedLunasModalOrder?.id === orderId) {
      setSelectedLunasModalOrder(updated.find((o) => o.id === orderId) || null);
    }
  };

  const handleUpdateProgress = (orderId: string, updatedProgress: CustomOrderItem['workProgress']) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const updated = customOrders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          workProgress: updatedProgress,
          updatedAt: formattedDate,
        };
      }
      return ord;
    });
    setCustomOrders(updated);
    saveCustomOrders(updated);
    setSelectedProgressModalOrder(null);
  };

  const handleCompleteHandover = (orderId: string, reiOfficer: string, bprsOfficer: string, notes: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = bprsCicilanOrders.map((c) => {
      if (c.id === orderId) {
        return {
          ...c,
          isHandoverCompleted: true,
          notaHandoverDate: today,
          handoverReiOfficer: reiOfficer,
          handoverBprsOfficer: bprsOfficer,
          handoverNotes: notes,
        };
      }
      return c;
    });
    setBprsCicilanOrders(updated);
    saveBprsCicilanOrders(updated);
    if (selectedNotaReiOrder?.id === orderId) {
      setSelectedNotaReiOrder(updated.find((o) => o.id === orderId) || null);
    }
  };

  const filteredCustomOrders = customOrders.filter((ord) => {
    const matchesSearch =
      ord.customerName.toLowerCase().includes(customSearch.toLowerCase()) ||
      ord.orderNumber.toLowerCase().includes(customSearch.toLowerCase()) ||
      ord.customerPhone.includes(customSearch);
    const matchesBranch =
      customBranchFilter === 'ALL' || ord.branchRei.toLowerCase().includes(customBranchFilter.toLowerCase());
    const matchesStep =
      customStepFilter === 'ALL' || ord.workProgress.step === customStepFilter;
    return matchesSearch && matchesBranch && matchesStep;
  });

  const filteredBprsOrders = bprsCicilanOrders.filter((ord) => {
    const matchesSearch =
      ord.customerName.toLowerCase().includes(bprsSearch.toLowerCase()) ||
      ord.contractNumber.toLowerCase().includes(bprsSearch.toLowerCase()) ||
      ord.bprsName.toLowerCase().includes(bprsSearch.toLowerCase()) ||
      ord.goldSerialNumbers.some((s) => s.toLowerCase().includes(bprsSearch.toLowerCase()));
    const matchesInstitution =
      bprsInstitutionFilter === 'ALL' || ord.bprsId === bprsInstitutionFilter;
    const matchesBranch =
      bprsBranchFilter === 'ALL' || ord.branchRei.toLowerCase().includes(bprsBranchFilter.toLowerCase());
    return matchesSearch && matchesInstitution && matchesBranch;
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#0f0b1a] text-gray-100' : 'bg-[#f8f7fc] text-gray-900'}`}>
      {/* Navbar Standalone */}
      <nav className={`sticky top-0 z-40 border-b backdrop-blur-xl ${darkMode ? 'bg-[#151022]/90 border-purple-800/40 text-gray-100' : 'bg-white/90 border-purple-100 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-800 to-indigo-700 flex items-center justify-center text-amber-300 font-black shadow-md shadow-purple-900/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-purple-950 dark:text-purple-200 uppercase">
                  Emas-Custom & BPRS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700">
                  Raja Emas Indonesia
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Sistem Terpadu Pesanan Custom Cabang REI & Cicilan BPRS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const next = !darkMode;
                setDarkMode(next);
                if (next) document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              }}
              className="p-2 rounded-xl border border-gray-200 dark:border-purple-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-purple-950/50"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-700" />}
            </button>

            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>+ Pesanan Custom Baru</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-16">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-purple-800/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800/60 border border-purple-400/30 text-amber-300 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sentra Produksi Custom & Pembiayaan BPRS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Platform Khusus Emas-Custom & Cicilan BPRS
              </h1>
              <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                Aplikasi standalone untuk pemesanan custom logam mulia perorangan cabang REI serta pengelolaan faktur website & nota serah terima fisik emas cicilan BPRS.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-purple-900/50 border border-purple-700/40 text-center">
                <span className="text-purple-300 text-[10px] uppercase font-bold block">Pesanan Custom</span>
                <span className="text-xl font-black text-white">{customOrders.length}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-900/50 border border-purple-700/40 text-center">
                <span className="text-purple-300 text-[10px] uppercase font-bold block">Akad BPRS</span>
                <span className="text-xl font-black text-amber-300">{bprsCicilanOrders.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons Switcher */}
        <div className="flex border-b border-gray-200 dark:border-purple-800/50">
          <button
            onClick={() => setActiveTab('custom_perorangan')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'custom_perorangan'
                ? 'border-purple-600 text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/30'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Pemesanan Custom Perorangan (Cabang REI)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 font-bold">
              {customOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cicilan_bprs')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'cicilan_bprs'
                ? 'border-blue-600 text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Pemesanan Cicilan Emas Lewat BPRS</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-bold">
              {bprsCicilanOrders.length}
            </span>
          </button>
        </div>

        {/* TAB 1: PEMESANAN CUSTOM PERORANGAN DARI CABANG REI */}
        {activeTab === 'custom_perorangan' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="soft-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama pemesan / no. order..."
                  value={customSearch}
                  onChange={(e) => setCustomSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-purple-800 text-xs focus:border-purple-600 focus:ring-1 focus:ring-purple-600 bg-white dark:bg-[#151022]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-semibold">Cabang REI:</span>
                </div>
                <select
                  value={customBranchFilter}
                  onChange={(e) => setCustomBranchFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-purple-800 text-xs bg-white dark:bg-[#151022] font-medium text-gray-700 dark:text-gray-300"
                >
                  <option value="ALL">Semua Cabang REI</option>
                  {REI_BRANCHES.map((b) => (
                    <option key={b.id} value={b.name.split(' ')[1] || b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 ml-2">
                  <Filter className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-semibold">Tahap:</span>
                </div>
                <select
                  value={customStepFilter}
                  onChange={(e) => setCustomStepFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-purple-800 text-xs bg-white dark:bg-[#151022] font-medium text-gray-700 dark:text-gray-300"
                >
                  <option value="ALL">Semua Tahapan</option>
                  <option value="design">1. Pengerjaan Design</option>
                  <option value="produksi">2. Pengerjaan Produksi</option>
                  <option value="pengiriman">3. Pengiriman (Helper/JNE)</option>
                  <option value="done">4. Done (Selesai)</option>
                </select>
              </div>
            </div>

            {/* Custom Cards */}
            <div className="space-y-4">
              {filteredCustomOrders.map((ord) => {
                const isDpPaid = ord.dpInvoice.status === 'terkonfirmasi';
                const isLunasPaid = ord.lunasInvoice.status === 'terkonfirmasi';

                return (
                  <div
                    key={ord.id}
                    className="soft-card-elevated rounded-2xl p-5 border border-purple-100 dark:border-purple-900/40 space-y-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-purple-900/30 pb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-black flex items-center justify-center shrink-0 text-sm">
                          {ord.goldGram}g
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-sm text-gray-900 dark:text-gray-100">{ord.customerName}</span>
                            <span className="text-[11px] font-mono text-gray-500 bg-gray-100 dark:bg-purple-950 px-2 py-0.5 rounded">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                              {ord.branchRei}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 font-mono text-gray-600 dark:text-gray-400">
                              <Phone className="w-3 h-3 text-emerald-600" />
                              {ord.customerPhone}
                            </span>
                            <span>•</span>
                            <span className="text-gray-400">Dibuat: {ord.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedProgressModalOrder(ord)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 transition-colors self-end sm:self-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Update Pengerjaan</span>
                      </button>
                    </div>

                    {/* 5 Ketentuan Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                      {/* 1. INVOICE DP */}
                      <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-purple-950/20 border border-gray-200 dark:border-purple-900/30 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              1. Invoice DP
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isDpPaid ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'}`}>
                              {isDpPaid ? 'DP LUNAS' : 'PENDING'}
                            </span>
                          </div>
                          <div className="font-mono font-bold text-gray-900 dark:text-gray-100 mt-1">
                            {formatRupiah(ord.dpInvoice.dpAmount)}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            DP {ord.dpInvoice.dpPercentage}% • Jatuh Tempo {ord.dpInvoice.dueDate}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedDpModalOrder(ord)}
                          className="w-full py-1.5 px-2 rounded-lg bg-white dark:bg-purple-900/40 border border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 text-[11px] font-bold hover:bg-purple-50 flex items-center justify-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <span>Buka Invoice DP</span>
                        </button>
                      </div>

                      {/* 2. DETAIL REQUEST LM */}
                      <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 block">
                            2. Request LM Custom
                          </span>
                          <div className="font-bold text-gray-900 dark:text-gray-100 mt-1 truncate">
                            {ord.goldType}
                          </div>
                          <div className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold mt-0.5">
                            {ord.goldGram}g Fine Gold ({ord.quantity} pcs)
                          </div>
                          <p className="text-[10px] text-gray-600 dark:text-gray-400 italic line-clamp-2 mt-1">
                            "{ord.requestDetails}"
                          </p>
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">
                          Cabang: {ord.branchRei.split(' ')[0]} {ord.branchRei.split(' ')[1] || ''}
                        </div>
                      </div>

                      {/* 3. FINAL DESAIN CETAK */}
                      <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-purple-950/20 border border-gray-200 dark:border-purple-900/30 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              3. Final Desain
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              Siap Cetak
                            </span>
                          </div>
                          <div
                            onClick={() => setPreviewDesignUrl(ord.finalDesignUrl)}
                            className="mt-1.5 relative rounded-lg overflow-hidden border border-gray-300 h-14 bg-gray-950 flex items-center justify-center cursor-pointer group"
                          >
                            <img src={ord.finalDesignUrl} alt="Desain" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                              <Eye className="w-3.5 h-3.5 mr-1" /> Lihat
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => window.open(ord.finalDesignUrl, '_blank')}
                          className="w-full py-1.5 px-2 rounded-lg bg-white dark:bg-purple-900/40 border border-gray-300 dark:border-purple-700 text-gray-700 dark:text-gray-200 text-[10px] font-semibold hover:bg-gray-100 flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh File Cetak</span>
                        </button>
                      </div>

                      {/* 4. PROSES PENGERJAAN & PENGIRIMAN */}
                      <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                              4. Pengerjaan
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                              {ord.workProgress.step.toUpperCase()}
                            </span>
                          </div>

                          <div className="mt-1 font-bold text-gray-900 dark:text-gray-100 text-[11px]">
                            {ord.workProgress.step === 'design' && '1. Desain Grafir'}
                            {ord.workProgress.step === 'produksi' && '2. Produksi & Cetak'}
                            {ord.workProgress.step === 'pengiriman' && '3. Pengiriman'}
                            {ord.workProgress.step === 'done' && '4. Selesai / Diterima'}
                          </div>

                          {ord.workProgress.shippingMethod && (
                            <div className="mt-1 p-1.5 rounded bg-white/80 dark:bg-gray-900/80 border border-blue-200 dark:border-blue-900 text-[10px]">
                              {ord.workProgress.shippingMethod === 'jne' ? (
                                <div>
                                  <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                                    <Truck className="w-3 h-3 text-blue-600" /> JNE Express
                                  </span>
                                  <div className="font-mono text-gray-700 dark:text-gray-300 truncate">
                                    Resi: {ord.workProgress.jneResiNumber || '-'}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                                    <Truck className="w-3 h-3 text-blue-600" /> Helper REI
                                  </span>
                                  <div className="text-gray-600 dark:text-gray-400 truncate">{ord.workProgress.helperName}</div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="text-[10px] text-gray-500 truncate">
                          Ket: {ord.workProgress.notes || '-'}
                        </div>
                      </div>

                      {/* 5. INVOICE LUNAS */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                              5. Invoice Lunas
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isLunasPaid ? 'bg-emerald-200 text-emerald-950' : 'bg-gray-100 text-gray-700'}`}>
                              {isLunasPaid ? 'LUNAS 100%' : 'SISA TAGIHAN'}
                            </span>
                          </div>
                          <div className="font-mono font-bold text-emerald-950 dark:text-emerald-300 mt-1">
                            {formatRupiah(ord.lunasInvoice.remainingAmount)}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Total: {formatRupiah(ord.totalPrice)}
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedLunasModalOrder(ord)}
                          className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Buka Invoice Lunas</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PEMESANAN CICILAN EMAS LEWAT BPRS */}
        {activeTab === 'cicilan_bprs' && (
          <div className="space-y-6">
            {/* 1. List BPRS seluruhnya */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <span>1. Daftar Seluruh Lembaga BPRS Konsorsium</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Daftar seluruh instansi BPRS mitra resmi Raja Emas Indonesia
                  </p>
                </div>
                <span className="text-xs text-blue-700 font-bold bg-blue-50 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                  Total {BPRS_INSTITUTIONS.length} BPRS Mitra
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {BPRS_INSTITUTIONS.map((bprs) => {
                  const isSelected = bprsInstitutionFilter === bprs.id;
                  return (
                    <div
                      key={bprs.id}
                      onClick={() => setBprsInstitutionFilter(isSelected ? 'ALL' : bprs.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-600 shadow-md ring-2 ring-blue-600/30'
                          : 'bg-white dark:bg-[#151022] border-gray-200 dark:border-purple-800/40 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 font-bold text-xs flex items-center justify-center shrink-0">
                          {bprs.code.split('-')[0]}
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          {bprs.city}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <h4 className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">{bprs.name}</h4>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">PIC: {bprs.contactPerson}</p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-gray-400 block text-[10px]">Akad Aktif</span>
                          <span className="font-bold text-blue-950 dark:text-blue-300">{bprs.totalActiveContracts} Nasabah</span>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400 block text-[10px]">Total Gramasi</span>
                          <span className="font-bold text-amber-700 dark:text-amber-400">{bprs.totalGramsFinanced}g LM</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Filter Cabang REI */}
            <div className="soft-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 border border-blue-100 dark:border-blue-900/40">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nasabah BPRS, no. akad, nomor seri LM..."
                  value={bprsSearch}
                  onChange={(e) => setBprsSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 dark:border-purple-800 text-xs focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white dark:bg-[#151022]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span className="font-bold text-amber-950 dark:text-amber-300">2. Filter Cabang REI:</span>
                  <select
                    value={bprsBranchFilter}
                    onChange={(e) => setBprsBranchFilter(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-amber-300 dark:border-amber-700 text-xs bg-white dark:bg-[#151022] font-bold text-amber-950 dark:text-amber-200"
                  >
                    <option value="ALL">Semua Cabang REI</option>
                    {REI_BRANCHES.map((b) => (
                      <option key={b.id} value={b.name.split(' ')[1] || b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3 & 4. Table Faktur Web & Nota REI */}
            <div className="soft-card-elevated rounded-2xl overflow-hidden border border-gray-200 dark:border-purple-900/40">
              <div className="p-4 bg-gray-50 dark:bg-purple-950/30 border-b border-gray-200 dark:border-purple-900/40 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-gray-800 dark:text-gray-200">
                    Daftar Transaksi Cicilan Emas BPRS (Cabang REI)
                  </span>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Menampilkan {filteredBprsOrders.length} transaksi pembiayaan cicilan emas
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-gray-500">
                  Fitur: Cetak 3. Faktur Website & 4. Nota REI Fisik
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100/70 dark:bg-purple-950/40 border-b border-gray-200 dark:border-purple-900/40 text-gray-600 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Nasabah & BPRS</th>
                      <th className="p-3.5">Cabang Khazanah REI</th>
                      <th className="p-3.5">Gramasi & Nomor Seri LM</th>
                      <th className="p-3.5 text-center">Tenor & Cicilan</th>
                      <th className="p-3.5 text-center">Status Serah Terima</th>
                      <th className="p-3.5 text-right">Aksi Dokumen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-purple-900/20">
                    {filteredBprsOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-blue-50/30 dark:hover:bg-purple-950/30 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">{ord.customerName}</div>
                          <div className="text-[11px] text-blue-900 dark:text-blue-300 font-semibold mt-0.5">{ord.bprsName}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">{ord.contractNumber}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800 text-[11px]">
                            <Building2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>{ord.branchRei}</span>
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1">Tanggal: {ord.fakturDate}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-extrabold text-amber-700 dark:text-amber-400 text-xs">
                            {ord.goldGram} Gram Fine Gold
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ord.goldSerialNumbers.map((sn, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 font-mono text-[10px] font-bold text-amber-950 dark:text-amber-300">
                                {sn}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="font-bold text-gray-900 dark:text-gray-100">{ord.tenorMonths} Bulan</div>
                          <div className="font-mono text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                            {formatRupiah(ord.monthlyInstallment)}/bln
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            Bayar: {ord.installmentsPaid}/{ord.totalInstallments}
                          </div>
                        </td>

                        <td className="p-3.5 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${ord.isHandoverCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}`}>
                            {ord.isHandoverCompleted ? '✓ Serah Terima Selesai' : 'Siap Diambil'}
                          </span>
                        </td>

                        {/* 3. Faktur Web & 4. Nota REI */}
                        <td className="p-3.5 text-right">
                          <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedFakturWebOrder(ord)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-700" />
                              <span>3. Faktur Web</span>
                            </button>

                            <button
                              onClick={() => setSelectedNotaReiOrder(ord)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-purple-950 font-bold text-[11px] flex items-center gap-1 shadow-sm"
                            >
                              <Award className="w-3.5 h-3.5 text-purple-950" />
                              <span>4. Nota REI</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedDpModalOrder && (
        <CustomDpInvoiceModal
          order={selectedDpModalOrder}
          onClose={() => setSelectedDpModalOrder(null)}
          onConfirmDp={handleConfirmDpPayment}
        />
      )}

      {selectedLunasModalOrder && (
        <CustomLunasInvoiceModal
          order={selectedLunasModalOrder}
          onClose={() => setSelectedLunasModalOrder(null)}
          onConfirmLunas={handleConfirmLunasPayment}
        />
      )}

      {selectedProgressModalOrder && (
        <UpdateProgressModal
          order={selectedProgressModalOrder}
          onClose={() => setSelectedProgressModalOrder(null)}
          onUpdate={handleUpdateProgress}
        />
      )}

      {selectedFakturWebOrder && (
        <BprsFakturWebModal
          order={selectedFakturWebOrder}
          onClose={() => setSelectedFakturWebOrder(null)}
        />
      )}

      {selectedNotaReiOrder && (
        <BprsNotaReiModal
          order={selectedNotaReiOrder}
          onClose={() => setSelectedNotaReiOrder(null)}
          onCompleteHandover={handleCompleteHandover}
        />
      )}

      {isNewOrderModalOpen && (
        <NewCustomOrderModal
          onClose={() => setIsNewOrderModalOpen(false)}
          onSubmit={handleAddNewCustomOrder}
        />
      )}

      {previewDesignUrl && (
        <div
          onClick={() => setPreviewDesignUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-black rounded-2xl overflow-hidden border border-white/20 p-2">
            <img src={previewDesignUrl} alt="Preview" className="max-h-[80vh] w-full object-contain rounded-xl" />
            <div className="text-center text-xs text-gray-300 mt-2 font-medium">
              Klik di mana saja untuk menutup preview
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
