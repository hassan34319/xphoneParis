import Link from "next/link";
import React, { useEffect, useState } from "react";

interface BrandData {
  [key: string]: string[];
}
interface NavbarProps {
    categories?: string[]
    brands?: string[]
    subcategories?: string[]
    brands_categories?: BrandData
    subcategories_categories?: BrandData
    categories_brands?: BrandData
    subcategories_brands?: BrandData
    products : {[key: string]: {name:string, id:string}[]};
    isOpen: boolean
    toggleSidebar : ()=>void
  }
const SidebarModal :  React.FC<NavbarProps> = ({ isOpen, toggleSidebar, categories,brands,subcategories,brands_categories,subcategories_categories,categories_brands,subcategories_brands,products })=> {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeBrand, setActiveBrand] = useState("");
  const [activeSubCategory, setActiveSubCategory] = useState("");

  const toggleSubModal = () => {
    if (isSubModalOpen) {
      setActiveCategory("");
      setActiveBrand("");
      setActiveSubCategory("");
    }
    setIsSubModalOpen(!isSubModalOpen);
  };

  const closeSubModal = () => {
    toggleSubModal()
    toggleSidebar()
  }

  useEffect(() => {
    // Disable scrolling of the entire page when the sidebar or sub-modal is open
    if (isOpen || isSubModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      // Clean up the effect by removing the class when the component is unmounted
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, isSubModalOpen]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveBrand("");
    setActiveSubCategory("");
    toggleSubModal();
  };

  const handleBrandClick = (brand: string) => {
    setActiveBrand(brand);
    setActiveCategory("");
    setActiveSubCategory("");
    toggleSubModal();
  };

  const handleSubCategoryClick = (subcategory: string) => {
    setActiveBrand("");
    setActiveCategory("");
    setActiveSubCategory(subcategory);
    toggleSubModal();
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
          <h2 className="font-bold text-sm text-[#AE3033]">Categories</h2>
          <ul className="pl-4 mt-2">
            {categories?.map((category) => (
              <li
                key={category}
                className={`flex items-center py-2 border-t border-b border-gray-200 cursor-pointer ${
                  activeCategory === category ? "bg-gray-100" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                <span className="mr-2">{category}</span>
                <svg
                  className={`w-4 h-4 ml-auto fill-current -rotate-90 ${
                    activeCategory === category ? "transform rotate-0" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6z" />
                </svg>
              </li>
            ))}
          </ul>
          <h2 className="font-bold text-sm text-[#AE3033] mt-4">Brands</h2>
          <ul className="pl-4 mt-2">
            {brands?.map((brand) => (
              <li
                key={brand}
                className={`flex items-center py-2 border-t border-b border-gray-200 cursor-pointer ${
                  activeBrand === brand ? "bg-gray-100" : ""
                }`}
                onClick={() => handleBrandClick(brand)}
              >
                <span className="mr-2">{brand}</span>
                <svg
                  className={`w-4 h-4 ml-auto fill-current -rotate-90 ${
                    activeBrand === brand ? "transform rotate-0" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6z" />
                </svg>
              </li>
            ))}
          </ul>
          <h2 className="font-bold text-sm text-[#AE3033] mt-4">
            Most Popular
          </h2>
          <ul className="pl-4 mt-2">
            {subcategories?.map((subcategory) => (
              <li
                key={subcategory}
                className={`flex items-center py-2 border-t border-b border-gray-200 cursor-pointer ${
                  activeSubCategory === subcategory ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSubCategoryClick(subcategory)}
              >
                <span className="mr-2">{subcategory}</span>
                <svg
                  className={`w-4 h-4 ml-auto fill-current -rotate-90 ${
                    activeSubCategory === subcategory
                      ? "transform rotate-0"
                      : ""
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
            {activeBrand && (
              <>
                <h2 className="font-bold text-sm text-[#AE3033]">
                  Categories for {activeBrand}
                </h2>
                <ul className="pl-4 mt-2">
                  {categories_brands && categories_brands[activeBrand]?.map((category) => (
                    <Link
                      href={`/${activeBrand}/${category}`}
                      key={category}
                      className="flex items-center py-2 border-t border-b border-gray-200 cursor-pointer"
                      onClick={closeSubModal}
                    >
                      <span className="mr-2">{category}</span>
                      <svg
                        className="w-4 h-4 ml-auto fill-current -rotate-90"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 9l6 6 6-6z" />
                      </svg>
                    </Link>
                  ))}
                </ul>
                <h2 className="font-bold text-sm text-[#AE3033] mt-4">
                  Most Popular for {activeBrand}
                </h2>
                <ul className="pl-4 mt-2">
                  {subcategories_brands && subcategories_brands[activeBrand]?.map((subcategory) => (
                    <Link
                      href={`/subcategory/${subcategory}`}
                      key={subcategory}
                      className="flex items-center py-2 border-t border-b border-gray-200 cursor-pointer"
                      onClick={closeSubModal}
                    >
                      <span className="mr-2">{subcategory}</span>
                      <svg
                        className="w-4 h-4 ml-auto fill-current -rotate-90"
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
            {activeCategory && (
              <>
                <h2 className="font-bold text-sm text-[#AE3033]">
                  Brands for {activeCategory}
                </h2>
                <ul className="pl-4 mt-2">
                  {brands_categories && brands_categories[activeCategory]?.map((brand) => (
                    <Link
                      href={`/${brand}/${activeCategory}`}
                      key={brand}
                      className="flex items-center py-2 border-t border-b border-gray-200 cursor-pointer"
                      onClick={closeSubModal}
                    >
                      <span className="mr-2">{brand}</span>
                      <svg
                        className="w-4 h-4 ml-auto fill-current -rotate-90"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 9l6 6 6-6z" />
                      </svg>
                    </Link>
                  ))}
                </ul>
                <h2 className="font-bold text-sm text-[#AE3033] mt-4">
                  Most Popular for {activeCategory}
                </h2>
                <ul className="pl-4 mt-2">
                  {subcategories_categories && subcategories_categories[activeCategory]?.map(
                    (subcategory) => (
                      <Link
                        href={`/subcategory/${subcategory}`}
                        key={subcategory}
                        className="flex items-center py-2 border-t border-b border-gray-200 cursor-pointer"
                        onClick={closeSubModal}
                      >
                        <span className="mr-2">{subcategory}</span>
                        <svg
                          className="w-4 h-4 ml-auto fill-current -rotate-90"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 9l6 6 6-6z" />
                        </svg>
                      </Link>
                    )
                  )}
                </ul>
              </>
            )}
            {activeSubCategory && (
              <>
                <h2 className="mt-4 font-bold text-sm text-[#AE3033]">
                  Products for {activeSubCategory}
                </h2>
                <ul className="pl-4 mt-2">
                  {products[activeSubCategory]?.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center py-2 border-t border-b border-gray-200 cursor-pointer"
                      onClick={closeSubModal}
                    >
                      <span className="mr-2">{product.name}</span>
                      <svg
                        className="w-4 h-4 ml-auto fill-current -rotate-90"
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


