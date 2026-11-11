import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  Building2,
  Clock,
  Coins,
  Database,
  Download,
  ExternalLink,
  FileText,
  Inbox,
  LogOut,
  Moon,
  Package,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Sun,
  Truck,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  BprsCicilanOrder,
  BprsInstitutionInfo,
  CustomGoldSession,
  CustomOrderItem,
  DesignStatus,
  ROLE_CONFIG,
  WorkProgressStep,
} from './types/customGold';
import {
  BPRS_INSTITUTIONS,
  REI_BRANCHES,
  loadBprsCicilanOrders,
  loadCustomOrders,
  saveBprsCicilanOrders,
  saveCustomOrders,
} from './services/customGoldService';
import {
  CRM_DASHBOARD_URL,
  DbSyncStatus,
  MITRA_DASHBOARD_URL,
  checkDatabaseConnection,
  clearCustomSession,
  fetchLiveBprsPartners,
  fetchSyncedOrdersFromSupabase,
  loadCustomSession,
  saveCustomSession,
  syncCustomOrderToSupabase,
} from './services/supabase';
import { LoginPage } from './components/LoginPage';
import { CustomDpInvoiceModal } from './components/custom-gold/CustomDpInvoiceModal';
import { CustomLunasInvoiceModal } from './components/custom-gold/CustomLunasInvoiceModal';
import { BprsFakturWebModal } from './components/custom-gold/BprsFakturWebModal';
import { BprsNotaReiModal } from './components/custom-gold/BprsNotaReiModal';
import { NewCustomOrderModal } from './components/custom-gold/NewCustomOrderModal';
import { UpdateProgressModal } from './components/custom-gold/UpdateProgressModal';
import { formatRupiah } from './utils/pointCalculator';
import { nowStamp, toLocalDateISO } from './utils/date';
import { isImageUrl } from './utils/file';

/* ------------------------------------------------------------------ */
/* Konstanta & helper                                                  */
/* ------------------------------------------------------------------ */

type Tab = 'custom' | 'bprs';

const STEPS: { key: WorkProgressStep; label: string }[] = [
  { key: 'design', label: 'Desain' },
  { key: 'produksi', label: 'Produksi' },
  { key: 'pengiriman', label: 'Pengiriman' },
  { key: 'done', label: 'Selesai' },
];

const DESIGN_STATUS_LABEL: Record<DesignStatus, string> = {
  draft: 'Draft',
  menunggu_approval: 'Menunggu approval',
  disetujui: 'Disetujui',
  siap_cetak: 'Siap cetak',
};

const THEME_KEY = 'rei_theme';

/** "REI Tebet (Kantor Pusat Khazanah)" -> "REI Tebet" */
const shortBranch = (name: string) => name.replace(/\s*\(.*\)\s*$/, '');

