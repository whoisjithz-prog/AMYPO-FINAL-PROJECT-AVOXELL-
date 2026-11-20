import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2, Plus, Minus, ShoppingBag, Tag, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    shipping,
    discount,
    total,
    appliedCoupon,
    couponError,
    couponSuccess,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
    }
  };

  const formatPrice = (val) => '₹' + Number(val).toLocaleString('en-IN');

  return (
    <div className="space-y-8">
      
      {/* Cart Top Bar (Exact text & link from Bottom-Right mockup) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Your Cart <span className="text-slate-400 font-semibold text-lg sm:text-xl">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        </h1>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Your cart is currently empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added anything yet. Discover our best-selling audio and smart essentials.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs shadow-md transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* 2-Column Cart Layout (Exact from Reference Image) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 hover:shadow-md transition-shadow"
              >
                {/* Product Thumbnail & Names */}
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#f6f9fe] p-2 flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.product?.primary_image || (item.product?.images && item.product.images[0]?.image_url)}
                      alt={item.product?.name}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div>
                    <Link
                      to={`/product/${item.product?.slug}`}
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {item.product?.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {item.variant}
                      </p>
                    )}
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-2">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                {/* Stepper & Remove Button */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Stepper */}
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50/50 px-2.5 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Remove Trash Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary (Exact card from Mockup) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              
              <h2 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-semibold">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'text-slate-900 font-semibold'}>
                    {shipping === 0 ? '₹0' : formatPrice(shipping)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-base font-extrabold text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-full font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Coupon Code Section */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Have a Coupon Code?
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-700">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <span>({appliedCoupon.discount_type === 'PERCENTAGE' ? `${appliedCoupon.value}% OFF` : `₹${appliedCoupon.value} OFF`})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-500 hover:underline font-semibold text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 uppercase placeholder:normal-case"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Feedback Messages */}
                {couponError && (
                  <p className="text-xs text-rose-500 flex items-center gap-1 font-medium animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                  </p>
                )}
                {couponSuccess && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium animate-in fade-in">
                    <Check className="w-3.5 h-3.5" /> {couponSuccess}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Available coupons:</span>
                  <span className="font-mono font-bold text-blue-600 cursor-pointer" onClick={() => setCouponInput('AVOXELL10')}>AVOXELL10</span>,
                  <span className="font-mono font-bold text-blue-600 cursor-pointer" onClick={() => setCouponInput('WELCOME500')}>WELCOME500</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
