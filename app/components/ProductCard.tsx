/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { urlFor } from "../../lib/sanityClient";
import { product } from "../utils/types";
import { useRouter } from "next/navigation";
import ClientOnly from "./ClientOnly";

const StarRating = ({ rating = 0, totalStars = 5 }) => {
  return (
    <div className="flex items-center mt-2">
      {Array.from({ length: totalStars }, (_, index) => (
        <svg
          key={index}
          className={`w-4 h-4 ms-1 ${
            index < rating ? "text-yellow-300" : "text-gray-300"
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      ))}
    </div>
  );
};

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
        className="bg-white rounded-xl p-2 flex flex-col  cursor-pointer shadow-lg  w-80 lg:h-[28rem] xl:h-[32rem] mb-6 hover:shadow-xl"
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

          <StarRating rating={product.rating? Number(product.rating) : 5} totalStars={5} />
        </div>
      </div>
    </ClientOnly>
  );
};

export default ProductCard;
