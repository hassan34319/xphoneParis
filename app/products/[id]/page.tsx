import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sanityClient, urlFor } from "../../../lib/sanityClient";
import Layout from "../../components/Layout";
import ProductComponent from "../../components/ProductComponent";
import ProductSelection from "../../components/ProductSelection";
import getCurrentUser from "../../utils/getCurrentUser";
import { product } from "../../utils/types";

type Props = {};
async function ProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;
  const currentUser = await getCurrentUser()
  const query = `*[_type == "product" && _id == "${id}" ][0]`;
  const product: product = await sanityClient.fetch(query);
  console.log("product",product)
  if (!product) {
    return <p>No product found</p>;
  }

  return <ProductComponent product={product} currentUser={currentUser} />;
}
export default ProductPage;
