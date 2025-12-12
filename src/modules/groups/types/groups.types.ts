import type { EnterpriseContactResponseType } from "@/core/models/contact-new"

export type Group = {
  id: string
  createdAt: string
  updatedAt: string
  version: number
  name: string
  code: string
  enterprise: string
  enterpriseContacts: EnterpriseContactResponseType[]
  archived: boolean
  deleted: boolean
}

export type CreateGroupInput = {
  name: string
  code: string
  enterpriseId: string
}
