import React, { useEffect, useState } from "react";
import { sanityClient } from "../../lib/sanityClient";
import { product } from "../utils/types";
import ProductCard from "./ProductCard";

const Categories2: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [phones, setPhones] = useState<product[]>([]);
  const [televisions, setTelevisions] = useState<product[]>([]);
  const [tablets, setTablets] = useState<product[]>([]);
  const [computers, setComputers] = useState<product[]>([]);
  const [pc, setPc] = useState<product[]>([]);
  const [dyson, setDyson] = useState<product[]>([]);
  const [consolee, setConsole] = useState<product[]>([]);
  type category = {
    name: string;
    products: product[];
  };
  const categories: category[] = [
    { name: "Téléphones", products: phones },
    { name: "Ordinateurs", products: computers },
    { name: "Tablettes", products: tablets },
    { name: "Télévisions", products: televisions },
    { name: "Écran Pc", products: pc },
    { name: "Console", products: consolee },
    { name: "Dyson", products: dyson },
  ];

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const phonesQuery = '*[_type == "product" && category == "smartphone"]';
        const televisionsQuery =
          '*[_type == "product" && category == "television"]';
        const tabletsQuery = '*[_type == "product" && category == "tablet"]';
        const computersQuery =
          '*[_type == "product" && category == "computer"]';
        const pcQuery =
          '*[_type == "product" && category == "pc"]';
        const consoleQuery =
          '*[_type == "product" && category == "console"]';
        const dysonQuery =
          '*[_type == "product" && category == "dyson"]';
        const phones: product[] = await sanityClient.fetch(phonesQuery);
        const televisions: product[] = await sanityClient.fetch(
          televisionsQuery
        );
        const tablets: product[] = await sanityClient.fetch(tabletsQuery);
        const computers: product[] = await sanityClient.fetch(computersQuery);
        const pc : product[] = await sanityClient.fetch(pcQuery);
        const console: product[] = await sanityClient.fetch(consoleQuery);
        const dyson: product[] = await sanityClient.fetch(dysonQuery);
        setPhones(phones);
        setTelevisions(televisions);
        setTablets(tablets);
        setComputers(computers);
        setPc(pc)
        setConsole(console)
        setDyson(dyson)
        setLoading(false);
      } catch (error: any) {
        console.error(error);
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  return (
    <div className="flex flex-col self-center w-11/12">
      {categories.map((category: category) => {
        return (
          <div key={category.name} className="my-10">
            <h1 className="underline text-2xl lg:text-3xl">{category.name}</h1>
            <div className="flex flex-row gap-8 mt-4 overflow-auto">
              {category.products.length > 0 && category.products.slice(0, 5).map((product: product) => {
                return <ProductCard key={product._id} product={product} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Categories2;
