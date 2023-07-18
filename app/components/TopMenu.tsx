import Link from "next/link";
import { useState } from "react";
import { categories as predefined_categories } from "./Categories";
import SidebarModal from "./SidebarModal";
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
}
const TopMenu: React.FC<NavbarProps> = ({
  categories,
  brands,
  subcategories,
  brands_categories,
  subcategories_categories,
  categories_brands,
  subcategories_brands,
  products,
}) => {
  console.log("From component"  , categories,
    brands,
    subcategories,
    brands_categories,
    subcategories_categories,
    categories_brands,
    subcategories_brands,
    products,)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="hidden md:block">
      <div className="w-full bg-[#AE3033] h-10 flex flex-row justify-between items-center px-20 text-white">
        <div className="flex items-center">
          <button className="text-white cursor-pointer" onClick={toggleSidebar}>
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
          <span className="ml-2">Menu</span>
        </div>
        {predefined_categories.map((category) => (
          <Link
            key={category.title}
            href={{
              pathname: "/products",
              query: { search: category.search },
            }}
          >
            <h1 className="text-white cursor-pointer">{category.title}</h1>
          </Link>
        ))}
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
    </div>
  );
};

export default TopMenu;
