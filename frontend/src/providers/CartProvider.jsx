import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { summarizeCartPricing } from "@/lib/pricing";

const CartContext = createContext(undefined);

function mergeCartItem(items, product, quantity, selectedVariant) {
  const existingIndex = items.findIndex(
    (item) =>
      item.product.id === product.id && item.selectedVariant === selectedVariant,
  );
  if (existingIndex > -1) {
    const next = [...items];
    next[existingIndex] = {
      ...next[existingIndex],
      quantity: next[existingIndex].quantity + quantity,
    };
    return next;
  }
  return [...items, { product, quantity, selectedVariant }];
}

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
    setCartItems((prevItems) =>
      mergeCartItem(prevItems, product, quantity, selectedVariant),
    );
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

  /** Add a product while checkout is open (cart or express). */
  const addToCheckout = (product, quantity = 1, variant) => {
    const selectedVariant = variant || product.variants?.[0]?.name || "";
    if (directCheckoutItems) {
      setDirectCheckoutItems((prev) =>
        mergeCartItem(prev || [], product, quantity, selectedVariant),
      );
      return;
    }
    addToCart(product, quantity, selectedVariant, { open: false });
  };

  const updateCheckoutQuantity = (productId, quantity, variant) => {
    if (directCheckoutItems) {
      if (quantity <= 0) {
        setDirectCheckoutItems((prev) => {
          const next = (prev || []).filter(
            (item) =>
              !(item.product.id === productId && item.selectedVariant === variant),
          );
          return next.length ? next : null;
        });
        return;
      }
      setDirectCheckoutItems((prev) =>
        (prev || []).map((item) =>
          item.product.id === productId && item.selectedVariant === variant
            ? { ...item, quantity }
            : item,
        ),
      );
      return;
    }
    updateQuantity(productId, quantity, variant);
  };

  const removeFromCheckout = (productId, variant) => {
    if (directCheckoutItems) {
      setDirectCheckoutItems((prev) => {
        const next = (prev || []).filter(
          (item) =>
            !(item.product.id === productId && item.selectedVariant === variant),
        );
        return next.length ? next : null;
      });
      return;
    }
    removeFromCart(productId, variant);
  };

  const clearCart = () => {
    setCartItems([]);
    setDirectCheckoutItems(null);
  };

  const checkoutItems = directCheckoutItems || cartItems;
  const isDirectCheckout = Boolean(directCheckoutItems?.length);

  const cartCount = getCartItemCountSafe(cartItems);
  const cartPricing = summarizeCartPricing(cartItems);
  const checkoutPricing = summarizeCartPricing(checkoutItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        checkoutItems,
        isDirectCheckout,
        addToCart,
        addToCheckout,
        buyNow,
        removeFromCart,
        removeFromCheckout,
        updateQuantity,
        updateCheckoutQuantity,
        clearCart,
        cartCount,
        cartTotal: cartPricing.total,
        cartTotalOriginal: cartPricing.original,
        cartSavings: cartPricing.savings,
        cartDiscountPercent: cartPricing.discountPercent,
        checkoutTotal: checkoutPricing.total,
        checkoutTotalOriginal: checkoutPricing.original,
        checkoutSavings: checkoutPricing.savings,
        checkoutDiscountPercent: checkoutPricing.discountPercent,
        checkoutItemCount: checkoutPricing.itemCount,
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

function getCartItemCountSafe(items) {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
