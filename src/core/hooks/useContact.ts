import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPaginatedAllContacts, getAllContacts, importContacts } from "@/core/services/contact.service";
import { contactService } from "@/core/services/contact.service";
import type { PaginatedEnterpriseContactsResponseType, EnterpriseContactResponseType } from "@/core/models/contact-new";
import type { ApiResponse } from "@/core/models/common";

export const contactKeys = {
  all: ["contacts"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (page: number, size: number) => [...contactKeys.lists(), { page, size }] as const,
  enterprise: (enterpriseId: string, page: number, size: number) => [...contactKeys.all, "enterprise", enterpriseId, page, size] as const,
};

export function useContacts(page: number = 0, size: number = 10) {
  return useQuery<PaginatedEnterpriseContactsResponseType, Error>({
    queryKey: contactKeys.list(page, size),
    queryFn: async (): Promise<PaginatedEnterpriseContactsResponseType> => {
      const response = await getPaginatedAllContacts(page, size) as ApiResponse<PaginatedEnterpriseContactsResponseType>;
      // Handle the ApiResponse wrapper - the actual paginated data is in the data property
      return response.data || response as PaginatedEnterpriseContactsResponseType;
    },
  });
}

export function useAllContacts() {
  return useQuery<EnterpriseContactResponseType[], Error>({
    queryKey: contactKeys.lists(),
    queryFn: async (): Promise<EnterpriseContactResponseType[]> => {
      const response = await getAllContacts() as ApiResponse<EnterpriseContactResponseType[]>;
      return response.data || response as EnterpriseContactResponseType[];
    },
  });
}

export function useImportContacts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => importContacts(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      toast.success("Contacts importés avec succès.");
    },
    onError: (error: any) => {
      toast.error("Erreur lors de l'importation des contacts.", {
        description: error?.message || "Une erreur s'est produite",
      });
    },
  });
}

export function useContactsByEnterprise(enterpriseId: string, page: number = 0, size: number = 10) {
  return useQuery<PaginatedEnterpriseContactsResponseType, Error>({
    queryKey: contactKeys.enterprise(enterpriseId, page, size),
    queryFn: async (): Promise<PaginatedEnterpriseContactsResponseType> => {
      const response = await contactService.getContactsByEnterprise(enterpriseId, { page, size }) as ApiResponse<PaginatedEnterpriseContactsResponseType>;
      return response.data || response as PaginatedEnterpriseContactsResponseType;
    },
    enabled: !!enterpriseId,
  });
}
