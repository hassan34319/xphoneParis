import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sanityClient } from "../../../lib/sanityClient";
import Layout from "../../components/Layout";
import ProductCard from "../../components/ProductCard";
import { product } from "../../utils/types";

async function SubPage({
  params,
  searchParams,
}: {
  params: { subcategory: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { subcategory } = params;
  const productsQuery = `*[_type == "product" && subcategory->title == "${subcategory}"]{
    ...
  }`;
  const products: product[] = await sanityClient.fetch(productsQuery);

  return (
      <div className="w-11/12 mx-auto">
        <h1 className="text-3xl my-4 underline-offset-8 underline ">
          {subcategory}
        </h1>
        <h2 className="text-xl text-gray-800 mb-4">
          {" "}
          {products && products.length} produits
        </h2>
        <div className="flex flex-row gap-4 flex-wrap items-center justify-center">
          {products &&
            products.map((product: product) => {
              return <ProductCard key={product._id} product={product} />;
            })}
        </div>
      </div>
  );
}

export default SubPage;