import { create } from 'zustand';

interface StatusModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useChangeStatusModal = create<StatusModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useChangeStatusModal;