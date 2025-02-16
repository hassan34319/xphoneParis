import { useState, useEffect } from "react";
import Image from "next/image";
import { urlFor } from "../../lib/sanityClient";

const ProductCarousel = ({
  variants,
  handleVariantClick,
  currentImage,
  onVariantSelect,
  product,
  selectedColor,
  selectedGrade,
  selectedCapacity
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allImages, setAllImages] = useState([]);
  const itemsPerPage = 3;

  useEffect(() => {
    const processedImages = variants.reduce((acc, variant) => {
      acc.push({
        image: variant.image,
        variant,
        _key: `main-${variant.color}-${variant.grade}-${variant.capacity}`
      });

      if (variant.additionalImages && Array.isArray(variant.additionalImages)) {
        variant.additionalImages.forEach((addImage, idx) => {
          acc.push({
            image: addImage,
            variant,
            _key: `additional-${variant.color}-${variant.grade}-${variant.capacity}-${idx}`
          });
        });
      }

      return acc;
    }, []);

    setAllImages(processedImages);
  }, [variants]);

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, allImages.length - itemsPerPage));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleImageSelection = (imageData) => {
    const variantImage = urlFor(imageData.image).url();
    handleVariantClick(variantImage);
    onVariantSelect(
      imageData.variant.color,
      imageData.variant.grade,
      imageData.variant.capacity
    );
  };

  const isVariantSelected = (variant) => {
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
          className="absolute left-2 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transform -translate-x-1/2"
          aria-label="Previous images"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className="flex gap-2 transition-transform duration-300 mx-6">
        {allImages
          .slice(currentIndex, currentIndex + itemsPerPage)
          .map((imageData) => (
            <div
              key={imageData._key}
              onClick={() => handleImageSelection(imageData)}
              className={`relative w-16 h-16 border-2 rounded-lg cursor-pointer transition-all ${
                isVariantSelected(imageData.variant)
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <Image
                src={urlFor(imageData.image).url()}
                alt={`${imageData.variant.color} ${imageData.variant.capacity}GB ${imageData.variant.grade}`}
                fill
                className="object-contain p-1"
              />
            </div>
          ))}
      </div>

      {currentIndex < allImages.length - itemsPerPage && (
        <button
          onClick={handleNext}
          className="absolute right-2 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transform translate-x-1/2"
          aria-label="Next images"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ProductCarousel;