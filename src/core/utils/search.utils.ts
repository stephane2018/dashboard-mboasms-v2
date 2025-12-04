/**
 * Search utilities for filtering data across multiple columns
 */

/**
 * Generic search filter function for any data type
 * Searches across multiple fields with case-insensitive matching
 *
 * @param items - Array of items to search through
 * @param searchTerm - Search term to filter by
 * @param searchableFields - Array of field names to search in
 * @returns Filtered array of items
 *
 * @example
 * const results = filterBySearch(contacts, "john", ["firstname", "lastname", "email"])
 */
export function filterBySearch<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchableFields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return items

  const searchLower = searchTerm.toLowerCase().trim()

  return items.filter((item) => {
    return searchableFields.some((field) => {
      const value = item[field]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchLower)
    })
  })
}

/**
 * Search contacts by multiple fields
 *
 * @param contacts - Array of contacts to search
 * @param searchTerm - Search term
 * @returns Filtered contacts
 *
 * @example
 * const results = searchContacts(contacts, "john")
 */
export function searchContacts<T extends Record<string, any>>(
  contacts: T[],
  searchTerm: string
): T[] {
  return filterBySearch(contacts, searchTerm, [
    "firstname",
    "lastname",
    "phoneNumber",
    "email",
    "country",
    "city",
  ] as (keyof T)[])
}

/**
 * Search users by multiple fields
 *
 * @param users - Array of users to search
 * @param searchTerm - Search term
 * @returns Filtered users
 */
export function searchUsers<T extends Record<string, any>>(
  users: T[],
  searchTerm: string
): T[] {
  return filterBySearch(users, searchTerm, [
    "name",
    "email",
    "role",
  ] as (keyof T)[])
}

/**
 * Advanced search with field-specific queries
 * Supports syntax like "field:value"
 *
 * @param items - Array of items to search
 * @param query - Search query (can include field:value syntax)
 * @param searchableFields - Default fields to search if no field specified
 * @returns Filtered items
 *
 * @example
 * // Search all fields
 * const results = advancedSearch(contacts, "john", ["firstname", "lastname"])
 *
 * // Search specific field
 * const results = advancedSearch(contacts, "email:john@example.com", ["firstname", "lastname", "email"])
 */
export function advancedSearch<T extends Record<string, any>>(
  items: T[],
  query: string,
  searchableFields: (keyof T)[]
): T[] {
  if (!query.trim()) return items

  const queryLower = query.toLowerCase().trim()

  // Check for field:value syntax
  const fieldMatch = queryLower.match(/^(\w+):(.+)$/)

  if (fieldMatch) {
    const [, fieldName, searchValue] = fieldMatch
    const field = fieldName as keyof T

    return items.filter((item) => {
      const value = item[field]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(searchValue.trim())
    })
  }

  // Default: search across all specified fields
  return filterBySearch(items, query, searchableFields)
}

/**
 * Highlight search terms in text
 * Returns HTML with highlighted matches
 *
 * @param text - Text to highlight
 * @param searchTerm - Term to highlight
 * @returns Text with highlighted matches
 *
 * @example
 * const highlighted = highlightSearchTerm("John Doe", "john")
 * // Returns: "<mark>John</mark> Doe"
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text

  const regex = new RegExp(`(${searchTerm})`, "gi")
  return text.replace(regex, "<mark>$1</mark>")
}

/**
 * Get search suggestions based on partial input
 *
 * @param items - Array of items
 * @param searchTerm - Partial search term
 * @param field - Field to get suggestions from
 * @param limit - Maximum number of suggestions
 * @returns Array of unique suggestions
 *
 * @example
 * const suggestions = getSearchSuggestions(contacts, "jo", "firstname", 5)
 */
export function getSearchSuggestions<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  field: keyof T,
  limit: number = 5
): string[] {
  if (!searchTerm.trim()) return []

  const searchLower = searchTerm.toLowerCase()
  const suggestions = new Set<string>()

  items.forEach((item) => {
    const value = item[field]
    if (value !== null && value !== undefined) {
      const stringValue = String(value)
      if (stringValue.toLowerCase().includes(searchLower)) {
        suggestions.add(stringValue)
      }
    }
  })

  return Array.from(suggestions).slice(0, limit)
}

/**
 * Fuzzy search - matches even with typos or missing characters
 *
 * @param items - Array of items to search
 * @param searchTerm - Search term
 * @param searchableFields - Fields to search in
 * @returns Filtered items sorted by match quality
 *
 * @example
 * const results = fuzzySearch(contacts, "jhn", ["firstname", "lastname"])
 */
export function fuzzySearch<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchableFields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) return items

  const searchLower = searchTerm.toLowerCase()

  const scored = items
    .map((item) => {
      let score = 0

      searchableFields.forEach((field) => {
        const value = item[field]
        if (value === null || value === undefined) return

        const stringValue = String(value).toLowerCase()

        // Exact match
        if (stringValue === searchLower) {
          score += 100
        }
        // Starts with
        else if (stringValue.startsWith(searchLower)) {
          score += 50
        }
        // Contains
        else if (stringValue.includes(searchLower)) {
          score += 25
        }
        // Fuzzy match (all characters in order)
        else if (isFuzzyMatch(stringValue, searchLower)) {
          score += 10
        }
      })

      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)

  return scored
}

/**
 * Check if text matches search term in fuzzy way
 * (all characters of search term appear in order in text)
 *
 * @param text - Text to check
 * @param searchTerm - Search term
 * @returns true if fuzzy match
 */
function isFuzzyMatch(text: string, searchTerm: string): boolean {
  let searchIndex = 0

  for (let i = 0; i < text.length && searchIndex < searchTerm.length; i++) {
    if (text[i] === searchTerm[searchIndex]) {
      searchIndex++
    }
  }

  return searchIndex === searchTerm.length
}

/**
 * Debounced search - useful for real-time search with API calls
 *
 * @param callback - Function to call after debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * const debouncedSearch = debounceSearch((term) => {
 *   // API call or expensive operation
 * }, 300)
 *
 * input.addEventListener("input", (e) => {
 *   debouncedSearch(e.target.value)
 * })
 */
export function debounceSearch<T extends any[]>(
  callback: (...args: T) => void,
  delay: number = 300
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: T) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}
