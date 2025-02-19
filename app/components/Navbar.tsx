/* eslint-disable @next/next/no-img-element */
"use client";
import { RiTeamLine } from "react-icons/ri";
import { BsBag, BsHouseDoor } from "react-icons/bs";
import Search from "./Search";
import Link from "next/link";
import { useStateContext } from "../context/stateContext";
import TopMenu from "./TopMenu";
import BurgerMenu from "./BurgerMenu";
import UserMenu from "./userMenu";
import { BiUser } from "react-icons/bi";
import useLoginModal from "../../hooks/useLoginModal";
import { User } from "@prisma/client";
import Image from "next/image";
import ClientOnly from "./ClientOnly";
import Header from "./Header";
import SearchBar from "./SearchBar";
interface BrandData {
  [key: string]: string[];
}
export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
interface Product {
  name: string;
  _id: string;
}

interface Subcategory {
  title: string;
  _id: string;
  products: Product[];
}

interface NavbarProps {
  currentUser?: SafeUser | null;
  menuCategories: {
    title: string;
    hasSubcategories: boolean;
    subcategories?: {
      title: string;
      _id: string;
      products: { name: string; _id: string }[];
    }[];
    products?: { name: string; _id: string }[];
  }[];
  menuCategories2: {
    _id: string;
    title: string;
    products: { name: string; _id: string }[];
  }[];
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, menuCategories, menuCategories2 }) => {
  const { totalQuantity } = useStateContext();
  const loginModal = useLoginModal();
  return (
    <ClientOnly>
      <nav className="bg-white shadow-lg border-b-black border-2 md:border-0 mx-auto ">
        <Header 
          currentUser={currentUser} 
          menuCategories={menuCategories}
          menuCategories2={menuCategories2}
        />
        <TopMenu menuCategories={menuCategories} menuCategories2={menuCategories2} />
        <SearchBar/>
      </nav>
    </ClientOnly>
  );
};

export default Navbar;
