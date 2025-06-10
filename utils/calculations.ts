// Utility functions for calculations and data processing

export const calculateVolumeVendu = (numeroActuel: number, numeroPrecedent: number): number => {
  return Math.max(0, numeroActuel - numeroPrecedent);
};

export const calculateTotal = (volume: number, prixParLitre: number): number => {
  return volume * prixParLitre;
};

export const formatCurrency = (amount: number, currency: string = 'DH'): string => {
  return `${amount.toFixed(2)} ${currency}`;
};

export const formatDate = (dateString: string, locale: string = 'fr-FR'): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const sumArray = (array: Array<{ montant?: number; total?: number }>, field: 'montant' | 'total'): number => {
  return array.reduce((sum, item) => sum + (item[field] || 0), 0);
};