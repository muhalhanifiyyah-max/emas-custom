import {
  BranchReiInfo,
  BprsInstitutionInfo,
  CustomOrderItem,
  BprsCicilanOrder,
} from '../types/customGold';
import { romanMonth } from '../utils/date';

export const REI_BRANCHES: BranchReiInfo[] = [
  {
    id: 'rei-tebet',
    name: 'REI Tebet (Kantor Pusat Khazanah)',
    code: 'TBT',
    city: 'Jakarta Selatan',
    address: 'Jl. Tebet Raya No. 45, Tebet, Jakarta Selatan 12810',
    phone: '0812-8800-1122',
    picName: 'Ahmad Fauzi (Khazanah Pusat)',
  },
  {
    id: 'rei-depok',
    name: 'REI Depok (Margonda)',
    code: 'DPK',
    city: 'Kota Depok',
    address: 'Jl. Margonda Raya No. 188, Pondok Cina, Depok 16424',
    phone: '0813-2211-3344',
    picName: 'Rian Hidayat (PIC Depok)',
  },
  {
    id: 'rei-serpong',
    name: 'REI Serpong (BSD City)',
    code: 'SRP',
    city: 'Tangerang Selatan',
    address: 'Ruko Golden Boulevard Blok S-12, BSD City, Tangerang Selatan',
    phone: '0811-9988-7711',
    picName: 'Bayu Pratama (PIC Serpong)',
  },
  {
    id: 'rei-bekasi',
    name: 'REI Bekasi (Grand Galaxy)',
    code: 'BKS',
    city: 'Kota Bekasi',
    address: 'Grand Galaxy City Blok RGA No. 25, Jakasetia, Bekasi Selatan',
    phone: '0815-4433-2211',
    picName: 'Hendro Wijaya (PIC Bekasi)',
  },
  {
    id: 'rei-cengkareng',
    name: 'REI Cengkareng (Daan Mogot)',
    code: 'CKG',
    city: 'Jakarta Barat',
    address: 'Jl. Daan Mogot KM 14 No. 8, Cengkareng, Jakarta Barat',
    phone: '0817-5544-3322',
    picName: 'Siti Rahma (PIC Cengkareng)',
  },
  {
    id: 'rei-bandung',
    name: 'REI Bandung (Martadinata)',
    code: 'BDG',
    city: 'Kota Bandung',
    address: 'Jl. LLRE Martadinata No. 78, Riau, Bandung 40115',
    phone: '0812-3344-5566',
    picName: 'Dadan Suhendar (PIC Bandung)',
  },
  {
    id: 'rei-bogor',
    name: 'REI Bogor (Pajajaran)',
    code: 'BGR',
    city: 'Kota Bogor',
    address: 'Jl. Pajajaran Raya No. 92, Baranangsiang, Bogor Timur',
    phone: '0818-7766-5544',
    picName: 'Irfan Hakim (PIC Bogor)',
  },
];

