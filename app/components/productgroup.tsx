'use client'
import { product } from "../utils/types";
import { urlFor } from "../../lib/sanityClient";
import { useRouter } from "next/navigation";

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
    });
  });
  
  if (variants.length === 0) {
    return null;
  }
  
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
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={handleCardClick}
            >
              {/* Product image */}
              <div className="flex justify-center mb-4">
                <img 
                  src={imageUrl} 
                  alt={variantTitle}
                  className="object-contain h-40"
                />
              </div>
              
              {/* Product details */}
              <div>
                <h3 className="font-bold text-lg line-clamp-2">{baseProductName}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {variantColor && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {variantColor}
                    </span>
                  )}
                  {variantCapacity && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {variantCapacity}
                    </span>
                  )}
                  {variantGrade && (
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {variantGrade}
                    </span>
                  )}
                </div>
                <div className="flex flex-row gap-2 items-center mt-3">
                  <span className="font-semibold text-gray-400 line-through">
                    {Math.round((variant.price * 1.2 + Number.EPSILON) * 100) / 100}€
                  </span>
                  <span className="font-semibold text-xl">
                    {Math.round((variant.price + Number.EPSILON) * 100) / 100}€
                  </span>
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