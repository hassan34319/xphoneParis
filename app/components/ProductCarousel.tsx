import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { urlFor } from "../../lib/sanityClient";

interface ProductCarouselProps {
  variants: any[];
  handleVariantClick: (image: string) => void;
  currentImage: string;
  onVariantSelect: (color: string, grade: string, capacity: string) => void;
  selectedColor: string;
  selectedGrade: string;
  selectedCapacity: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  variants,
  handleVariantClick,
  currentImage,
  onVariantSelect,
  selectedColor,
  selectedGrade,
  selectedCapacity
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allImages, setAllImages] = useState<any[]>([]);
  const itemsPerPage = 3;
  const prevSelectionRef = useRef({ color: selectedColor, grade: selectedGrade, capacity: selectedCapacity });

  useEffect(() => {
    const processedImages = variants.reduce((acc: any[], variant) => {
      // Add main image
      acc.push({
        image: variant.image,
        variant,
        _key: `main-${variant.color}-${variant.grade}-${variant.capacity}`,
        isMain: true
      });
      
      // Add additional images if they exist
      if (variant.additionalImages && Array.isArray(variant.additionalImages)) {
        variant.additionalImages.forEach((addImage: any, idx: number) => {
          acc.push({
            image: addImage,
            variant,
            _key: `additional-${variant.color}-${variant.grade}-${variant.capacity}-${idx}`,
            isMain: false
          });
        });
      }
      
      return acc;
    }, []);
    
    setAllImages(processedImages);
    
    // Find and scroll to the selected variant's image ONLY if the selection has changed
    if (
      selectedColor !== prevSelectionRef.current.color ||
      selectedGrade !== prevSelectionRef.current.grade ||
      selectedCapacity !== prevSelectionRef.current.capacity
    ) {
      const selectedImageIndex = processedImages.findIndex(img =>
        img.variant.color.toLowerCase() === selectedColor.toLowerCase() &&
        img.variant.grade === selectedGrade &&
        img.variant.capacity == selectedCapacity
      );
      
      if (selectedImageIndex !== -1) {
        // Calculate the right page to show to make the selected image visible
        const targetIndex = Math.max(0, Math.min(selectedImageIndex, processedImages.length - itemsPerPage));
        setCurrentIndex(targetIndex);
      }
      
      // Update the ref with the current selection
      prevSelectionRef.current = { color: selectedColor, grade: selectedGrade, capacity: selectedCapacity };
    }
  }, [variants, selectedColor, selectedGrade, selectedCapacity]);

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, allImages.length - itemsPerPage));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleImageClick = (imageData: any) => {
    // Prevent calling onVariantSelect if the selection hasn't actually changed
    if (
      imageData.variant.color.toLowerCase() !== selectedColor.toLowerCase() ||
      imageData.variant.grade !== selectedGrade ||
      imageData.variant.capacity != selectedCapacity
    ) {
      const variantImage = urlFor(imageData.image).url();
      handleVariantClick(variantImage);
      onVariantSelect(
        imageData.variant.color,
        imageData.variant.grade,
        imageData.variant.capacity
      );
    }
  };

  const isVariantSelected = (imageData: any) => {
    const variant = imageData.variant;
    return (
      variant.color.toLowerCase() === selectedColor.toLowerCase() &&
      variant.grade === selectedGrade &&
      variant.capacity == selectedCapacity
    );
  };

  const isCurrentImage = (imageData: any) => {
    return urlFor(imageData.image).url() === currentImage;
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
              onClick={() => handleImageClick(imageData)}
              className={`relative w-16 h-16 border-2 rounded-lg cursor-pointer transition-all ${
                isVariantSelected(imageData)
                  ? isCurrentImage(imageData)
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-300'
                    : 'border-blue-300 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'
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