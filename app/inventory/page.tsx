import { useEffect, useState } from 'react';
import { sanityClient } from '../../lib/sanityClient';

interface Product {
  _id: string;
  name: string;
  variants: Variant[];
}

interface Variant {
  grade: string;
  capacity: number;
  color: string;
  quantity: number;
  productId: string;
  productName: string;
}

type Props = {};

async function InventoryPage({}: Props) {
  const query = `*[_type == "product"]{
    _id,
    name,
    variants[] {
      grade,
      capacity,
      color,
      quantity
    }[quantity < 2]
  }`;
  const results = await sanityClient.fetch(query);

  console.log(results)

  // Flatten the variants array
  const variants = results && results.length > 0
  ? results.flatMap((product: Product) =>
      product.variants && product.variants.length > 0
        ? product.variants.map((variant: Variant) => ({
            ...variant,
            productId: product._id,
            productName: product.name,
          }))
        : []
    )
  : [];
  console.log(variants)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="py-2">Product ID</th>
            <th className="py-2">Product Name</th>
            <th className="py-2">Variant Grade</th>
            <th className="py-2">Variant Capacity</th>
            <th className="py-2">Variant Color</th>
            <th className="py-2">Variant Quantity</th>
          </tr>
        </thead>
        <tbody>
          {variants && variants.length > 0 &&  variants.map((variant: Variant) => (
            <tr
              key={`${variant.productId}-${variant.grade}-${variant.capacity}-${variant.color}`}
              className="hover:bg-gray-50"
            >
              <td className="py-3">{variant.productId}</td>
              <td className="py-3">{variant.productName}</td>
              <td className="py-3">{variant.grade}</td>
              <td className="py-3">{variant.capacity}</td>
              <td className="py-3">{variant.color}</td>
              <td className="py-3">{variant.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryPage;

