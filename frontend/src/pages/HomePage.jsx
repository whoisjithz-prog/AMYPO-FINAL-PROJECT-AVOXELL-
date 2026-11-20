import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, Headphones, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { INITIAL_PRODUCTS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getHomeData();
      if (data) {
        if (data.featured_products && data.featured_products.length > 0) {
          setFeaturedProducts(data.featured_products);
        }
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    };
    fetchData();
  }, []);

  const heroSlides = [
    {
      badge: "A Avoxell",
      titleLine1: "Dream Bigger.",
      titleLine2: "Shop Smarter.",
      subtitle: "Premium quality. Unbeatable prices.",
      cta: "Shop Now",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      accent: "from-blue-100 via-sky-50 to-blue-50"
    },
    {
      badge: "New Release",
      titleLine1: "Sound Redefined.",
      titleLine2: "Pure Immersion.",
      subtitle: "Active Noise Cancellation with up to 40hr battery.",
      cta: "Explore ProPods",
      link: "/product/avoxell-propods-wireless-headphones",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
      accent: "from-sky-100 via-blue-50 to-indigo-50"
    },
    {
      badge: "Smart Living",
      titleLine1: "Precision Crafted.",
      titleLine2: "All-Day Elegance.",
      subtitle: "AMOLED curved display with real-time health telemetry.",
      cta: "Discover Wearables",
      link: "/shop?category=accessories",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      accent: "from-slate-100 via-blue-50 to-sky-100"
    },
    {
      badge: "Limited Edition",
      titleLine1: "Urban Commute.",
      titleLine2: "Weather Shield.",
      subtitle: "Cordura ballistic nylon with shockproof laptop cradle.",
      cta: "Shop Backpacks",
      link: "/shop?category=fashion",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80",
      accent: "from-blue-100 via-indigo-50 to-blue-50"
    }
  ];

  const current = heroSlides[activeSlide];

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const trustBadges = [
    {
      icon: Truck,
      title: 'Free Shipping',
      subtitle: 'On orders above ₹999'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      subtitle: '100% Protected'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      subtitle: "We're here to help"
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      subtitle: 'Hassle free'
    }
  ];

  return (
    <div className="space-y-12">
      
      {/* Hero Carousel Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#d9ebff] via-[#eaf3fe] to-[#f4f9ff] border border-blue-100/60 shadow-soft">
        
        {/* Subtle decorative background ribbons/curves */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full bg-sky-200/40 blur-2xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200/60 text-xs font-semibold text-blue-900 shadow-sm">
                <span>{current.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                {current.titleLine1} <br />
                <span className="text-slate-900">{current.titleLine2}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-md">
                {current.subtitle}
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  to={current.link}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  <span>{current.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center gap-2 pt-6">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeSlide === idx
                        ? 'w-7 bg-slate-900'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-6 flex items-center justify-center relative">
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all hover:scale-110"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all hover:scale-110"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Product Visual Showcase */}
              <div className="relative w-full max-w-lg aspect-square flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-300/20 to-sky-200/30 rounded-full blur-2xl transform scale-90" />
                <img
                  src={current.image}
                  alt={current.titleLine1}
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-2xl transition-all duration-500 transform hover:scale-105"
                />
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* Trust Badges Strip (Exact 4 Cards from Mockup) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {trustBadges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{badge.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{badge.subtitle}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Shop by Category (Exact 6 Categories from Mockup) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all text-center flex flex-col items-center"
            >
              <div className="w-full aspect-square bg-[#f6f9fe] group-hover:bg-[#edf5ff] rounded-2xl p-3 mb-3 flex items-center justify-center overflow-hidden transition-colors">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner: "Up to 60% OFF" */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 text-white shadow-soft-lg">
        <div className="relative z-10 px-8 sm:px-12 py-10 sm:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase mb-1">
              Limited Time Only!
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Up to 60% OFF
            </h2>
            <p className="text-sm sm:text-base text-blue-50 max-w-md">
              Upgrade your sound and tech essentials with exclusive seasonal discounts across all top categories.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/shop?badge=Hot+Deal"
              className="px-8 py-3.5 bg-white text-blue-600 hover:bg-blue-50 rounded-full font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              Grab Deals Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured / Trending Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Trending Products
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Handpicked customer favorites with best-in-class reviews
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Explore all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
