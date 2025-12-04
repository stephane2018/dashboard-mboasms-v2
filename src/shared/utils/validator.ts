export const validateNumber = (value?: string): boolean => {
  if (!value) return false;
  return !isNaN(Number(value));
};

export const numberGreaterThan = (value?: string, min = 0): boolean => {
  if (!value) return false;
  return Number(value) > min;
};
