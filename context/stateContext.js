import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price);

    const itemInCart = cartItems.find(
      (cartItem) =>
        cartItem.productId == product.productId &&
        cartItem.color == product.color &&
        cartItem.grade == product.grade &&
        cartItem.price == product.price &&
        cartItem.capacity == product.capacity
    );

    if (itemInCart) {
      const newCart = cartItems.map((cartItem) => {
        if (
          cartItem.productId == product.productId &&
          cartItem.color == product.color &&
          cartItem.grade == product.grade &&
          cartItem.capacity == product.capacity &&
          cartItem.price == product.price
        ) {
          cartItem.quantity += 1;
        }

        return cartItem;
      });

      setCartItems(newCart);
      setTotalQuantity((prevQty) => prevQty + 1);
      toast.success(`${product.name} ajouté au panier.`);
    } else {
      const newCart = [...cartItems, product];
      setCartItems(newCart);
      setTotalQuantity((prevQty) => prevQty + 1);
      toast.success(`${product.name} ajouté au panier.`);
    }
  };

  const removeFromCart = (product) => {
    const itemInCart = cartItems.find(
      (cartItem) =>
        cartItem.productId == product.productId &&
        cartItem.color == product.color &&
        cartItem.grade == product.grade &&
        cartItem.price == product.price &&
        cartItem.capacity == product.capacity
    );

    if (itemInCart && itemInCart.quantity == 1) {
      const newCart = cartItems.filter(
        (cartItem) =>
          !(
            cartItem.productId == product.productId &&
            cartItem.color == product.color &&
            cartItem.grade == product.grade &&
            cartItem.capacity == product.capacity &&
            cartItem.price == product.price
          )
      );
      setCartItems(newCart);
      setTotalPrice((prevTotalPrice) => prevTotalPrice - itemInCart.price);
      setTotalQuantity((prevQty) => prevQty - 1);
      toast.error(`${product.name} retiré du panier.`);
    } else if (itemInCart && itemInCart.quantity > 1) {
      const newCart = cartItems.map((cartItem) => {
        if (
          cartItem.productId == product.productId &&
          cartItem.color == product.color &&
          cartItem.grade == product.grade &&
          cartItem.capacity == product.capacity &&
          cartItem.price == product.price
        ) {
          cartItem.quantity -= 1;
        }
        return cartItem;
      });
      setCartItems(newCart);
      setTotalQuantity((prevQty) => prevQty - 1);
      setTotalPrice((prevTotalPrice) => prevTotalPrice - itemInCart.price);
      toast.error(`${product.name} retiré du panier.`);
    } else {
      return;
    }
  };

  return (
    <Context.Provider
      value={{
        cartItems,
        totalPrice,
        totalQuantity,
        addToCart,
        setTotalQuantity,
        removeFromCart,
        setCartItems,
        setTotalPrice,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
