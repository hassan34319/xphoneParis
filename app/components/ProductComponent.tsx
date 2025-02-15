"use client";
import { useEffect, useState } from "react";
import ProductSelection from "./ProductSelection";
import { product } from "../utils/types";
import { urlFor } from "../../lib/sanityClient";
import ClientOnly from "./ClientOnly";
import Image from "next/image";
import Script from "next/script";
import ProductReview from "./ProductReview";
import ProductReviewMobile from "./ProductReviewMobile";
import { User } from "@prisma/client";
import ProductCarousel from "./ProductCarousel";

type Props = {
  product: product;
  currentUser: User | null;
};

function ProductComponent({ product, currentUser }: Props) {
  const [image, setImage] = useState<string>(urlFor(product.variants[0].image).url());
  const [selectedColor, setSelectedColor] = useState(product.variants[0].color);
  const [selectedCapacity, setSelectedCapacity] = useState(product.variants[0].capacity);
  const [selectedGrade, setSelectedGrade] = useState(product.variants[0].grade);

  const handleVariantClick = (variantImage: string) => {
    setImage(variantImage);
  };

  const handleVariantSelect = (color: string, grade: string, capacity: string) => {
    setSelectedColor(color);
    setSelectedGrade(grade);
    setSelectedCapacity(capacity);
  };

  return (
    <ClientOnly>
      <div className="w-11/12 mx-auto bg-white p-4 rounded mt-10 mb-10">
        {/* Product Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side: Image & Carousel */}
          <div className="flex flex-col items-center">
            <div className="relative h-[24rem] w-full flex justify-center">
              <Image
                src={image}
                alt="Product Image"
                className="object-contain"
                fill
              />
            </div>
            {/* Product Variant Carousel */}
            <div className="mt-4 -ml-8">
              <ProductCarousel
                variants={product.variants}
                handleVariantClick={handleVariantClick}
                currentImage={image}
                onVariantSelect={handleVariantSelect}
                product={product}
                selectedColor={selectedColor}
                selectedGrade={selectedGrade}
                selectedCapacity={selectedCapacity}
              />
            </div>
          </div>

          {/* Right Side: Product Selection & Reviews */}

          <div className="flex flex-col">
  {product && (
    <ProductSelection
      product={product}
      setImage={setImage}
      selectedColor={selectedColor}
      selectedCapacity={selectedCapacity}
      selectedGrade={selectedGrade}
    />
  )}

  {/* Desktop Reviews (Hidden on Small Screens) */}
  <div className="hidden lg:block mt-10 self-start w-[60%]"> 
    <ProductReview
      id={product._id!}
      currentUser={currentUser}
      review={product.review}
    />
  </div>
</div>
        </div>

        {/* Mobile Reviews (Visible Only on Small Screens) */}
        <div className="block lg:hidden mt-10">
          <ProductReviewMobile
            id={product._id!}
            currentUser={currentUser}
            review={product.review}
          />
        </div>

        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          type="text/javascript"
        />
      </div>
    </ClientOnly>
  );
}

export default ProductComponent
