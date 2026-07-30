import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("himu-cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when cartItems change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("himu-cart", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product, quantity = 1, variant) => {
    const selectedVariant = variant || product.variants?.[0]?.name || "";
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === selectedVariant
      );
      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }
      return [...prevItems, { product, quantity, selectedVariant }];
    });
    setCartOpen(true); // Auto-open cart drawer when adding an item!
  };

  const removeFromCart = (productId, variant) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.product.id === productId && item.selectedVariant === variant))
    );
  };

  const updateQuantity = (productId, quantity, variant) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.selectedVariant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartTotalOriginal = cartItems.reduce(
    (acc, item) => acc + (item.product.compareAtPrice || item.product.price) * item.quantity,
    0
  );
  const cartSavings = cartTotalOriginal - cartTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        cartTotalOriginal,
        cartSavings,
        isCartOpen,
        setCartOpen,
        isCheckoutOpen,
        setCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
