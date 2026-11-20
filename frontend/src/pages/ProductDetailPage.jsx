import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, Share2, Shield, Truck, RotateCcw,
  Plus, Minus, Check, Sparkles, MessageSquare, Send
} from 'lucide-react';
import { api } from '../services/api';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [addedNotice, setAddedNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review submission state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await api.getProduct(slug);
      if (data) {
        setProduct(data);
      } else {
        // Fallback from mock data
        const found = INITIAL_PRODUCTS.find((p) => p.slug === slug) || INITIAL_PRODUCTS[0];
        setProduct(found);
      }
      setSelectedImageIndex(0);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    fetchProduct();
  }, [slug]);

  if (!product) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading product details...</p>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images.map(img => typeof img === 'string' ? img : img.image_url)
    : [product.primary_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'];

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, 'Sky Blue');
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, 'Sky Blue');
    navigate('/cart');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      user_name: reviewerName || 'Verified Buyer',
      rating: reviewRating,
      comment: reviewComment,
      created_at: new Date().toISOString()
    };

    try {
      await api.addReview(product.id, newRev);
    } catch (err) {}

    // Update local product reviews
    const updatedReviews = [newRev, ...(product.reviews || [])];
    setProduct({
      ...product,
      reviews: updatedReviews,
      rating_count: (product.rating_count || 1) + 1
    });

    setReviewComment('');
    setReviewerName('');
    setReviewSuccess('Thank you! Your review has been published.');
    setTimeout(() => setReviewSuccess(''), 4000);
  };

  const formatPrice = (val) => '₹' + Number(val).toLocaleString('en-IN');

  return (
    <div className="space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-blue-600">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category_name?.toLowerCase() || 'electronics'}`} className="hover:text-blue-600">
          {product.category_name || 'Electronics'}
        </Link>
        <span>/</span>
        <span className="text-slate-700 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid (Exact layout from Bottom-Left panel of mockup) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Gallery Column (Vertical Thumbnails + Large Main Image) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          
          {/* Vertical Thumbnails */}
          <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 bg-white border-2 overflow-hidden transition-all flex items-center justify-center flex-shrink-0 ${
                  selectedImageIndex === idx
                    ? 'border-blue-600 ring-2 ring-blue-100 shadow-sm'
                    : 'border-slate-100 hover:border-blue-300'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </button>
            ))}
          </div>

          {/* Large Main Showcase Box */}
          <div className="flex-1 order-1 md:order-2">
            <div className="relative aspect-square w-full rounded-[2.5rem] bg-gradient-to-br from-[#ebf4ff] via-[#f2f7fe] to-[#f8faff] p-8 sm:p-12 border border-blue-100/60 shadow-soft flex items-center justify-center overflow-hidden group">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Social Share Bar (Below Thumbnails in Reference Image) */}
            <div className="flex items-center gap-4 pt-4 px-2 text-xs font-semibold text-slate-500">
              <span>Share:</span>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-colors"
                title="Copy link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <a
                href={`https://facebook.com/sharer/sharer.php?u=${window.location.href}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600"
              >
                X (Twitter)
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=${window.location.href}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600"
              >
                Pinterest
              </a>
              {copiedLink && (
                <span className="text-emerald-600 font-bold animate-in fade-in">
                  Link copied!
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Product Details Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Badge */}
          {product.badge && (
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide">
              {product.badge}
            </span>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Rating & Sold Stats */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-800">{product.rating_avg}</span>
              <span>({(product.rating_count || 12450).toLocaleString()} reviews)</span>
            </div>
            <span>|</span>
            <span className="font-semibold text-slate-700">{product.units_sold || '1M+ sold'}</span>
          </div>

          {/* Pricing Block */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-base text-slate-400 line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
            {product.discount_pct > 0 && (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                {product.discount_pct}% OFF
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Key Feature Highlights */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {(product.features && product.features.length > 0 ? product.features : [
              'Active Noise Cancellation',
              'Up to 40hrs Battery Life',
              'Premium Sound Quality'
            ]).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Action Row: Quantity Stepper + Add to Cart + Heart */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              
              {/* Stepper */}
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 20, quantity + 1))}
                  className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-full font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-full border transition-all ${
                  isFavorited
                    ? 'border-rose-200 bg-rose-50 text-rose-500 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-500 hover:text-rose-500 hover:bg-slate-50'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buy Now Button (Full width pill outline as in mockup) */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white rounded-full font-bold text-xs tracking-wide transition-all duration-200"
            >
              Buy Now
            </button>
          </div>

          {/* Delivery & Stock reassurance */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Free Delivery on ₹999+</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>1 Year Official Warranty</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs: Specifications & Customer Reviews */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-6 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-sm font-bold pb-2 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Product Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-bold pb-2 border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Customer Reviews ({product.reviews?.length || 3})
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">Acoustic Specs</h4>
              <p>• Custom 40mm low-distortion titanium drivers with neodymium magnets</p>
              <p>• Hybrid Active Noise Cancellation with dual feedback microphones</p>
              <p>• Frequency Response: 20Hz – 40,000Hz (Hi-Res Audio Certified)</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">Connectivity & Power</h4>
              <p>• Bluetooth 5.3 with multi-device seamless switching</p>
              <p>• Battery: Up to 40 hours with ANC on (50 hours with ANC off)</p>
              <p>• USB Type-C fast charge: 5 minutes gives 4 hours of music playback</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Reviews List */}
            <div className="space-y-4">
              {(product.reviews && product.reviews.length > 0 ? product.reviews : [
                {
                  id: 1,
                  user_name: 'Rohit Sharma',
                  rating: 5,
                  comment: 'Outstanding build quality and comfort. The sound clarity and noise cancelling are remarkable!',
                  created_at: '2026-11-18'
                },
                {
                  id: 2,
                  user_name: 'Priya Patel',
                  rating: 5,
                  comment: 'Fast delivery, securely packed. Looks so elegant in person, exact match with pictures.',
                  created_at: '2026-11-15'
                }
              ]).map((rev, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{rev.user_name}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Write a Review</h4>
              <form onSubmit={handleAddReview} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Poor</option>
                    <option value={1}>1 Star - Terrible</option>
                  </select>
                </div>
                <textarea
                  placeholder="Share your experience with this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
                >
                  Submit Review
                </button>
                {reviewSuccess && (
                  <p className="text-xs text-emerald-600 font-semibold">{reviewSuccess}</p>
                )}
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Related Products */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {INITIAL_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </div>
  );
}
