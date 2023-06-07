import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sanityClient } from "../../../lib/sanityClient";
import ProductCard from "../../components/ProductCard";
import { product } from "../../utils/types";

const Products: NextPage = () => {
  const [products, setProducts] = useState<product[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { search } = router.query;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const fetchProducts = async () => {
      setLoading(true);
      const query = `*[_type == 'product' && name  match '${search}' || brand match '${search}' 
|| category match '${search}']`;
      const gotProducts: product[] = await sanityClient.fetch(query);
      setProducts(gotProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [router.isReady, search]);

  if (loading) return <h1>Loading...</h1>;
  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-3xl my-4 underline-offset-8 underline ">{search}</h1>
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
};

export default Products;
