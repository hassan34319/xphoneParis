import { create } from 'zustand';

interface AdressModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useChangeAdressModal = create<AdressModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useChangeAdressModal;