import { create } from 'zustand';

interface UserAddressData {
  shippingAdress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

interface AdressModalStore {
  isOpen: boolean;
  userData: UserAddressData;
  onOpen: () => void;
  onClose: () => void;
  setUserData: (data: UserAddressData) => void;
}

const useChangeAdressModal = create<AdressModalStore>((set) => ({
  isOpen: false,
  userData: {},
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setUserData: (data) => set({ userData: data })
}));

export default useChangeAdressModal;