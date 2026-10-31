import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialCoupons } from '../data/coupons';
import { useNotification } from './NotificationContext';

const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = 1499;
const STANDARD_SHIPPING_FEE = 150;
const COLD_CHAIN_PACKAGING_FEE = 99;

export function CartProvider({ children }) {
  const { addToast } = useNotification();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('purehaven_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('purehaven_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pincode, setPincode] = useState(() => {
    return localStorage.getItem('purehaven_delivery_pincode') || '560038';
  });

  const [pincodeStatus, setPincodeStatus] = useState({
    checked: true,
    serviceable: true,
    city: 'Bengaluru',
    deliveryDays: '1-2 Days'
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('purehaven_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('purehaven_applied_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('purehaven_applied_coupon');
    }
  }, [coupon]);

  useEffect(() => {
    if (pincode) {
      localStorage.setItem('purehaven_delivery_pincode', pincode);
    }
  }, [pincode]);

  // Add Item to Cart
  const addItem = (product, variant = null, quantity = 1) => {
    const selectedVariant = variant || (product.variants && product.variants[0]) || {
      weight: product.weight,
      price: product.price
    };

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant.weight === selectedVariant.weight
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedVariant,
            price: selectedVariant.price || product.price,
            quantity
          }
        ];
      }
    });

    addToast(`Added "${product.name}" (${selectedVariant.weight}) to cart`);
  };

  // Remove Item
  const removeItem = (productId, variantWeight) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant.weight === variantWeight)
      )
    );
    addToast('Item removed from cart', 'info');
  };

  // Update Quantity
  const updateQuantity = (productId, variantWeight, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, variantWeight);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedVariant.weight === variantWeight) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  // Subtotal Calculation
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  // Check coupon validity against current subtotal
  const couponDiscount = useMemo(() => {
    if (!coupon) return 0;

    if (subtotal < (coupon.minOrderValue || 0)) {
      return 0;
    }

    if (coupon.discountType === 'percentage') {
      const rawDiscount = (subtotal * coupon.discountValue) / 100;
      return coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
    }

    if (coupon.discountType === 'flat') {
      return Math.min(coupon.discountValue, subtotal);
    }

    if (coupon.discountType === 'shipping') {
      return STANDARD_SHIPPING_FEE;
    }

    return 0;
  }, [coupon, subtotal]);

  // Apply Coupon
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const found = initialCoupons.find((c) => c.code === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    if (subtotal < (found.minOrderValue || 0)) {
      return {
        success: false,
        message: `Minimum order value of ₹${found.minOrderValue} required for this coupon`
      };
    }

    setCoupon(found);
    addToast(`Coupon "${found.code}" applied successfully!`, 'success');
    return { success: true, coupon: found };
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // Delivery & Packaging Fees
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || coupon?.discountType === 'shipping';
  const shippingFee = isFreeShipping || items.length === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const coldChainFee = isFreeShipping || items.length === 0 ? 0 : COLD_CHAIN_PACKAGING_FEE;

  // 5% GST on dairy products
  const gst = useMemo(() => {
    return Math.round((subtotal - couponDiscount) * 0.05);
  }, [subtotal, couponDiscount]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal - couponDiscount + shippingFee + coldChainFee + gst);
  }, [subtotal, couponDiscount, shippingFee, coldChainFee, gst, items.length]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  // Pincode Validator
  const checkPincode = (pin) => {
    setPincode(pin);
    if (!pin || pin.length !== 6 || isNaN(pin)) {
      setPincodeStatus({
        checked: true,
        serviceable: false,
        city: '',
        deliveryDays: ''
      });
      return false;
    }

    // Major Indian postal hubs supported for express cold-chain
    const prefix = pin.substring(0, 2);
    let city = 'Metro Region';
    let days = '1-2 Days';

    if (prefix === '56') { city = 'Bengaluru'; days = 'Next Day (24 hrs)'; }
    else if (prefix === '11') { city = 'Delhi NCR'; days = 'Next Day (24 hrs)'; }
    else if (prefix === '40') { city = 'Mumbai'; days = 'Next Day (24 hrs)'; }
    else if (prefix === '60') { city = 'Chennai'; days = '1-2 Days'; }
    else if (prefix === '50') { city = 'Hyderabad'; days = '1-2 Days'; }
    else if (prefix === '70') { city = 'Kolkata'; days = '2 Days'; }
    else if (prefix === '41') { city = 'Pune'; days = 'Next Day'; }
    else if (prefix === '38') { city = 'Ahmedabad'; days = '1-2 Days'; }
    else if (prefix === '68') { city = 'Kochi'; days = '1-2 Days'; }
    else { city = 'Direct Express Hub'; days = '2-3 Days'; }

    setPincodeStatus({
      checked: true,
      serviceable: true,
      city,
      deliveryDays: days
    });

    return true;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        coupon,
        applyCoupon,
        removeCoupon,
        couponDiscount,
        shippingFee,
        coldChainFee,
        gst,
        total,
        totalItemsCount,
        isFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        pincode,
        pincodeStatus,
        checkPincode
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
