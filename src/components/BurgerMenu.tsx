import { useState } from "react";
import { slide as Menu } from "react-burger-menu";
import Link from "next/link";
import { sanityClient } from "../../lib/sanityClient";
import { product } from "../utils/types";
import { BiArrowBack } from "react-icons/bi";

var styles = {
  bmBurgerButton: {
    position: "absolute",
    width: "24px",
    height: "24px",
    left: "16px",
    top: "36px",
    zIndex: "1" // Add this line to set the z-index
  },
  bmBurgerBars: {
    background: "#000000",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "24px",
    width: "24px",
  },
  bmCross: {
    background: "white",
  },
  bmMenuWrap: {
    position: "fixed",
    left: "0px",
    top: "0px",
    height: "100%",
  },
  bmMenu: {
    background: "black",
    padding: "2.5em 1.5em 0",
    fontSize: "1.15em",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    padding: "0.8em",
  },
  bmItem: {
    display: "inline-block",
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
    left: "0px",
    top: "0px",
    margin: "10px",
  },
};

const menuItems = [
  { title: "Smartphones", slug: "smartphone" },
  { title: "Ordinateurs", slug: "computer" },
  { title: "Tablettes", slug: "tablet" },
  { title: "Télévisions", slug: "television" },
];

type nameAndId = {
  name: string;
  _id: string;
};

const BurgerMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [itemSelected, setItemSelected] = useState(false);
  const [subItems, setSubItems] = useState<nameAndId[]>([]);

  const menuHandler = () => {
    setMenuOpen((oldState) => !oldState);
    setItemSelected(false);
    setSubItems([]);
  };

  const selectedItemHandler = async (title: string) => {
    setItemSelected(true);
    const slug = menuItems.find((item) => item.title == title)?.slug;
    try {
      const query = `*[_type == "product" && category == "${slug}"]`;
      const items: product[] = await sanityClient.fetch(query);
      setSubItems(
        items.map((item) => {
          return { name: item.name, _id: item._id as string };
        })
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      <Menu
        styles={styles}
        isOpen={menuOpen}
        onOpen={menuHandler}
        onClose={menuHandler}
      >
        <div>
          {itemSelected && (
            <div
              className="flex flex-row items-center gap-1 mb-4 cursor-pointer"
              onClick={() => setItemSelected(false)}
            >
              <BiArrowBack />
              <h1>Retour</h1>
            </div>
          )}
          {!itemSelected
            ? menuItems
                .map((item) => item.title)
                .map((item: string, index: number) => {
                  return (
                    <div key={index} className="my-4 text-white">
                      <button
                        className="block text-2xl"
                        onClick={() => selectedItemHandler(item)}
                      >
                        {item}
                      </button>
                    </div>
                  );
                })
            : subItems.map((item: nameAndId) => {
                return (
                  <div
                    key={item._id}
                    className={`${
                      item.name === "Bons Plans" ? "text-red-600" : ""
                    } my-4 text-white`}
                    onClick={menuHandler}
                  >
                    <Link
                      key={item._id}
                      href={"/products/" + item._id}
                      className="block text-2xl"
                    >
                      {item.name}
                    </Link>
                  </div>
                );
              })}
        </div>
      </Menu>
    </div>
  );
};

export default BurgerMenu;