function getInitialDark(): boolean {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
  } catch {
    /* localStorage tidak tersedia */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

const inputCls =
  'h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-white/10 dark:bg-[#16131f] dark:text-gray-100';

const btnCls =
  'inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-transparent dark:text-gray-200 dark:hover:bg-white/5';

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                      */
/* ------------------------------------------------------------------ */

type Tone = 'gray' | 'amber' | 'green' | 'blue' | 'red';

const TONE_CLS: Record<Tone, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
};

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium ${TONE_CLS[tone]}`}>
      {children}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#16131f]">
      <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
        <span>{label}</span>
        <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="mt-2 truncate text-xl font-semibold tabular-nums text-gray-900 dark:text-gray-50">{value}</div>
      {hint && <div className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{hint}</div>}
    </div>
  );
}

function StepIndicator({ step }: { step: WorkProgressStep }) {
  const idx = Math.max(0, STEPS.findIndex((s) => s.key === step));
  const isDone = step === 'done';
  return (
    <div>
      <div className="flex gap-1" aria-hidden>
        {STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`h-1.5 w-5 rounded-full ${
              i <= idx ? (isDone ? 'bg-emerald-500' : 'bg-purple-600 dark:bg-purple-400') : 'bg-gray-200 dark:bg-white/10'
            }`}
          />
        ))}
      </div>
      <div className="mt-1 text-xs font-medium text-gray-800 dark:text-gray-200">
        {idx + 1}. {STEPS[idx].label}
      </div>
    </div>
  );
}

function EmptyRow({ colSpan, onReset }: { colSpan: number; onReset?: () => void }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <Inbox className="mx-auto h-6 w-6 text-gray-300 dark:text-gray-600" />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Tidak ada data yang cocok dengan filter.</p>
        {onReset && (
          <button onClick={onReset} className="mt-2 text-xs font-medium text-purple-700 hover:underline dark:text-purple-300">
            Reset filter
          </button>
        )}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [darkMode, setDarkMode] = useState(getInitialDark);
  const [session, setSession] = useState<CustomGoldSession | null>(() => loadCustomSession());
  const [activeTab, setActiveTab] = useState<Tab>('custom');

  const [customOrders, setCustomOrders] = useState<CustomOrderItem[]>(() => loadCustomOrders());
  const [bprsOrders, setBprsOrders] = useState<BprsCicilanOrder[]>(() => loadBprsCicilanOrders());
  const [bprsDirectory, setBprsDirectory] = useState<BprsInstitutionInfo[]>(BPRS_INSTITUTIONS);

  // Status sinkronisasi Live Database Supabase (Mitra & CRM)
  const [dbStatus, setDbStatus] = useState<DbSyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter - custom
  const [customSearch, setCustomSearch] = useState('');
  const [customBranch, setCustomBranch] = useState('ALL');
  const [customStep, setCustomStep] = useState('ALL');

  // Filter - BPRS
  const [bprsSearch, setBprsSearch] = useState('');
  const [bprsInstitution, setBprsInstitution] = useState('ALL');
  const [bprsBranch, setBprsBranch] = useState('ALL');
  const [bprsHandover, setBprsHandover] = useState<'ALL' | 'pending' | 'done'>('ALL');

  // Modal: simpan ID saja, lalu ambil data terbaru dari state (hindari data basi)
  const [dpId, setDpId] = useState<string | null>(null);
  const [lunasId, setLunasId] = useState<string | null>(null);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [fakturId, setFakturId] = useState<string | null>(null);
  const [notaId, setNotaId] = useState<string | null>(null);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const dpOrder = customOrders.find((o) => o.id === dpId);
  const lunasOrder = customOrders.find((o) => o.id === lunasId);
  const progressOrder = customOrders.find((o) => o.id === progressId);
  const previewOrder = customOrders.find((o) => o.id === previewId);
  const fakturOrder = bprsOrders.find((o) => o.id === fakturId);
  const notaOrder = bprsOrders.find((o) => o.id === notaId);

  const anyModalOpen = !!(dpOrder || lunasOrder || progressOrder || previewOrder || fakturOrder || notaOrder || isNewOrderOpen);
  const rolePerms = session ? ROLE_CONFIG[session.role] : ROLE_CONFIG.admin;

  /* ---------- Sinkronisasi Live Database Supabase (Mitra & CRM) ---------- */

  const syncWithDatabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [status, livePartners, syncedOrders] = await Promise.all([
        checkDatabaseConnection(),
        fetchLiveBprsPartners(),
        fetchSyncedOrdersFromSupabase(),
      ]);

      setDbStatus(status);

      // Gabungkan daftar BPRS live dari tabel `partners` + daftar konsorsium
      if (livePartners.length > 0) {
        setBprsDirectory(() => {
          const map = new Map<string, BprsInstitutionInfo>();
          BPRS_INSTITUTIONS.forEach((b) => map.set(b.id, b));
          livePartners.forEach((lp) => {
            // Cocokkan nama agar tidak duplikat jika ID berbeda
            const existingSameName = Array.from(map.values()).find(
              (m) => m.name.toLowerCase() === lp.name.toLowerCase()
            );
            if (existingSameName) {
              map.set(existingSameName.id, { ...existingSameName, ...lp, id: existingSameName.id });
            } else {
              map.set(lp.id, lp);
            }
          });
          return Array.from(map.values());
        });
      }

      // Gabungkan Custom Orders dari Supabase `transactions` dengan cache lokal
      if (syncedOrders.customOrders.length > 0) {
        setCustomOrders((prev) => {
          const map = new Map<string, CustomOrderItem>();
          prev.forEach((o) => map.set(o.id, o));
          syncedOrders.customOrders.forEach((so) => map.set(so.id, so));
          const merged = Array.from(map.values());
          saveCustomOrders(merged);
          return merged;
        });
      }

      // Gabungkan Transaksi BPRS live dari Supabase `transactions` dengan cache lokal
      if (syncedOrders.bprsOrders.length > 0) {
        setBprsOrders((prev) => {
          const map = new Map<string, BprsCicilanOrder>();
          prev.forEach((o) => map.set(o.id, o));
          syncedOrders.bprsOrders.forEach((sb) => map.set(sb.id, sb));
          const merged = Array.from(map.values());
          saveBprsCicilanOrders(merged);
          return merged;
        });
      }
    } catch (err) {
      console.error('Database sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      syncWithDatabase();
    }
  }, [session, syncWithDatabase]);

  // Set default filter & tab sesuai role saat login
  const applyRoleDefaults = useCallback((s: CustomGoldSession) => {
    if (s.role === 'cabang_rei' && s.branchRei) {
      setCustomBranch(s.branchRei);
      setBprsBranch(s.branchRei);
    } else {
      setCustomBranch('ALL');
      setBprsBranch('ALL');
    }

    if (s.role === 'bprs') {
      setActiveTab('bprs');
      if (!s.isHimbarsi && s.partnerId) {
        setBprsInstitution(s.partnerId);
      } else {
        setBprsInstitution('ALL');
      }
    } else {
      setActiveTab('custom');
      setBprsInstitution('ALL');
    }
  }, []);

  const handleLogin = (newSession: CustomGoldSession) => {
    saveCustomSession(newSession);
    setSession(newSession);
    applyRoleDefaults(newSession);
  };

  const handleLogout = () => {
    clearCustomSession();
    setSession(null);
    setDpId(null);
    setLunasId(null);
    setProgressId(null);
    setPreviewId(null);
    setFakturId(null);
    setNotaId(null);
    setIsNewOrderOpen(false);
  };

  /* ---------- Efek: tema, scroll lock, tombol Escape ---------- */

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
    } catch {
      /* abaikan */
    }
  }, [darkMode]);

  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [anyModalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setPreviewId(null);
      setDpId(null);
      setLunasId(null);
      setFakturId(null);
      setNotaId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ---------- Mutasi data (Terhubung ke Supabase DB Mitra & CRM) ---------- */

  const updateCustomOrder = (id: string, patch: (o: CustomOrderItem) => CustomOrderItem) => {
    let updatedItem: CustomOrderItem | null = null;
    const next = customOrders.map((o) => {
      if (o.id === id) {
        updatedItem = patch(o);
        return updatedItem;
      }
      return o;
    });
    setCustomOrders(next);
    saveCustomOrders(next);
    if (updatedItem) {
      syncCustomOrderToSupabase(updatedItem, session);
    }
  };

  const handleAddNewCustomOrder = (newOrder: CustomOrderItem) => {
    const orderWithFlag: CustomOrderItem = { ...newOrder, syncedToSupabase: true };
    const next = [orderWithFlag, ...customOrders];
    setCustomOrders(next);
    saveCustomOrders(next);
    setIsNewOrderOpen(false);
    setDpId(orderWithFlag.id);
    syncCustomOrderToSupabase(orderWithFlag, session);
  };

  const handleConfirmDp = (orderId: string) => {
    if (!rolePerms.canConfirmPayment) {
      alert('Hanya role Admin Pusat atau Finance yang dapat mengonfirmasi pembayaran DP.');
      return;
    }
    const stamp = nowStamp();
    updateCustomOrder(orderId, (o) => ({
      ...o,
      dpInvoice: { ...o.dpInvoice, status: 'terkonfirmasi', paidAt: `${stamp} WIB` },
      designStatus: 'siap_cetak',
      updatedAt: stamp,
    }));
  };

  const handleConfirmLunas = (orderId: string) => {
    if (!rolePerms.canConfirmPayment) {
      alert('Hanya role Admin Pusat atau Finance yang dapat mengonfirmasi pelunasan akhir.');
      return;
    }
    const order = customOrders.find((o) => o.id === orderId);
    if (!order || order.dpInvoice.status !== 'terkonfirmasi') {
      alert('Pembayaran DP harus dikonfirmasi terlebih dahulu.');
      return;
    }
    const stamp = nowStamp();
    updateCustomOrder(orderId, (o) => ({
      ...o,
      lunasInvoice: { ...o.lunasInvoice, status: 'terkonfirmasi', paidAt: `${stamp} WIB` },
      workProgress: { ...o.workProgress, step: 'done', updatedAt: stamp },
      updatedAt: stamp,
    }));
  };

  const handleUpdateProgress = (orderId: string, progress: CustomOrderItem['workProgress']) => {
    updateCustomOrder(orderId, (o) => ({ ...o, workProgress: progress, updatedAt: progress.updatedAt }));
    setProgressId(null);
  };

  const handleCompleteHandover = (orderId: string, reiOfficer: string, bprsOfficer: string, notes: string) => {
    const next = bprsOrders.map((c) =>
      c.id === orderId
        ? {
            ...c,
            isHandoverCompleted: true,
            notaHandoverDate: toLocalDateISO(),
            handoverReiOfficer: reiOfficer,
            handoverBprsOfficer: bprsOfficer,
            handoverNotes: notes,
          }
        : c
    );
    setBprsOrders(next);
    saveBprsCicilanOrders(next);
  };

  /* ---------- Filter ---------- */

  const filteredCustom = useMemo(() => {
    const q = customSearch.trim().toLowerCase();
    return customOrders.filter((o) => {
      const matchesSearch =
        !q ||
        o.customerName.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerPhone.includes(q);
      const matchesBranch = customBranch === 'ALL' || o.branchRei === customBranch;
      const matchesStep = customStep === 'ALL' || o.workProgress.step === customStep;
      return matchesSearch && matchesBranch && matchesStep;
    });
  }, [customOrders, customSearch, customBranch, customStep]);

  const filteredBprs = useMemo(() => {
    const q = bprsSearch.trim().toLowerCase();
    return bprsOrders.filter((o) => {
      const matchesSearch =
        !q ||
        o.customerName.toLowerCase().includes(q) ||
        o.contractNumber.toLowerCase().includes(q) ||
        o.bprsName.toLowerCase().includes(q) ||
        o.goldSerialNumbers.some((s) => s.toLowerCase().includes(q));
      const matchesInstitution = bprsInstitution === 'ALL' || o.bprsId === bprsInstitution;
      const matchesBranch = bprsBranch === 'ALL' || o.branchRei === bprsBranch;
      const matchesHandover =
        bprsHandover === 'ALL' || (bprsHandover === 'done' ? o.isHandoverCompleted : !o.isHandoverCompleted);
      return matchesSearch && matchesInstitution && matchesBranch && matchesHandover;
    });
  }, [bprsOrders, bprsSearch, bprsInstitution, bprsBranch, bprsHandover]);

  const customFilterActive = !!customSearch || customBranch !== 'ALL' || customStep !== 'ALL';
  const bprsFilterActive = !!bprsSearch || bprsInstitution !== 'ALL' || bprsBranch !== 'ALL' || bprsHandover !== 'ALL';

  const resetCustomFilter = () => {
    setCustomSearch('');
    setCustomBranch('ALL');
    setCustomStep('ALL');
  };
  const resetBprsFilter = () => {
    setBprsSearch('');
    setBprsInstitution('ALL');
    setBprsBranch('ALL');
    setBprsHandover('ALL');
  };

  /* ---------- Ringkasan ---------- */

  const customStats = useMemo(() => {
    const inProgress = customOrders.filter((o) => o.workProgress.step !== 'done').length;
    const dpPending = customOrders.filter((o) => o.dpInvoice.status !== 'terkonfirmasi');
    const outstanding = customOrders
      .filter((o) => o.lunasInvoice.status !== 'terkonfirmasi')
      .reduce((sum, o) => sum + o.lunasInvoice.remainingAmount, 0);
    return { inProgress, dpPending: dpPending.length, outstanding, done: customOrders.length - inProgress };
  }, [customOrders]);

  const bprsStats = useMemo(() => {
    const pendingHandover = bprsOrders.filter((o) => !o.isHandoverCompleted).length;
    const totalGram = bprsOrders.reduce((sum, o) => sum + o.goldGram, 0);
    const totalValue = bprsOrders.reduce((sum, o) => sum + o.totalValue, 0);
    const institutions = new Set(bprsOrders.map((o) => o.bprsId)).size;
    return { pendingHandover, totalGram, totalValue, institutions };
  }, [bprsOrders]);

  const bprsCountById = useMemo(() => {
    const map: Record<string, number> = {};
    bprsOrders.forEach((o) => (map[o.bprsId] = (map[o.bprsId] || 0) + 1));
    return map;
  }, [bprsOrders]);

  /* ---------- Auth Gate: Tampilkan Login jika belum login ---------- */

  if (!session) {
    return (
      <LoginPage
        onLogin={handleLogin}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((v) => !v)}
      />
    );
  }

  /* ---------- Render Dashboard Utama ---------- */

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0e0c14] dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#0e0c14]/90 print:hidden">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-700 text-xs font-bold text-white">
              {session.avatarBadge}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-semibold">Emas Custom</span>
                <span className={`hidden rounded px-1.5 py-0.5 text-[10px] font-bold sm:inline-block ${rolePerms.badgeColor}`}>
                  {rolePerms.label}
                </span>
              </div>
              <div className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                {session.name} · {session.partnerName || 'Raja Emas Indonesia'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Indikator & Tombol Sync Live DB */}
            <button
              onClick={syncWithDatabase}
              disabled={isSyncing}
              className="hidden items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 md:inline-flex"
              title={dbStatus?.message || 'Sinkronisasi Database Mitra & CRM'}
            >
              <Database className={`h-3.5 w-3.5 ${dbStatus?.connected ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span>{isSyncing ? 'Syncing…' : dbStatus?.connected ? 'DB Mitra & CRM' : 'Offline Cache'}</span>
              <RefreshCw className={`h-3 w-3 text-gray-400 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* Cross-Links ke Dasbor Mitra & CRM */}
            <a
              href={MITRA_DASHBOARD_URL}
              target="_blank"
              rel="noreferrer"
              className={`${btnCls} hidden lg:inline-flex`}
              title="Buka Dasbor Mitra"
            >
              Dasbor Mitra <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={CRM_DASHBOARD_URL}
              target="_blank"
              rel="noreferrer"
              className={`${btnCls} hidden lg:inline-flex`}
              title="Buka CRM Pembiayaan Emas"
            >
              CRM <ExternalLink className="h-3 w-3" />
            </a>

            <button
              onClick={() => setDarkMode((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              aria-label={darkMode ? 'Mode terang' : 'Mode gelap'}
              title={darkMode ? 'Mode terang' : 'Mode gelap'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {rolePerms.canCreateOrder && (
              <button
                onClick={() => setIsNewOrderOpen(true)}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-purple-700 px-3 text-xs font-semibold text-white transition hover:bg-purple-800"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Pesanan Custom</span>
                <span className="sm:hidden">Baru</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
              title="Keluar / Ganti Akun"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-6 pb-16 sm:px-6 print:hidden">
        {/* Judul + tab */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                Role: {rolePerms.label}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'custom'
                ? 'Pesanan emas custom perorangan dari cabang REI.'
                : 'Pembiayaan cicilan emas lewat mitra BPRS (Sinkron DB Mitra & CRM).'}
            </p>
          </div>

          <div className="inline-flex self-start rounded-lg border border-gray-200 bg-white p-0.5 dark:border-white/10 dark:bg-[#16131f]" role="tablist">
            {[
              { key: 'custom' as const, label: 'Custom Perorangan', count: customOrders.length, visible: true },
              { key: 'bprs' as const, label: 'Cicilan BPRS', count: bprsOrders.length, visible: rolePerms.canViewBprsTab },
            ]
              .filter((t) => t.visible)
              .map((t) => {
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(t.key)}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition ${
                      active
                        ? 'bg-purple-700 text-white'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                    }`}
                  >
                    {t.label}
                    <span className={`text-xs tabular-nums ${active ? 'text-purple-200' : 'text-gray-400'}`}>{t.count}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Ringkasan */}
        {activeTab === 'custom' ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={Package} label="Total pesanan" value={customOrders.length} hint={`${customStats.done} selesai`} />
            <StatCard icon={Clock} label="Sedang diproses" value={customStats.inProgress} hint="Desain, produksi, kirim" />
            <StatCard icon={FileText} label="Menunggu DP" value={customStats.dpPending} hint="Belum dikonfirmasi" />
            <StatCard icon={Wallet} label="Sisa tagihan" value={formatRupiah(customStats.outstanding)} hint="Invoice lunas pending" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard icon={Users} label="Total akad" value={bprsOrders.length} hint={`${bprsStats.institutions} lembaga BPRS`} />
            <StatCard icon={Award} label="Belum serah terima" value={bprsStats.pendingHandover} hint="Fisik emas di khazanah" />
            <StatCard icon={Scale} label="Total emas" value={`${bprsStats.totalGram} g`} hint="Semua akad" />
            <StatCard icon={Coins} label="Nilai pembiayaan" value={formatRupiah(bprsStats.totalValue)} hint="Total nilai akad" />
          </div>
        )}

        {/* Tabel */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#16131f]">
          {/* Filter bar */}
          <div className="flex flex-col gap-2 border-b border-gray-200 p-3 dark:border-white/10 md:flex-row md:items-center">
            <div className="relative md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              {activeTab === 'custom' ? (
                <input
                  type="search"
                  placeholder="Cari nama, no. order, no. HP…"
                  value={customSearch}
                  onChange={(e) => setCustomSearch(e.target.value)}
                  className={`${inputCls} w-full pl-9`}
                />
              ) : (
                <input
                  type="search"
                  placeholder="Cari nasabah, no. akad, no. seri…"
                  value={bprsSearch}
                  onChange={(e) => setBprsSearch(e.target.value)}
                  className={`${inputCls} w-full pl-9`}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 md:flex md:flex-1 md:items-center">
              {activeTab === 'custom' ? (
                <>
                  <select value={customBranch} onChange={(e) => setCustomBranch(e.target.value)} className={inputCls} aria-label="Filter cabang">
                    <option value="ALL">Semua cabang</option>
                    {REI_BRANCHES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {shortBranch(b.name)}
                      </option>
                    ))}
                  </select>
                  <select value={customStep} onChange={(e) => setCustomStep(e.target.value)} className={inputCls} aria-label="Filter tahap">
                    <option value="ALL">Semua tahap</option>
                    {STEPS.map((s, i) => (
                      <option key={s.key} value={s.key}>
                        {i + 1}. {s.label}
                      </option>
                    ))}
                  </select>
                  {customFilterActive && (
                    <button onClick={resetCustomFilter} className={`${btnCls} col-span-2 justify-center md:col-span-1`}>
                      <X className="h-3.5 w-3.5" /> Reset
                    </button>
                  )}
                </>
              ) : (
                <>
                  <select value={bprsInstitution} onChange={(e) => setBprsInstitution(e.target.value)} className={inputCls} aria-label="Filter lembaga BPRS">
                    <option value="ALL">Semua BPRS ({bprsDirectory.length})</option>
                    {bprsDirectory.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.shortName} ({bprsCountById[b.id] || 0})
                      </option>
                    ))}
                  </select>
                  <select value={bprsBranch} onChange={(e) => setBprsBranch(e.target.value)} className={inputCls} aria-label="Filter cabang">
                    <option value="ALL">Semua cabang</option>
                    {REI_BRANCHES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {shortBranch(b.name)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={bprsHandover}
                    onChange={(e) => setBprsHandover(e.target.value as typeof bprsHandover)}
                    className={inputCls}
                    aria-label="Filter serah terima"
                  >
                    <option value="ALL">Semua status</option>
                    <option value="pending">Belum serah terima</option>
                    <option value="done">Sudah serah terima</option>
                  </select>
                  {bprsFilterActive && (
                    <button onClick={resetBprsFilter} className={`${btnCls} justify-center`}>
                      <X className="h-3.5 w-3.5" /> Reset
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'custom' ? (
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-white/[0.02] dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Pemesan</th>
                    <th className="px-4 py-2.5 font-medium">Produk</th>
                    <th className="px-4 py-2.5 font-medium">Tahap</th>
                    <th className="px-4 py-2.5 font-medium">Pembayaran</th>
                    <th className="px-4 py-2.5 text-right font-medium">Total</th>
                    <th className="px-4 py-2.5 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredCustom.length === 0 && <EmptyRow colSpan={6} onReset={customFilterActive ? resetCustomFilter : undefined} />}
                  {filteredCustom.map((o) => {
                    const dpPaid = o.dpInvoice.status === 'terkonfirmasi';
                    const lunasPaid = o.lunasInvoice.status === 'terkonfirmasi';
                    const wp = o.workProgress;
                    return (
                      <tr key={o.id} className="align-top transition hover:bg-gray-50/70 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{o.customerName}</span>
                            {o.syncedToSupabase && (
                              <span title="Tersinkronisasi ke Database Mitra & CRM" className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            )}
                          </div>
                          <div className="mt-0.5 font-mono text-[11px] text-gray-500 dark:text-gray-400">{o.orderNumber}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Building2 className="h-3 w-3" />
                            {shortBranch(o.branchRei)} · {o.customerPhone}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => setPreviewId(o.id)}
                              className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5"
                              title="Lihat desain"
                            >
                              {isImageUrl(o.finalDesignUrl) ? (
                                <img src={o.finalDesignUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <FileText className="m-auto h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            <div className="min-w-0">
                              <div className="font-medium tabular-nums">
                                {o.goldGram} g × {o.quantity}
                              </div>
                              <div className="max-w-[200px] truncate text-xs text-gray-500 dark:text-gray-400" title={o.goldType}>
                                {o.goldType}
                              </div>
                              <div className="mt-1">
                                <Badge tone={o.designStatus === 'siap_cetak' ? 'blue' : 'gray'}>
                                  {DESIGN_STATUS_LABEL[o.designStatus]}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <StepIndicator step={wp.step} />
                          {wp.shippingMethod && (wp.step === 'pengiriman' || wp.step === 'done') && (
                            <div className="mt-1 flex max-w-[180px] items-center gap-1 truncate text-xs text-gray-500 dark:text-gray-400">
                              <Truck className="h-3 w-3 shrink-0" />
                              {wp.shippingMethod === 'jne' ? `JNE ${wp.jneResiNumber || '-'}` : shortBranch(wp.helperName || 'Helper REI')}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col items-start gap-1">
                            <Badge tone={dpPaid ? 'green' : 'amber'}>DP {dpPaid ? 'lunas' : 'pending'}</Badge>
                            <Badge tone={lunasPaid ? 'green' : 'gray'}>
                              {lunasPaid ? 'Pelunasan selesai' : `Sisa ${formatRupiah(o.lunasInvoice.remainingAmount)}`}
                            </Badge>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right font-medium tabular-nums">{formatRupiah(o.totalPrice)}</td>

                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            {rolePerms.canUpdateProgress && (
                              <button onClick={() => setProgressId(o.id)} className={btnCls} title="Update pengerjaan">
                                <RefreshCw className="h-3.5 w-3.5" /> Progres
                              </button>
                            )}
                            <button onClick={() => setDpId(o.id)} className={btnCls}>
                              DP
                            </button>
                            <button onClick={() => setLunasId(o.id)} className={btnCls}>
                              Lunas
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-white/[0.02] dark:text-gray-400">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Nasabah</th>
                    <th className="px-4 py-2.5 font-medium">BPRS & cabang</th>
                    <th className="px-4 py-2.5 font-medium">Emas</th>
                    <th className="px-4 py-2.5 font-medium">Angsuran</th>
                    <th className="px-4 py-2.5 font-medium">Serah terima</th>
                    <th className="px-4 py-2.5 text-right font-medium">Dokumen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {filteredBprs.length === 0 && <EmptyRow colSpan={6} onReset={bprsFilterActive ? resetBprsFilter : undefined} />}
                  {filteredBprs.map((o) => {
                    const pct = o.totalInstallments ? Math.min(100, Math.round((o.installmentsPaid / o.totalInstallments) * 100)) : 0;
                    return (
                      <tr key={o.id} className="align-top transition hover:bg-gray-50/70 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{o.customerName}</span>
                            {o.fromDatabase && (
                              <Badge tone="blue">Live DB</Badge>
                            )}
                          </div>
                          <div className="mt-0.5 font-mono text-[11px] text-gray-500 dark:text-gray-400">{o.contractNumber}</div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="max-w-[220px] truncate" title={o.bprsName}>
                            {o.bprsName}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Building2 className="h-3 w-3" />
                            {shortBranch(o.branchRei)} · {o.fakturDate}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-medium tabular-nums">{o.goldGram} g</div>
                          <div className="mt-0.5 font-mono text-[11px] text-gray-500 dark:text-gray-400">
                            {o.goldSerialNumbers.join(', ')}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="tabular-nums text-gray-700 dark:text-gray-300">
                              {o.installmentsPaid}/{o.totalInstallments} bln
                            </span>
                            <span className="tabular-nums text-gray-500 dark:text-gray-400">{pct}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-36 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                            <div
                              className={`h-full rounded-full ${pct === 100 ? 'bg-emerald-500' : 'bg-purple-600 dark:bg-purple-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="mt-1 text-xs tabular-nums text-gray-500 dark:text-gray-400">
                            {formatRupiah(o.monthlyInstallment)}/bln
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <Badge tone={o.isHandoverCompleted ? 'green' : 'amber'}>
                            {o.isHandoverCompleted ? 'Selesai' : 'Belum'}
                          </Badge>
                          {o.isHandoverCompleted && o.notaHandoverDate && (
                            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{o.notaHandoverDate}</div>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => setFakturId(o.id)} className={btnCls}>
                              <FileText className="h-3.5 w-3.5" /> Faktur
                            </button>
                            <button onClick={() => setNotaId(o.id)} className={btnCls}>
                              <Award className="h-3.5 w-3.5" /> Nota
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
            <span>
              {activeTab === 'custom'
                ? `Menampilkan ${filteredCustom.length} dari ${customOrders.length} pesanan`
                : `Menampilkan ${filteredBprs.length} dari ${bprsOrders.length} akad`}
            </span>
            {dbStatus?.connected && (
              <span className="hidden text-[11px] text-emerald-600 dark:text-emerald-400 sm:inline">
                Tersinkronisasi dengan database Mitra & CRM ({dbStatus.partnersCount} mitra aktif)
              </span>
            )}
          </div>
        </section>
      </main>

      {/* Modals */}
      {dpOrder && (
        <CustomDpInvoiceModal
          order={dpOrder}
          onClose={() => setDpId(null)}
          onConfirmDp={rolePerms.canConfirmPayment ? handleConfirmDp : undefined}
        />
      )}

      {lunasOrder && (
        <CustomLunasInvoiceModal
          order={lunasOrder}
          onClose={() => setLunasId(null)}
          onConfirmLunas={rolePerms.canConfirmPayment ? handleConfirmLunas : undefined}
        />
      )}

      {progressOrder && (
        <UpdateProgressModal
          order={progressOrder}
          onClose={() => setProgressId(null)}
          onUpdate={handleUpdateProgress}
        />
      )}

      {fakturOrder && <BprsFakturWebModal order={fakturOrder} onClose={() => setFakturId(null)} />}

      {notaOrder && (
        <BprsNotaReiModal
          key={`${notaOrder.id}-${notaOrder.isHandoverCompleted}`}
          order={notaOrder}
          onClose={() => setNotaId(null)}
          onCompleteHandover={rolePerms.canSignNotaRei ? handleCompleteHandover : undefined}
        />
      )}

      {isNewOrderOpen && (
        <NewCustomOrderModal
          onClose={() => setIsNewOrderOpen(false)}
          onSubmit={handleAddNewCustomOrder}
          defaultBranch={session.branchRei}
          defaultPricePerGram={dbStatus?.goldPrice1g}
        />
      )}

      {previewOrder && (
        <div onClick={() => setPreviewId(null)} className="fixed inset-0 z-50 flex bg-black/80 p-4 print:hidden">
          <div
            onClick={(e) => e.stopPropagation()}
            className="m-auto w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-[#16131f]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-white/10">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{previewOrder.customerName}</div>
                <div className="truncate font-mono text-[11px] text-gray-500 dark:text-gray-400">
                  {previewOrder.finalDesignFilename || 'File desain'}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <a
                  href={previewOrder.finalDesignUrl}
                  download={previewOrder.finalDesignFilename || true}
                  target="_blank"
                  rel="noreferrer"
                  className={btnCls}
                >
                  <Download className="h-3.5 w-3.5" /> Unduh
                </a>
                <button onClick={() => setPreviewId(null)} className={btnCls} aria-label="Tutup">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex max-h-[75vh] items-center justify-center bg-gray-950 p-2">
              {isImageUrl(previewOrder.finalDesignUrl) ? (
                <img src={previewOrder.finalDesignUrl} alt="Desain final" className="max-h-[72vh] w-full object-contain" />
              ) : (
                <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-gray-300">
                  <FileText className="h-8 w-8" />
                  Preview tidak tersedia, silakan unduh file.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
