import { create } from 'zustand';

interface UserPasswordData {
  email?: string | null;
  userId?: string | null;
}

interface PasswordModalStore {
  isOpen: boolean;
  userData: UserPasswordData;
  onOpen: () => void;
  onClose: () => void;
  setUserData: (data: UserPasswordData) => void;
}

const useChangePasswordModal = create<PasswordModalStore>((set) => ({
  isOpen: false,
  userData: {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setUserData: (data) => set({ userData: data })
}));

export default useChangePasswordModal;