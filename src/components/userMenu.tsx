import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import useLoginModal from "../hooks/useLoginModal";
import useRegisterModal from "..//hooks/useRegisterModal";
import { User } from "@prisma/client";

import MenuItem from "./MenuItem";
import Avatar from "./Avatar";
import useChangeAdressModal from "../hooks/useChangeAdressModal";
import { RiTeamLine } from "react-icons/ri";
import { BiUser } from "react-icons/bi";

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

interface UserMenuProps {
  currentUser?: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({}) => {
  const router = useRouter();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const changeAdressModal = useChangeAdressModal();
  const [isOpen, setIsOpen] = useState(false);


  const { data: session } = useSession();
  const currentUser = session?.user;
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="relative" ref={menuRef}>
      <div className="">
        <div
          onClick={toggleOpen}
          className="flex flex-col justify-center items-center
          "
        >
          <BiUser className="text-2xl lg:text-4xl" />
          <h1>Espace Client</h1>
        </div>
      </div>
      {isOpen && (
        <div
          className="
            absolute 
            shadow-md
            w-max
            md:w-full 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  label="Change Adress"
                  onClick={changeAdressModal.onOpen}
                />
                <hr />
                <MenuItem label="Logout" onClick={() => signOut()} />
              </>
            ) : (
              <>
                <MenuItem label="Log In" onClick={loginModal.onOpen} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
