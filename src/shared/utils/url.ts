import type { GenericType } from "../common.types";

export const keepValidParams = (meta?: GenericType): Record<string, string | string[] | number> => {
  const result: Record<string, string | string[] | number> = {};

  if (meta) {
    for (const [key, value] of Object.entries(meta)) {
      if (value !== undefined && value !== null) {
        if (typeof value === "number") {
          if (value > 0) {
            result[key] = value;
          }
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            result[key] = value.map(String);
          }
        } else if (typeof value === "string" && value.length > 0) {
          result[key] = value;
        }
      }
    }
  }

  return result;
};

export const buildSearchQueryParams = (meta: GenericType): string => {
  const searchParams = new URLSearchParams();
  const validParams = keepValidParams(meta);

  for (const [key, value] of Object.entries(validParams)) {
    if (Array.isArray(value)) {
      searchParams.append(key, value.join("|"));
    } else {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
};

export function insertIf<T>(condition: boolean, ...elements: T[]): T[] {
  return condition ? elements : [];
}
