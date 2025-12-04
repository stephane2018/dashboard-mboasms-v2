type NumberFormatOptions = Intl.NumberFormatOptions & { locale?: string, currency?: string };

const DEFAULT_CURRENCY = import.meta.env.VITE_APP_CURRENCY || "EUR";

export const formatNumber = (number: string | number | undefined | null, options?: NumberFormatOptions) => {
  const toFormat = number ? Number(number) : 0;
  return toFormat.toLocaleString(options?.locale || "fr-FR", options);
};

export const formatCurrency = (number: string | number | undefined | null, options?: NumberFormatOptions) => {
  const toFormat = number ? Number(number) : 0;
  return toFormat.toLocaleString(options?.locale || "fr-FR", { style: "currency", currency: DEFAULT_CURRENCY, ...options });
};

export const formatCurrencyCompact = (number: string | number | undefined | null, options?: NumberFormatOptions) => {
  const toFormat = number ? Number(number) : 0;
  return toFormat.toLocaleString(options?.locale || "fr-FR", {
    style: "currency",
    currency: options?.currency || DEFAULT_CURRENCY,
    notation: "compact",
    ...options,
  });
};
