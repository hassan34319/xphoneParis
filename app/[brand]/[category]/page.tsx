// page.tsx
import { product } from "../../utils/types";
import { sanityClient } from "../../../lib/sanityClient";
import ProductCard from "../../components/ProductCard";

export default async function SubPage({ 
 params 
}: {
 params: { category: string; brand: string }
}) {
 const { brand, category } = params;
 
 const productsQuery = `*[_type == "product" && categoryReal->title == "${category}" && brandReal->title == "${brand}"]{
   ...
 }`;
 
 const products: product[] = await sanityClient.fetch(productsQuery);

 return (
   <div className="w-11/12 mx-auto">
     <h1 className="text-3xl my-4 underline-offset-8 underline">
       {category} from {brand}
     </h1>
     <h2 className="text-xl text-gray-800 mb-4">
       {products?.length} produits
     </h2>
     <div className="flex flex-row gap-4 flex-wrap items-center justify-center">
       {products?.map((product: product) => (
         <ProductCard key={product._id} product={product} />
       ))}
     </div>
   </div>
 );
}