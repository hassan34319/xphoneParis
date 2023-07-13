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
  productId : string
  productName : string
}
type Props = {

}
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

  // Flatten the variants array
  const variants = results.flatMap((product: Product) =>
    product.variants.map((variant: Variant) => ({
      ...variant,
      productId: product._id,
      productName: product.name,
    }))
  );
 

  return (
    <div>
      <h1>Inventory</h1>

      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Variant Grade</th>
            <th>Variant Capacity</th>
            <th>Variant Color</th>
            <th>Variant Quantity</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant : Variant) => (
            <tr key={`${variant.productId}-${variant.grade}-${variant.capacity}-${variant.color}`}>
              <td>{variant.productId}</td>
              <td>{variant.productName}</td>
              <td>{variant.grade}</td>
              <td>{variant.capacity}</td>
              <td>{variant.color}</td>
              <td>{variant.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
