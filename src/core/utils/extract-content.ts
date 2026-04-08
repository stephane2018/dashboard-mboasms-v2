/**
 * Extracts array data from a Spring Data paginated response or returns as-is if already an array.
 *
 * Handles both formats:
 * - Direct array: [item1, item2, ...]
 * - Spring pagination: { content: [item1, item2, ...], pageable: {...}, totalElements: N, ... }
 */
export function extractContent<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[]

  if (response && typeof response === "object" && "content" in response) {
    const paginated = response as { content: unknown }
    if (Array.isArray(paginated.content)) return paginated.content as T[]
  }

  return []
}
