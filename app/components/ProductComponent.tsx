"use client";
import { useEffect, useState } from "react";
import ProductSelection from "./ProductSelection";
import { product } from "../utils/types";
import { urlFor } from "../../lib/sanityClient";
import ClientOnly from "./ClientOnly";
import Image from "next/image";
import Script from "next/script";
import ProductReview from "./ProductReview";
import ProductReviewMobile from "./ProductReviewMobile";
import { User } from "@prisma/client";
import ProductCarousel from "./ProductCarousel";

type Props = {
  product: product;
  currentUser: User | null;
};

function ProductComponent({ product, currentUser }: Props) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>(urlFor(product.variants[0].image).url());
  const [selectedColor, setSelectedColor] = useState(product.variants[0].color);
  const [selectedCapacity, setSelectedCapacity] = useState(product.variants[0].capacity);
  const [selectedGrade, setSelectedGrade] = useState(product.variants[0].grade);

  const handleVariantClick = (variantImage: string) => {
    setImage(variantImage);
  };

  const handleVariantSelect = (color: string, grade: string, capacity: string) => {
    setSelectedColor(color);
    setSelectedGrade(grade);
    setSelectedCapacity(capacity);
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <ClientOnly>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white w-11/12 p-4 mx-auto rounded mt-10 mb-10">
          <div className="flex flex-col justify-center items-center">
            <div className="w-full h-full relative flex items-center justify-center">

              <div className="flex flex-col items-start w-2/3">

                <div className="relative h-[24rem] w-full">
                  <Image
                    src={image}
                    alt="Product Image"
                    className="object-contain"
                    fill
                  />
                </div>


                <ProductCarousel
                  variants={product.variants}
                  handleVariantClick={handleVariantClick}
                  currentImage={image}
                  onVariantSelect={handleVariantSelect}
                  product={product}
                  selectedColor={selectedColor}
                  selectedGrade={selectedGrade}
                  selectedCapacity={selectedCapacity}
                />
              </div>


              <div className="w-[30%] h-full flex flex-col relative items-center justify-start">
                <div className="w-full h-32 relative">
                  <Image
                    className="object-contain"
                    fill
                    src="/grnty.png"
                    alt="Verified"
                  />
                </div>
                <div className="w-full h-24 relative">
                  <Image
                    className="object-contain"
                    fill
                    src="https://image.noelshack.com/fichiers/2024/17/7/1714333874-rreerreer.png"
                    alt="Verified"
                  />
                </div>
                <h3 className="text-center font-bold text-xl md:text-2xl xl:text-3xl">Chargeur</h3>
                <h3 className="text-center font-bold text-xl md:text-2xl xl:text-3xl">+ Cable</h3>
              </div>
            </div>

            <ProductReview
              id={product._id!}
              currentUser={currentUser}
              review={product.review}
            />
          </div>

          <div>
            {product && (
              <ProductSelection
                product={product}
                setImage={setImage}
                selectedColor={selectedColor}
                selectedCapacity={selectedCapacity}
                selectedGrade={selectedGrade}
              />
            )}
          </div>

          <ProductReviewMobile
            id={product._id!}
            currentUser={currentUser}
            review={product.review}
          />
        </div>
      </div>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        type="text/javascript"
      />
    </ClientOnly>
  );
}

export default ProductComponent;