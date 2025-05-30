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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/community.png" sizes="any" />
        
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WZC5VTKW');`
          }}
        />
        
        {/* Google tag (gtag.js) */}
        <Script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=AW-16906129078"
          strategy="afterInteractive"
        />
        <Script 
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16906129078');
            `
          }}
        />
        
        {/* Event snippet for Page vue conversion */}
        <Script
          id="google-conversion"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              gtag('event', 'conversion', {
                'send_to': 'AW-16906129078/fbp6CLr9zbcaELadvP0-',
                'value': 1.0,
                'currency': 'EUR'
              });
            `
          }}
        />
      </head>
      <body className={font.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-WZC5VTKW"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
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