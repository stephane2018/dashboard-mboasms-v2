"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getCompanies,
  getCompaniesPaginated,
  createCompany,
  addUserToEnterprise,
  deleteUserFromEnterprise,
  deleteCompany,
  creditEnterprise,
  getEnterpriseDetails,
  type CreditEnterprisePayload,
} from "@/core/services/CompanyService"
import type { EnterpriseType, PaginatedCompaniesResponseType, CreateCompanyRequestType, AddUserToEnterpriseRequestType } from "@/core/models/company"

export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  list: (filters: string) => [...companyKeys.lists(), { filters }] as const,
  paginated: (page: number, size: number) => [...companyKeys.all, "paginated", page, size] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
}

export function useCompanies() {
  return useQuery<EnterpriseType[], Error>({
    queryKey: companyKeys.lists(),
    queryFn: getCompanies,
  })
}

export function useCompaniesPaginated(page: number = 0, size: number = 10, enabled: boolean = true) {
  return useQuery<EnterpriseType[], Error>({
    queryKey: companyKeys.paginated(page, size),
    queryFn: () => getCompaniesPaginated(page, size),
    enabled,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCompanyRequestType) => createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
      toast.success("Entreprise créée", {
        description: "L'entreprise a été créée avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la création", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })
}

export function useAddUserToEnterprise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ enterpriseId, user }: { enterpriseId: string; user: AddUserToEnterpriseRequestType }) =>
      addUserToEnterprise(enterpriseId, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
      toast.success("Utilisateur ajouté", {
        description: "L'utilisateur a été ajouté à l'entreprise",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'ajout", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })
}

export function useDeleteUserFromEnterprise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ enterpriseId, userId }: { enterpriseId: string; userId: string }) =>
      deleteUserFromEnterprise(enterpriseId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
      toast.success("Utilisateur supprimé", {
        description: "L'utilisateur a été retiré de l'entreprise",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la suppression", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })
}

export function useDeleteCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
      toast.success("Entreprise supprimée", {
        description: "L'entreprise a été supprimée avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de la suppression", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })
}

export function useCreditEnterprise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ enterpriseId, payload }: { enterpriseId: string; payload: CreditEnterprisePayload }) =>
      creditEnterprise(enterpriseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all })
      queryClient.invalidateQueries({ queryKey: companyKeys.details() })
      toast.success("Crédit ajouté", {
        description: "Le crédit SMS a été ajouté avec succès",
      })
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'ajout de crédit", {
        description: error?.message || "Une erreur s'est produite",
      })
    },
  })
}

export function useEnterpriseDetails(enterpriseId: string, enabled: boolean = true) {
  return useQuery<EnterpriseType, Error>({
    queryKey: companyKeys.detail(enterpriseId),
    queryFn: () => getEnterpriseDetails(enterpriseId),
    enabled,
  })
}
