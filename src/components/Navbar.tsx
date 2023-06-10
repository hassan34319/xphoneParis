/* eslint-disable @next/next/no-img-element */
import { RiTeamLine } from "react-icons/ri";
import { BsBag, BsHouseDoor } from "react-icons/bs";
import Search from "./Search";
import Link from "next/link";
import { useStateContext } from "../../context/stateContext";
import TopMenu from "./TopMenu";
import BurgerMenu from "./BurgerMenu";
import UserMenu from "./userMenu";


const Navbar = () => {
  const { totalQuantity } = useStateContext();

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
                src="https://cdn.shopify.com/s/files/1/0061/7929/1200/files/ephones_250x.png?v=1638106517"
                className="lg:w-1/2 cursor-pointer"
              />
            </Link>
          </div>
          <Search />
          <div className="flex flex-row order-2 lg:order-3  items-center gap-8 lg:gap-0 justify-around my-4 lg:my-0 cursor-pointer flex-1">
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
              <div className="flex flex-col justify-center items-center pt-2">
                <h1 className="sticky text-center -mb-9 lg:-mb-10">
                  {totalQuantity}
                </h1>
                <BsBag className="text-2xl lg:text-4xl mt-2" />
                <h1>Panier</h1>
              </div>
            </Link>
            <div className="md:w-1/4">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
      <TopMenu />
    </nav>
  );
};

export default Navbar;
