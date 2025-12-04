const DEFAULT_CURRENCY = import.meta.env.VITE_APP_CURRENCY || 'FCFA';

/**
 * Format a number as currency (XOF/XAF)
 * Format: 1,000 XOF ou 1,000,000 XOF
 */
export const formatCurrency = (amount: number, currency: string = DEFAULT_CURRENCY): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  if (currency === 'CAD') {
    return `$${formatted}`;
  }

  return `${formatted} ${currency}`;
};
