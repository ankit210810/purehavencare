import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { addToast } = useNotification();
  const { addItem } = useCart();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('purehaven_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('purehaven_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        addToast(`Removed "${product.name}" from your wishlist`, 'info');
        return prev.filter((item) => item.id !== product.id);
      } else {
        addToast(`Saved "${product.name}" to your wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  const moveToCart = (product) => {
    addItem(product);
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    addToast(`Moved "${product.name}" to cart`, 'success');
  };

  const clearWishlist = () => {
    setWishlist([]);
    addToast('Wishlist cleared', 'info');
  };

  const moveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => addItem(item));
    const count = wishlist.length;
    setWishlist([]);
    addToast(`Moved all ${count} items to your shopping cart!`, 'success');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        moveToCart,
        clearWishlist,
        moveAllToCart
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
