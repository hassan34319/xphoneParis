import { create } from "zustand";

interface AdressModalStore {
  isOpen: boolean;
  userData: any | null; // Store user data (address)
  onOpen: (data?: any) => void; // Accept data when opening
  onClose: () => void;
}

const useChangeAdressModal = create<AdressModalStore>((set) => ({
  isOpen: false,
  userData: null,
  onOpen: (data = null) => set({ isOpen: true, userData: data }),
  onClose: () => set({ isOpen: false, userData: null }),
}));

export default useChangeAdressModal;
