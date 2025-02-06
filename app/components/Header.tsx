import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { BiUser, BiShoppingBag } from "react-icons/bi";
import {
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { useStateContext } from "../context/stateContext";
import { useRouter } from "next/navigation";
import SidebarModal from "./SidebarModal";
import { SafeUser } from "../utils/types";
import useLoginModal from "../../hooks/useLoginModal";

interface NavbarProps {
  currentUser?: SafeUser | null;
  menuCategories: { title: string; products: { name: string; _id: string }[] }[];
}

const Header: React.FC<NavbarProps> = ({ menuCategories, currentUser }) => {
  const { totalQuantity } = useStateContext();
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const loginModal = useLoginModal();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const searchHandler = () => {
    if (search) {
      router.push(`/products?search=${search}`);
      setSearch("");
    }
  };

  return (
    <header className="top-0 z-30 flex w-full font-sans items-center justify-between bg-white p-4 font-extrabold">
      <div className="flex items-center justify-between w-full md:justify-normal">
        <div className="flex items-center gap-3 md:hidden space-y-8">
          <button
            className="flex flex-col items-center h-12 text-[#AE3033] cursor-pointer "
            onClick={toggleSidebar}
          >
            <div className="max-h-12 flex items-center justify-center -mt-0.5">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path d="M19 7h-14c-1.104 0-2 .896-2 2v6c0 1.104.896 2 2 2h14c1.104 0 2-.896 2-2v-6c0-1.104-.896-2-2-2zm0 2v6h-14v-6h14zm-11 2h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
                ) : (
                  <path d="M4 5h16v2h-16v-2zm0 6h16v2h-16v-2zm0 6h16v2h-16v-2z" />
                )}
              </svg>
            </div>
          </button>
          
          <Link href="/" className="flex flex-col items-center h-10">
            <div className="h-7 w-7 sm:h-10 sm:w-10 relative flex items-center justify-center -mt-[0.85rem]">
              <Image
                src="/community.png"
                alt="abc"
                className="object-contain"
                fill
              />
            </div>
            <span className="text-[10px] sm:text-[12px] text-center mt-1 leading-tight">Acceuil</span>
          </Link>
        </div>

        <Link href="/" className="md:hidden">
          <div className="relative h-6 w-28 sm:h-10 sm:w-36 cursor-pointer opacity-100 transition hover:opacity-80 mr-3 ml-3 -mt-2">
            <Image
              src="/logo001.jpeg"
              alt="company_logo"
              fill
              className="fill"
              priority
            />
          </div>
        </Link>

        <div className="hidden md:ml-3 md:w-1/4 md:flex md:flex-row md:items-center md:justify-center md:gap-x-10">
          <Link href="/" className="flex flex-col items-center">
            <div className="w-10 h-10 relative">
              <Image
                src="/community.png"
                alt="Community"
                className="object-contain"
                fill
              />
            </div>
            <span className="text-xs text-center mt-2">Acceuil</span>
          </Link>
          
          <Link href="/notre_quality" className="hidden lg:flex lg:flex-col lg:items-center">
            <div className="w-10 h-10 relative">
              <Image
                src="/quality.jpg"
                alt="Quality"
                className="object-contain"
                fill
              />
            </div>
            <span className="text-xs text-center mt-2">Notre qualité</span>
          </Link>
          
          <Link href="/nos_magasin" className="hidden lg:flex lg:flex-col lg:items-center">
            <div className="w-10 h-10 relative">
              <Image
                src="/magasins.jpg"
                alt="Stores"
                className="object-contain"
                fill
              />
            </div>
            <span className="text-xs text-center mt-2">Nos Magasins</span>
          </Link>
        </div>

        <div className="hidden md:flex md:justify-center md:items-center mr-6 ml-4">
          <Link href="/">
            <div className="relative h-14 w-[18rem]  cursor-pointer opacity-100 transition hover:opacity-80 ">
              <Image
                src="/logo001.jpeg"
                alt="company_logo"
                fill
                className="object-contain md:fill "
                priority
              />
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center mt-4 sm:mr-4 md:mt-0 md:flex md:self-center">
          <form className="flex items-center w-full max-w-xl">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <DevicePhoneMobileIcon className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Essayez Iphone, Samsung, Macbook..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchHandler()}
              />
            </div>
            <button
              type="button"
              onClick={searchHandler}
              className="p-2.5 ml-2 text-sm font-medium text-white bg-[#AE3033] rounded-lg border border-[#AE3033] hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
            >
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 md:w-1/4 md:justify-center">
          {currentUser ? (
            <Link href="/user" className="flex flex-col items-center h-12 md:h-auto">
              <div className="h-8 sm:h-10 flex items-center justify-center md:h-auto">
                <BiUser className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer opacity-100 transition hover:opacity-75" />
              </div>
              <span className="text-[10px] sm:text-[12px] text-center mt-1 leading-tight md:mt-2 md:text-xs">
                Espace Client
              </span>
            </Link>
          ) : (
            <button
              className="flex flex-col items-center h-12 md:h-auto"
              onClick={loginModal.onOpen}
            >
              <div className="h-8 sm:h-10 flex items-center justify-center md:h-auto">
                <BiUser className="w-8 h-8 sm:w-10 sm:h-10 cursor-pointer opacity-100 transition hover:opacity-75" />
              </div>
              <span className="text-[10px] sm:text-[12px] text-center mt-1 leading-tight md:mt-2 md:text-xs">
                Espace Client
              </span>
            </button>
          )}

          <Link href="/" className="hidden lg:flex lg:flex-col lg:items-center">
            <GlobeAltIcon className="w-10 h-10 cursor-pointer opacity-100 transition hover:opacity-75" />
            <span className="text-xs text-center mt-2">Accueil</span>
          </Link>

          <Link href="/faq" className="hidden lg:flex lg:flex-col lg:items-center">
            <QuestionMarkCircleIcon className="w-10 h-10 cursor-pointer opacity-100 transition hover:opacity-75" />
            <span className="text-xs text-center mt-2">FAQ</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center h-12 md:h-auto">
            <div className="h-8 sm:h-10 flex items-center justify-center md:h-auto">
              <div className="relative">
                {totalQuantity > 0 && (
                  <span className="absolute -right-1 -top-1 z-30 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#AE3033] to-[#751A21] text-[10px] sm:text-xs text-white">
                    {totalQuantity}
                  </span>
                )}
                <BiShoppingBag className="w-8 h-8 -mt-0.5 sm:w-10 sm:h-10 cursor-pointer opacity-100 transition hover:opacity-75" />
              </div>
            </div>
            <span className="text-[10px] sm:text-[12px] text-center mt-1 leading-tight md:mt-2 md:text-xs">Panier</span>
          </Link>
        </div>
      </div>

      <SidebarModal
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        menuCategories={menuCategories}
      />
    </header>
  );
};

export default Header;