export const BPRS_INSTITUTIONS: BprsInstitutionInfo[] = [
  {
    id: 'bprs-hik-depok',
    name: 'BPRS HIK Insan Cita Depok',
    shortName: 'BPRS HIK Depok',
    city: 'Kota Depok',
    code: 'HIK-DPK',
    phone: '021-7720-3344',
    contactPerson: 'Kurniawan (Kepala Divisi Pembiayaan)',
    email: 'pembiayaan@hikdepok.co.id',
    isActive: true,
    totalActiveContracts: 28,
    totalGramsFinanced: 265,
  },
  {
    id: 'bprs-hik-pusat',
    name: 'BPRS Harta Insan Karimah (HIK)',
    shortName: 'BPRS HIK Pusat',
    city: 'Tangerang Selatan',
    code: 'HIK-PST',
    phone: '021-740-9988',
    contactPerson: 'Aini Marketing / BPRS Officer',
    email: 'aini.marketing@rajaemasindonesia.co.id',
    isActive: true,
    totalActiveContracts: 45,
    totalGramsFinanced: 410,
  },
  {
    id: 'bprs-hik-parahyangan',
    name: 'BPRS HIK Parahyangan Bandung',
    shortName: 'BPRS HIK Bandung',
    city: 'Kota Bandung',
    code: 'HIK-BDG',
    phone: '022-720-1122',
    contactPerson: 'Ridwan Kamiludin',
    email: 'pembiayaan@hikparahyangan.co.id',
    isActive: true,
    totalActiveContracts: 19,
    totalGramsFinanced: 180,
  },
  {
    id: 'bprs-patriot-bekasi',
    name: 'BPRS Patriot Kota Bekasi',
    shortName: 'BPRS Patriot',
    city: 'Kota Bekasi',
    code: 'PTR-BKS',
    phone: '021-884-5511',
    contactPerson: 'Hendra Gunawan',
    email: 'emas@bprspatriot.co.id',
    isActive: true,
    totalActiveContracts: 22,
    totalGramsFinanced: 195,
  },
  {
    id: 'bprs-alsalaam',
    name: 'BPRS AlSalaam Amal Salman',
    shortName: 'BPRS AlSalaam',
    city: 'Jakarta Selatan',
    code: 'ALS-JKT',
    phone: '021-788-3456',
    contactPerson: 'Fitri Handayani',
    email: 'cicilanemas@alsalaam.co.id',
    isActive: true,
    totalActiveContracts: 34,
    totalGramsFinanced: 320,
  },
  {
    id: 'bprs-botani',
    name: 'BPRS Botani Bina Rahmah Bogor',
    shortName: 'BPRS Botani',
    city: 'Kota Bogor',
    code: 'BTN-BGR',
    phone: '0251-832-7788',
    contactPerson: 'Dr. Lukman Nurhakim',
    email: 'khazanah@bprsbotani.co.id',
    isActive: true,
    totalActiveContracts: 15,
    totalGramsFinanced: 140,
  },
  {
    id: 'bprs-amanah-ummah',
    name: 'BPRS Amanah Ummah',
    shortName: 'BPRS Amanah Ummah',
    city: 'Bogor Barat',
    code: 'AMU-BGR',
    phone: '0251-864-1234',
    contactPerson: 'Zulham Efendi',
    email: 'layanan@amanahummah.co.id',
    isActive: true,
    totalActiveContracts: 12,
    totalGramsFinanced: 95,
  },
  {
    id: 'bprs-dana-syariah',
    name: 'BPRS Dana Syariah (BDS)',
    shortName: 'BPRS BDS',
    city: 'Jakarta Timur',
    code: 'BDS-JKT',
    phone: '021-860-2211',
    contactPerson: 'Wahyu Ramadhan',
    email: 'info@danasyariah.co.id',
    isActive: true,
    totalActiveContracts: 18,
    totalGramsFinanced: 160,
  },
];

