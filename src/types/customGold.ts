export type CustomGoldRole =
  | 'admin'
  | 'cabang_rei'
  | 'desainer_produksi'
  | 'finance'
  | 'bprs';

export interface CustomGoldSession {
  id: string;
  role: CustomGoldRole;
  name: string;
  email: string;
  branchRei?: string;
  partnerId?: string;
  partnerName?: string;
  partnerCategory?: string;
  isHimbarsi?: boolean;
  avatarBadge: string;
  source: 'supabase_partners' | 'internal_rei';
}

export interface RoleMetadata {
  role: CustomGoldRole;
  label: string;
  badgeColor: string;
  description: string;
  canCreateOrder: boolean;
  canConfirmPayment: boolean;
  canUpdateProgress: boolean;
  canSignNotaRei: boolean;
  canViewBprsTab: boolean;
}

export const ROLE_CONFIG: Record<CustomGoldRole, RoleMetadata> = {
  admin: {
    role: 'admin',
    label: 'Super Admin Pusat REI',
    badgeColor: 'bg-purple-600 text-white border-purple-400',
    description: 'Akses penuh seluruh cabang REI, verifikasi pembayaran, produksi & BPRS.',
    canCreateOrder: true,
    canConfirmPayment: true,
    canUpdateProgress: true,
    canSignNotaRei: true,
    canViewBprsTab: true,
  },
  cabang_rei: {
    role: 'cabang_rei',
    label: 'PIC Cabang REI',
    badgeColor: 'bg-amber-500 text-purple-950 border-amber-300',
    description: 'Buat pesanan cabang, pantau pengiriman, dan tandatangani Nota Serah Terima REI.',
    canCreateOrder: true,
    canConfirmPayment: false,
    canUpdateProgress: true,
    canSignNotaRei: true,
    canViewBprsTab: true,
  },
  desainer_produksi: {
    role: 'desainer_produksi',
    label: 'Tim Desain & Produksi',
    badgeColor: 'bg-indigo-600 text-white border-indigo-400',
    description: 'Kelola file final desain cetak, update produksi, & upload resi pengiriman JNE/Helper.',
    canCreateOrder: false,
    canConfirmPayment: false,
    canUpdateProgress: true,
    canSignNotaRei: false,
    canViewBprsTab: false,
  },
  finance: {
    role: 'finance',
    label: 'Finance & Verifikasi',
    badgeColor: 'bg-emerald-600 text-white border-emerald-400',
    description: 'Verifikasi & konfirmasi Invoice DP, pelunasan akhir (Invoice Lunas), dan Faktur Web.',
    canCreateOrder: false,
    canConfirmPayment: true,
    canUpdateProgress: false,
    canSignNotaRei: false,
    canViewBprsTab: true,
  },
  bprs: {
    role: 'bprs',
    label: 'Mitra BPRS / Lembaga',
    badgeColor: 'bg-blue-600 text-white border-blue-400',
    description: 'Pantau cicilan emas nasabah per cabang REI, cetak Faktur Website & Nota REI.',
    canCreateOrder: true,
    canConfirmPayment: false,
    canUpdateProgress: false,
    canSignNotaRei: false,
    canViewBprsTab: true,
  },
};

export interface BranchReiInfo {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  picName: string;
}

export interface BprsInstitutionInfo {
  id: string;
  name: string;
  shortName: string;
  city: string;
  code: string;
  phone: string;
  contactPerson: string;
  email: string;
  isActive: boolean;
  totalActiveContracts: number;
  totalGramsFinanced: number;
  fromDatabase?: boolean;
}

export type DesignStatus = 'draft' | 'menunggu_approval' | 'disetujui' | 'siap_cetak';
export type WorkProgressStep = 'design' | 'produksi' | 'pengiriman' | 'done';
export type ShippingMethod = 'helper' | 'jne';

export interface WorkProgress {
  step: WorkProgressStep;
  shippingMethod?: ShippingMethod;
  helperName?: string;
  helperPhone?: string;
  jneResiNumber?: string;
  jneResiPhotoUrl?: string;
  notes?: string;
  updatedAt: string;
}

export interface DpInvoiceInfo {
  invoiceNumber: string;
  dpAmount: number;
  dpPercentage: number;
  dueDate: string;
  status: 'pending' | 'terkonfirmasi';
  paidAt?: string;
  paymentProofUrl?: string;
}

export interface LunasInvoiceInfo {
  invoiceNumber: string;
  remainingAmount: number;
  dueDate: string;
  status: 'pending' | 'terkonfirmasi';
  paidAt?: string;
  paymentProofUrl?: string;
}

export interface CustomOrderItem {
  id: string;
  orderNumber: string;
  orderType: 'perorangan_cabang';
  customerName: string;
  customerPhone: string;
  branchRei: string;
  goldGram: number;
  goldPurity: string;
  goldType: string;
  quantity: number;
  pricePerGram: number;
  customDesignFee: number;
  totalPrice: number;
  requestDetails: string;
  finalDesignUrl: string;
  finalDesignFilename?: string;
  designStatus: DesignStatus;
  workProgress: WorkProgress;
  dpInvoice: DpInvoiceInfo;
  lunasInvoice: LunasInvoiceInfo;
  createdAt: string;
  updatedAt: string;
  syncedToSupabase?: boolean;
}

export interface BprsCicilanOrder {
  id: string;
  contractNumber: string;
  fakturWebNumber: string;
  notaReiNumber: string;
  bprsId: string;
  bprsName: string;
  branchRei: string;
  customerName: string;
  customerPhone: string;
  customerNik: string;
  customerAddress: string;
  goldGram: number;
  goldPurity: string;
  goldSerialNumbers: string[];
  tenorMonths: number;
  monthlyInstallment: number;
  totalValue: number;
  downPayment: number;
  installmentsPaid: number;
  totalInstallments: number;
  status: 'Aktif' | 'Lunas' | 'Jatuh Tempo';
  fakturDate: string;
  notaHandoverDate?: string;
  handoverReiOfficer?: string;
  handoverBprsOfficer?: string;
  handoverNotes?: string;
  isHandoverCompleted: boolean;
  fromDatabase?: boolean;
}
