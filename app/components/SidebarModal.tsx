import Link from "next/link";
import React, { useEffect, useState } from "react";

interface NavbarProps {
  menuCategories: { title: string; products: { name: string; _id: string }[] }[];
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarModal: React.FC<NavbarProps> = ({
  isOpen,
  toggleSidebar,
  menuCategories,
}) => {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeProduct, setActiveProduct] = useState("");

  const toggleSubModal = () => {
    if (isSubModalOpen) {
      setActiveCategory("");
      setActiveProduct("");
    }
    setIsSubModalOpen(!isSubModalOpen);
  };

  const closeSubModal = () => {
    toggleSubModal();
    toggleSidebar();
  };

  useEffect(() => {
    if (isOpen || isSubModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, isSubModalOpen]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveProduct("");
    toggleSubModal();
  };

  const handleProductClick = (productId: string) => {
    setActiveProduct(productId);
    toggleSubModal();
    toggleSidebar();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-12 md:top-[7.2rem] left-0 w-full h-full bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`space-y-10 fixed top-12 md:top-[7.2rem] left-0 w-full h-full bg-white z-50 shadow-lg md:w-1/4 ${
          isOpen ? "block" : "hidden"
        } overflow-y-auto`}
      >
        <button
          className="absolute top-0 right-0 m-4 p-2 text-white bg-[#AE3033] rounded-lg cursor-pointer"
          onClick={toggleSidebar}
        >
          Close
        </button>

        <div className="p-4 h-full overflow-y-auto">
          <h2 className="font-bold text-sm text-[#AE3033]">Menu Categories</h2>
          <ul className="pl-4 mt-2">
            {menuCategories.map((category) => (
              <li
                key={category.title}
                className={`flex items-center py-2 border-t border-b border-gray-200 cursor-pointer ${
                  activeCategory === category.title ? "bg-gray-100" : ""
                }`}
                onClick={() => handleCategoryClick(category.title)}
              >
                <span className="mr-2">{category.title}</span>
                <svg
                  className={`w-4 h-4 ml-auto fill-current -rotate-90 ${
                    activeCategory === category.title ? "transform rotate-0" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6z" />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sub Modal */}
      {isSubModalOpen && (
        <div
          className={`fixed top-12 md:top-[7.2rem] left-0 md:left-[25%] w-full h-full bg-white z-50 shadow-lg md:w-1/4 ${
            isOpen ? "block" : "hidden"
          } md:h-screen overflow-y-auto`}
        >
          <button
            className="absolute top-0 right-0 m-4 p-2 text-white bg-[#AE3033] rounded-lg cursor-pointer"
            onClick={closeSubModal}
          >
            Close
          </button>

          <div className="p-4 h-full overflow-y-auto mt-10">
            {activeCategory && (
              <>
                <h2 className="font-bold text-sm text-[#AE3033]">
                  Products for {activeCategory}
                </h2>
                <ul className="pl-4 mt-2">
                  {menuCategories
                    .find((category) => category.title === activeCategory)
                    ?.products.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                        className={`flex items-center py-2 border-t border-b border-gray-200 cursor-pointer ${
                          activeProduct === product._id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => handleProductClick(product._id)}
                      >
                        <span className="mr-2">{product.name}</span>
                        <svg
                          className={`w-4 h-4 ml-auto fill-current -rotate-90 ${
                            activeProduct === product._id ? "transform rotate-0" : ""
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 9l6 6 6-6z" />
                        </svg>
                      </Link>
                    ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarModal;

