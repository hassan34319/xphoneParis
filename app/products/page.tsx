import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sanityClient } from "../../lib/sanityClient";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { product } from "../utils/types";

async function ProductsPage({
  params,
  searchParams,
}: {
  params: { search: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { search } = searchParams;
  const query = `*[_type == 'product' && name  match '${search}' || brand match '${search}' 
|| category match '${search}']`;
  const products: product[] = await sanityClient.fetch(query);

  return (
      <div className="w-11/12 mx-auto">
        <h1 className="text-3xl my-4 underline-offset-8 underline ">
          {search}
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

export default ProductsPage;
