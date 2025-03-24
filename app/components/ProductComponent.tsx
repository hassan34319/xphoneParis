"use client";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
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
import { useSearchParams } from "next/navigation";

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

// Helper function to safely convert any value to string for comparison
const safeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value).toLowerCase();
};

function ProductComponent({ product, currentUser }: Props) {
  const searchParams = useSearchParams();
  const initialRenderRef = useRef(true);
  
  // Memoize in-stock variants to avoid re-filtering on every render
  const inStockVariants = useMemo(() => {
    return product.variants.filter(v => v.inStock !== false);
  }, [product.variants]);
  
  // Find variant by color only - with safe string comparison
  const findVariantByColor = useCallback((color: string) => {
    return inStockVariants.find(v => 
      safeString(v.color) === safeString(color)
    );
  }, [inStockVariants]);
  
  // Find variant by all properties - with safe string comparison
  const findVariant = useCallback((color: string | null, capacity: string | null, grade: string | null) => {
    // Filter conditions based on which parameters exist
    return inStockVariants.find(v => {
      // Safely compare strings regardless of type
      const colorMatch = !color || safeString(v.color) === safeString(color);
      const capacityMatch = !capacity || safeString(v.capacity) === safeString(capacity);
      const gradeMatch = !grade || safeString(v.grade) === safeString(grade);
      
      return colorMatch && capacityMatch && gradeMatch;
    });
  }, [inStockVariants]);

  // Initialize with URL parameters or default, using memoization to avoid recreation
  const initialVariant = useMemo(() => {
    const urlColor = searchParams.get('color');
    const urlCapacity = searchParams.get('capacity');
    const urlGrade = searchParams.get('grade');
    
    let matchingVariant = null;
    
    // Try to find a variant with the provided parameters
    if (urlColor || urlCapacity || urlGrade) {
      // Try to find a variant matching all provided parameters
      matchingVariant = findVariant(urlColor, urlCapacity, urlGrade);
      
      // If we found a match
      if (matchingVariant) {
        return {
          image: urlFor(matchingVariant.image).url(),
          color: String(matchingVariant.color || ''),
          capacity: String(matchingVariant.capacity || ''),
          grade: String(matchingVariant.grade || '')
        };
      } else if (urlColor) {
        // Fallback to just color if no match found with all parameters
        const colorVariant = findVariantByColor(urlColor);
        if (colorVariant) {
          return {
            image: urlFor(colorVariant.image).url(),
            color: String(colorVariant.color || ''),
            capacity: String(colorVariant.capacity || ''),
            grade: String(colorVariant.grade || '')
          };
        }
      }
    }
    
    // Default to first in-stock variant, or first variant if none are in stock
    const defaultVariant = inStockVariants.length > 0 ? inStockVariants[0] : product.variants[0];
    return {
      image: urlFor(defaultVariant.image).url(),
      color: String(defaultVariant.color || ''),
      capacity: String(defaultVariant.capacity || ''),
      grade: String(defaultVariant.grade || '')
    };
  }, [searchParams, findVariant, findVariantByColor, inStockVariants, product.variants]);
  
  // Set states after memoizing initial values to avoid rerenders
  const [currentVariant, setCurrentVariant] = useState<Variant>(initialVariant);
  const [currentImage, setCurrentImage] = useState<string>(initialVariant.image);
  
  // Synchronize the state with URL params ONLY on first render
  useEffect(() => {
    if (initialRenderRef.current) {
      setCurrentVariant(initialVariant);
      setCurrentImage(initialVariant.image);
      initialRenderRef.current = false;
    }
  }, [initialVariant]);
  
  // Handle image click from carousel
  const handleImageClick = useCallback((imageUrl: string) => {
    setCurrentImage(imageUrl);
  }, []);
  
  // Handle variant selection with safe string conversion
  const handleVariantSelect = useCallback((color: string, grade: string, capacity: string) => {
    const variant = findVariant(color, capacity, grade);
    
    if (variant) {
      const newImage = urlFor(variant.image).url();
      setCurrentVariant({
        image: newImage,
        color: String(variant.color || ''),
        capacity: String(variant.capacity || ''),
        grade: String(variant.grade || '')
      });
      setCurrentImage(newImage);
    }
  }, [findVariant]);
  
  // Handle dropdown variant selection
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
                variants={inStockVariants}
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