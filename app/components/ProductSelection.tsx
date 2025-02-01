"use client";
import { useState, useEffect } from "react";
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
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  product,
  setImage,
  selectedColor: initialColor,
  selectedCapacity: initialCapacity,
  selectedGrade: initialGrade,
}) => {
  const { addToCart, cartItems } = useStateContext();
  const [productImage, setProductImage] = useState(
    urlFor(product.variants[0].image).url()
  );
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedCapacity, setSelectedCapacity] = useState(initialCapacity);
  const [selectedGrade, setSelectedGrade] = useState(initialGrade);

  useEffect(() => {
    setSelectedColor(initialColor);
    setSelectedCapacity(initialCapacity);
    setSelectedGrade(initialGrade);
  }, [initialColor, initialCapacity, initialGrade]);

  const price = product.variants
    .filter(
      (variant: any) =>
        selectedColor == variant.color &&
        selectedCapacity == variant.capacity &&
        selectedGrade == variant.grade
    )
    .map((variant: any) => variant.price)[0];

  const Availquantity = product.variants
    .filter(
      (variant: any) =>
        selectedColor == variant.color &&
        selectedCapacity == variant.capacity &&
        selectedGrade == variant.grade
    )
    .map((variant: any) => variant.quantity)[0];

  const cartQuantity = cartItems.reduce((quantity: number, item: any) => {
    if (
      item.productId === product._id &&
      item.color === selectedColor &&
      item.capacity === selectedCapacity &&
      item.grade === selectedGrade
    ) {
      return quantity + item.quantity;
    }
    return quantity;
  }, 0);

  const quantity = Availquantity - cartQuantity;

  const uniqueColors = [
    ...new Set(product.variants.map((variant: any) => variant.color)),
  ];

  const uniqueCapacities = [
    ...new Set(
      product.variants
        .filter((variant: any) => variant.color == selectedColor)
        .map((variant: any) => variant.capacity)
    ),
  ];

  const uniqueGradesAndPrices = [
    ...new Set(
      product.variants
        .filter(
          (variant: any) =>
            variant.color == selectedColor &&
            variant.capacity == selectedCapacity
        )
        .map((variant: any) => [variant.grade, variant.price])
    ),
  ];

  const colorChangeHandler = (color: string) => {
    setSelectedColor(color);
    setImage(
      urlFor(
        product.variants
          .filter((variant: any) => color == variant.color)
          .map((variant: any) => variant.image)[0]
      ).url()
    );
    setProductImage(
      urlFor(
        product.variants
          .filter((variant: any) => color == variant.color)
          .map((variant: any) => variant.image)[0]
      ).url()
    );

    setSelectedCapacity(
      product.variants
        .filter((variant: any) => variant.color == color)
        .map((variant: any) => variant.capacity)[0]
    );

    setSelectedGrade(
      product.variants
        .filter(
          (variant: any) =>
            variant.color == color &&
            variant.capacity ==
              product.variants
                .filter((variant: any) => variant.color == color)
                .map((variant: any) => variant.capacity)[0]
        )
        .map((variant: any) => variant.grade)[0]
    );
  };

  const capacityChangeHandler = (capacity: number) => {
    setSelectedCapacity(capacity);
    setSelectedGrade(
      product.variants
        .filter(
          (variant: any) =>
            variant.color == selectedColor && variant.capacity == capacity
        )
        .map((variant: any) => variant.grade)[0]
    );
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
        return "#FFFFFF";
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
                <h1 className=" mt-2">
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
            {uniqueGradesAndPrices.map((gradeAndPrice: any) => {
              return (
                <SelectionButton
                  key={gradeAndPrice[0]}
                  selected={selectedGrade == gradeAndPrice[0]}
                >
                  <input
                    type="radio"
                    name="grade"
                    value={gradeAndPrice[0]}
                    checked={selectedGrade == gradeAndPrice[0]}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="hidden"
                  />
                  <h1 className="w-full text-lg whitespace-nowrap">
                    {gradeAndPrice[0]}
                  </h1>
                  <h1 className="text-lg whitespace-nowrap">
                    {gradeAndPrice[1]} &euro;
                  </h1>
                </SelectionButton>
              );
            })}
          </div>

          {uniqueCapacities.length > 0 && uniqueCapacities[0] !== 0 && (
  <>
    <h1 className="lg:text-xl my-2">Stockage</h1>
    <div className="flex flex-wrap gap-4 mb-12">
      {uniqueCapacities.map((capacity: any) => (
        <SelectionButton key={capacity} selected={selectedCapacity == capacity}>
          <input
            type="radio"
            name="capacity"
            value={capacity}
            checked={selectedCapacity == capacity}
            onChange={(e) => capacityChangeHandler(parseInt(e.target.value))}
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
            {uniqueColors.map((color: any) => {
              return (
                <SelectionButton key={color} selected={selectedColor == color}>
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={selectedColor == color}
                    onChange={(e) => colorChangeHandler(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center text-lg">
                    <span
                      className="w-4 h-4 rounded-full inline-block mr-2"
                      style={{ backgroundColor: getColorCode(color) }}
                    ></span>
                    {String(color).charAt(0).toUpperCase() +
                      String(color).split(" ")[0].slice(1)}
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