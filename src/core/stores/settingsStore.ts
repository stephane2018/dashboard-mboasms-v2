import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    contactsPageSize: number;
    setContactsPageSize: (size: number) => void;

    // Sender ID preferences
    useTemporarySenderId: boolean;
    setUseTemporarySenderId: (value: boolean) => void;
    temporarySenderId: string;
    setTemporarySenderId: (value: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            contactsPageSize: 50,
            setContactsPageSize: (size: number) => set({ contactsPageSize: size }),

            // Sender ID preferences
            useTemporarySenderId: false,
            setUseTemporarySenderId: (value: boolean) => set({ useTemporarySenderId: value }),
            temporarySenderId: '',
            setTemporarySenderId: (value: string) => set({ temporarySenderId: value }),
        }),
        {
            name: 'mboasms-settings',
            storage: {
                getItem: (name) => {
                    if (typeof window === 'undefined') return null;
                    const value = window.sessionStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => {
                    if (typeof window === 'undefined') return;
                    window.sessionStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    if (typeof window === 'undefined') return;
                    window.sessionStorage.removeItem(name);
                },
            },
        }
    )
);

