import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { isAuthenticated, openLogin, loginOpen } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [directCheckoutItems, setDirectCheckoutItems] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPending, setCheckoutPending] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("himu-cart");
      if (stored) setCartItems(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("himu-cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems, isLoaded]);

  useEffect(() => {
    if (isAuthenticated && checkoutPending) {
      setCheckoutPending(false);
      setCartOpen(false);
      setCheckoutOpen(true);
    }
  }, [isAuthenticated, checkoutPending]);

  useEffect(() => {
    if (!loginOpen && checkoutPending && !isAuthenticated) {
      setCheckoutPending(false);
      setDirectCheckoutItems(null);
    }
  }, [loginOpen, checkoutPending, isAuthenticated]);

  const addToCart = (product, quantity = 1, variant, options = {}) => {
    const { open = true } = options;
    const selectedVariant = variant || product.variants?.[0]?.name || "";
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id && item.selectedVariant === selectedVariant,
      );
      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return newItems;
      }
      return [...prevItems, { product, quantity, selectedVariant }];
    });
    if (open) setCartOpen(true);
  };

  /**
   * Buy Now rules:
   * - Empty cart → require login/signup first, then open order form with this product
   * - Cart already has items → add product and open cart drawer
   */
  const buyNow = (product, quantity = 1, variant) => {
    const selectedVariant = variant || product.variants?.[0]?.name || "";
    if (cartItems.length === 0) {
      setDirectCheckoutItems([{ product, quantity, selectedVariant }]);
      setCartOpen(false);
      if (!isAuthenticated) {
        setCheckoutPending(true);
        openLogin();
        return;
      }
      setCheckoutOpen(true);
      return;
    }
    setDirectCheckoutItems(null);
    addToCart(product, quantity, selectedVariant, { open: true });
  };

  const openCheckoutFromCart = () => {
    setDirectCheckoutItems(null);
    setCartOpen(false);
    if (!isAuthenticated) {
      setCheckoutPending(true);
      openLogin();
      return;
    }
    setCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setCheckoutOpen(false);
    setDirectCheckoutItems(null);
  };

  const removeFromCart = (productId, variant) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.selectedVariant === variant),
      ),
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
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setDirectCheckoutItems(null);
  };

  const checkoutItems = directCheckoutItems || cartItems;
  const isDirectCheckout = Boolean(directCheckoutItems?.length);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const cartTotalOriginal = cartItems.reduce(
    (acc, item) =>
      acc + (item.product.compareAtPrice || item.product.price) * item.quantity,
    0,
  );
  const cartSavings = cartTotalOriginal - cartTotal;

  const checkoutTotal = checkoutItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const checkoutTotalOriginal = checkoutItems.reduce(
    (acc, item) =>
      acc + (item.product.compareAtPrice || item.product.price) * item.quantity,
    0,
  );
  const checkoutSavings = checkoutTotalOriginal - checkoutTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        checkoutItems,
        isDirectCheckout,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        cartTotalOriginal,
        cartSavings,
        checkoutTotal,
        checkoutTotalOriginal,
        checkoutSavings,
        isCartOpen,
        setCartOpen,
        isCheckoutOpen,
        setCheckoutOpen,
        openCheckoutFromCart,
        closeCheckout,
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
