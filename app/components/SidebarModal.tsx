import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { SafeUser } from "../utils/types";
import { useRouter } from 'next/navigation';

// Inside your component


interface NavbarProps {
  currentUser?: SafeUser | null;
  menuCategories: {
    title: string;
    hasSubcategories: boolean;
    subcategories?: {
      _ref: string;
      _type: string;
      _key: string;
    }[];
    products?: { name: string; _id: string }[];
  }[];
  menuCategories2: {
    _id: string;
    title: string;
    products: { name: string; _id: string }[];
  }[];
  pages: {
    title: string;
    pageName: { current: string };
    order: number;
  }[];
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarModal: React.FC<NavbarProps> = ({
  isOpen,
  toggleSidebar,
  menuCategories,
  menuCategories2,
  pages,
}) => {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isThirdModalOpen, setIsThirdModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSubcategory, setActiveSubcategory] = useState("");
  const [activeProduct, setActiveProduct] = useState("");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const subModalRef = useRef<HTMLDivElement>(null);
  const thirdModalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const sortedPages = [...(pages || [])].sort((a, b) => a.order - b.order);

  // Get subcategories for the active category by resolving references
  const getSubcategoriesForCategory = () => {
    const category = menuCategories.find(cat => cat.title === activeCategory);
    if (!category?.subcategories) return [];
    
    // Map through the references and find matching documents in menuCategories2
    return category.subcategories.map(subRef => {
      const matchingCategory = menuCategories2.find(cat => cat._id === subRef._ref);
      return matchingCategory ? {
        title: matchingCategory.title,
        _id: matchingCategory._id,
        products: matchingCategory.products
      } : null;
    }).filter(Boolean); // Remove any null values
  };

  const activeCategoryData = menuCategories.find(cat => cat.title === activeCategory);
  
  // Find the matching subcategory from menuCategories2 using the reference
  const activeSubcategoryData = menuCategories2.find(
    cat => cat.title === activeSubcategory
  );

