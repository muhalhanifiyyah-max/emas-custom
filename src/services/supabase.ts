import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  CustomGoldSession,
  CustomGoldRole,
  CustomOrderItem,
  BprsCicilanOrder,
  BprsInstitutionInfo,
} from '../types/customGold';

const env = (import.meta as unknown as { env?: Record<string, string> }).env;

export const SUPABASE_URL =
  env?.VITE_SUPABASE_URL || 'https://rytaeenjobbutzodsido.supabase.co';
export const SUPABASE_ANON_KEY =
  env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Iu_nl3uZM6Pud5rYYT5UNQ_DaZST_0-';

export const MITRA_DASHBOARD_URL =
  env?.VITE_MITRA_DASHBOARD_URL || 'https://mitra-raja-emas.vercel.app';
export const CRM_DASHBOARD_URL =
  env?.VITE_CRM_DASHBOARD_URL || 'https://crm-mitra.vercel.app';

export const CUSTOM_SESSION_KEY = 'rei_emas_custom_session_v1';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
};

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-USER ROLE INTERNAL ACCOUNTS (Staff Pusat, Cabang REI, Desainer, Finance)
// Password default untuk preset staff internal dapat disesuaikan via .env
// ─────────────────────────────────────────────────────────────────────────────
export interface PresetAccountEntry {
  session: CustomGoldSession;
  passwords: string[];
}

