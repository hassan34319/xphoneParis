import { useEffect, ReactNode } from "react";
import { useStateContext } from "../../context/stateContext";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { fetchCart } from "../utils/fetchCart";

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

  useEffect(() => {
    const fetchAndCreateCartData = async () => {
      // Check if cartId exists in cookies
      const existingCartId = Cookies.get("cartId");
      console.log(existingCartId)

      if (!existingCartId) {
        // Generate a new cartId if it doesn't exist
        const newCartId = generateCartId();
        Cookies.set("cartId", newCartId.toString(), { expires: 7, sameSite: "Lax", secure : true }); // Set cookie expiration to 7 days

        // Send a request to your backend API to create a new cart
        await createCart(newCartId.toString());
      } else {
        await fetchCart(existingCartId, setCart);
      }
    };

    fetchAndCreateCartData();
  }, [setCart]);

  useEffect(() => {
    const updateCartInDatabase = async () => {
      const cartId = Cookies.get("cartId");
      if (cartId) {
        // Send a request to your backend API to update the cart in the database
        await updateCart(cartId, cartItems);
      }
    };

    updateCartInDatabase();
  }, [cartItems]);

  const generateCartId = () => {
    return Date.now();
  };

  const createCart = async (cartId: String) => {
    try {
      // Send a request to your backend API to create a new cart
      await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ cartId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error creating cart:", error);
    }
  };

  const updateCart = async (cartId: string, items: Item[]) => {
    try {
      // Send a request to your backend API to update the cart in the database
      const response = await fetch("/api/cart", {
        method: "PUT",
        body: JSON.stringify({ cartId, items }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response)
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return <div>{children}</div>;
};

export default Layout;
