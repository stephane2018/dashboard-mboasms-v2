/**
 * Common types and interfaces used across the application
 */

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  archived: boolean;
  deleted: boolean;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  statusCode?: number;
  error?: string;
  message?: string;
  data?: T;
}

// Pagination Sort
export interface SortType {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

// Pageable
export interface PageableType {
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: SortType;
  offset: number;
}

// Generic Paginated Response
export interface PaginatedResponse<T> {
  totalPages: number;
  totalElements: number;
  pageable: PageableType;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  sort: SortType;
  number: number;
  size: number;
  content: T[];
  empty: boolean;
}

// Authority
export interface AuthorityType {
  authority: string;
}