const INITIAL_CUSTOM_ORDERS: CustomOrderItem[] = [
  {
    id: 'custom-ord-001',
    orderNumber: 'ORD-CUST/REI/2026/11/001',
    orderType: 'perorangan_cabang',
    customerName: 'Bpk. Ir. Rahmat Gunawan',
    customerPhone: '081298765432',
    branchRei: 'REI Tebet (Kantor Pusat Khazanah)',
    goldGram: 10,
    goldPurity: '999.9 (24 Karat) Fine Gold',
    goldType: 'Custom Card Logam Mulia (Gift Edisi Wedding)',
    quantity: 2,
    pricePerGram: 2562500,
    customDesignFee: 250000,
    totalPrice: 51500000,
    requestDetails: 'Grafir foto siluet kedua mempelai "Rahmat & Sarah", barcode verifikasi, background motif floral emas elegan.',
    finalDesignUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
    finalDesignFilename: 'Design_Wedding_Rahmat_Sarah_Final_Cetak.pdf',
    designStatus: 'siap_cetak',
    workProgress: {
      step: 'pengiriman',
      shippingMethod: 'jne',
      jneResiNumber: 'JNE8892019921',
      jneResiPhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      notes: 'Paket diasuransikan all-risk LM via JNE YES. Estimasi tiba besok sore.',
      updatedAt: '2026-11-10 14:30',
    },
    dpInvoice: {
      invoiceNumber: 'INV-DP/REI/2026/XI/0081',
      dpAmount: 25750000,
      dpPercentage: 50,
      dueDate: '2026-11-05',
      status: 'terkonfirmasi',
      paidAt: '2026-11-05 10:15 WIB',
      paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    },
    lunasInvoice: {
      invoiceNumber: 'INV-LUNAS/REI/2026/XI/0042',
      remainingAmount: 25750000,
      dueDate: '2026-11-12',
      status: 'pending',
    },
    createdAt: '2026-11-04 09:20',
    updatedAt: '2026-11-10 14:30',
  },
  {
    id: 'custom-ord-002',
    orderNumber: 'ORD-CUST/REI/2026/11/002',
    orderType: 'perorangan_cabang',
    customerName: 'Ibu Dr. Ratna Juwita, Sp.A',
    customerPhone: '081388112233',
    branchRei: 'REI Depok (Margonda)',
    goldGram: 5,
    goldPurity: '999.9 (24 Karat) Fine Gold',
    goldType: 'Custom Card Logam Mulia (Kelahiran Buah Hati)',
    quantity: 1,
    pricePerGram: 2565000,
    customDesignFee: 150000,
    totalPrice: 12975000,
    requestDetails: 'Ucapan kelahiran: "Selamat Datang Baby Rayyan Arkana", tanggal lahir 01-11-2026, background soft pastel gold.',
    finalDesignUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80',
    finalDesignFilename: 'Mockup_Baby_Rayyan_Arkana_Approved.png',
    designStatus: 'siap_cetak',
    workProgress: {
      step: 'produksi',
      shippingMethod: 'helper',
      helperName: 'Doni Saputra (Helper REI Depok)',
      helperPhone: '0812-7788-9900',
      notes: 'Tahap pencetakan kartu laminasi eksklusif & finishing grafir emas.',
      updatedAt: '2026-11-11 09:00',
    },
    dpInvoice: {
      invoiceNumber: 'INV-DP/REI/2026/XI/0082',
      dpAmount: 6487500,
      dpPercentage: 50,
      dueDate: '2026-11-08',
      status: 'terkonfirmasi',
      paidAt: '2026-11-07 16:45 WIB',
      paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    },
    lunasInvoice: {
      invoiceNumber: 'INV-LUNAS/REI/2026/XI/0043',
      remainingAmount: 6487500,
      dueDate: '2026-11-13',
      status: 'pending',
    },
    createdAt: '2026-11-06 11:30',
    updatedAt: '2026-11-11 09:00',
  },
  {
    id: 'custom-ord-003',
    orderNumber: 'ORD-CUST/REI/2026/11/003',
    orderType: 'perorangan_cabang',
    customerName: 'Bpk. Hendra Saputra',
    customerPhone: '081901234567',
    branchRei: 'REI Serpong (BSD City)',
    goldGram: 25,
    goldPurity: '999.9 (24 Karat) Fine Gold',
    goldType: 'Custom Engraved Gold Bar (Corporate Loyalty)',
    quantity: 1,
    pricePerGram: 2560000,
    customDesignFee: 350000,
    totalPrice: 64350000,
    requestDetails: 'Grafir logo perusahaan "PT Cahaya Abadi 25th Anniversary", nomor seri khusus REI-CORP-025, sertifikat custom velvet box.',
    finalDesignUrl: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=800&q=80',
    finalDesignFilename: 'Design_Cahaya_Abadi_25th.pdf',
    designStatus: 'disetujui',
    workProgress: {
      step: 'design',
      notes: 'Desain layout disetujui pemesan, antrean file cetak ke unit grafir laser.',
      updatedAt: '2026-11-11 10:15',
    },
    dpInvoice: {
      invoiceNumber: 'INV-DP/REI/2026/XI/0083',
      dpAmount: 20000000,
      dpPercentage: 31,
      dueDate: '2026-11-11',
      status: 'terkonfirmasi',
      paidAt: '2026-11-10 11:00 WIB',
    },
    lunasInvoice: {
      invoiceNumber: 'INV-LUNAS/REI/2026/XI/0044',
      remainingAmount: 44350000,
      dueDate: '2026-11-16',
      status: 'pending',
    },
    createdAt: '2026-11-09 14:00',
    updatedAt: '2026-11-11 10:15',
  },
  {
    id: 'custom-ord-004',
    orderNumber: 'ORD-CUST/REI/2026/11/004',
    orderType: 'perorangan_cabang',
    customerName: 'Ibu Hj. Maryam Zulaikha',
    customerPhone: '081122334455',
    branchRei: 'REI Bandung (Martadinata)',
    goldGram: 50,
    goldPurity: '999.9 (24 Karat) Fine Gold',
    goldType: 'Custom Card Logam Mulia (Wakaf Emas Keluarga)',
    quantity: 1,
    pricePerGram: 2555000,
    customDesignFee: 200000,
    totalPrice: 127950000,
    requestDetails: 'Tulisan kaligrafi doa wakaf keluarga besar H. Sulaiman, kemasan akrilik eksklusif magnetik.',
    finalDesignUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
    finalDesignFilename: 'Wakaf_Sulaiman_Ready_Print.png',
    designStatus: 'siap_cetak',
    workProgress: {
      step: 'done',
      shippingMethod: 'helper',
      helperName: 'Rian Kurnia (Helper Khazanah REI Bandung)',
      helperPhone: '0813-8899-7711',
      notes: 'Pesanan telah diserahterimakan dan diterima dengan baik oleh pemesan di Cabang REI Bandung.',
      updatedAt: '2026-11-09 16:00',
    },
    dpInvoice: {
      invoiceNumber: 'INV-DP/REI/2026/XI/0075',
      dpAmount: 64000000,
      dpPercentage: 50,
      dueDate: '2026-11-01',
      status: 'terkonfirmasi',
      paidAt: '2026-11-01 10:00 WIB',
    },
    lunasInvoice: {
      invoiceNumber: 'INV-LUNAS/REI/2026/XI/0038',
      remainingAmount: 63950000,
      dueDate: '2026-11-09',
      status: 'terkonfirmasi',
      paidAt: '2026-11-09 15:30 WIB',
      paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
    },
    createdAt: '2026-10-30 08:30',
    updatedAt: '2026-11-09 16:00',
  },
];

