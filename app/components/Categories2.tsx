'use client'

import React, { useEffect, useState } from "react";
import { sanityClient } from "../../lib/sanityClient";
import { product } from "../utils/types";
import ProductCard from "./ProductCard";

type Props = {
  phones: product[]
  televisions: product[]
  computers: product[]
  tablets: product[]
  exclusive: product[]
  audio?: product[]
  jeuxVideo?: product[]
}

type category = {
  name: string;
  products: product[];
}

const Categories2: React.FC<Props> = ({ 
  phones, 
  televisions, 
  computers, 
  tablets, 
  exclusive, 
  audio = [], 
  jeuxVideo = [] 
}) => {
  const [loading, setLoading] = useState(false);

  const categories: category[] = [
    { name: "Promotion du Moment", products: exclusive ?? [] },
    { name: "Téléphones", products: phones ?? [] },
    { name: "Ordinateurs", products: computers ?? [] },
    { name: "Tablettes", products: tablets ?? [] },
    { name: "Télévisions", products: televisions ?? [] },
    { name: "Jeux vidéo", products: jeuxVideo ?? [] },
    { name: "Audio", products: audio ?? [] },
  ];

  // Filter out categories with no products
  const categoriesWithProducts = categories.filter(
    category => category.products && category.products.length > 0
  );

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="flex flex-col self-center w-11/12">
      {categoriesWithProducts.map((category: category) => (
        <div key={category.name} className="my-10">
          <h1 className="underline text-2xl lg:text-3xl py-4">
            {category.name}
          </h1>
          <div className="flex flex-row gap-8 mt-4 overflow-auto">
            {category.products.slice(0, 5).map((product: product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories2;