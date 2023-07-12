"use client";
import { useEffect, ReactNode, useState } from "react";
import { StateContext, useStateContext } from "../context/stateContext";
import { v4 as uuidv4 } from "uuid";
import { fetchCart } from "../utils/fetchCart";
import BlowfishTranslation from "../utils/blowfishTranslation";
import MacGeneration from "../utils/hmacGeneration";

interface Item {
  image: string;
  name: string;
  productId: string;
  color: string;
  capacity: number;
  grade: string;
  price: number;
  quantity: number;
}

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { cartItems, setCart } = useStateContext();
  const [touched, setTouched] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (touched) {
      return;
    }
    const savedCart = localStorage.getItem("hMac Generation");

    if (savedCart) {
      // Decrypt and deserialize the cart data
      const blowfish = new BlowfishTranslation(savedCart);
      const decryptedData = blowfish.decryptBlowfish();

      // Parse the decrypted data as JSON
      setCart(JSON.parse(decryptedData));
    } else {
      localStorage.setItem("hMac Generation", "");
    }
  }, [setCart, touched]);

  useEffect(() => {
    // Serialize the cart data to a string
    if (cartItems && cartItems.length === 0) {
      console.log("I WAS HERE");
      localStorage.removeItem("hMac Generation");
    }
    setTouched(true);
    const serializedData = JSON.stringify(cartItems);
    console.log(serializedData);
    // Encrypt the serialized data
    const blowfish = new BlowfishTranslation(serializedData);
    const encryptedData = blowfish.encryptBlowfish();

    localStorage.setItem("hMac Generation", encryptedData);
  }, [cartItems]);

  //   useEffect(() => {
  //     const fetchAndCreateCartData = async () => {
  //       // Check if cartId exists in localStorage
  //       const existingCartId = localStorage.getItem("cartId");
  //       console.log(existingCartId);

  //       if (!existingCartId) {
  //         // Generate a new cartId if it doesn't exist
  //         const newCartId = generateCartId();
  //         localStorage.setItem("cartId", newCartId.toString());

  //         // Send a request to your backend API to create a new cart
  //         await createCart(newCartId.toString());
  //       } else {
  //         await fetchCart(existingCartId, setCart);
  //       }
  //     };

  //     fetchAndCreateCartData();
  //   }, [setCart]);

  //   useEffect(() => {
  //     const updateCartInDatabase = async () => {
  //       const cartId = localStorage.getItem("cartId");
  //       if (cartId) {
  //         // Send a request to your backend API to update the cart in the database
  //         await updateCart(cartId, cartItems);
  //       }
  //     };

  //     updateCartInDatabase();
  //   }, [cartItems]);

  //   const generateCartId = () => {
  //     return Date.now().toString();
  //   };

  //   const createCart = async (cartId: string) => {
  //     try {
  //       // Send a request to your backend API to create a new cart and associate it with the session
  //       await fetch("/api/cart", {
  //         method: "POST",
  //         body: JSON.stringify({ cartId }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },// Send cookies or session information with the request
  //       });
  //     } catch (error) {
  //       console.error("Error creating cart:", error);
  //     }
  //   };

  //   const updateCart = async (cartId: string, items: Item[]) => {
  //     try {
  //       // Send a request to your backend API to update the cart in the database
  //       const response = await fetch("/api/cart", {
  //         method: "PUT",
  //         body: JSON.stringify({ cartId, items }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },// Send cookies or session information with the request
  //       });
  //       console.log(response);
  //     } catch (error) {
  //       console.error("Error updating cart:", error);
  //     }
  //   };
  if (!hasMounted) return null;
  return <>{children}</>;
};

export default Layout;