const INITIAL_BPRS_CICILAN: BprsCicilanOrder[] = [
  {
    id: 'cicilan-bprs-001',
    contractNumber: 'AKAD-BPRS/HIK-DPK/2026/XI/018',
    fakturWebNumber: 'FAKTUR-WEB/2026/XI/8812',
    notaReiNumber: 'NOTA-REI/DPK/2026/XI/051',
    bprsId: 'bprs-hik-depok',
    bprsName: 'BPRS HIK Insan Cita Depok',
    branchRei: 'REI Depok (Margonda)',
    customerName: 'Ibu Aini (Nasabah Prioritas HIK)',
    customerPhone: '081802180003',
    customerNik: '3174095208840003',
    customerAddress: 'Jl. Surya Kencana No. 42, Kebon Jeruk, Jakarta Barat',
    goldGram: 10,
    goldPurity: '999.9 (24 Karat) SNI Khazanah',
    goldSerialNumbers: ['REI-24K-DPK-99411', 'REI-24K-DPK-99412'],
    tenorMonths: 12,
    monthlyInstallment: 1859375,
    totalValue: 27312500,
    downPayment: 5000000,
    installmentsPaid: 3,
    totalInstallments: 12,
    status: 'Aktif',
    fakturDate: '2026-08-10',
    notaHandoverDate: '2026-11-10',
    handoverReiOfficer: 'Rian Hidayat (Khazanah REI Depok)',
    handoverBprsOfficer: 'Kurniawan (Div. Pembiayaan HIK Depok)',
    handoverNotes: 'Fisik 2 keping emas @ 5g telah diperiksa bersama, nomor seri sesuai dan tersimpan aman di brankas titipan khazanah.',
    isHandoverCompleted: true,
  },
  {
    id: 'cicilan-bprs-002',
    contractNumber: 'AKAD-BPRS/HIK-PST/2026/XI/022',
    fakturWebNumber: 'FAKTUR-WEB/2026/XI/8819',
    notaReiNumber: 'NOTA-REI/TBT/2026/XI/058',
    bprsId: 'bprs-hik-pusat',
    bprsName: 'BPRS Harta Insan Karimah (HIK)',
    branchRei: 'REI Tebet (Kantor Pusat Khazanah)',
    customerName: 'Bpk. Bambang Pamungkas',
    customerPhone: '081288991234',
    customerNik: '3275031204880005',
    customerAddress: 'Jl. Merpati Putih No. 12, Bekasi Barat',
    goldGram: 5,
    goldPurity: '999.9 (24 Karat) SNI Khazanah',
    goldSerialNumbers: ['REI-24K-TBT-88710'],
    tenorMonths: 6,
    monthlyInstallment: 2150000,
    totalValue: 13650000,
    downPayment: 2500000,
    installmentsPaid: 2,
    totalInstallments: 6,
    status: 'Aktif',
    fakturDate: '2026-07-15',
    handoverReiOfficer: 'Ahmad Fauzi (Khazanah Pusat REI)',
    isHandoverCompleted: false,
  },
  {
    id: 'cicilan-bprs-003',
    contractNumber: 'AKAD-BPRS/PTR-BKS/2026/X/009',
    fakturWebNumber: 'FAKTUR-WEB/2026/X/7740',
    notaReiNumber: 'NOTA-REI/BKS/2026/X/033',
    bprsId: 'bprs-patriot-bekasi',
    bprsName: 'BPRS Patriot Kota Bekasi',
    branchRei: 'REI Bekasi (Grand Galaxy)',
    customerName: 'Ibu Siti Khodijah',
    customerPhone: '081399887766',
    customerNik: '3171056501750002',
    customerAddress: 'Menteng Residence Blok C-08, Bekasi Timur',
    goldGram: 25,
    goldPurity: '999.9 (24 Karat) SNI Khazanah',
    goldSerialNumbers: ['REI-24K-BKS-55101'],
    tenorMonths: 24,
    monthlyInstallment: 2850000,
    totalValue: 68400000,
    downPayment: 10000000,
    installmentsPaid: 6,
    totalInstallments: 24,
    status: 'Aktif',
    fakturDate: '2026-05-10',
    notaHandoverDate: '2026-05-12',
    handoverReiOfficer: 'Hendro Wijaya (Khazanah REI Bekasi)',
    handoverBprsOfficer: 'Hendra Gunawan (BPRS Patriot)',
    handoverNotes: 'Fisik LM 25 gram telah diterima perwakilan BPRS Patriot disaksikan nasabah.',
    isHandoverCompleted: true,
  },
  {
    id: 'cicilan-bprs-004',
    contractNumber: 'AKAD-BPRS/ALS-JKT/2026/XI/041',
    fakturWebNumber: 'FAKTUR-WEB/2026/XI/8920',
    notaReiNumber: 'NOTA-REI/SRP/2026/XI/062',
    bprsId: 'bprs-alsalaam',
    bprsName: 'BPRS AlSalaam Amal Salman',
    branchRei: 'REI Serpong (BSD City)',
    customerName: 'Bpk. Faisal Akbar, S.T.',
    customerPhone: '085711229988',
    customerNik: '3674021908870001',
    customerAddress: 'Cluster Foresta Blok F No. 7, BSD City, Tangerang Selatan',
    goldGram: 10,
    goldPurity: '999.9 (24 Karat) SNI Khazanah',
    goldSerialNumbers: ['REI-24K-SRP-44201', 'REI-24K-SRP-44202'],
    tenorMonths: 12,
    monthlyInstallment: 1860000,
    totalValue: 27320000,
    downPayment: 5000000,
    installmentsPaid: 1,
    totalInstallments: 12,
    status: 'Aktif',
    fakturDate: '2026-10-01',
    handoverReiOfficer: 'Bayu Pratama (PIC Serpong)',
    isHandoverCompleted: false,
  },
  {
    id: 'cicilan-bprs-005',
    contractNumber: 'AKAD-BPRS/HIK-BDG/2026/IX/014',
    fakturWebNumber: 'FAKTUR-WEB/2026/IX/6610',
    notaReiNumber: 'NOTA-REI/BDG/2026/IX/029',
    bprsId: 'bprs-hik-parahyangan',
    bprsName: 'BPRS HIK Parahyangan Bandung',
    branchRei: 'REI Bandung (Martadinata)',
    customerName: 'Ibu Nenden Kurniasih',
    customerPhone: '081223344556',
    customerNik: '3273014506800004',
    customerAddress: 'Jl. Dago Asri Blok B No. 14, Coblong, Bandung',
    goldGram: 5,
    goldPurity: '999.9 (24 Karat) SNI Khazanah',
    goldSerialNumbers: ['REI-24K-BDG-33101'],
    tenorMonths: 6,
    monthlyInstallment: 2150000,
    totalValue: 13650000,
    downPayment: 2500000,
    installmentsPaid: 6,
    totalInstallments: 6,
    status: 'Lunas',
    fakturDate: '2026-05-15',
    notaHandoverDate: '2026-11-05',
    handoverReiOfficer: 'Dadan Suhendar (Khazanah REI Bandung)',
    handoverBprsOfficer: 'Ridwan Kamiludin (BPRS HIK Parahyangan)',
    handoverNotes: 'Status cicilan lunas, emas fisik resmi diserahkan kepada nasabah Ibu Nenden Kurniasih.',
    isHandoverCompleted: true,
  },
];

