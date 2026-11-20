import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { INITIAL_PRODUCTS } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useCart();

  const wishlistProducts = INITIAL_PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Products you have saved for later</p>
        </div>
        <Link
          to="/shop"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Explore More →
        </Link>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500">Tap the heart icon on any product to save it here.</p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full text-xs font-semibold"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
