import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sanityClient, urlFor } from "../../../lib/sanityClient";
import Layout from "../../components/Layout";
import ProductSelection from "../../components/ProductSelection";
import { product } from "../../utils/types";

const Product: NextPage = () => {
  const [product, setProduct] = useState<product>();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    router.query.id && setLoading(true);
    const { id } = router.query;
    const fetchProduct = async () => {
      try {
        const query = `*[_type == "product" && _id == "${id}" ][0]`;
        const product: product = await sanityClient.fetch(query);
        setProduct(product);
        setImage(urlFor(product.variants[0].image).url());
        setLoading(false);
      } catch (error: any) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [router.isReady, router.query.id, router.query]);

  if (loading) return <h1>Loading...</h1>;

  return (
    <Layout>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white w-11/12 p-4 mx-auto rounded">
          <div className="flex flex-col justify-center items-center">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="product image" className="w-2/3" />
            )}
          </div>
          <div>
            {product && (
              <ProductSelection product={product} setImage={setImage} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Product;