const STORAGE_KEY_CUSTOM_ORDERS = 'rei_custom_gold_orders_v1';
const STORAGE_KEY_BPRS_CICILAN = 'rei_bprs_cicilan_orders_v1';

export function loadCustomOrders(): CustomOrderItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CUSTOM_ORDERS, JSON.stringify(INITIAL_CUSTOM_ORDERS));
      return INITIAL_CUSTOM_ORDERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading custom orders:', err);
    return INITIAL_CUSTOM_ORDERS;
  }
}

export function saveCustomOrders(orders: CustomOrderItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving custom orders:', err);
  }
}

export function loadBprsCicilanOrders(): BprsCicilanOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BPRS_CICILAN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BPRS_CICILAN, JSON.stringify(INITIAL_BPRS_CICILAN));
      return INITIAL_BPRS_CICILAN;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading BPRS cicilan orders:', err);
    return INITIAL_BPRS_CICILAN;
  }
}

export function saveBprsCicilanOrders(orders: BprsCicilanOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_BPRS_CICILAN, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving BPRS cicilan orders:', err);
  }
}

// Generate new ID and Order Numbers
function randomSuffix(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function generateCustomOrderNumber(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `ORD-CUST/REI/${now.getFullYear()}/${month}/${Date.now().toString().slice(-5)}`;
}

export function generateInvoiceDpNumber(): string {
  const now = new Date();
  return `INV-DP/REI/${now.getFullYear()}/${romanMonth(now)}/${randomSuffix()}`;
}

export function generateInvoiceLunasNumber(): string {
  const now = new Date();
  return `INV-LUNAS/REI/${now.getFullYear()}/${romanMonth(now)}/${randomSuffix()}`;
}
