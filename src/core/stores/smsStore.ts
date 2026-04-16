import { create } from 'zustand';

interface ContactForSMS {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
}

interface PrefilledGroup {
  id: string;
  name: string;
  contactCount: number;
  sourceUrl?: string;
}

interface SMSStore {
  prefilledContacts: ContactForSMS[];
  prefilledGroup: PrefilledGroup | null;
  setPrefilledContacts: (contacts: ContactForSMS[]) => void;
  clearPrefilledContacts: () => void;
  addContact: (contact: ContactForSMS) => void;
  removeContact: (contactId: string) => void;
  setPrefilledGroup: (group: PrefilledGroup | null) => void;
  clearPrefilledGroup: () => void;
}

export const useSMSStore = create<SMSStore>((set) => ({
  prefilledContacts: [],
  prefilledGroup: null,

  setPrefilledContacts: (contacts) => set({ prefilledContacts: contacts }),

  clearPrefilledContacts: () => set({ prefilledContacts: [] }),

  addContact: (contact) =>
    set((state) => ({
      prefilledContacts: [...state.prefilledContacts, contact],
    })),

  removeContact: (contactId) =>
    set((state) => ({
      prefilledContacts: state.prefilledContacts.filter((c) => c.id !== contactId),
    })),

  setPrefilledGroup: (group) => set({ prefilledGroup: group }),

  clearPrefilledGroup: () => set({ prefilledGroup: null }),
}));
