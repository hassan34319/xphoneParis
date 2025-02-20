"use client";
import { useState, useEffect, useRef } from "react";
import SelectionButton from "./SelectionButton";
import { urlFor } from "../../lib/sanityClient";
import { useStateContext } from "../context/stateContext";
import ClientOnly from "./ClientOnly";
import Image from "next/image";

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
  const { addToCart, cartItems } = useStateContext();
  const [productImage, setProductImage] = useState(
    urlFor(product.variants[0].image).url()
  );
  
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
      
      // Only call onVariantChange if it's a user-initiated change
      if (onVariantChange) {
        onVariantChange(selectedColor, selectedGrade, selectedCapacity);
      }
    }
  }, [selectedColor, selectedCapacity, selectedGrade, onVariantChange]);

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

  const uniqueColors = [
    ...new Set(
      product.variants
        .map((variant: any) => variant.color.trim().toLowerCase())
        .filter((color: string) => color !== '')
    ),
  ];

  const uniqueCapacities = [
    ...new Set(
      product.variants
        .filter((variant: any) => variant.color.toLowerCase() === selectedColor.toLowerCase())
        .map((variant: any) => variant.capacity)
    ),
  ];

  const uniqueGradesAndPrices = [
    ...new Set(
      product.variants
        .filter(
          (variant: any) =>
            variant.color.toLowerCase() === selectedColor.toLowerCase() &&
            variant.capacity == selectedCapacity
        )
        .map((variant: any) => [variant.grade, variant.price])
    ),
  ];

  const colorChangeHandler = (color: string) => {
    setSelectedColor(color);
    const variant = product.variants.find(
      (v: any) => v.color.toLowerCase() === color.toLowerCase()
    );
    
    if (variant) {
      setImage(urlFor(variant.image).url());
      setProductImage(urlFor(variant.image).url());

      // Find the first matching capacity for this color
      const firstCapacity = product.variants
        .filter((v: any) => v.color.toLowerCase() === color.toLowerCase())
        .map((v: any) => v.capacity)[0];
      setSelectedCapacity(firstCapacity);

      // Find the first matching grade for this color and capacity
      const firstGrade = product.variants
        .filter(
          (v: any) =>
            v.color.toLowerCase() === color.toLowerCase() &&
            v.capacity === firstCapacity
        )
        .map((v: any) => v.grade)[0];
      setSelectedGrade(firstGrade);
    }
  };

  const capacityChangeHandler = (capacity: number) => {
    setSelectedCapacity(capacity);
    
    // Find the first matching grade for this color and capacity
    const firstGrade = product.variants
      .filter(
        (variant: any) =>
          variant.color.toLowerCase() === selectedColor.toLowerCase() &&
          variant.capacity === capacity
      )
      .map((variant: any) => variant.grade)[0];
    setSelectedGrade(firstGrade);
    
    // Find and set the matching image
    const matchingVariant = product.variants.find(
      (v: any) => 
        v.color.toLowerCase() === selectedColor.toLowerCase() &&
        v.capacity === capacity &&
        v.grade === firstGrade
    );
    
    if (matchingVariant) {
      const newImage = urlFor(matchingVariant.image).url();
      setImage(newImage);
      setProductImage(newImage);
    }
  };
  
  const gradeChangeHandler = (grade: string) => {
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

  const buyHandler = () => {
    const item = {
      image: productImage,
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

  const getColorCode = (colorName: string) => {
    const extractedColor = colorName.toLowerCase().split(" ")[0];
    switch (extractedColor) {
      case "argent":
        return "#C0C0C0";
      case "blanc":
        return "#EBE8E2";
      case "bleu":
        return "#0000FF";
      case "gris":
        return "#808080";
      case "jaune":
        return "#FFFF00";
      case "marron":
        return "#800000";
      case "noir":
        return "#000000";
      case "orange":
        return "#FFA500";
      case "rose":
        return "#FFC0CB";
      case "rouge":
        return "#FF0000";
      case "vert":
        return "#00FF00";
      case "or":
        return "#D4AF37";
      case "graphite":
        return "#41424C";
      default:
        return extractedColor;
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
          <button
            className={`mt-2 bg-black text-white px-8 py-2 rounded text-xl shadow-xl hover:shadow-2xl lg:w-1/3 lg:self-end ${
              quantity <= 0 && "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={buyHandler}
            disabled={quantity <= 0}
          >
            Ajouter au panier
          </button>
        </div>

        <div>
          <h1 className="lg:text-xl mt-10 mb-2">Condition</h1>
          <div className="flex flex-wrap md:gap-4 gap-2 mb-12">
            {uniqueGradesAndPrices.map((gradeAndPrice: any) => (
              <SelectionButton
                key={gradeAndPrice[0]}
                selected={selectedGrade == gradeAndPrice[0]}
              >
                <input
                  type="radio"
                  name="grade"
                  value={gradeAndPrice[0]}
                  checked={selectedGrade == gradeAndPrice[0]}
                  onChange={(e) => gradeChangeHandler(e.target.value)}
                  className="hidden"
                />
                <h1 className="w-full text-lg whitespace-nowrap">
                  {gradeAndPrice[0]}
                </h1>
                <h1 className="text-lg whitespace-nowrap">
                  {gradeAndPrice[1]} &euro;
                </h1>
              </SelectionButton>
            ))}
          </div>

          {uniqueCapacities.length > 0 && uniqueCapacities[0] !== 0 && (
            <>
              <h1 className="lg:text-xl my-2">Stockage</h1>
              <div className="flex flex-wrap gap-4 mb-12">
                {uniqueCapacities.map((capacity: any) => (
                  <SelectionButton
                    key={capacity}
                    selected={selectedCapacity == capacity}
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
                    />
                    <h1 className="text-lg">{capacity} Go</h1>
                  </SelectionButton>
                ))}
              </div>
            </>
          )}

<h1 className="lg:text-xl my-2">Couleur</h1>
<div className="flex flex-wrap gap-4">
  {uniqueColors.map((color: any) => (
    <SelectionButton
      key={color}
      selected={selectedColor.toLowerCase() === color.toLowerCase()}
    >
      <input
        type="radio"
        name="color"
        value={color}
        checked={selectedColor.toLowerCase() === color.toLowerCase()}
        onChange={(e) => colorChangeHandler(e.target.value)}
        className="hidden"
      />
      <div className="flex items-center text-lg min-w-[120px] relative">
        <div className="absolute left-20 sm:left-6 md:left-4 xl:left-16">
          <span
            className={`w-4 h-4 rounded-full inline-block ${
              color.toLowerCase().startsWith('blanc') ? 'border border-black' : ''
            }`}
            style={{ backgroundColor: getColorCode(color) }}
          ></span>
        </div>
        <span className="ml-28 sm:ml-12 md:ml-10 xl:ml-24">
          {String(color).charAt(0).toUpperCase() +
            String(color).split(" ")[0].slice(1)}
        </span>
      </div>
    </SelectionButton>
  ))}
</div>
        </div>
      </div>
    </ClientOnly>
  );
};

export default ProductSelection;