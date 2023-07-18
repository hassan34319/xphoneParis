import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { StateContext } from "./context/stateContext";
import ChangeAdressModal from "./components/ChangeAdressModal";
import ChangePasswordModal from "./components/changePasswordModal";
import ClientOnly from "./components/ClientOnly";
import Heading from "./components/Heading";
import Layout from "./components/Layout";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import RegisterModal from "./components/RegisterModal";
import ToasterProvider from "./components/ToasterProvider";
import getCurrentUser from "./utils/getUser";
import "./globals.css";
import { NextAuthProvider } from "./components/provider";
import { Poppins } from "next/font/google";
import SidebarModal from "./components/SidebarModal";
import { sanityClient as client } from "../lib/sanityClient";
interface Product {
  _id: string;
  name: string;
  subcategory: {
    title: string;
  };
}

interface ConvertedProduct {
  name: string;
  id: string;
}
interface BrandData {
  [key: string]: string[];
}
const font = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});
export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  // Fetch categories
  const categoriesQuery = `*[_type == "categoryReal"]{
            title
          }`;
  const Categories = await client.fetch(categoriesQuery);
  const fetchedCategories = Categories.map((subcategory : {title:string}) => subcategory.title);
  console.log(fetchedCategories);
  // Fetch brands for each category
  const brandsCategoriesQuery = `*[_type == "categoryReal"]{
          title,
          brandsReal
          }`;
  const fetchedBrandsCategories = await client.fetch<any[]>(
    brandsCategoriesQuery
  );
  console.log(fetchedBrandsCategories);
  const convertedBrandsCategories: BrandData = {};
  fetchedBrandsCategories.forEach((category) => {
    const categoryName = category.title;
    console.log(category.brandsReal);
    const brands = category.brandsReal.map((brand: any) => brand.title);
    convertedBrandsCategories[categoryName] = brands;
  });

  // Fetch subcategories for each category
  const subcategoriesCategoriesQuery = `*[_type == "categoryReal"]{
            title,
            subcategories}`;
  const fetchedSubcategoriesCategories = await client.fetch<any[]>(
    subcategoriesCategoriesQuery
  );
  const convertedSubcategoriesCategories: BrandData = {};
  fetchedSubcategoriesCategories.forEach((category) => {
    const categoryName = category.title;
    const subcategories = category.subcategories.map(
      (subcategory: any) => subcategory.title
    );
    convertedSubcategoriesCategories[categoryName] = subcategories;
  });

  // Fetch brands
  const brandsQuery = `*[_type == "brandReal"]{
            title
          }`;
  const Brands = await client.fetch(brandsQuery);
  const fetchedBrands = Brands.map((subcategory : {title:string}) => subcategory.title);

  // Fetch categories for each brand
  const categoriesBrandsQuery = `*[_type == "brandReal"]{
            title,
            categoriesReal
          }`;
  const fetchedCategoriesBrands = await client.fetch<any[]>(
    categoriesBrandsQuery
  );
  const convertedCategoriesBrands: BrandData = {};
  fetchedCategoriesBrands.forEach((brand) => {
    const brandName = brand.title;
    const categories = brand.categoriesReal.map(
      (category: any) => category.title
    );
    convertedCategoriesBrands[brandName] = categories;
  });

  // Fetch subcategories for each brand
  const subcategoriesBrandsQuery = `*[_type == "brandReal"]{
            title,
            subcategories
          }`;
  const fetchedSubcategoriesBrands = await client.fetch<any[]>(
    subcategoriesBrandsQuery
  );
  const convertedSubcategoriesBrands: BrandData = {};
  fetchedSubcategoriesBrands.forEach((brand) => {
    const brandName = brand.title;
    const subcategories = brand.subcategories.map(
      (subcategory: any) => subcategory.title
    );
    convertedSubcategoriesBrands[brandName] = subcategories;
  });

  // Fetch subcategories
  const subcategoriesQuery = `*[_type == "subcategory"]{
            title
          }`;
  const Subcategories = await client.fetch(subcategoriesQuery);
  const fetchedSubcategories = Subcategories.map((subcategory : {title:string}) => subcategory.title);
  console.log(fetchedSubcategories);
  // Fetch products for each subcategory
  const productsQuery = `*[_type == "product" && defined(subcategory)]{
    _id,
    name,
    "subcategory": *[_id == ^.subcategory._ref][0]{
      title
    }
  }`;
  
  const fetchedProducts: Product[] = await client.fetch<Product[]>(productsQuery);
  console.log("fetched products", fetchedProducts);
  
  const convertedProductsBrands: { [subcategory: string]: ConvertedProduct[] } = {};
  fetchedProducts.forEach((product) => {
    const subcategoryName = product.subcategory.title;
    const convertedProduct: ConvertedProduct = {
      name: product.name,
      id: product._id,
    };
    if (!convertedProductsBrands[subcategoryName]) {
      convertedProductsBrands[subcategoryName] = [];
    }
    convertedProductsBrands[subcategoryName].push(convertedProduct);
  });
  console.log(
    fetchedBrands,
    fetchedBrandsCategories,
    fetchedCategories,
    fetchedSubcategories,
    fetchedCategoriesBrands,
    fetchedProducts,
    fetchedSubcategoriesBrands,
    fetchedSubcategoriesCategories,
    convertedProductsBrands
  );

  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className={font.className}>
        <StateContext>
          <NextAuthProvider>
            <ClientOnly>
              <ToasterProvider />
              <ChangePasswordModal currentUser={currentUser} />
              <ChangeAdressModal currentUser={currentUser} />
              <LoginModal currentUser={currentUser} />
              <RegisterModal currentUser={currentUser} />
              <Navbar
                currentUser={currentUser}
                categories={fetchedCategories}
                brands_categories={convertedBrandsCategories}
                subcategories_categories={convertedSubcategoriesCategories}
                brands={fetchedBrands}
                categories_brands={convertedCategoriesBrands}
                subcategories_brands={convertedSubcategoriesBrands}
                subcategories={fetchedSubcategories}
                products={convertedProductsBrands}
              />
            </ClientOnly>
            <div
              className="flex flex-col h-screen justify-between"
              id="outer-container"
            >
              <div className="relative mb-auto">{children}</div>
            </div>
          </NextAuthProvider>
        </StateContext>
      </body>
    </html>
  );
}
