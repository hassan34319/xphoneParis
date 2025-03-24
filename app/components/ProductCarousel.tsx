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
  const initialSyncDoneRef = useRef(false);
  const isProgrammaticUpdateRef = useRef(false);
  
  // Process images on mount and when variants change
  useEffect(() => {
    // Only process in-stock variants
    const processedImages = variants.reduce((acc: any[], variant) => {
      // Skip variants that are explicitly marked as not in stock
      if (variant.inStock === false) {
        return acc;
      }
      
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

  // Initial sync with URL params - only run once
  useEffect(() => {
    if (allImages.length > 0 && !initialSyncDoneRef.current) {
      // Find the main image for the selected variant
      const selectedImageIndex = allImages.findIndex(img =>
        img.variant.color?.toLowerCase() === selectedColor?.toLowerCase() &&
        String(img.variant.grade || '') === String(selectedGrade || '') &&
        String(img.variant.capacity || '') === String(selectedCapacity || '') &&
        img.isMain
      );
      
      if (selectedImageIndex !== -1) {
        // Calculate the page to show the selected image
        const targetIndex = Math.max(0, Math.min(selectedImageIndex, allImages.length - itemsPerPage));
        setCurrentIndex(targetIndex);
        initialSyncDoneRef.current = true;
      }
    }
  }, [allImages, selectedColor, selectedGrade, selectedCapacity, itemsPerPage]);

  // Handle selection changes - only run when selection actually changes and not from arrow navigation
  useEffect(() => {
    // Skip if this is from arrow navigation
    if (isProgrammaticUpdateRef.current) {
      isProgrammaticUpdateRef.current = false;
      return;
    }
    
    // Only scroll to selected variant if the selection has actually changed
    if (
      selectedColor !== prevSelectionRef.current.color ||
      selectedGrade !== prevSelectionRef.current.grade ||
      selectedCapacity !== prevSelectionRef.current.capacity
    ) {
      // Find the main image for the selected variant
      const selectedImageIndex = allImages.findIndex(img =>
        img.variant.color?.toLowerCase() === selectedColor?.toLowerCase() &&
        String(img.variant.grade || '') === String(selectedGrade || '') &&
        String(img.variant.capacity || '') === String(selectedCapacity || '') &&
        img.isMain
      );
      
      if (selectedImageIndex !== -1) {
        // Calculate the page to show the selected image
        const targetIndex = Math.max(0, Math.min(selectedImageIndex, allImages.length - itemsPerPage));
        setCurrentIndex(targetIndex);
      }
      
      prevSelectionRef.current = { color: selectedColor, grade: selectedGrade, capacity: selectedCapacity };
    }
  }, [selectedColor, selectedGrade, selectedCapacity, allImages, itemsPerPage]);

  const handleNext = () => {
    if (currentIndex < allImages.length - itemsPerPage) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      
      // Update the main image to show the first image in the new set
      if (allImages.length > 0 && newIndex < allImages.length) {
        const nextImage = allImages[newIndex];
        const imageUrl = urlFor(nextImage.image).url();
        handleVariantClick(imageUrl);
        
        // Only update variant selection if needed
        if (
          nextImage.variant.color?.toLowerCase() !== selectedColor?.toLowerCase() ||
          String(nextImage.variant.grade || '') !== String(selectedGrade || '') ||
          String(nextImage.variant.capacity || '') !== String(selectedCapacity || '')
        ) {
          // Mark this update as programmatic to skip the effect
          isProgrammaticUpdateRef.current = true;
          onVariantSelect(
            nextImage.variant.color,
            nextImage.variant.grade,
            nextImage.variant.capacity
          );
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      
      // Update the main image to show the last image in the previous set
      if (allImages.length > 0) {
        const prevImage = allImages[newIndex];
        const imageUrl = urlFor(prevImage.image).url();
        handleVariantClick(imageUrl);
        
        // Only update variant selection if needed
        if (
          prevImage.variant.color?.toLowerCase() !== selectedColor?.toLowerCase() ||
          String(prevImage.variant.grade || '') !== String(selectedGrade || '') ||
          String(prevImage.variant.capacity || '') !== String(selectedCapacity || '')
        ) {
          // Mark this update as programmatic to skip the effect
          isProgrammaticUpdateRef.current = true;
          onVariantSelect(
            prevImage.variant.color,
            prevImage.variant.grade,
            prevImage.variant.capacity
          );
        }
      }
    }
  };

  const handleImageClick = (imageData: any) => {
    const imageUrl = urlFor(imageData.image).url();
    
    // First, update the image display
    handleVariantClick(imageUrl);
    
    // Then, conditionally update variant selection to avoid double state updates
    const isAlreadySelected = 
      imageData.variant.color?.toLowerCase() === selectedColor?.toLowerCase() &&
      String(imageData.variant.grade || '') === String(selectedGrade || '') &&
      String(imageData.variant.capacity || '') === String(selectedCapacity || '');
      
    if (!isAlreadySelected) {
      // Mark this update as programmatic to skip the effect
      isProgrammaticUpdateRef.current = true;
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
      variant.color?.toLowerCase() === selectedColor?.toLowerCase() &&
      String(variant.grade || '') === String(selectedGrade || '') &&
      String(variant.capacity || '') === String(selectedCapacity || '')
    );
  };

  const isCurrentImage = (imageData: any) => {
    return urlFor(imageData.image).url() === currentImage;
  };

  // Determine if there are previous or next items to show
  const hasPrevious = currentIndex > 0;
  const hasNext = allImages.length > 0 && currentIndex < allImages.length - itemsPerPage;

  return (
    <div className="relative flex items-center gap-2 mt-4 ml-2">
      {hasPrevious && (
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
      
      {hasNext && (
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