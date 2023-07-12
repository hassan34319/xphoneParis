import ProductCard from "./ProductCard";
import { sanityClient } from "../../lib/sanityClient";
import { useEffect, useState } from "react";
import { product } from "../utils/types";

const BestSellers = () => {
  const [bestSellers, setBestSellers] = useState<product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBestsellers = async () => {
      setLoading(true);
      try {
        const query = '*[_type == "product" && "bestseller" in tags]';
        const bestSellers: product[] = await sanityClient.fetch(query);
        setBestSellers(bestSellers);
        setLoading(false);
      } catch (error: any) {
        console.error(error);
        setLoading(false);
      }
    };
    getBestsellers();
  }, []);

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="w-11/12 mx-auto mt-8 mb-4">
      <h1 className="text-3xl underline-offset-8 underline my-4">
        Nos Bestsellers
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {bestSellers.map((best: product) => {
          console.log(best);
          return <ProductCard key={best._id} product={best} />;
        })}
      </div>
    </div>
  );
};

export default BestSellers;
