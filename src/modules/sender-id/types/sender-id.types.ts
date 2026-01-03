export type SenderIdStatus = "EN_ATTENTE" | "VALIDE" | "REJETE"

export type SenderId = {
  id: string
  name: string
  description: string
  enterpriseId: string
  createdAt: string
  updatedAt: string
  status: SenderIdStatus
  rejectionReason: string | null
}

export type PaginatedSenderIds = {
  totalPages: number
  totalElements: number
  number: number
  size: number
  content: SenderId[]
  numberOfElements: number
  sort: {
    empty: boolean
    unsorted: boolean
    sorted: boolean
  }
  first: boolean
  last: boolean
  pageable: {
    offset: number
    unpaged: boolean
    paged: boolean
    sort: {
      empty: boolean
      unsorted: boolean
      sorted: boolean
    }
    pageSize: number
    pageNumber: number
  }
  empty: boolean
}

export type CreateSenderIdInput = {
  name: string
  description: string
  enterpriseId: string
}

export type UpdateSenderIdInput = {
  name: string
  description: string
}

export type UpdateSenderIdStatusInput = {
  status: SenderIdStatus
  rejectionReason?: string
}

export type SenderIdQueryParams = {
  status?: SenderIdStatus
  page?: number
  size?: number
}
