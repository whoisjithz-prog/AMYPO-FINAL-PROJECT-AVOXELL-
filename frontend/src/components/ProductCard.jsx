import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const formatPrice = (val) => {
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  const formatRatingCount = (count) => {
    if (!count) return '1k';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
    }
    return count;
  };

  return (
    <div className="group relative bg-white rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 border border-slate-100 flex flex-col justify-between">
      
      {/* Top Wishlist Heart */}
      <div className="flex items-center justify-between z-10">
        {product.badge ? (
          <span className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 rounded-full">
            {product.badge}
          </span>
        ) : <span />}
        <button
          onClick={handleWishlist}
          className={`p-2 rounded-full transition-colors ${
            isFavorited
              ? 'text-rose-500 bg-rose-50'
              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="block my-2 overflow-hidden rounded-2xl">
        <div className="relative aspect-square w-full flex items-center justify-center p-4">
          <img
            src={product.primary_image || (product.images && product.images[0]?.image_url)}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="space-y-2">
        <Link to={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price & Rating */}
        <div className="flex items-baseline justify-between">
          <span className="text-base font-bold text-slate-900">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{product.rating_avg}</span>
            <span className="text-slate-400">({formatRatingCount(product.rating_count)})</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 mt-2 ${
            added
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added to Cart
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>

    </div>
  );
}
