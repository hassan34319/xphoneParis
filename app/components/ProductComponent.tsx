"use client";
import { useEffect, useState, useRef, useCallback } from "react";
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

type Variant = {
  image: string;
  color: string;
  capacity: string;
  grade: string;
};

function ProductComponent({ product, currentUser }: Props) {
  // Initialize state with the first variant
  const [currentVariant, setCurrentVariant] = useState<Variant>({
    image: urlFor(product.variants[0].image).url(),
    color: product.variants[0].color,
    capacity: product.variants[0].capacity,
    grade: product.variants[0].grade
  });
  
  // Track current image separately
  const [currentImage, setCurrentImage] = useState<string>(urlFor(product.variants[0].image).url());
  
  // Use memoized functions to prevent unnecessary re-renders
  const findVariant = useCallback((color: string, grade: string, capacity: string) => {
    return product.variants.find(v => 
      v.color.toLowerCase() === color.toLowerCase() &&
      v.grade === grade &&
      v.capacity == capacity
    );
  }, [product.variants]);

  // Handle image click from carousel - just update image, don't change variant selection
  const handleImageClick = useCallback((imageUrl: string) => {
    setCurrentImage(imageUrl);
  }, []);
  
  // Handle full variant selection from carousel - update both image and variant data
  const handleVariantSelect = useCallback((color: string, grade: string, capacity: string) => {
    const variant = findVariant(color, grade, capacity);
    
    if (variant) {
      setCurrentVariant({
        image: urlFor(variant.image).url(),
        color: variant.color,
        capacity: variant.capacity,
        grade: variant.grade
      });
      setCurrentImage(urlFor(variant.image).url());
    }
  }, [findVariant]);
  
  // Handle variant selection from dropdown - same implementation for consistency
  const handleDropdownVariantChange = useCallback((color: string, grade: string, capacity: string) => {
    handleVariantSelect(color, grade, capacity);
  }, [handleVariantSelect]);

  return (
    <ClientOnly>
      <div className="w-11/12 mx-auto bg-white p-4 rounded mt-10 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side: Image & Carousel */}
          <div className="flex flex-col items-center">
            <div className="relative h-[24rem] w-full flex justify-center">
              <Image
                src={currentImage}
                alt="Product Image"
                className="object-contain"
                fill
              />
            </div>
            <div className="mt-4 -ml-8">
              <ProductCarousel
                variants={product.variants}
                handleVariantClick={handleImageClick}
                currentImage={currentImage}
                onVariantSelect={handleVariantSelect}
                selectedColor={currentVariant.color}
                selectedGrade={currentVariant.grade}
                selectedCapacity={currentVariant.capacity}
              />
            </div>
          </div>

          {/* Right Side: Product Selection & Reviews */}
          <div className="flex flex-col">
            {product && (
              <ProductSelection
                product={product}
                selectedColor={currentVariant.color}
                selectedCapacity={currentVariant.capacity}
                selectedGrade={currentVariant.grade}
                setImage={handleImageClick}
                onVariantChange={handleDropdownVariantChange}
              />
            )}
            {/* Desktop Reviews */}
            <div className="hidden lg:block mt-10 self-start w-[60%]">
              <ProductReview
                id={product._id!}
                currentUser={currentUser}
                review={product.review}
              />
            </div>
          </div>
        </div>

        {/* Mobile Reviews */}
        <div className="block lg:hidden mt-10">
          <ProductReviewMobile
            id={product._id!}
            currentUser={currentUser}
            review={product.review}
          />
        </div>
        
        {/* Cloudinary Script */}
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          type="text/javascript"
        />
      </div>
    </ClientOnly>
  );
}

export default ProductComponent;