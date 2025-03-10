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
  
  // Process images on mount and when variants change
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
  }, [variants]);

  // Handle selection changes separately to avoid cascading effects
  useEffect(() => {
    // Only scroll to selected variant if the selection has actually changed
    if (
      selectedColor !== prevSelectionRef.current.color ||
      selectedGrade !== prevSelectionRef.current.grade ||
      selectedCapacity !== prevSelectionRef.current.capacity
    ) {
      // Find the main image for the selected variant
      const selectedImageIndex = allImages.findIndex(img =>
        img.variant.color.toLowerCase() === selectedColor.toLowerCase() &&
        img.variant.grade === selectedGrade &&
        img.variant.capacity == selectedCapacity &&
        img.isMain
      );
      
      if (selectedImageIndex !== -1) {
        // Calculate the page to show the selected image
        const targetIndex = Math.max(0, Math.min(selectedImageIndex, allImages.length - itemsPerPage));
        setCurrentIndex(targetIndex);
      }
      
      prevSelectionRef.current = { color: selectedColor, grade: selectedGrade, capacity: selectedCapacity };
    }
  }, [selectedColor, selectedGrade, selectedCapacity, allImages]);

  const handleNext = () => {
    const newIndex = Math.min(currentIndex + 1, allImages.length - itemsPerPage);
    setCurrentIndex(newIndex);
    
    // Update main image to the leftmost visible image in the carousel
    if (allImages.length > 0 && newIndex < allImages.length) {
      const leftmostImage = allImages[newIndex];
      const imageUrl = urlFor(leftmostImage.image).url();
      handleVariantClick(imageUrl);
      
      // Only update variant selection if different from current selection
      if (!isVariantSelected(leftmostImage)) {
        onVariantSelect(
          leftmostImage.variant.color,
          leftmostImage.variant.grade,
          leftmostImage.variant.capacity
        );
      }
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    
    // Update main image to the leftmost visible image in the carousel
    if (allImages.length > 0 && newIndex < allImages.length) {
      const leftmostImage = allImages[newIndex];
      const imageUrl = urlFor(leftmostImage.image).url();
      handleVariantClick(imageUrl);
      
      // Only update variant selection if different from current selection
      if (!isVariantSelected(leftmostImage)) {
        onVariantSelect(
          leftmostImage.variant.color,
          leftmostImage.variant.grade,
          leftmostImage.variant.capacity
        );
      }
    }
  };

  const handleImageClick = (imageData: any) => {
    const imageUrl = urlFor(imageData.image).url();
    
    // First, update the image display
    handleVariantClick(imageUrl);
    
    // Then, conditionally update variant selection to avoid double state updates
    const isAlreadySelected = 
      imageData.variant.color.toLowerCase() === selectedColor.toLowerCase() &&
      imageData.variant.grade === selectedGrade &&
      imageData.variant.capacity == selectedCapacity;
      
    if (!isAlreadySelected) {
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
        {allImages.length > 0 && allImages
          .slice(currentIndex, currentIndex + itemsPerPage)
          .map((imageData) => (
            <div
              key={imageData._key}
              onClick={() => handleImageClick(imageData)}
              className={`relative w-16 h-16 border-2 rounded-lg cursor-pointer transition-all ${
                isVariantSelected(imageData)
                  ? isCurrentImage(imageData)
                    ? 'border-blue-500 shadow-lg ring-2 ring-blue-300'
                    : 'border-gray-300 shadow-md'
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
      
      {allImages.length > 0 && currentIndex < allImages.length - itemsPerPage && (
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