import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { urlFor } from "../../lib/sanityClient";

interface ProductCarouselProps {
  variants: any[];
  handleVariantClick: (variant: any) => void;
  currentImage: string;
  onVariantSelect: (color: string, grade: string, capacity: string) => void;
  product: any;
  selectedColor: string;
  selectedGrade: string;
  selectedCapacity: string;
}

const ProductCarousel = ({
  variants,
  handleVariantClick,
  currentImage,
  onVariantSelect,
  product,
  selectedColor,
  selectedGrade,
  selectedCapacity
}: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const handleNext = () => {
    setCurrentIndex(prev =>
      Math.min(prev + 1, variants.length - itemsPerPage)
    );
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleVariantSelection = (variant: any) => {
    const variantImage = urlFor(variant.image).url();
    handleVariantClick(variantImage);
    onVariantSelect(
      variant.color,
      variant.grade,
      variant.capacity
    );
  };

  const isVariantSelected = (variant: any) => {
    return (
      variant.color === selectedColor &&
      variant.grade === selectedGrade &&
      variant.capacity === selectedCapacity
    );
  };

  return (
    <div className="relative flex items-center gap-2 mt-4 ml-2">
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-0 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transform -translate-x-1/2"
          aria-label="Previous variants"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className="flex gap-2 transition-transform duration-300 mx-6">
        {variants
          .slice(currentIndex, currentIndex + itemsPerPage)
          .map((variant, index) => (
            <div
              key={`${variant.color}-${variant.grade}-${variant.capacity}-${index}`}
              onClick={() => handleVariantSelection(variant)}
              className={`relative w-16 h-16 border-2 rounded-lg cursor-pointer transition-all ${
                isVariantSelected(variant)
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <Image
                src={urlFor(variant.image).url()}
                alt={`${variant.color} ${variant.capacity}GB ${variant.grade}`}
                fill
                className="object-contain p-1"
              />
              {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                {variant.capacity}GB {variant.grade}
              </div> */}
            </div>
          ))}
      </div>

      {currentIndex < variants.length - itemsPerPage && (
        <button
          onClick={handleNext}
          className="absolute right-0 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transform translate-x-1/2"
          aria-label="Next variants"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ProductCarousel;