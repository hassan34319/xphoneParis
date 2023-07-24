"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaUser, FaComments, FaBriefcase } from "react-icons/fa";

import {
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { BiUser, BiShoppingBag } from "react-icons/bi";
import { FcAbout } from "react-icons/fc";

{
  /* Icons use an upper camel case naming convention and are always suffixed with the word Icon */
}

import { useSession, signIn, signOut } from "next-auth/react";
import { useStateContext } from "../context/stateContext";
import TopMenu from "./TopMenu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import SidebarModal from "./SidebarModal";
import { User } from "@prisma/client";
import { SafeUser } from "../utils/types";
import LoginModal from "./LoginModal";
import useLoginModal from "../../hooks/useLoginModal";
interface NavbarProps {
  currentUser?: SafeUser | null;
  categories?: string[];
  brands?: string[];
  subcategories?: string[];
  brands_categories?: BrandData;
  subcategories_categories?: BrandData;
  categories_brands?: BrandData;
  subcategories_brands?: BrandData;
  products: { [key: string]: { name: string; id: string }[] };
}
interface BrandData {
  [key: string]: string[];
}
// Type rfce to create component and export it with the same name as your page
// Image component imported by next/image can be used isntead of regular img html tag and is lazy loaded by default.
type Props = {};
const Header: React.FC<NavbarProps> = ({
  categories,
  brands,
  subcategories,
  brands_categories,
  subcategories_categories,
  categories_brands,
  subcategories_brands,
  products,
  currentUser,
}) => {
  console.log(
    "From header",
    categories,
    brands,
    subcategories,
    brands_categories,
    subcategories_categories,
    categories_brands,
    subcategories_brands,
    products
  );
  const { totalQuantity } = useStateContext();
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  console.log(search);
  const router = useRouter();

  const searchHandler = () => {
    if (search) {
      router.push(`/products?search=${search}`);
      setSearch("");
    } else {
      return;
    }
  };
  const loginModal = useLoginModal()
  return (
    <header className="top-0 z-30 flex w-full items-center justify-between bg-white p-4">
      {/* Z Index ( z-index ) is a CSS property that defines the order of overlapping HTML elements. Elements with a higher index will be placed on top of elements with a lower index. */}
      {/* bg-gradient-to-r from-[#A9F1DF] to-[#FFBBBB] */}
      <button
        className="md:hidden text-[#AE3033] cursor-pointer w-1/5"
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path d="M19 7h-14c-1.104 0-2 .896-2 2v6c0 1.104.896 2 2 2h14c1.104 0 2-.896 2-2v-6c0-1.104-.896-2-2-2zm0 2v6h-14v-6h14zm-11 2h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" />
          ) : (
            <path d="M4 5h16v2h-16v-2zm0 6h16v2h-16v-2zm0 6h16v2h-16v-2z" />
          )}
        </svg>
      </button>
      <div className="items-center justify-center flex flex-1 md:w-1/5">
        {/* So by default it is in center and when md screen comes ot goes to 20% width of the total width of page */}
        {/*Tailwind Styles are mobile first so whatever we style is for mobile and then we add breakpoints for changes for bigger screens like md means for screen sizes greater than md*/}
        <Link href="/">
          {/*Adds a Link to the apple tag to homepage */}
          <div className="relative h-5 w-40 cursor-pointer opacity-100 transition hover:opacity-80">
            {/* //Tailwind by default has no margins so content starts right from top left, h and w are height and width */}
            {/* //Relative must be added when using layout=fill for the image so that div is relative to the size of image.  */}
            <Image
              src="/logo0.jpeg"
              alt="company_logo"
              fill
              className="object-cover"
            />
            {/* layout_fill surrounds the image with the parent div i.e container
       object fit helps mantain the aspect ratio of picture by displaying the image of its exact size. */}

            {/* //Must White List this domain by adding it to next config file. */}
          </div>
        </Link>
      </div>
      <div className="hidden flex-1 items-center justify-center space-x-8 md:flex">
        {/* Flex 1 means you want this div to take as much space as possible so 80% space as 20% space is taken by above container as w=1/5 for that. Space x means apce between components horizontally */}

        {/* So initially these anchor tqgs are hidden but when medium screen is reached the flexbox properties we defined are activated and items are centered with space of 8 between them  */}

        <form className="flex items-center w-full">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <DevicePhoneMobileIcon className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Essayez Iphone, Samsung, Macbook..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key == "Enter" && searchHandler()}
            />
          </div>
          <div
            onClick={searchHandler}
            className="p-2.5 ml-2 text-sm font-medium text-white bg-[#AE3033] rounded-lg border border-[#AE3033] hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
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
          </div>
        </form>

        {/* You can also make a seperate class named headerLink and apply to all 4 links and then go to global.css and 
        @layer components : {
          .headerLink : {
            @apply cursor-pointer opacity-75 transition hover:opacity-100
          }
        }  */}
      </div>
      <div className="flex w-1/5 items-center justify-center gap-x-4 md:w-1/4 md:gap-x-6 mr-3 ">
        {currentUser && (
          <Link href="/user">
            <BiUser className="w-6 h-6 cursor-pointer opacity-100 transition hover:opacity-75" />
          </Link>
        )}
        {!currentUser && (
          <button onClick={loginModal.onOpen}>
            <BiUser className="w-6 h-6 cursor-pointer opacity-100 transition hover:opacity-75" />
          </button>
        )}
        <Link href="/us" className="hidden md:block">
          <GlobeAltIcon className="w-6 h-6 cursor-pointer opacity-100 transition hover:opacity-75" />
        </Link>
        <Link href="/faq" className="hidden md:block">
          <QuestionMarkCircleIcon className="w-6 h-6 cursor-pointer opacity-100 transition hover:opacity-75" />
        </Link>
        {/* https://heroicons.com/ */}
        {/* //See Global Css FIle Must Give height and width to the icons for them to be seen. */}
        <Link href="/cart">
          <div className="relative cursor-pointer">
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 z-50 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r  from-[#AE3033] to-[#751A21] text-xs text-[white]">
                {totalQuantity}
                {/* FONT FOR THIS IS IMPORTED IN APP.JS AND ADDED TO TAILWIND.CONFIG.JS  AND THEN TP GLOBAL.CSS*/}
              </span>
            )}
            {/* -top-1 -right-1 means it will negative margin to right and top so moves towards that side. z-index-50 means top priority so on top of evrything */}
            <BiShoppingBag className="w-6 h-6 cursor-pointer opacity-100 transition hover:opacity-75" />
          </div>
        </Link>

        {/* {session ? (
          <Image
            src={
              session.user?.image ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt=""
            className="cursor-pointer rounded-full"
            width={34}
            height={34}
            onClick={() => signOut()}
          />
        ) : (
          <UserIcon
            className="headerIcon"
             onClick={() => signIn()}
          />
        )} */}
      </div>
      <SidebarModal
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        products={products}
        categories={categories}
        brands={brands}
        subcategories={subcategories}
        brands_categories={brands_categories}
        categories_brands={categories_brands}
        subcategories_brands={subcategories_brands}
        subcategories_categories={subcategories_categories}
      />
    </header>
  );
};

export default Header;
