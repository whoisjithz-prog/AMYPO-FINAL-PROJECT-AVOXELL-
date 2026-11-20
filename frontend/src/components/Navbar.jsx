import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, ChevronDown, User, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { itemCount, wishlist } = useCart();
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', hasDropdown: true },
    { name: 'Deals', path: '/shop?badge=Hot+Deal' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const categories = [
    { name: 'Electronics', path: '/shop?category=electronics' },
    { name: 'Fashion', path: '/shop?category=fashion' },
    { name: 'Home & Living', path: '/shop?category=home-living' },
    { name: 'Beauty', path: '/shop?category=beauty' },
    { name: 'Sports', path: '/shop?category=sports' },
    { name: 'Accessories', path: '/shop?category=accessories' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 22h4.5l2.5-5h6l2.5 5H22L12 2zm0 6.5l2.25 4.5h-4.5L12 8.5z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Avoxell
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setIsCategoryOpen(true)}
                    onMouseLeave={() => setIsCategoryOpen(false)}
                  >
                    <button
                      className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 py-2 transition-colors"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    >
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isCategoryOpen && (
                      <div className="absolute top-full left-0 w-52 py-2 bg-white rounded-2xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                        {categories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={cat.path}
                            onClick={() => setIsCategoryOpen(false)}
                            className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-full border border-slate-200/80 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart with Badge */}
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {itemCount}
              </span>
            </Link>

            {/* User Avatar / Profile Dropdown */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative flex items-center focus:outline-none group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-500 transition-all"
                  />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Profile Dropdown */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-2xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  >
                    Wishlist ({wishlist.length})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search & Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 py-4 px-2 space-y-3">
            <form onSubmit={handleSearch} className="relative mb-3">
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 text-sm rounded-full border border-slate-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
            <div className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 rounded-lg">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 rounded-lg">Shop</Link>
              <Link to="/shop?badge=Hot+Deal" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 rounded-lg">Deals</Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 rounded-lg">My Orders</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 rounded-lg">About</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 rounded-lg">Contact</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