  useEffect(() => {
    if (isOpen || isSubModalOpen || isThirdModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, isSubModalOpen, isThirdModalOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is inside any of the modals
      const isInsideSidebar = sidebarRef.current?.contains(target);
      const isInsideSubModal = subModalRef.current?.contains(target);
      const isInsideThirdModal = thirdModalRef.current?.contains(target);
      
      // If click is inside any modal, don't do anything
      if (isInsideSidebar || isInsideSubModal || isInsideThirdModal) {
        return;
      }
  
      // Handle closing modals in reverse order (innermost to outermost)
      if (isThirdModalOpen) {
        setIsThirdModalOpen(false);
        setActiveSubcategory("");
      } else if (isSubModalOpen) {
        setIsSubModalOpen(false);
        setActiveCategory("");
      } else if (isOpen) {
        toggleSidebar();
      }
    };
  
    if (isOpen || isSubModalOpen || isThirdModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isSubModalOpen, isThirdModalOpen, toggleSidebar]);

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category && isSubModalOpen) {
      setIsSubModalOpen(false);
      setActiveCategory("");
    } else {
      setActiveCategory(category);
      setIsSubModalOpen(true);
      setIsThirdModalOpen(false);
      setActiveSubcategory("");
    }
  };

  const handleSubcategoryClick = (subcategoryTitle: string) => {
    if (activeSubcategory === subcategoryTitle && isThirdModalOpen) {
      setIsThirdModalOpen(false);
      setActiveSubcategory("");
    } else {
      setActiveSubcategory(subcategoryTitle);
      setIsThirdModalOpen(true);
    }
  };

  const handleProductClick = (productId: string) => {
    setActiveProduct(productId);
    setIsSubModalOpen(false);
    setIsThirdModalOpen(false);
    console.log("here you go bro:  ",productId);
    toggleSidebar();
  };
  const getProductIdFromReference = (referenceId: string) => {
    // Loop through all menuCategories2 to find matching product
    for (const category of menuCategories2) {
      const foundProduct = category.products.find(product => product._id === referenceId);
      if (foundProduct) {
        return foundProduct._id;
      }
    }
    
    // If not found, return the original reference ID
    console.log("Warning: Product reference not found:", referenceId);
    return referenceId;
  };
  
  const handleProductClick2 = (e: React.MouseEvent, productId: string) => {
    console.log("Prod clicked")
    e.preventDefault(); // Prevent default link behavior
    
    const actualProductId = getProductIdFromReference(productId);
    console.log("Reference ID:", productId);
    console.log("Actual Product ID:", actualProductId);
    
    setActiveProduct(actualProductId);
    setIsSubModalOpen(false);
    setIsThirdModalOpen(false);
    toggleSidebar();
    
    router.push(`/products/${actualProductId}`);
  };


  

  const closeSubModal = () => {
    setIsSubModalOpen(false);
    setIsThirdModalOpen(false);
    setActiveCategory("");
    setActiveSubcategory("");
  };

  const closeThirdModal = () => {
    setIsThirdModalOpen(false);
    setActiveSubcategory("");
  };

  const uniqueMenuCategories = Array.from(
    new Set(menuCategories.map(cat => cat.title))
  ).map(title => 
    menuCategories.find(cat => cat.title === title)
  );

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 md:top-[6rem] left-0 w-full h-full bg-black opacity-50 z-40" />
      )}
      
      {/* First Modal - Categories */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 md:top-[6rem] left-0 w-full md:w-[15%] h-full md:max-h-fit bg-white z-50 shadow-lg ${
          isOpen ? "block" : "hidden"
        } overflow-y-auto md:rounded-b-xl`}
      >
        <button
          className="lg:hidden absolute top-0 right-0 m-4 p-2 bg-transparent rounded-full cursor-pointer"
          onClick={toggleSidebar}
        >
          <svg
            className="w-6 h-6 text-[#AE3033]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        <div className="p-4">
          <div className="flex justify-center">
            <Button 
              href="/" 
              onClick={() => {
                setIsSubModalOpen(false);
                setIsThirdModalOpen(false);
                toggleSidebar();
              }}
            >
              <img src="/logo0.jpeg" alt="Logo" className="flex items-center w-[10rem] md:w-[10rem]" />
            </Button>
          </div>
          
          <ul className="pl-4 mt-2">
            {uniqueMenuCategories.map((category) => (
              <li
                key={`category-${category?.title}`}
                className={`flex items-center py-2 border-t border-gray-200 cursor-pointer ${
                  activeCategory === category?.title ? "bg-gray-100" : ""
                }`}
                onClick={() => category && handleCategoryClick(category.title)}
              >
                <span className="mr-2">{category?.title}</span>
                <svg
                  className={`w-4 h-4 ml-auto fill-current -rotate-90 ${
                    activeCategory === category?.title ? "transform rotate-0" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6z" />
                </svg>
              </li>
            ))}
            {sortedPages.map((page) => (
              <li key={page.pageName.current}>
                <Link
                  href={`/${page.pageName}`}
                  className="flex items-center py-2 border-t border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setIsSubModalOpen(false);
                    setIsThirdModalOpen(false);
                    toggleSidebar();
                  }}
                >
                  <span className="mr-2">{page.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Second Modal - Subcategories or Products */}
      {isSubModalOpen && (
        <div
          ref={subModalRef}
          className={`fixed top-0 md:top-[6rem] left-0 md:left-[15%] w-full md:w-[20%] h-full md:max-h-fit bg-white z-50 shadow-lg overflow-y-auto md:rounded-b-xl`}
        >
          <button
            className="lg:hidden absolute top-0 right-0 m-4 p-2 bg-transparent rounded-full cursor-pointer"
            onClick={closeSubModal}
          >
            <svg
              className="w-6 h-6 text-[#AE3033]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="p-4">
            <h2 className="font-bold text-lg text-[#AE3033] relative flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#AE3033] cursor-pointer absolute left-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                onClick={closeSubModal}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 19.5L3 12l6.75-7.5M3 12h18"
                />
              </svg>
              <div className="text-center max-w-xs">
                {activeCategory}
              </div>
            </h2>
            <ul className="pl-4 mt-2">
              {activeCategoryData?.hasSubcategories ? (
                // Show subcategories if they exist
                getSubcategoriesForCategory().map((subcategory) => (
                  <li
                    key={subcategory._id}
                    className={`flex items-center py-2 border-t border-gray-200 cursor-pointer ${
                      activeSubcategory === subcategory.title ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleSubcategoryClick(subcategory.title)}
                  >
                    <span className="mr-2">{subcategory.title}</span>
                    <svg
                      className={`w-4 h-4 ml-auto fill-current -rotate-90 ${
                        activeSubcategory === subcategory.title ? "transform rotate-0" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6z" />
                    </svg>
                  </li>
                ))
              ) : (
                // Show products directly if no subcategories
                activeCategoryData?.products?.map((product) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className={`block py-2 border-t border-b border-gray-200 cursor-pointer ${
                      activeProduct === product._id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleProductClick(product._id)}
                  >
                    <span>{product.name}</span>
                  </Link>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Third Modal - Products from Subcategory */}
      {isThirdModalOpen && activeCategoryData?.hasSubcategories && (
    <div ref={thirdModalRef} className={`fixed top-0 md:top-[6rem] left-0 md:left-[35%] w-full md:w-[20%] h-full md:max-h-fit bg-white z-[60] shadow-lg overflow-y-auto md:rounded-b-xl`}>

          <button
            className="lg:hidden absolute top-0 right-0 m-4 p-2 bg-transparent rounded-full cursor-pointer"
            onClick={closeThirdModal}
          >
            <svg
              className="w-6 h-6 text-[#AE3033]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="p-4">
            <h2 className="font-bold text-lg text-[#AE3033] relative flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#AE3033] cursor-pointer absolute left-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                onClick={closeThirdModal}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 19.5L3 12l6.75-7.5M3 12h18"
                />
              </svg>
              <div className="text-center max-w-xs">
                {activeSubcategory}
              </div>
            </h2>
            <ul className="pl-4 mt-2">
        {activeSubcategoryData?.products.map((product) => (
      
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className={`block py-2 border-t border-b border-gray-200 cursor-pointer ${
              activeProduct === product._id ? "bg-gray-100" : ""
            }`}
            onClick={(e) => handleProductClick2(e, product._id)}
          >
            <span>{product.name}</span>
          </Link>
        ))}
      </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarModal;