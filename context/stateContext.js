import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);


  const addToCart = (product) => {
    setTotalPrice((prevTotalPrice) => prevTotalPrice + Math.round(product.price - (product.price * discountPercentage/100)));

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
      setTotalPrice((prevTotalPrice) => prevTotalPrice - Math.round(itemInCart.price - (itemInCart.price * discountPercentage/100)));
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
      setTotalPrice((prevTotalPrice) => prevTotalPrice -  Math.round(itemInCart.price - (itemInCart.price * discountPercentage/100)));
      toast.error(`${product.name} retiré du panier.`);
    } else {
      return;
    }
  };
  const calculateTotalPrice = (cartItems) => {
    return cartItems.reduce((totalPrice, item) => {
      return totalPrice + item.price * item.quantity;
    }, 0);
  };
  
  const calculateTotalQuantity = (cartItems) => {
    return cartItems.reduce((totalQuantity, item) => {
      return totalQuantity + item.quantity;
    }, 0);
  };
  const setCart = (cart) => {
    const isCartDifferent = JSON.stringify(cart) !== JSON.stringify(cartItems);

    if (isCartDifferent && cartItems.length == 0) {
      setCartItems(cart);
      setTotalPrice(calculateTotalPrice(cart));
      setTotalQuantity(calculateTotalQuantity(cart));
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
        setCart,
        discountPercentage,
        setDiscountPercentage
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
