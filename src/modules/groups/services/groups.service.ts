import { httpClient } from "@/core/lib/http-client"
import { refractHttpError } from "@/core/utils/http-error"
import type { Group, CreateGroupInput } from "../types"

export const groupsService = {
  async getGroupsByEnterprise(enterpriseId: string): Promise<Group[]> {
    try {
      return await httpClient.get<Group[]>(`/api/v1/group/all/${enterpriseId}`)
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
