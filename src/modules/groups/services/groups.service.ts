import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"
import type { Group, CreateGroupInput } from "../types"

const normalizeGroupsResponse = (payload: unknown): Group[] => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload as Group[]

  if (typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>

    if (Array.isArray(objectPayload.groupes)) {
      return objectPayload.groupes as Group[]
    }

    if (Array.isArray(objectPayload.data)) {
      return normalizeGroupsResponse(objectPayload.data)
    }

    if (Array.isArray(objectPayload.content)) {
      return objectPayload.content as Group[]
    }
  }

  return []
}

export const groupsService = {
  async getAllGroups(): Promise<Group[]> {
    try {
      const data = await httpClient.get<Group[] | Record<string, unknown>>(`/api/v1/group/all`)
      return normalizeGroupsResponse(data)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async getGroupsByEnterprise(enterpriseId: string): Promise<Group[]> {
    try {
      const data = await httpClient.get<Group[] | Record<string, unknown>>(`/api/v1/group/all/${enterpriseId}`)
      return normalizeGroupsResponse(data)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async getGroupById(groupId: string): Promise<Group> {
    try {
      // Since there's no GET endpoint for a single group, fetch all and filter
      const data = await httpClient.get<Group[] | Record<string, unknown>>(`/api/v1/group/all`)
      const groups = normalizeGroupsResponse(data)
      const group = groups.find((g) => g.id === groupId)

      if (!group) {
        throw new Error(`Group with ID ${groupId} not found`)
      }

      return group
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async createGroup(input: CreateGroupInput): Promise<Group> {
    try {
      return await httpClient.post<Group>("/api/v1/group/save", input as any)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async deleteGroup(groupId: string): Promise<any> {
    try {
      return await httpClient.delete(`/api/v1/group/${groupId}`)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  /**
   * Delete a contact from a group
   * DELETE /api/v1/group/deleteContact/{groupId}
   */
  async deleteContactFromGroup(groupId: string, contactId: string): Promise<any> {
    try {
      return await httpClient.delete(`/api/v1/group/deleteContact/${groupId}`, {
        contactId
      } as any)
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async addContactsToGroup(groupId: string, contactIds: string[]): Promise<Group> {
    try {
      return await httpClient.put<Group>(`/api/v1/group/addContact/${groupId}`, {
        listContactid: contactIds,
      })
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },

  async removeContactFromGroup(groupId: string, contactId: string): Promise<any> {
    try {
      return await httpClient.delete(`/api/v1/group/deleteContact/${groupId}`, {
        params: { contactId },
      })
    } catch (error) {
      return Promise.reject(refractHttpError(error))
    }
  },
}
