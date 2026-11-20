import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { INITIAL_PRODUCTS } from '../data/mockData';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize with the 2 reference items from the mockup
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('avoxell_cart_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const p1 = INITIAL_PRODUCTS[0]; // ProPods
    const p2 = INITIAL_PRODUCTS[2]; // Backpack
    return [
      {
        id: 101,
        product: p1,
        quantity: 1,
        variant: 'Wireless Headphones',
        price: p1.price
      },
      {
        id: 102,
        product: p2,
        quantity: 1,
        variant: 'Black',
        price: p2.price
      }
    ];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('avoxell_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [INITIAL_PRODUCTS[0].id];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Persist local cart
  useEffect(() => {
    localStorage.setItem('avoxell_cart_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('avoxell_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load backend cart on mount
  useEffect(() => {
    const loadBackendCart = async () => {
      const backendCart = await api.getCart();
      if (backendCart && backendCart.items && backendCart.items.length > 0) {
        const formatted = backendCart.items.map(item => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          variant: item.variant || '',
          price: item.product.price
        }));
        setItems(formatted);
      }
    };
    loadBackendCart();
  }, []);

  const addToCart = async (product, quantity = 1, variant = '') => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.variant === variant);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.variant === variant
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          product,
          quantity,
          variant: variant || product.category_name,
          price: product.price
        }
      ];
    });

    try {
      await api.addToCart(product.id, quantity, variant);
    } catch (e) {}
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.id === itemId ? { ...i, quantity: newQuantity } : i))
    );
    try {
      await api.updateCartItem(itemId, newQuantity);
    } catch (e) {}
  };

  const removeFromCart = async (itemId) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
    try {
      await api.removeCartItem(itemId);
    } catch (e) {}
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('avoxell_cart_items');
  };

  const toggleWishlist = (product) => {
    const pId = typeof product === 'object' ? product.id : product;
    setWishlist(prev =>
      prev.includes(pId) ? prev.filter(id => id !== pId) : [...prev, pId]
    );
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Totals
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal === 0 ? 0 : (subtotal >= 999 ? 0 : 99);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'PERCENTAGE') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
    discount = Math.min(discount, subtotal);
  }
  const total = Math.max(0, subtotal + shipping - discount);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const applyCoupon = async (code) => {
    setCouponError('');
    setCouponSuccess('');
    const cleanCode = code.trim().toUpperCase();

    // Call API first
    const res = await api.applyCoupon(cleanCode, subtotal);
    if (res && res.valid) {
      setAppliedCoupon(res);
      setCouponSuccess(`Coupon ${res.code} applied successfully!`);
      return true;
    }

    // Fallback validation
    if (cleanCode === 'AVOXELL10') {
      if (subtotal < 1500) {
        setCouponError('Minimum order of ₹1,500 required for AVOXELL10');
        return false;
      }
      setAppliedCoupon({ code: 'AVOXELL10', discount_type: 'PERCENTAGE', value: 10 });
      setCouponSuccess('Coupon AVOXELL10 applied: 10% OFF!');
      return true;
    } else if (cleanCode === 'WELCOME500') {
      if (subtotal < 2000) {
        setCouponError('Minimum order of ₹2,000 required for WELCOME500');
        return false;
      }
      setAppliedCoupon({ code: 'WELCOME500', discount_type: 'FLAT', value: 500 });
      setCouponSuccess('Coupon WELCOME500 applied: ₹500 OFF!');
      return true;
    } else {
      setCouponError('Invalid coupon code. Try AVOXELL10 or WELCOME500');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        discount,
        total,
        appliedCoupon,
        couponError,
        couponSuccess,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
