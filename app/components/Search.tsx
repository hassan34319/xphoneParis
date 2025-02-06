'use client'

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import React, { useState, useTransition } from "react";
import { BsSearch } from "react-icons/bs";

const Search: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!search.trim()) return;

    startTransition(() => {
      // Create a new URLSearchParams object
      const params = new URLSearchParams(searchParams);
      
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }

      // Use replace instead of push to avoid history stack issues
      router.replace(`${pathname}?${params.toString()}`);
      setSearch("");
    });
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          disabled={isPending}
        />
        <BsSearch
          className={`ml-auto mr-4 h-6 w-6 cursor-pointer ${
            isPending ? 'text-gray-400' : 'text-gray-600'
          }`}
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default Search;