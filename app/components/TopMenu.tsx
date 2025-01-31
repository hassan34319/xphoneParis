import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { categories as predefined_categories } from "./Categories";
import SidebarModal from "./SidebarModal";

interface NavbarProps {
  menuCategories: { title: string; products: { name: string; _id: string }[] }[];
}

const TopMenu: React.FC<NavbarProps> = ({ menuCategories }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState(8);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateVisibleCategories = () => {
    const width = window.innerWidth;
    if (width >= 1280) { // xl
      setVisibleCategories(8);
    } else if (width >= 1024) { // lg
      setVisibleCategories(6);
    } else if (width >= 768) { // md
      setVisibleCategories(4);
    } else {
      setVisibleCategories(3);
    }
  };

  useEffect(() => {
    updateVisibleCategories();
    window.addEventListener('resize', updateVisibleCategories);
    return () => window.removeEventListener('resize', updateVisibleCategories);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNext = () => {
    setCurrentIndex(prev => 
      Math.min(prev + 1, predefined_categories.length - visibleCategories)
    );
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const showPrevButton = currentIndex > 0;
  const showNextButton = currentIndex + visibleCategories < predefined_categories.length;

  const visibleCategoriesList = predefined_categories.slice(
    currentIndex,
    currentIndex + visibleCategories
  );

  return (
    <div className="hidden md:block">
      <div className="w-full bg-[#f8f9fc] h-10">
        <div className="relative h-full flex items-center px-4 lg:px-20">

          <div className="flex items-center mr-4 shrink-0">
            <button className="text-black cursor-pointer" onClick={toggleSidebar}>
              <svg
                className="w-6 h-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                {!isSidebarOpen && (
                  <path d="M4 5h16v2h-16v-2zm0 6h16v2h-16v-2zm0 6h16v2h-16v-2z" />
                )}
              </svg>
            </button>
          </div>


          {showPrevButton && (
            <button 
              onClick={handlePrev}
              className="absolute left-12 lg:left-25 z-10 p-1 hover:bg-red-600 rounded transition-colors"
              aria-label="Previous category"
            >
              <svg 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}


          <div 
            ref={containerRef} 
            className="flex-1 overflow-hidden"
          >
            <div 
              className="flex items-center justify-between transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / visibleCategories}%)`,
                width: `${(100 * predefined_categories.length) / visibleCategories}%`
              }}
            >
              {predefined_categories.map((category) => (
                <Link
                  key={category.title}
                  href={{ pathname: "/products", query: { search: category.search } }}
                  className="flex-shrink-0"
                  style={{ width: `${100 / predefined_categories.length}%` }}
                >
                  <h1 className="text-black cursor-pointer font-['Open_Sans'] whitespace-nowrap hover:text-[#AE3033] transition-colors text-center text-sm lg:text-base px-2">
                    {category.title}
                  </h1>
                </Link>
              ))}
            </div>
          </div>

          {showNextButton && (
            <button 
              onClick={handleNext}
              className="absolute right-2 lg:right-16 z-10 p-1 hover:bg-red-600 rounded transition-colors"
              aria-label="Next category"
            >
              <svg 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <SidebarModal
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        menuCategories={menuCategories}
      />
    </div>
  );
};

export default TopMenu;