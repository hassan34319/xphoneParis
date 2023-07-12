/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { urlFor } from "../../lib/sanityClient";
import { product } from "../utils/types";
import { useRouter } from "next/navigation";
import ClientOnly from "./ClientOnly";

interface ProductCardProps {
  product: product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const [image, setImage] = useState("");
  useEffect(() => {
    const getImage = async () => {
      const image = urlFor(product.variants[0].image).url();
      setImage(image);
    };
    getImage();
  }, [product.variants]);

  return (
    <ClientOnly>
      <div
        className="bg-white rounded-xl p-2 flex flex-col  cursor-pointer shadow-lg  w-72 lg:h-96 mb-6 hover:shadow-xl"
        onClick={() => router.push(`/products/${product._id}`)}
      >
        <img
          src={image}
          alt="product image"
          className="object-contain h-44 w-32 m-4 mx-auto"
        />
        <div className="whitespace">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <h1 className="text-xl text-gray-600">{product.brand}</h1>
          <h1 className="text-gray-600">{product.desc}</h1>
          <h1 className="text-gray-600">A partir de:</h1>
          <div className="flex flex-row gap-4">
            <h1 className="font-semibold text-2xl mt-2 text-gray-400 line-through">
              {Math.round(
                (product.variants[0].price * 1.2 + Number.EPSILON) * 100
              ) / 100}
              &euro;
            </h1>
            <h1 className="font-semibold text-2xl mt-2">
              {Math.round((product.variants[0].price + Number.EPSILON) * 100) /
                100}
              &euro;
            </h1>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};

export default ProductCard;
