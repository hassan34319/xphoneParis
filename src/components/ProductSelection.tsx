import { useState } from "react";
import SelectionButton from "./SelectionButton";
import { urlFor } from "../../lib/sanityClient";
import { useStateContext } from "../../context/stateContext";

interface ProductSelectionProps {
  product: any;
  setImage: (image: string) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  product,
  setImage,
}) => {
  const { addToCart } = useStateContext();
  const [productImage, setProductImage] = useState(
    urlFor(product.variants[0].image).url()
  );
  const [selectedColor, setSelectedColor] = useState(product.variants[0].color);
  const [selectedCapacity, setSelectedCapacity] = useState(
    product.variants[0].capacity
  );
  const [selectedGrade, setSelectedGrade] = useState(product.variants[0].grade);

  const price = product.variants
    .filter(
      (variant: any) =>
        selectedColor == variant.color &&
        selectedCapacity == variant.capacity &&
        selectedGrade == variant.grade
    )
    .map((variant: any) => variant.price)[0];

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
    };

    addToCart(item);
  };

  return (
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
                {price * 1.2}&euro;
              </h1>
              <h1 className="text-2xl font-bold">{price}&euro;</h1>
            </div>
          </div>
        </div>
        <button
          className="mt-2 bg-black text-white px-8 py-2 rounded text-xl shadow-xl hover:shadow-2xl lg:w-1/3 lg:self-end"
          onClick={buyHandler}
        >
          Ajouter au panier
        </button>
      </div>

      <div>
        <h1 className="lg:text-xl mt-10 mb-2">Condition</h1>
        <div className="flex flex-row gap-4 mb-12">
          {uniqueGradesAndPrices.map((gradeAndPrice: any) => {
            return (
              <SelectionButton
                key={gradeAndPrice[0]}
                selected={selectedGrade == gradeAndPrice[0]}
              >
                <input
                  type={"radio"}
                  name="grade"
                  value={gradeAndPrice[0]}
                  checked={selectedGrade == gradeAndPrice[0]}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="hidden"
                />
                <h1>{gradeAndPrice[0]}</h1>
                <h1 className="mt-auto">{gradeAndPrice[1]} &euro;</h1>
              </SelectionButton>
            );
          })}
        </div>

        <h1 className="lg:text-xl my-2">Stockage</h1>
        <div className="flex flex-row gap-4 mb-12">
          {uniqueCapacities.map((capacity: any) => {
            return (
              <SelectionButton
                key={capacity}
                selected={selectedCapacity == capacity}
              >
                <input
                  type={"radio"}
                  name="capacity"
                  value={capacity}
                  checked={selectedCapacity == capacity}
                  onChange={(e) =>
                    capacityChangeHandler(parseInt(e.target.value))
                  }
                  className="hidden"
                />
                {capacity} Go
              </SelectionButton>
            );
          })}
        </div>

        <h1 className="lg:text-xl my-2">Couleur</h1>
        <div className="flex flex-row gap-4">
          {uniqueColors.map((color: any) => {
            return (
              <SelectionButton key={color} selected={selectedColor == color}>
                <input
                  type={"radio"}
                  name="color"
                  value={color}
                  checked={selectedColor == color}
                  onChange={(e) => colorChangeHandler(e.target.value)}
                  className="hidden"
                />
                {String(color).charAt(0).toUpperCase() + String(color).slice(1)}
              </SelectionButton>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;
