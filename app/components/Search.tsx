'use client'
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
const Search: React.FC = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const searchHandler = () => {
    if (search) {
      router
        .push(`/products?search=${search}`);
        setSearch("")
    } else {
      return;
    }
  };

  return (
    <div className="my-4 w-11/12 lg:w-1/3 order-3 lg:order-2 flex-1">
      <div className="flex flex-row items-center rounded border-2 border-black p-2">
        <input
          type="text"
          id="search"
          className="mr-2 flex flex-1 py-2 pl-2 text-xl outline-none"
          placeholder="Essayez Iphone, Macbook..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && searchHandler()}
        />
        <BsSearch
          className="ml-auto mr-4 h-6 w-6 text-gray-600 cursor-pointer"
          onClick={searchHandler}
        />
      </div>
    </div>
  );
};

export default Search;
