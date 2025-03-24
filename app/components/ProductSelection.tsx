"use client";
import { useState, useEffect, useRef } from "react";
import SelectionButton from "./SelectionButton";
import { urlFor } from "../../lib/sanityClient";
import { useStateContext } from "../context/stateContext";
import ClientOnly from "./ClientOnly";
import { useRouter } from "next/navigation";

interface ProductSelectionProps {
  selectedColor: string;
  selectedCapacity: string;
  selectedGrade: string;
  setImage: (image: string) => void;
  product: any;
  onVariantChange?: (color: string, grade: string, capacity: string) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  product,
  setImage,
  selectedColor: initialColor,
  selectedCapacity: initialCapacity,
  selectedGrade: initialGrade,
  onVariantChange,
}) => {
  const router = useRouter();
  const { addToCart, cartItems } = useStateContext();
  
  // Use refs to track current external props to compare against internal state
  const externalPropsRef = useRef({
    color: initialColor,
    capacity: initialCapacity,
    grade: initialGrade
  });

  // Use refs for internal state to prevent useEffect trigger
  const internalStateRef = useRef({
    color: initialColor,
    capacity: initialCapacity,
    grade: initialGrade
  });
  
  // Flag to prevent useEffect from running during initialization
  const isInitialMount = useRef(true);
  
  // Flag to identify if we're currently updating from external props
  const updatingFromExternalProps = useRef(false);
  
  // Actual state variables - these drive the UI
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedCapacity, setSelectedCapacity] = useState(initialCapacity);
  const [selectedGrade, setSelectedGrade] = useState(initialGrade);
  
  // State to store the current product image URL
  const [productImage, setProductImage] = useState("");

  // Find the correct variant based on selected properties
  const findMatchingVariant = () => {
    return product.variants.find(
      (v: any) =>
        v.color.toLowerCase() === selectedColor.toLowerCase() &&
        v.capacity == selectedCapacity &&
        v.grade == selectedGrade
    );
  };

  // Initialize the product image on mount
  useEffect(() => {
    const matchingVariant = findMatchingVariant();
    if (matchingVariant) {
      const newImage = urlFor(matchingVariant.image).url();
      setProductImage(newImage);
    } else if (product.variants.length > 0) {
      setProductImage(urlFor(product.variants[0].image).url());
    }
  }, []);

  // This useEffect updates internal state when external props change
  useEffect(() => {
    // Check if external props have changed from what we've seen before
    if (
      initialColor !== externalPropsRef.current.color ||
      initialCapacity !== externalPropsRef.current.capacity ||
      initialGrade !== externalPropsRef.current.grade
    ) {
      // Update our reference to current external props
      externalPropsRef.current = {
        color: initialColor,
        capacity: initialCapacity,
        grade: initialGrade
      };
      
      // Mark that we're updating from external props
      updatingFromExternalProps.current = true;
      
      // Update internal state to match new props
      setSelectedColor(initialColor);
      setSelectedCapacity(initialCapacity);
      setSelectedGrade(initialGrade);
      
      // Update our internal state ref
      internalStateRef.current = {
        color: initialColor,
        capacity: initialCapacity,
        grade: initialGrade
      };
      
      // Find and update the image
      const matchingVariant = product.variants.find(
        (v: any) =>
          v.color.toLowerCase() === initialColor.toLowerCase() &&
          v.capacity == initialCapacity &&
          v.grade == initialGrade
      );
      
      if (matchingVariant) {
        const newImage = urlFor(matchingVariant.image).url();
        setImage(newImage);
        setProductImage(newImage);
      }
      
      // Reset the flag after processing
      updatingFromExternalProps.current = false;
    }
  }, [initialColor, initialCapacity, initialGrade, product.variants, setImage]);

  // This useEffect calls onVariantChange ONLY when internal state changes from user actions
  useEffect(() => {
    // Skip during initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Skip if we're currently updating from external props
    if (updatingFromExternalProps.current) {
      return;
    }

    // Compare current state with our internal state reference
    if (
      selectedColor !== internalStateRef.current.color ||
      selectedCapacity !== internalStateRef.current.capacity ||
      selectedGrade !== internalStateRef.current.grade
    ) {
      // Update our internal state reference
      internalStateRef.current = {
        color: selectedColor,
        capacity: selectedCapacity,
        grade: selectedGrade
      };
      
      // Find and update the product image
      const matchingVariant = findMatchingVariant();
      if (matchingVariant) {
        const newImage = urlFor(matchingVariant.image).url();
        setProductImage(newImage);
      }
      
      // Only call onVariantChange if it's a user-initiated change
      if (onVariantChange) {
        onVariantChange(selectedColor, selectedGrade, selectedCapacity);
      }
    }
  }, [selectedColor, selectedCapacity, selectedGrade, onVariantChange]);

  // Updated to use cached product image
  const price = product.variants
    .filter(
      (variant: any) =>
        selectedColor.toLowerCase() === variant.color.toLowerCase() &&
        selectedCapacity == variant.capacity &&
        selectedGrade == variant.grade
    )
    .map((variant: any) => variant.price)[0];

  const Availquantity = product.variants
    .filter(
      (variant: any) =>
        selectedColor.toLowerCase() === variant.color.toLowerCase() &&
        selectedCapacity == variant.capacity &&
        selectedGrade == variant.grade
    )
    .map((variant: any) => variant.quantity)[0];

  const cartQuantity = cartItems.reduce((quantity: number, item: any) => {
    if (
      item.productId === product._id &&
      item.color.toLowerCase() === selectedColor.toLowerCase() &&
      item.capacity === selectedCapacity &&
      item.grade === selectedGrade
    ) {
      return quantity + item.quantity;
    }
    return quantity;
  }, 0);

  const quantity = Availquantity - cartQuantity;

  // Get all unique colors but also check if they have any variants in stock
  const allColors = [
    ...new Set(
      product.variants
        .map((variant: any) => variant.color.trim().toLowerCase())
        .filter((color: string) => color !== '')
    ),
  ];
  
  // Function to check if a color has any in-stock variants
  const isColorInStock = (color: string) => {
    return product.variants.some((variant: any) => {
      const variantQuantity = variant.quantity || 0;
      const cartItemQuantity = cartItems.reduce((q: number, item: any) => {
        if (
          item.productId === product._id &&
          item.color.toLowerCase() === variant.color.toLowerCase() &&
          item.capacity === variant.capacity &&
          item.grade === variant.grade
        ) {
          return q + item.quantity;
        }
        return q;
      }, 0);
      
      return (
        variant.color.toLowerCase() === color.toLowerCase() && 
        variantQuantity - cartItemQuantity > 0
      );
    });
  };
  
  // Filter colors to identify which are in stock
  const colorAvailability = allColors.reduce((acc: any, color: string) => {
    acc[color] = isColorInStock(color);
    return acc;
  }, {});
  
  // For UI display, keep all colors but mark availability
  const uniqueColors = allColors;

  // Get all unique capacities for the selected color
  const allCapacities = [
    ...new Set(
      product.variants
        .filter((variant: any) => variant.color.toLowerCase() === selectedColor.toLowerCase())
        .map((variant: any) => variant.capacity)
    ),
  ];
  
  // Function to check if a capacity has any in-stock variants for the selected color
  const isCapacityInStock = (capacity: number) => {
    return product.variants.some((variant: any) => {
      const variantQuantity = variant.quantity || 0;
      const cartItemQuantity = cartItems.reduce((q: number, item: any) => {
        if (
          item.productId === product._id &&
          item.color.toLowerCase() === variant.color.toLowerCase() &&
          item.capacity === variant.capacity &&
          item.grade === variant.grade
        ) {
          return q + item.quantity;
        }
        return q;
      }, 0);
      
      return (
        variant.color.toLowerCase() === selectedColor.toLowerCase() &&
        variant.capacity === capacity &&
        variantQuantity - cartItemQuantity > 0
      );
    });
  };
  
  // Filter capacities to identify which are in stock
  const capacityAvailability = allCapacities.reduce((acc: any, capacity: number) => {
    acc[capacity] = isCapacityInStock(capacity);
    return acc;
  }, {});
  
  // For UI display, keep all capacities but mark availability
  const uniqueCapacities = allCapacities;

  // Get all unique grades for the selected color and capacity
  const allGrades = [
    ...new Set(
      product.variants
        .filter(
          (variant: any) =>
            variant.color.toLowerCase() === selectedColor.toLowerCase() &&
            variant.capacity == selectedCapacity
        )
        .map((variant: any) => variant.grade)
    ),
  ];
  
  // Function to check if a grade has any in-stock variants for the selected color and capacity
  const isGradeInStock = (grade: string) => {
    return product.variants.some((variant: any) => {
      const variantQuantity = variant.quantity || 0;
      const cartItemQuantity = cartItems.reduce((q: number, item: any) => {
        if (
          item.productId === product._id &&
          item.color.toLowerCase() === variant.color.toLowerCase() &&
          item.capacity === variant.capacity &&
          item.grade === variant.grade
        ) {
          return q + item.quantity;
        }
        return q;
      }, 0);
      
      return (
        variant.color.toLowerCase() === selectedColor.toLowerCase() &&
        variant.capacity == selectedCapacity &&
        variant.grade === grade &&
        variantQuantity - cartItemQuantity > 0
      );
    });
  };
  
  // Filter grades to identify which are in stock
  const gradeAvailability = allGrades.reduce((acc: any, grade: string) => {
    acc[grade] = isGradeInStock(grade);
    return acc;
  }, {});
  
  // Get all unique grades and their prices
  const uniqueGradesAndPrices = product.variants
    .filter(
      (variant: any) =>
        variant.color.toLowerCase() === selectedColor.toLowerCase() &&
        variant.capacity == selectedCapacity
    )
    .map((variant: any) => [variant.grade, variant.price]);

  const colorChangeHandler = (color: string) => {
    // Don't allow selection of out-of-stock colors
    if (!colorAvailability[color]) {
      return;
    }
    
    setSelectedColor(color);
    
    // Find the first in-stock variant for this color
    const inStockVariants = product.variants.filter(
      (v: any) => {
        const variantQuantity = v.quantity || 0;
        const cartItemQuantity = cartItems.reduce((q: number, item: any) => {
          if (
            item.productId === product._id &&
            item.color.toLowerCase() === v.color.toLowerCase() &&
            item.capacity === v.capacity &&
            item.grade === v.grade
          ) {
            return q + item.quantity;
          }
          return q;
        }, 0);
        
        return (
          v.color.toLowerCase() === color.toLowerCase() && 
          variantQuantity - cartItemQuantity > 0
        );
      }
    );
    
    if (inStockVariants.length > 0) {
      const variant = inStockVariants[0];
      const newImage = urlFor(variant.image).url();
      setImage(newImage);
      setProductImage(newImage);
      setSelectedCapacity(variant.capacity);
      setSelectedGrade(variant.grade);
    } else {
      // Fallback to first variant if no in-stock variants (should not happen due to check above)
      const variant = product.variants.find(
        (v: any) => v.color.toLowerCase() === color.toLowerCase()
      );
      
      if (variant) {
        const newImage = urlFor(variant.image).url();
        setImage(newImage);
        setProductImage(newImage);
        setSelectedCapacity(variant.capacity);
        setSelectedGrade(variant.grade);
      }
    }
  };

  const capacityChangeHandler = (capacity: number) => {
    // Don't allow selection of out-of-stock capacities
    if (!capacityAvailability[capacity]) {
      return;
    }
    
    setSelectedCapacity(capacity);
    
    // Find the first in-stock grade for this color and capacity
    const inStockVariants = product.variants.filter(
      (v: any) => {
        const variantQuantity = v.quantity || 0;
        const cartItemQuantity = cartItems.reduce((q: number, item: any) => {
          if (
            item.productId === product._id &&
            item.color.toLowerCase() === v.color.toLowerCase() &&
            item.capacity === v.capacity &&
            item.grade === v.grade
          ) {
            return q + item.quantity;
          }
          return q;
        }, 0);
        
        return (
          v.color.toLowerCase() === selectedColor.toLowerCase() &&
          v.capacity === capacity &&
          variantQuantity - cartItemQuantity > 0
        );
      }
    );
    
    if (inStockVariants.length > 0) {
      const variant = inStockVariants[0];
      const newImage = urlFor(variant.image).url();
      setImage(newImage);
      setProductImage(newImage);
      setSelectedGrade(variant.grade);
    } else {
      // Fallback to first variant if no in-stock variants (should not happen due to check above)
      const variant = product.variants.find(
        (v: any) => 
          v.color.toLowerCase() === selectedColor.toLowerCase() &&
          v.capacity === capacity
      );
      
      if (variant) {
        const newImage = urlFor(variant.image).url();
        setImage(newImage);
        setProductImage(newImage);
        setSelectedGrade(variant.grade);
      }
    }
  };
  
  const gradeChangeHandler = (grade: string) => {
    // Don't allow selection of out-of-stock grades
    if (!gradeAvailability[grade]) {
      return;
    }
    
    setSelectedGrade(grade);
    
    // Find and set the matching image
    const matchingVariant = product.variants.find(
      (v: any) => 
        v.color.toLowerCase() === selectedColor.toLowerCase() &&
        v.capacity == selectedCapacity &&
        v.grade === grade
    );
    
    if (matchingVariant) {
      const newImage = urlFor(matchingVariant.image).url();
      setImage(newImage);
      setProductImage(newImage);
    }
  };

  // Always use the cached productImage for cart operations
  const buyHandler = () => {
    // Always find the current variant to ensure we have the correct image
    const matchingVariant = findMatchingVariant();
    const currentImage = matchingVariant ? urlFor(matchingVariant.image).url() : productImage;
    
    const item = {
      image: currentImage,
      name: product.name,
      productId: product._id,
      color: selectedColor,
      capacity: selectedCapacity,
      grade: selectedGrade,
      price,
      quantity: 1,
      maxQuantity: Availquantity,
    };

    addToCart(item);
  };

  const buyNowHandler = () => {
    // Always find the current variant to ensure we have the correct image
    const matchingVariant = findMatchingVariant();
    const currentImage = matchingVariant ? urlFor(matchingVariant.image).url() : productImage;
    
    const item = {
      image: currentImage,
      name: product.name,
      productId: product._id,
      color: selectedColor,
      capacity: selectedCapacity,
      grade: selectedGrade,
      price,
      quantity: 1,
      maxQuantity: Availquantity,
    };

    addToCart(item);
    router.push('/cart');
  };

  const getColorCode = (colorName: string) => {
    const normalizedColorName = colorName.toLowerCase();
    
    switch (normalizedColorName) {
      // Apple Colors
      case "noir sidéral":
        return "#1A1A1A";
      case "gris sidéral":
        return "#54585A";
      case "argent":
        return "#C0C0C0";
      case "blanc":
        return "#FFFFFF";
      case "or":
        return "#D4AF37";
      case "or rose":
        return "#B76E79";
      case "bleu alpin":
        return "#8A9DB3";
      case "bleu sierra":
        return "#90A8C0";
      case "bleu pacifique":
        return "#5D768C";
      case "bleu":
        return "#0000FF";
      case "bleu ciel":
        return "#87CEEB";
      case "rouge (product red)":
        return "#A50011";
      case "rouge":
        return "#FF0000";
      case "vert":
        return "#00FF00";
      case "vert minuit":
        return "#4C5B5D";
      case "vert alpin":
        return "#505F4E";
      case "minuit":
        return "#1C1C1E";
      case "lumière stellaire":
        return "#F8F7F2";
      case "mauve":
        return "#800080";
      case "jaune":
        return "#FFFF00";
      case "corail":
        return "#FF7F50";
        
      // Samsung Colors
      case "noir carbone":
        return "#232B2B";
      case "noir fantôme":
        return "#2B2B2B";
      case "noir onyx":
        return "#0F0F0F";
      case "noir":
        return "#000000";
      case "blanc perle":
        return "#F5F5F0";
      case "blanc crème":
        return "#FFF8DC";
      case "gris titane":
        return "#646464";
      case "gris acier":
        return "#71797E";
      case "gris":
        return "#808080";
      case "bleu arctique":
        return "#A5C4D4";
      case "bleu marine":
        return "#000080";
      case "bleu corail":
        return "#5D9CEC";
      case "bleu bora":
        return "#4CA5D8";
      case "bleu lavande":
        return "#CCCCFF";
      case "bleu saphir":
        return "#0F52BA";
      case "vert émeraude":
        return "#50C878";
      case "vert menthe":
        return "#98FFCC";
      case "vert olive":
        return "#808000";
      case "cuivre bronze":
        return "#B87333";
      case "cuivre":
        return "#B87333";
      case "violet":
        return "#8F00FF";
      case "rose":
        return "#FFC0CB";
      case "bourgogne":
        return "#800020";
      case "graphite":
        return "#41424C";
      case "crème":
        return "#FFFDD0";
        
      // Xiaomi/Redmi Colors
      case "blanc lune":
        return "#F4F4F4";
      case "gris graphite":
        return "#3D3D3D";
      case "bleu polaire":
        return "#DEEDF4";
      case "bleu océan":
        return "#006994";
      case "bleu glacier":
        return "#78A8C0";
      case "bleu crépuscule":
        return "#4E598C";
      case "bleu céleste":
        return "#2A52BE";
      case "vert jade":
        return "#00A36C";
      case "rouge flamme":
        return "#E25822";
        
      default:
        return "#CCCCCC"; // Default color for any unmatched colors
    }
  };

  return (
    <ClientOnly>
      <div className="mt-8">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <h1 className="text-gray-500">{product.desc}</h1>
            </div>
            <div className="text-right">
              <div className="flex flex-col lg:flex-row justify-end lg:gap-4">
                <h1 className="text-2xl text-gray-500 line-through">
                  {Math.round((price * 1.2 + Number.EPSILON) * 100) / 100}&euro;
                </h1>
                <h1 className="text-2xl font-bold">
                  {Math.round((price + Number.EPSILON) * 100) / 100}&euro;
                </h1>
              </div>
              {quantity <= 0 ? (
                <h1 className="text-red-500 mt-2">
                  {quantity <= 0 ? "Stock épuisé" : ""}
                </h1>
              ) : (
                <h1 className="mt-2">
                  Quantité maximale disponible : {quantity}
                </h1>
              )}
            </div>
          </div>
          
          {/* Buttons container */}
          <div className="flex flex-col sm:flex-row gap-2 mt-2 lg:w-2/3 lg:self-end">
            <button
              className={`bg-black text-white px-8 py-2 rounded text-xl shadow-xl hover:shadow-2xl flex-1 ${
                quantity <= 0 && "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={buyHandler}
              disabled={quantity <= 0}
            >
              Ajouter au panier
            </button>
            
            <button
              className={`bg-blue-600 text-white px-8 py-2 rounded text-xl shadow-xl hover:shadow-2xl hover:bg-blue-700 flex-1 ${
                quantity <= 0 && "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={buyNowHandler}
              disabled={quantity <= 0}
            >
              Acheter maintenant
            </button>
          </div>
        </div>

        <div>
          <h1 className="lg:text-xl mt-10 mb-2">Condition</h1>
          <div className="flex flex-wrap md:gap-4 gap-2 mb-12">
            {uniqueGradesAndPrices.map((gradeAndPrice: any) => {
              const grade = gradeAndPrice[0];
              const price = gradeAndPrice[1];
              const isInStock = gradeAvailability[grade];
              
              return (
                <SelectionButton
                  key={grade}
                  selected={selectedGrade === grade}
                  disabled={!isInStock}
                >
                  <input
                    type="radio"
                    name="grade"
                    value={grade}
                    checked={selectedGrade === grade}
                    onChange={(e) => gradeChangeHandler(e.target.value)}
                    className="hidden"
                    disabled={!isInStock}
                  />
                  <div className={`flex flex-col items-center ${!isInStock ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    <h1 className="w-full text-lg whitespace-nowrap">
                      {grade}
                    </h1>
                    <h1 className="text-lg whitespace-nowrap">
                      {price} &euro;
                    </h1>
                  </div>
                </SelectionButton>
              );
            })}
          </div>

          {uniqueCapacities.length > 0 && uniqueCapacities[0] !== 0 && (
            <>
              <h1 className="lg:text-xl my-2">Stockage</h1>
              <div className="flex flex-wrap gap-4 mb-12">
                {uniqueCapacities.map((capacity: any) => {
                  const isInStock = capacityAvailability[capacity];
                  
                  return (
                    <SelectionButton
                      key={capacity}
                      selected={selectedCapacity == capacity}
                      disabled={!isInStock}
                    >
                      <input
                        type="radio"
                        name="capacity"
                        value={capacity}
                        checked={selectedCapacity == capacity}
                        onChange={(e) =>
                          capacityChangeHandler(parseInt(e.target.value))
                        }
                        className="hidden"
                        disabled={!isInStock}
                      />
                      <div className={`flex items-center justify-center ${!isInStock ? 'opacity-30 cursor-not-allowed' : ''}`}>
                        <h1 className="text-lg">{capacity} Go</h1>
                      </div>
                    </SelectionButton>
                  );
                })}
              </div>
            </>
          )}

          <h1 className="lg:text-xl my-2">Couleur</h1>
          <div className="flex flex-wrap gap-4">
            {uniqueColors.map((color: any) => {
              const isInStock = colorAvailability[color];
              
              return (
                <SelectionButton
                  key={color}
                  selected={selectedColor.toLowerCase() === color.toLowerCase()}
                  disabled={!isInStock}
                >
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={selectedColor.toLowerCase() === color.toLowerCase()}
                    onChange={(e) => colorChangeHandler(e.target.value)}
                    className="hidden"
                    disabled={!isInStock}
                  />
                  <div className={`flex items-center text-lg min-w-[120px] relative ${!isInStock ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    <div className="absolute left-28 sm:left-6 md:left-4 xl:left-16">
                      <span
                        className={`w-4 h-4 rounded-full inline-block ${
                          color.toLowerCase().startsWith('blanc') ? 'border border-black' : ''
                        }`}
                        style={{ backgroundColor: getColorCode(color) }}
                      ></span>
                    </div>
                    <span className="ml-36 sm:ml-12 md:ml-10 xl:ml-24">
                      {String(color).charAt(0).toUpperCase() +
                        String(color).split(' ')[0].slice(1)}
                    </span>
                  </div>
                </SelectionButton>
              );
            })}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
};

export default ProductSelection;