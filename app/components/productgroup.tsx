'use client'
import { product } from "../utils/types";
import { urlFor } from "../../lib/sanityClient";
import { useRouter } from "next/navigation";

// Star Rating component matching the one from ProductCard
const StarRating = ({ rating = 0, totalStars = 5 }) => {
  return (
    <div className="flex items-center mt-1 mb-1">
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

interface ProductVariantGroupProps {
  baseProductName: string;
  products: product[];
}

const ProductVariantGroup: React.FC<ProductVariantGroupProps> = ({ 
  baseProductName, 
  products 
}) => {
  const router = useRouter();
  
  // Extract all variants from all products
  const variants: {
    productId: string;
    image: any;
    color?: string;
    capacity?: string;
    grade?: string;
    price: number;
  }[] = [];
  
  // Group variants by color and capacity to find lowest price
  const lowestPricesByColorCapacity: {[key: string]: number} = {};
  
  // Process each product
  products.forEach(product => {
    // Process each variant in the product
    product.variants.forEach(variant => {
      // Skip variants that are not in stock
      if (!variant.quantity || variant.quantity <= 0) {
        return;
      }
      
      // Add variant to the array
      variants.push({
        productId: product._id,
        image: variant.image,
        color: variant.color,
        capacity: variant.capacity,
        grade: variant.grade,
        price: variant.price
      });
      
      // Track the lowest price for each color+capacity combination
      if (variant.color && variant.capacity) {
        const key = `${variant.color}-${variant.capacity}`;
        
        if (!lowestPricesByColorCapacity[key] || variant.price < lowestPricesByColorCapacity[key]) {
          lowestPricesByColorCapacity[key] = variant.price;
        }
      }
    });
  });
  
  if (variants.length === 0) {
    return null;
  }
  
  // Find the overall lowest price for this base product
  const overallLowestPrice = Math.min(...Object.values(lowestPricesByColorCapacity));
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{baseProductName}</h2>
      
      {/* Grid of all variant cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {variants.map((variant, index) => {
          // Get variant details
          const variantColor = variant.color ? `${variant.color}` : '';
          const variantCapacity = variant.capacity ? `${variant.capacity}GB` : '';
          const variantGrade = variant.grade ? `Grade ${variant.grade}` : '';
          
          // Get the lowest price for this color+capacity
          let lowestPrice = variant.price;
          if (variant.color && variant.capacity) {
            const key = `${variant.color}-${variant.capacity}`;
            lowestPrice = lowestPricesByColorCapacity[key];
          }
          
          // Get image
          const imageUrl = variant.image 
            ? urlFor(variant.image).url() 
            : '';
          
          // Construct variant title
          let variantTitle = baseProductName;
          if (variantColor || variantCapacity || variantGrade) {
            variantTitle += ' - ';
            
            const parts = [];
            if (variantColor) parts.push(variantColor);
            if (variantCapacity) parts.push(variantCapacity);
            if (variantGrade) parts.push(variantGrade);
            
            variantTitle += parts.join(' - ');
          }
          
          // Build the URL with query parameters for color and capacity
          const handleCardClick = () => {
            const queryParams = new URLSearchParams();
            
            if (variant.color) {
              queryParams.append('color', variant.color.toLowerCase());
            }
            
            if (variant.capacity) {
              queryParams.append('capacity', variant.capacity.toString());
            }
            
            const queryString = queryParams.toString();
            const url = `/products/${variant.productId}${queryString ? `?${queryString}` : ''}`;
            
            router.push(url);
          };
          
          return (
            <div 
              key={`variant-${index}`}
              className="bg-white rounded-xl p-2 flex flex-col cursor-pointer shadow-lg w-80 h-[26rem] hover:shadow-xl transition-shadow duration-300"
              onClick={handleCardClick}
            >
              {/* Image container with fixed height */}
              <div className="h-48 flex items-center justify-center overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={variantTitle}
                  className="object-contain h-full w-auto max-w-full"
                />
              </div>
              
              {/* Product details - using a flex layout with flex-grow */}
              <div className="flex flex-col px-2 flex-grow">
                {/* Use a flex container with flex-grow for the name and variant details */}
                <div className="flex-grow">
                  <h1 className="text-lg font-semibold line-clamp-2 mt-2">
                    {baseProductName}
                  </h1>
                  
                  {/* Display variant info as "brand" */}
                  <h2 className="text-base text-gray-600">
                    {[variantColor, variantCapacity].filter(Boolean).join(' - ')}
                  </h2>
                </div>
                
                {/* Price and rating section will always be at the bottom */}
                <div className="mt-auto mb-2">
                  <div className="mt-1">
                    <p className="text-gray-600 text-sm">À partir de:</p>
                    <div className="flex flex-row gap-2 items-center">
                      <span className="font-semibold text-lg text-gray-400 line-through">
                        {Math.round((overallLowestPrice * 1.2 + Number.EPSILON) * 100) / 100}
                        &euro;
                      </span>
                      <span className="font-semibold text-xl">
                        {Math.round((overallLowestPrice + Number.EPSILON) * 100) / 100}
                        &euro;
                      </span>
                    </div>
                  </div>
                  
                  <StarRating rating={5} totalStars={5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductVariantGroup;