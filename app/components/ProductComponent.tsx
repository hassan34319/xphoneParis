"use client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductSelection from "./ProductSelection";
import { product } from "../utils/types";
import { renderRatingStars } from "../utils/stars";
import { sanityClient, urlFor } from "../../lib/sanityClient";
import ClientOnly from "./ClientOnly";
import Image from "next/image";
import Script from "next/script";
import ProductReview from "./ProductReview";
import ProductReviewMobile from "./ProductReviewMobile";
import { User } from "@prisma/client";

type Props = {
  product: product;
  currentUser: User | null;
};

function ProductComponent({ product, currentUser }: Props) {


  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>(
    urlFor(product.variants[0].image).url()
  );

  //   useEffect(() => {
  //     if (!router.isReady) return;
  //     router.query.id && setLoading(true);
  //     const { id } = router.query;
  //     const fetchProduct = async () => {
  //       try {
  //         const query = `*[_type == "product" && _id == "${id}" ][0]`;
  //         const product: product = await sanityClient.fetch(query);
  //         setProduct(product);
  //         setImage(urlFor(product.variants[0].image).url());
  //         setLoading(false);
  //       } catch (error: any) {
  //         console.log(error);
  //         setLoading(false);
  //       }
  //     };

  //     fetchProduct();
  //   }, [router.isReady, router.query.id, router.query]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <ClientOnly>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white w-11/12 p-4 mx-auto rounded mt-10 mb-10">
          <div className="flex flex-col justify-center items-center">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="product image" className="w-2/3" />
            )}
            <ProductReview
              id={product._id!}
              currentUser={currentUser}
              review={product.review}
            />
          </div>
          <div>
            {product && (
              <ProductSelection product={product} setImage={setImage} />
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
