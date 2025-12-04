import { format, formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (input: string | Date | undefined | null, withTime = false): string => {
  if (!input) return "";

  const date = new Date(input);

  let formatPattern = "dd MMMM yyyy";

  if (withTime) formatPattern = `${formatPattern} 'a' HH:mm`;

  return format(date, formatPattern, { locale: fr });
};

export const formatDateStandard = (input: string | Date, locale = "fr-FR", withTime = false): string => {
  const date = new Date(input);
  let format: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  if (withTime)
    format = {
      ...format,
      hour: "2-digit",
      minute: "2-digit",
    };

  return date.toLocaleDateString(locale, format);
};

export const formatDateFromPattern = (
  input: string | Date | null | undefined,
  pattern = "yyyy-MM-dd HH:mm:ss"
): string => {
  if (!input) return "";

  const date = new Date(input);
  if (isNaN(date.getTime())) return "";

  return format(date, pattern, { locale: fr });
};

export const formatIntervalDateToHuman = (startDate?: Date, endDate?: Date): string => {
  if (!startDate || !endDate) return "";

  return formatDistance(startDate, endDate, { locale: fr });
};
