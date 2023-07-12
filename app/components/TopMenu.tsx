import Link from "next/link";
import { categories } from "./Categories";

const TopMenu = () => {
  return (
    <div className="hidden md:block">
      <div className="w-full bg-black h-10 flex flex-row justify-center items-center gap-8">
        {categories.map((category) => (
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
    </div>
  );
};

export default TopMenu;
