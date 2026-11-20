import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronDown, SlidersHorizontal, X, Check } from 'lucide-react';
import { api } from '../services/api';
import { INITIAL_PRODUCTS, CATEGORIES, BRANDS } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States initialized from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const selectedRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : 0;
  const maxPriceParam = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : 10000;
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('ordering') || 'popularity';

  const [priceRange, setPriceRange] = useState(maxPriceParam);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [totalCount, setTotalCount] = useState(342);
  const [loading, setLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch or filter products
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (selectedRating > 0) params.rating = selectedRating;
      if (priceRange < 10000) params.max_price = priceRange;
      if (searchQuery) params.q = searchQuery;
      if (sortBy) params.ordering = sortBy;

      const data = await api.getProducts(params);
      if (data && data.results && data.results.length > 0) {
        setProducts(data.results);
        setTotalCount(data.total_count || 342);
      } else {
        // High fidelity client-side fallback
        let filtered = [...INITIAL_PRODUCTS];
        if (selectedCategory) {
          filtered = filtered.filter(p => p.category_name?.toLowerCase().includes(selectedCategory.toLowerCase()));
        }
        if (selectedBrand) {
          filtered = filtered.filter(p => p.brand_name?.toLowerCase().includes(selectedBrand.toLowerCase()));
        }
        if (selectedRating > 0) {
          filtered = filtered.filter(p => p.rating_avg >= selectedRating);
        }
        if (priceRange < 10000) {
          filtered = filtered.filter(p => p.price <= priceRange);
        }
        if (searchQuery) {
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (sortBy === 'price_asc') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_desc') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          filtered.sort((a, b) => b.rating_avg - a.rating_avg);
        } else if (sortBy === 'newest') {
          filtered.sort((a, b) => b.id - a.id);
        } else {
          filtered.sort((a, b) => b.rating_count - a.rating_count);
        }
        setProducts(filtered);
        setTotalCount(filtered.length === 0 ? 0 : 342);
      }
      setLoading(false);
    };

    fetchFilteredProducts();
  }, [selectedCategory, selectedBrand, selectedRating, priceRange, searchQuery, sortBy]);

  // Update query params
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 0) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceRange(10000);
  };

  const ratingsList = [
    { label: '5 & above', value: 5 },
    { label: '4 & above', value: 4 },
    { label: '3 & above', value: 3 },
    { label: '2 & above', value: 2 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Secondary Promo Banner (From Top-Right of Reference Mockup) */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#d9ebff] via-[#e8f2fe] to-[#f3f8ff] border border-blue-100/70 p-8 sm:p-10 shadow-soft">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Smart Choices. <br />
              <span className="text-slate-900">Better Living.</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Explore our exclusive collection
            </p>
            <div className="pt-1">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold text-xs tracking-wide shadow-md transition-all hover:scale-105"
              >
                <span>Shop the Sale</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-4 flex items-center justify-center">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
                alt="Smart watch collection"
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden col-span-12 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters & Categories</span>
          </button>
          <span className="text-xs text-slate-500">
            {products.length} products
          </span>
        </div>

        {/* Sidebar Filters (Exact UI from Top-Right Mockup) */}
        <aside
          className={`col-span-12 lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 ${
            isMobileFilterOpen
              ? 'fixed inset-0 z-50 overflow-y-auto p-6 bg-white m-0 rounded-none'
              : 'hidden lg:block'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Filters</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Clear all
              </button>
              {isMobileFilterOpen && (
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* 1. Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Category</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </h4>
            <div className="space-y-2 pt-1">
              {CATEGORIES.map((cat) => {
                const isChecked = selectedCategory === cat.slug;
                return (
                  <label
                    key={cat.slug}
                    className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer group select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => updateFilter('category', isChecked ? '' : cat.slug)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={isChecked ? 'font-bold text-blue-600' : ''}>
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">({cat.count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Price Range */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Price Range
            </h4>
            <div className="space-y-2 pt-1">
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={priceRange}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceRange(val);
                  updateFilter('max_price', val);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString('en-IN')}+</span>
              </div>
            </div>
          </div>

          {/* 3. Brand Filter */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Brand
            </h4>
            <div className="space-y-2 pt-1">
              {BRANDS.map((brand) => {
                const isChecked = selectedBrand === brand.slug;
                return (
                  <label
                    key={brand.slug}
                    className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer group select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => updateFilter('brand', isChecked ? '' : brand.slug)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={isChecked ? 'font-bold text-blue-600' : ''}>
                        {brand.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">({brand.count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 4. Ratings Filter */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Ratings
            </h4>
            <div className="space-y-2 pt-1">
              {ratingsList.map((r) => {
                const isChecked = selectedRating === r.value;
                return (
                  <label
                    key={r.value}
                    className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => updateFilter('rating', isChecked ? '' : r.value)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(r.value)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-slate-500">& above</span>
                  </label>
                );
              })}
            </div>
          </div>

          {isMobileFilterOpen && (
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-full font-semibold text-xs mt-4"
            >
              Apply Filters
            </button>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* Top Results Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100">
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">1–{products.length}</span> of <span className="font-bold text-slate-900">{totalCount}</span> products
            </p>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => updateFilter('ordering', e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid (Exact 4 Columns from Mockup) */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
              <p className="text-base font-semibold text-slate-700">No products match your filters</p>
              <p className="text-xs text-slate-400">Try adjusting your price range, ratings or category selection.</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <button className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">
              Previous
            </button>
            <button className="w-9 h-9 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm">
              1
            </button>
            <button className="w-9 h-9 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold">
              2
            </button>
            <button className="w-9 h-9 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold">
              3
            </button>
            <button className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Next
            </button>
          </div>

        </main>

      </div>

    </div>
  );
}
