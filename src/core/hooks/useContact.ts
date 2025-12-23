import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getPaginatedAllContacts, getAllContacts, importContacts } from "@/core/services/contact.service";
import type { PaginatedEnterpriseContactsResponseType, EnterpriseContactResponseType } from "@/core/models/contact-new";

export const contactKeys = {
  all: ["contacts"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (page: number, size: number) => [...contactKeys.lists(), { page, size }] as const,
};

export function useContacts(page: number = 0, size: number = 10) {
  return useQuery<PaginatedEnterpriseContactsResponseType, Error>({
    queryKey: contactKeys.list(page, size),
    queryFn: () => getPaginatedAllContacts(page, size),
  });
}

export function useAllContacts() {
  return useQuery<EnterpriseContactResponseType[], Error>({
    queryKey: contactKeys.lists(),
    queryFn: getAllContacts,
  });
}

export function useImportContacts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, enterpriseId }: { file: File; enterpriseId: string }) => importContacts(file, enterpriseId),
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
