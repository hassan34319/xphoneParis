/* eslint-disable @next/next/no-img-element */
import { RiTeamLine } from "react-icons/ri";
import { BsBag, BsHouseDoor } from "react-icons/bs";
import Search from "./Search";
import Link from "next/link";
import { useStateContext } from "../../context/stateContext";
import TopMenu from "./TopMenu";
import BurgerMenu from "./BurgerMenu";
import UserMenu from "./userMenu";
import { BiUser } from "react-icons/bi";
import { useSession } from "next-auth/react";
import useLoginModal from "../hooks/useLoginModal";
const Navbar = () => {
  const { totalQuantity } = useStateContext();
  const { data: session } = useSession();
  const currentUser = session?.user;
  const loginModal = useLoginModal()

  return (
    // fixed top-0 left-0 w-full z-10
    <nav className="bg-white shadow-lg mb-5 border-b-black border-2 md:border-0 ">
      <div>
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="flex lg:mt-0 mt-4 order-1 justify-center items-center flex-1">
            <BurgerMenu />
            <Link href={"/"} className={"cursor-pointer"}>
              <img
                alt="logo"
                src="/logo0.jpeg"
                className="lg:w-1/2 cursor-pointer w-1/2"
              />
            </Link>
          </div>
          <Search />
          <div className="flex flex-row order-2 lg:order-3  items-center gap-4 lg:gap-0 justify-around my-4 lg:my-0 cursor-pointer flex-1">
              {currentUser ? (
                <Link href={"/user"}>
                  <div className="flex flex-col justify-center items-center">
                    <BiUser className="text-2xl lg:text-4xl " />
                    <h1>Espace Client</h1>
                  </div>
                </Link>
              ) : (
                <button onClick={loginModal.onOpen}>
                  <div className="flex flex-col justify-center items-center">
                    <BiUser className="text-2xl lg:text-4xl " />
                    <h1>Espace Client</h1>
                  </div>
                </button>
              )}
            <Link href={"/"}>
              <div className="flex flex-col justify-center items-center">
                <BsHouseDoor className="text-2xl lg:text-4xl " />
                <h1>Accueil</h1>
              </div>
            </Link>
            <Link href={"/us"}>
              <div className="flex flex-col justify-center items-center">
                <RiTeamLine className="text-2xl lg:text-4xl" />
                <h1>Qui sommes nous</h1>
              </div>
            </Link>
            <Link href={"/cart"}>
              <div className="flex flex-col justify-center items-center">
                <h1 className="absolute flex items-center text-center -mt-[1.1rem] md:-mt-4 text-sm">
                  {totalQuantity}
                </h1>
                <BsBag className="text-2xl lg:text-4xl" />
                <h1>Panier</h1>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <TopMenu />
    </nav>
  );
};

export default Navbar;
