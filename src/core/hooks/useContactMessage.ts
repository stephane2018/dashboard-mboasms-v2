import { useState } from 'react';
import { toast } from 'sonner';
import { contactMessageService } from '@/core/services/contact-message.service';
import type { SendToContactPayload, SendToGroupPayload } from '@/core/services/contact-message.service';

export function useSendToContact() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendToContact = async (idContact: string, payload: SendToContactPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await contactMessageService.sendToContact(idContact, payload);
      toast.success('Message envoyé avec succès au contact');
      return result;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de l\'envoi du message';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendToContact,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

export function useSendToGroup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendToGroup = async (payload: SendToGroupPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await contactMessageService.sendToGroup(payload);
      toast.success('Message envoyé avec succès au groupe');
      return result;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de l\'envoi du message au groupe';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendToGroup,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
