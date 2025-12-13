import { create } from 'zustand';

interface ContactForSMS {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
}

interface SMSStore {
  prefilledContacts: ContactForSMS[];
  setPrefilledContacts: (contacts: ContactForSMS[]) => void;
  clearPrefilledContacts: () => void;
  addContact: (contact: ContactForSMS) => void;
  removeContact: (contactId: string) => void;
}

export const useSMSStore = create<SMSStore>((set) => ({
  prefilledContacts: [],
  
  setPrefilledContacts: (contacts) => set({ prefilledContacts: contacts }),
  
  clearPrefilledContacts: () => set({ prefilledContacts: [] }),
  
  addContact: (contact) => 
    set((state) => ({
      prefilledContacts: [...state.prefilledContacts, contact]
    })),
  
  removeContact: (contactId) =>
    set((state) => ({
      prefilledContacts: state.prefilledContacts.filter(c => c.id !== contactId)
    })),
}));
