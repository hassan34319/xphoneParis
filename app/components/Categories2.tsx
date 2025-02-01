'use client'
import React, { useEffect, useState } from "react";
import { sanityClient } from "../../lib/sanityClient";
import { product } from "../utils/types";
import ProductCard from "./ProductCard";

type Props = {
  phones : product[]
  televisions : product[]
  computers : product[]
  tablets : product[]
  exclusive : product[]
}

const Categories2: React.FC<Props> = ({ phones,televisions,computers,tablets,exclusive,audio,jeuxVideo }) =>  {
  const [loading, setLoading] = useState(false);
  type category = {
    name: string;
    products: product[];
  };
  const categories: category[] = [
    { name: "Promotion du Moment", products: exclusive ?? [] },
    { name: "Téléphones", products: phones ?? [] },
    { name: "Ordinateurs", products: computers ?? [] },
    { name: "Tablettes", products: tablets ?? [] },
    { name: "Télévisions", products: televisions ?? [] },
    { name: "Jeux vidéo", products: jeuxVideo ?? [] },
    { name: "Audio", products: audio ?? [] },
  ];

  // useEffect(() => {
  //   const getProducts = async () => {
  //     setLoading(true);
  //     try {
  //       const phonesQuery = '*[_type == "product" && category == "smartphone"]';
  //       const televisionsQuery =
  //         '*[_type == "product" && category == "television"]';
  //       const tabletsQuery = '*[_type == "product" && category == "tablet"]';
  //       const computersQuery =
  //         '*[_type == "product" && category == "computer"]';
  //       const phones: product[] = await sanityClient.fetch(phonesQuery);
  //       const televisions: product[] = await sanityClient.fetch(
  //         televisionsQuery
  //       );
  //       const tablets: product[] = await sanityClient.fetch(tabletsQuery);
  //       const computers: product[] = await sanityClient.fetch(computersQuery);
  //       setPhones(phones);
  //       setTelevisions(televisions);
  //       setTablets(tablets);
  //       setComputers(computers);
  //       setLoading(false);
  //     } catch (error: any) {
  //       console.error(error);
  //       setLoading(false);
  //     }
  //   };
  //   getProducts();
  // }, []);

  if (loading) return <h1>Loading...</h1>;
  return (
    <div className="flex flex-col self-center w-11/12">
      {categories.map((category: category) => {
        return (
          <div key={category.name} className="my-10">
            <h1 className="underline text-2xl lg:text-3xl">{category.name}</h1>
            <div className="flex flex-row gap-8 mt-4 overflow-auto">
              {category.products.slice(0, 5).map((product: product) => {
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