export const INTERNAL_MULTI_ROLE_ACCOUNTS: PresetAccountEntry[] = [
  {
    passwords: [env?.VITE_ADMIN_PASSWORD || 'admin123', 'rei2026', 'mitra123'],
    session: {
      id: 'usr-admin-pusat',
      role: 'admin',
      name: 'Super Admin Pusat REI',
      email: 'admin@rajaemasindonesia.co.id',
      partnerId: 'rei-pusat',
      partnerName: 'PT Emas Murni Asli (Pusat Khazanah)',
      partnerCategory: 'Pusat',
      avatarBadge: 'ADM',
      source: 'internal_rei',
    },
  },
  {
    passwords: ['cabang123', 'depok123', 'mitra123'],
    session: {
      id: 'usr-cabang-depok',
      role: 'cabang_rei',
      name: 'Rian Hidayat (PIC REI Depok)',
      email: 'depok@rajaemasindonesia.co.id',
      branchRei: 'REI Depok (Margonda)',
      partnerId: 'rei-depok',
      partnerName: 'Cabang REI Depok (Margonda)',
      partnerCategory: 'Cabang REI',
      avatarBadge: 'DPK',
      source: 'internal_rei',
    },
  },
  {
    passwords: ['cabang123', 'tebet123', 'mitra123'],
    session: {
      id: 'usr-cabang-tebet',
      role: 'cabang_rei',
      name: 'Ahmad Fauzi (PIC REI Tebet)',
      email: 'tebet@rajaemasindonesia.co.id',
      branchRei: 'REI Tebet (Kantor Pusat Khazanah)',
      partnerId: 'rei-tebet',
      partnerName: 'Cabang REI Tebet',
      partnerCategory: 'Cabang REI',
      avatarBadge: 'TBT',
      source: 'internal_rei',
    },
  },
  {
    passwords: ['desain123', 'produksi123', 'mitra123'],
    session: {
      id: 'usr-desain-produksi',
      role: 'desainer_produksi',
      name: 'Nadia Putri (Desain & Produksi)',
      email: 'produksi@rajaemasindonesia.co.id',
      partnerId: 'rei-produksi',
      partnerName: 'Divisi Grafir & Percetakan REI',
      partnerCategory: 'Produksi',
      avatarBadge: 'PRD',
      source: 'internal_rei',
    },
  },
  {
    passwords: ['finance123', 'treasury123', 'mitra123'],
    session: {
      id: 'usr-finance-treasury',
      role: 'finance',
      name: 'Dewi Lestari (Finance & Treasury)',
      email: 'finance@rajaemasindonesia.co.id',
      partnerId: 'rei-finance',
      partnerName: 'Divisi Finance & Treasury REI',
      partnerCategory: 'Finance',
      avatarBadge: 'FIN',
      source: 'internal_rei',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONNECTION HEALTH CHECK (Cek koneksi ke DB Mitra & CRM)
// ─────────────────────────────────────────────────────────────────────────────
export interface DbSyncStatus {
  connected: boolean;
  message: string;
  partnersCount: number;
  transactionsCount: number;
  goldPrice1g: number;
}

export const checkDatabaseConnection = async (): Promise<DbSyncStatus> => {
  try {
    const client = getSupabase();
    const [partnersRes, txRes, prodRes] = await Promise.all([
      client.from('partners').select('id', { count: 'exact', head: true }),
      client.from('transactions').select('id', { count: 'exact', head: true }),
      client.from('gold_products').select('sell_price').eq('id', 'prod-rei-1').maybeSingle(),
    ]);

    if (partnersRes.error && txRes.error) {
      return {
        connected: false,
        message: `Gagal terhubung ke Supabase: ${partnersRes.error.message}`,
        partnersCount: 0,
        transactionsCount: 0,
        goldPrice1g: 2565000,
      };
    }

    return {
      connected: true,
      message: 'Terhubung Live DB (Mitra & CRM)',
      partnersCount: partnersRes.count ?? 0,
      transactionsCount: txRes.count ?? 0,
      goldPrice1g: prodRes.data?.sell_price ? Number(prodRes.data.sell_price) : 2565000,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: err?.message || 'Koneksi database terputus',
      partnersCount: 0,
      transactionsCount: 0,
      goldPrice1g: 2565000,
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION (Multi-Role Internal + Live Supabase Partners Table)
// ─────────────────────────────────────────────────────────────────────────────
export const authenticateCustomGoldUser = async (
  emailInput: string,
  passwordInput: string
): Promise<{ session: CustomGoldSession | null; error?: string }> => {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !password) {
    return { session: null, error: 'Email dan password wajib diisi.' };
  }

  // 1. Cek akun internal multi-role REI (Admin, Cabang REI, Desainer, Finance)
  const internalMatch = INTERNAL_MULTI_ROLE_ACCOUNTS.find(
    (acc) => acc.session.email.toLowerCase() === email
  );
  if (internalMatch) {
    if (internalMatch.passwords.includes(password)) {
      return { session: internalMatch.session };
    }
    return { session: null, error: 'Password tidak sesuai untuk akun internal tersebut.' };
  }

  // 2. Cek akun terdaftar di Supabase `partners` (sinkron dengan Dasbor Mitra & CRM)
  try {
    const { data, error } = await getSupabase()
      .from('partners')
      .select('*')
      .ilike('email', email)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Supabase partner login error:', error.message);
      return { session: null, error: 'Gagal memeriksa kredensial ke database pusat.' };
    }

    if (!data) {
      return { session: null, error: 'Email akun tidak terdaftar di database Mitra / CRM.' };
    }

    if (data.password !== password) {
      return { session: null, error: 'Password akun mitra salah.' };
    }

    const isHimbarsi = data.email?.toLowerCase() === 'himbarsi@himbarsi.or.id' || data.id === 'pt-himbarsi';
    const role: CustomGoldRole = 'bprs'; // Mitra BPRS / Lembaga Pembiayaan

    const partnerSession: CustomGoldSession = {
      id: data.id,
      role,
      name: data.contact_person || data.name,
      email: data.email,
      partnerId: data.id,
      partnerName: data.name,
      partnerCategory: data.category || 'BPRS',
      isHimbarsi,
      avatarBadge: (data.code || 'BPR').slice(0, 3).toUpperCase(),
      source: 'supabase_partners',
    };

    return { session: partnerSession };
  } catch (err) {
    return { session: null, error: 'Terjadi kesalahan jaringan saat otentikasi.' };
  }
};

export const saveCustomSession = (session: CustomGoldSession): void => {
  localStorage.setItem(CUSTOM_SESSION_KEY, JSON.stringify(session));
};

export const loadCustomSession = (): CustomGoldSession | null => {
  try {
    const raw = localStorage.getItem(CUSTOM_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CustomGoldSession;
    if (!parsed?.email || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearCustomSession = (): void => {
  localStorage.removeItem(CUSTOM_SESSION_KEY);
};

// ─────────────────────────────────────────────────────────────────────────────
// LIVE DATA SYNC WITH DASBOR MITRA & CRM (Supabase)
// ─────────────────────────────────────────────────────────────────────────────

// Ambil daftar BPRS aktif langsung dari tabel `partners`
export const fetchLiveBprsPartners = async (): Promise<BprsInstitutionInfo[]> => {
  try {
    const { data, error } = await getSupabase()
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error || !data) return [];

    return data
      .filter((p: any) => p.category === 'BPRS' || p.id === 'pt-himbarsi')
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        shortName: p.name.length > 26 ? `${p.name.slice(0, 24)}...` : p.name,
        city: p.address || 'Indonesia',
        code: p.code || 'BPRS',
        phone: p.phone || '-',
        contactPerson: p.contact_person || 'Admin BPRS',
        email: p.email || '-',
        isActive: p.is_active ?? true,
        totalActiveContracts: p.total_transactions ?? 0,
        totalGramsFinanced: parseFloat(p.total_volume_grams ?? 0),
        fromDatabase: true,
      }));
  } catch {
    return [];
  }
};

// Sinkronisasi pesanan custom emas ke tabel `transactions` Supabase agar terbaca Dasbor Mitra & CRM
export const syncCustomOrderToSupabase = async (
  order: CustomOrderItem,
  session?: CustomGoldSession | null
): Promise<boolean> => {
  try {
    const client = getSupabase();

    // Tentukan status transaksi standar Mitra agar tampil sinkron di Dasbor Mitra
    let txStatus = 'Diproses';
    if (order.workProgress.step === 'pengiriman') txStatus = 'Sedang Dikirim';
    if (order.workProgress.step === 'done' && order.lunasInvoice.status === 'terkonfirmasi') {
      txStatus = 'Selesai';
    } else if (order.workProgress.step === 'done') {
      txStatus = 'Barang Diterima';
    } else if (order.dpInvoice.status === 'pending') {
      txStatus = 'Menunggu Pembayaran DP';
    }

    const paymentStatus =
      order.lunasInvoice.status === 'terkonfirmasi'
        ? 'Lunas'
        : order.dpInvoice.status === 'terkonfirmasi'
        ? 'DP Terkonfirmasi'
        : 'Menunggu DP';

    const metaNotes = {
      userNotes: `[Emas-Custom ${order.branchRei}] ${order.goldType} - ${order.requestDetails}`,
      __dp: {
        isDpPayment: true,
        dpPercentage: order.dpInvoice.dpPercentage,
        dpAmount: order.dpInvoice.dpAmount,
        remainingAmount: order.lunasInvoice.remainingAmount,
        dpStatus: order.dpInvoice.status,
        dpPaidAt: order.dpInvoice.paidAt,
      },
      __customGold: order,
    };

    const courierPayload = {
      serviceId: order.workProgress.shippingMethod === 'jne' ? 'jne_yes_safe' : 'raja_emas_armored',
      serviceName:
        order.workProgress.shippingMethod === 'jne'
          ? 'JNE Express (Emas Custom)'
          : 'Helper Cabang REI',
      courierFee: 0,
      insuranceFee: 0,
      resiNumber:
        order.workProgress.shippingMethod === 'jne'
          ? order.workProgress.jneResiNumber || ''
          : `HELPER-${order.orderNumber}`,
      driverName: order.workProgress.helperName || '',
      driverPhone: order.workProgress.helperPhone || '',
    };

    const partnerId = session?.partnerId && session.source === 'supabase_partners'
      ? session.partnerId
      : 'pt-himbarsi';

    const partnerName = session?.partnerName && session.source === 'supabase_partners'
      ? session.partnerName
      : `${order.branchRei} (Custom Perorangan)`;

    const payload = {
      id: order.id,
      invoice_number: order.orderNumber,
      date: order.createdAt.split(' ')[0] || new Date().toISOString().split('T')[0],
      partner_id: partnerId,
      partner_name: partnerName,
      partner_category: 'BPRS',
      parent_organization: 'REI_CUSTOM',
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_address: order.branchRei,
      referral_code: 'CUSTOM-LM',
      items: [
        {
          productId: `custom-${order.goldGram}g`,
          brand: 'Raja Emas Indonesia',
          weight: order.goldGram,
          quantity: order.quantity,
          pricePerUnit: order.pricePerGram * order.goldGram,
          subtotal: order.totalPrice,
        },
      ],
      total_weight_grams: order.goldGram * order.quantity,
      gold_subtotal: order.totalPrice - order.customDesignFee,
      courier: courierPayload,
      total_amount: order.totalPrice,
      points_earned: 0,
      points_value_rp: 0,
      cashback_earned: 0,
      payment_method: 'bsi_va',
      payment_status: paymentStatus,
      status: txStatus,
      notes: JSON.stringify(metaNotes),
      tracking_history: [
        {
          date: order.createdAt.split(' ')[0],
          time: order.createdAt.split(' ')[1] || '09:00',
          title: `Pesanan Custom: ${order.workProgress.step.toUpperCase()}`,
          location: order.branchRei,
          description: order.workProgress.notes || order.requestDetails,
          completed: true,
        },
      ],
      updated_at: new Date().toISOString(),
    };

    const { error } = await client.from('transactions').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('syncCustomOrderToSupabase error:', error.message);
      return false;
    }

    // Kirim notifikasi lintas sistem (terbaca di Dasbor Mitra)
    await client.from('notifications').insert({
      id: `notif-cust-${Date.now()}`,
      title: `Pesanan Emas Custom (${order.branchRei})`,
      message: `${order.customerName} memesan ${order.quantity}x ${order.goldGram}g (${order.goldType}) — Tahap: ${order.workProgress.step.toUpperCase()}`,
      timestamp: new Date().toISOString(),
      category: 'transaksi',
      read: false,
      related_id: order.id,
      priority: 'high',
      partner_id: partnerId,
    });

    return true;
  } catch (err) {
    console.error('syncCustomOrderToSupabase exception:', err);
    return false;
  }
};

// Ambil pesanan Custom & Cicilan BPRS langsung dari tabel `transactions` Supabase
export const fetchSyncedOrdersFromSupabase = async (): Promise<{
  customOrders: CustomOrderItem[];
  bprsOrders: BprsCicilanOrder[];
}> => {
  try {
    const { data, error } = await getSupabase()
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return { customOrders: [], bprsOrders: [] };

    const customOrders: CustomOrderItem[] = [];
    const bprsOrders: BprsCicilanOrder[] = [];

    for (const row of data) {
      let parsedNotes: any = {};
      if (typeof row.notes === 'string' && row.notes.startsWith('{')) {
        try {
          parsedNotes = JSON.parse(row.notes);
        } catch {
          parsedNotes = {};
        }
      }

      // 1. Jika transaksi merupakan Emas Custom (memiliki __customGold)
      if (parsedNotes?.__customGold) {
        customOrders.push({
          ...parsedNotes.__customGold,
          syncedToSupabase: true,
        });
        continue;
      }

      // 2. Jika transaksi dari mitra BPRS di Dasbor Mitra / CRM
      if (row.partner_category === 'BPRS' && row.parent_organization !== 'REI_CUSTOM') {
        const items = Array.isArray(row.items) ? row.items : [];
        const serialNumbers: string[] = [];
        items.forEach((it: any) => {
          if (Array.isArray(it.serialNumbers)) {
            serialNumbers.push(...it.serialNumbers);
          }
        });

        const totalVal = Number(row.total_amount || row.gold_subtotal || 0);
        const totalGrams = Number(row.total_weight_grams || 1);
        const dpVal = parsedNotes?.__dp?.dpAmount ? Number(parsedNotes.__dp.dpAmount) : Math.round(totalVal * 0.2);

        const rawAddr = `${row.customer_address || ''} ${row.partner_name || ''}`.toLowerCase();
        let resolvedBranch = 'REI Tebet (Kantor Pusat Khazanah)';
        if (rawAddr.includes('depok')) resolvedBranch = 'REI Depok (Margonda)';
        else if (rawAddr.includes('serpong') || rawAddr.includes('bsd') || rawAddr.includes('tangerang') || rawAddr.includes('ciledug')) resolvedBranch = 'REI Serpong (BSD City)';
        else if (rawAddr.includes('bekasi')) resolvedBranch = 'REI Bekasi (Grand Galaxy)';
        else if (rawAddr.includes('cengkareng') || rawAddr.includes('barat')) resolvedBranch = 'REI Cengkareng (Daan Mogot)';
        else if (rawAddr.includes('bandung')) resolvedBranch = 'REI Bandung (Martadinata)';
        else if (rawAddr.includes('bogor')) resolvedBranch = 'REI Bogor (Pajajaran)';

        bprsOrders.push({
          id: row.id,
          contractNumber: `AKAD-DB/${row.invoice_number}`,
          fakturWebNumber: row.invoice_number,
          notaReiNumber: `NOTA-REI/${row.invoice_number.replace('INV/', '')}`,
          bprsId: row.partner_id || 'bprs-mitra',
          bprsName: row.partner_name || 'Mitra BPRS',
          branchRei: resolvedBranch,
          customerName: row.customer_name || 'Nasabah BPRS',
          customerPhone: row.customer_phone || '-',
          customerNik: '-',
          customerAddress: row.customer_address || '-',
          goldGram: totalGrams,
          goldPurity: '999.9 (24 Karat) SNI Khazanah',
          goldSerialNumbers:
            serialNumbers.length > 0
              ? serialNumbers
              : [`REI-DB-${String(row.id).slice(-5)}`],
          tenorMonths: 12,
          monthlyInstallment: Math.round((totalVal - dpVal) / 12),
          totalValue: totalVal,
          downPayment: dpVal,
          installmentsPaid: row.payment_status === 'Lunas' ? 12 : 1,
          totalInstallments: 12,
          status: row.status === 'Selesai' || row.payment_status === 'Lunas' ? 'Lunas' : 'Aktif',
          fakturDate: row.date || new Date().toISOString().split('T')[0],
          isHandoverCompleted: row.status === 'Selesai' || row.status === 'Barang Diterima',
          fromDatabase: true,
        });
      }
    }

    return { customOrders, bprsOrders };
  } catch (err) {
    console.error('fetchSyncedOrdersFromSupabase error:', err);
    return { customOrders: [], bprsOrders: [] };
  }
};
