import { create } from 'zustand';
import { routing } from '@/i18n/routing';

const useLocaleStore = create((set) => ({
  currentLocale: routing.defaultLocale,
  setLocale: (newLocale) => set({ currentLocale: newLocale }),
}));

export default useLocaleStore;