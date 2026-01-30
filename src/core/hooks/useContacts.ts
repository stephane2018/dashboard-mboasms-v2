import { useState, useCallback } from 'react';
import { contactService } from '@/core/services/contact.service';
import type { ContactFilters } from '@/core/services/contact.service';
import type { CreateContactRequestType, UpdateContactRequestType } from '@/core/models/contact-new';

export function useContactsByEnterprise() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContacts = useCallback(async (enterpriseId: string, filters?: ContactFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await contactService.getContactsByEnterprise(enterpriseId, filters);
      return result;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la récupération des contacts';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    getContacts,
    isLoading,
    error,
    clearError,
  };
}

export function useContactsByGroup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGroupContacts = useCallback(async (groupId: string, enterpriseId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await contactService.getContactsByGroup(groupId, enterpriseId);
      return result;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la récupération des contacts du groupe';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    getGroupContacts,
    isLoading,
    error,
    clearError,
  };
}

export function useCreateContact() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback((
    data: CreateContactRequestType,
    options?: { onSuccess?: () => void; onError?: (error: any) => void }
  ) => {
    setIsPending(true);
    setError(null);

    contactService.createContact(data)
      .then((result) => {
        options?.onSuccess?.();
        return result;
      })
      .catch((err: any) => {
        const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la création du contact';
        setError(errorMessage);
        options?.onError?.(err);
      })
      .finally(() => {
        setIsPending(false);
      });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    mutate,
    isPending,
    isLoading: isPending,
    error,
    clearError,
  };
}

export function useUpdateContact() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback((
    params: { id: string; data: Partial<UpdateContactRequestType> },
    options?: { onSuccess?: () => void; onError?: (error: any) => void }
  ) => {
    setIsPending(true);
    setError(null);

    contactService.updateContact(params.id, params.data)
      .then((result) => {
        options?.onSuccess?.();
        return result;
      })
      .catch((err: any) => {
        const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la mise à jour du contact';
        setError(errorMessage);
        options?.onError?.(err);
      })
      .finally(() => {
        setIsPending(false);
      });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    mutate,
    isPending,
    isLoading: isPending,
    error,
    clearError,
  };
}

export function useDeleteContact() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteContact = useCallback(async (id: string, enterpriseId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await contactService.deleteContact(id, enterpriseId);
      return result;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la suppression du contact';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    deleteContact,
    isLoading,
    error,
    clearError,
  };
}

// Alias for consistency
export const useGetContactsByEnterprise = useContactsByEnterprise;
export const useGetAllContactsByEnterprise = useContactsByEnterprise;
