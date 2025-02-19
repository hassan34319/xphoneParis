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
import { sanityClient as client, sanityClient } from "../lib/sanityClient";
import Script from "next/script";
import Footer from "./components/Footer";
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


  const queryMenuCategories = `*[_type == "menuCategory"] | order(priority asc) {
    _id,
    title,
    hasSubcategories,
    subcategories,
    products[]->{
      _id,
      name
      
    }
  }`;

  const MenuCategories = await sanityClient.fetch(queryMenuCategories)

  

// Fetch all menuCategory2 items
const querymenuCategory2Items = `*[_type == "menuCategory2"] {
  _id,
  title,
  products[]->{
    name,
    _id
  }
}`;

const MenuCategories2 = await sanityClient.fetch(querymenuCategory2Items)


  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body className={font.className}>
        <Script
          src="//code.tidio.co/ooc6bralufcpukdjj03swqd2tnk19w9k.js"
          async
        />
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
                menuCategories={MenuCategories}
                menuCategories2={MenuCategories2}
              />
            </ClientOnly>

            <div
              className="flex flex-col h-screen justify-between"
              id="outer-container"
            >
              <div className="relative mb-auto">{children}</div>
              <Footer/>
            </div>
      
          </NextAuthProvider>
        </StateContext>
      </body>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        type="text/javascript"
      ></Script>
    </html>
  );
}
