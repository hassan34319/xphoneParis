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

interface NavbarProps {
  currentUser?: SafeUser | null;
  categories?: string[]
  brands?: string[]
  subcategories?: string[]
  brands_categories?: BrandData
  subcategories_categories?: BrandData
  categories_brands?: BrandData
  subcategories_brands?: BrandData
  products : {[key: string]: {name:string, id:string}[]};
}

const Navbar: React.FC<NavbarProps> = ({ currentUser,categories,brands,subcategories,brands_categories,subcategories_categories,categories_brands,subcategories_brands,products }) => {
  const { totalQuantity } = useStateContext();
  const loginModal = useLoginModal();
  console.log("From navbar"  , categories,
    brands,
    subcategories,
    brands_categories,
    subcategories_categories,
    categories_brands,
    subcategories_brands,
    products,)

  return (
    // fixed top-0 left-0 w-full z-10
    <ClientOnly>
      <nav className="bg-white shadow-lg  border-b-black border-2 md:border-0 mx-auto ">
        <Header products={products} categories={categories} brands={brands} subcategories={subcategories} brands_categories ={brands_categories} categories_brands={categories_brands} subcategories_brands={subcategories_brands} subcategories_categories={subcategories_categories}/>
        <TopMenu products={products} categories={categories} brands={brands} subcategories={subcategories} brands_categories ={brands_categories} categories_brands={categories_brands} subcategories_brands={subcategories_brands} subcategories_categories={subcategories_categories} />
        <SearchBar/>
      </nav>
    </ClientOnly>
  );
};

export default Navbar;
