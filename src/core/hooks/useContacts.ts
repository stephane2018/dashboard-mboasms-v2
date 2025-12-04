import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getAllContacts,
    getContactsByEnterprisePage,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    importContacts,
    getAllContactsByEnterprise
} from "@/core/services/contact.service";
import {
    CreateContactRequestType,
    UpdateContactRequestType,
    EnterpriseContactResponseType,
    PaginatedEnterpriseContactsResponseType
} from "@/core/models/contact-new";
import { invalidateContactQueries } from "@/core/utils/query-invalidation";

// Query keys for cache management
export const contactKeys = {
    all: ['contacts'] as const,
    lists: () => [...contactKeys.all, 'list'] as const,
    list: (filters: string) => [...contactKeys.lists(), { filters }] as const,
    details: () => [...contactKeys.all, 'detail'] as const,
    detail: (id: string) => [...contactKeys.details(), id] as const,
    byEnterprise: (enterpriseId: string, page: number, size: number) =>
        [...contactKeys.all, 'enterprise', enterpriseId, page, size] as const,
};

/**
 * Hook to get all contacts
 */
export function useGetAllContacts() {
    return useQuery<EnterpriseContactResponseType[], Error>({
        queryKey: contactKeys.lists(),
        queryFn: getAllContacts,
    });
}

export function useGetAllContactsByEnterprise(enterpriseId: string) {
    return useQuery<EnterpriseContactResponseType[], Error>({
        queryKey: contactKeys.lists(),
        queryFn: () => getAllContactsByEnterprise(enterpriseId),

    });
}

/**
 * Hook to get paginated contacts by enterprise
 */
export function useGetContactsByEnterprise(
    enterpriseId: string,
    page: number = 0,
    size: number = 10,
    enabled: boolean = true
) {
    return useQuery<PaginatedEnterpriseContactsResponseType, Error>({
        queryKey: contactKeys.byEnterprise(enterpriseId, page, size),
        queryFn: () => getContactsByEnterprisePage(enterpriseId, page, size),
        enabled: enabled && !!enterpriseId,
    });
}

/**
 * Hook to get a single contact by ID
 */
export function useGetContactById(id: string, enabled: boolean = true) {
    return useQuery<EnterpriseContactResponseType, Error>({
        queryKey: contactKeys.detail(id),
        queryFn: () => getContactById(id),
        enabled: enabled && !!id,
    });
}

/**
 * Hook to create a new contact
 */
export function useCreateContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateContactRequestType) => createContact(data),
        onSuccess: (data) => {
            toast.success("Contact créé", {
                description: `${data.firstname} ${data.lastname} a été ajouté avec succès`,
            });
            // Invalidate contacts based on user role
            invalidateContactQueries(queryClient);
        },
        onError: (error: any) => {
            const errorMessage = error?.message || "Erreur lors de la création du contact";
            toast.error("Erreur", {
                description: errorMessage,
            });
        },
    });
}

/**
 * Hook to update an existing contact
 */
export function useUpdateContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<UpdateContactRequestType> }) =>
            updateContact(id, data),
        onSuccess: (data, variables) => {
            toast.success("Contact mis à jour", {
                description: `${data.firstname} ${data.lastname} a été modifié avec succès`,
            });
            // Invalidate contacts based on user role
            invalidateContactQueries(queryClient, variables.id);
        },
        onError: (error: any) => {
            const errorMessage = error?.message || "Erreur lors de la mise à jour du contact";
            toast.error("Erreur", {
                description: errorMessage,
            });
        },
    });
}

/**
 * Hook to delete a contact
 */
export function useDeleteContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (contactId: string) => deleteContact(contactId),
        onSuccess: () => {
            toast.success("Contact supprimé", {
                description: "Le contact a été supprimé avec succès",
            });
            // Invalidate contacts based on user role
            invalidateContactQueries(queryClient);
        },
        onError: (error: any) => {
            const errorMessage = error?.message || "Erreur lors de la suppression du contact";
            toast.error("Erreur", {
                description: errorMessage,
            });
        },
    });
}

/**
 * Hook to import contacts from file
 */
export function useImportContacts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, enterpriseId }: { file: File; enterpriseId: string }) =>
            importContacts(file, enterpriseId),
        onSuccess: (data) => {
            const importedCount = data?.importedCount || 0;
            toast.success("Import réussi", {
                description: `${importedCount} contact(s) importé(s) avec succès`,
            });
            // Invalidate contacts based on user role
            invalidateContactQueries(queryClient);
        },
        onError: (error: any) => {
            const errorMessage = error?.message || "Erreur lors de l'import des contacts";
            toast.error("Erreur d'import", {
                description: errorMessage,
            });
        },
    });
}
