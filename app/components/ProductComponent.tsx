"use client";
import { useEffect, useState, useRef } from "react";
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

  // Add a ref to track source of update
  const updateSource = useRef<string | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
  }, []);

  // Handle thumbnail click in carousel
  const handleVariantClick = (variantImage: string) => {
    updateSource.current = 'carousel';
    const variant = product.variants.find(
      v => urlFor(v.image).url() === variantImage
    );
    
    if (variant) {
      setCurrentVariant({
        image: variantImage,
        color: variant.color,
        capacity: variant.capacity,
        grade: variant.grade
      });
    }
  };

  // Handle variant selection from carousel
  const handleVariantSelect = (color: string, grade: string, capacity: string) => {
    if (updateSource.current === 'selection') {
      updateSource.current = null;
      return;
    }

    updateSource.current = 'carousel';
    const variant = product.variants.find(
      v => 
        v.color.toLowerCase() === color.toLowerCase() &&
        v.grade === grade &&
        v.capacity == capacity
    );

    if (variant) {
      setCurrentVariant({
        image: urlFor(variant.image).url(),
        color: variant.color,
        capacity: variant.capacity,
        grade: variant.grade
      });
    }
  };

  // Handle updates from ProductSelection
  const handleProductSelectionChange = (color: string, grade: string, capacity: string) => {
    if (updateSource.current === 'carousel') {
      updateSource.current = null;
      return;
    }

    updateSource.current = 'selection';
    const variant = product.variants.find(
      v => 
        v.color.toLowerCase() === color.toLowerCase() &&
        v.grade === grade &&
        v.capacity == capacity
    );

    if (variant) {
      setCurrentVariant({
        image: urlFor(variant.image).url(),
        color: variant.color,
        capacity: variant.capacity,
        grade: variant.grade
      });
    }
  };

  // Handle image updates
  const handleImageUpdate = (image: string) => {
    if (updateSource.current === 'carousel') return;
    setCurrentVariant(prev => ({ ...prev, image }));
  };

  return (
    <ClientOnly>
      <div className="w-11/12 mx-auto bg-white p-4 rounded mt-10 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side: Image & Carousel */}
          <div className="flex flex-col items-center">
            <div className="relative h-[24rem] w-full flex justify-center">
              <Image
                src={currentVariant.image}
                alt="Product Image"
                className="object-contain"
                fill
              />
            </div>
            <div className="mt-4 -ml-8">
              <ProductCarousel
                variants={product.variants}
                handleVariantClick={handleVariantClick}
                currentImage={currentVariant.image}
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
                setImage={handleImageUpdate}
                onVariantChange={handleProductSelectionChange}
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