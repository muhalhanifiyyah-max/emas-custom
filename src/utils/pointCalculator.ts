export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatGrams(grams: number): string {
  return `${grams.toLocaleString('id-ID', { minimumFractionDigits: grams % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} gr`;
}
