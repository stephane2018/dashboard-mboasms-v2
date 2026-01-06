import { useState, useCallback } from 'react';
import { contactService } from '../services/contact.service';
import type { ContactFilters } from '../services/contact.service';

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
