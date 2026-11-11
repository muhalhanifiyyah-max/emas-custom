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
}
