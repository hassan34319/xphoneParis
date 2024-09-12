import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

function SearchBar({}: Props) {
  const [search, setSearch] = useState("");
  console.log(search);

  const router = useRouter();

  const searchHandler = () => {
    if (search) {
      router.push(`/products?search=${search}`);
      setSearch('')
    } else {
      return;
    }
  };
  return (
    <div className="flex flex-1 items-center justify-center space-x-8 md:hidden mb-5">
        
      {/* Flex 1 means you want this div to take as much space as possible so 80% space as 20% space is taken by above container as w=1/5 for that. Space x means apce between components horizontally */}

      {/* So initially these anchor tqgs are hidden but when medium screen is reached the flexbox properties we defined are activated and items are centered with space of 8 between them  */}

      <form className="flex items-center w-full mx-5">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <DevicePhoneMobileIcon className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            id="simple-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Essayez Iphone, Samsung, Macbook..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key == "Enter" && searchHandler()}
          />
        </div>
        <div
          onClick={searchHandler}
          className="p-2.5 ml-2 text-sm font-medium text-white bg-[#AE3033] rounded-lg border border-[#AE3033] hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </div>
      </form>
      {/* You can also make a seperate class named headerLink and apply to all 4 links and then go to global.css and 
        @layer components : {
          .headerLink : {
            @apply cursor-pointer opacity-75 transition hover:opacity-100
          }
        }  */}
    </div>
  );
}

export default SearchBar;
