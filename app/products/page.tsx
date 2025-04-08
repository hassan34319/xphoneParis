import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sanityClient } from "../../lib/sanityClient";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import ProductVariantGroup from "../components/productgroup";
import { product } from "../utils/types";

async function ProductsPage({
  params,
  searchParams,
}: {
  params: { search: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { search, exactName } = searchParams;
  
  // Different query based on whether we want exact match or partial match
  let query;
  
  if (exactName) {
    // Exact match query - match only products with the exact name
    query = `*[_type == 'product' && name == '${exactName}'] | order(name asc) {
      _id,
      name,
      brand,
      category,
      rating,
      variants[] {
        sub,
        price,
        capacity,
        grade,
        color,
        image,
        additionalImages,
        quantity
      }
    }`;
  } else {
    // Partial match query (original behavior)
    query = `*[_type == 'product' && (name match '${search}' || brand match '${search}' || category match '${search}')] | order(name asc) {
      _id,
      name,
      brand,
      category,
      rating,
      variants[] {
        sub,
        price,
        capacity,
        grade,
        color,
        image,
        additionalImages,
        quantity
      }
    }`;
  }
  
  const products: product[] = await sanityClient.fetch(query);
  
  // For display purposes, use either exactName or search
  const displaySearch = exactName || search;
  
  // Group products by base name (for variants)
  const groupedProducts = groupProductsByBase(products);
  
  return (
    <div className="w-11/12 mx-auto">
      {/* <h1 className="text-3xl my-4 underline-offset-8 underline ">
        {displaySearch}
      </h1> */}
      <h1 className="text-3xl my-4 underline-offset-8 underline ">
        
      </h1>
      {/* <h2 className="text-xl text-gray-800 mb-4">
        {" "}
        {products && products.length} produits
      </h2> */}
      <div className="flex flex-col gap-4">
        {Object.entries(groupedProducts).map(([baseProduct, productGroup]) => {
          // Check if product group has variants with color and capacity
          const hasVariants = productHasVariants(productGroup);
          
          if (hasVariants) {
            // Group variants by color and capacity
            const groupedVariants = groupVariantsByColorAndCapacity(productGroup);
            
            return (
              <ProductVariantGroup
                key={baseProduct}
                baseProductName={baseProduct}
                products={groupedVariants}
              />
            );
          } else {
            // For products without variants, show in a responsive grid WITHOUT heading or extra margin
            return (
              <div key={baseProduct} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productGroup.map((product: product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

// Function to group products by their base name
function groupProductsByBase(products: product[]) {
  const grouped: { [key: string]: product[] } = {};
  
  products.forEach(product => {
    // Extract base product name (remove variant-specific info)
    const baseProductName = extractBaseProductName(product.name);
    
    if (!grouped[baseProductName]) {
      grouped[baseProductName] = [];
    }
    
    grouped[baseProductName].push(product);
  });
  
  return grouped;
}

// Function to extract base product name
function extractBaseProductName(productName: string) {
  // This is a simple implementation - you might need to adjust based on your naming convention
  // Remove common variant indicators like colors, capacities from the product name
  return productName.replace(/\s+(noir|blue|red|white|gold|32GB|64GB|128GB|256GB|512GB).*$/i, '').trim();
}

// Check if any product in the group has color and capacity variants
function productHasVariants(products: product[]) {
  for (const product of products) {
    for (const variant of product.variants) {
      // If any variant has both color and capacity, return true
      if (variant.color && variant.capacity && variant.quantity > 0) {
        return true;
      }
    }
  }
  return false;
}

// New function to group variants by color and capacity
function groupVariantsByColorAndCapacity(products: product[]) {
  const groupedProducts: product[] = [];
  const colorCapacityMap: { [key: string]: boolean } = {};
  
  products.forEach(product => {
    // Create a new product object to store the filtered variants
    const newProduct: product = {
      ...product,
      variants: []
    };
    
    // Filter variants to include only one per color/capacity combination
    product.variants.forEach(variant => {
      if (variant.color && variant.capacity) {
        // Create a unique key for this color/capacity combination
        const key = `${variant.color}-${variant.capacity}`;
        
        // If we haven't seen this combination yet, add it
        if (!colorCapacityMap[key]) {
          colorCapacityMap[key] = true;
          newProduct.variants.push(variant);
        }
      } else {
        // If variant doesn't have both color and capacity, include it anyway
        newProduct.variants.push(variant);
      }
    });
    
    // Only add the product if it has variants after filtering
    if (newProduct.variants.length > 0) {
      groupedProducts.push(newProduct);
    }
  });
  
  return groupedProducts;
}

export default ProductsPage;