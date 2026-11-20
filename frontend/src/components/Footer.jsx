import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const SocialIcon = ({ type }) => {
  if (type === 'youtube') {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  if (type === 'instagram') {
    return (
      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    );
  }
  if (type === 'twitter') {
    return (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 22h4.5l2.5-5h6l2.5 5H22L12 2zm0 6.5l2.25 4.5h-4.5L12 8.5z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Avoxell
              </span>
            </Link>
            <p className="text-sm font-medium text-slate-500">
              Shop Smart. Live Better.
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Experience the pinnacle of audio engineering, smart wearable technology, and premium lifestyle essentials designed for modern perfection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Shop</Link></li>
              <li><Link to="/about" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5">
              <li><Link to="/faqs" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">FAQs</Link></li>
              <li><Link to="/shipping" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Returns</Link></li>
              <li><Link to="/support" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Follow Us & Newsletter */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Follow Us
              </h4>
              <div className="flex items-center space-x-3 text-slate-400">
                <a href="#youtube" className="hover:text-blue-600 transition-colors" title="YouTube"><SocialIcon type="youtube" /></a>
                <a href="#instagram" className="hover:text-blue-600 transition-colors" title="Instagram"><SocialIcon type="instagram" /></a>
                <a href="#twitter" className="hover:text-blue-600 transition-colors" title="X (Twitter)"><SocialIcon type="twitter" /></a>
                <a href="#facebook" className="hover:text-blue-600 transition-colors" title="Facebook"><SocialIcon type="facebook" /></a>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Subscribe to our newsletter
              </h4>
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3.5 pr-11 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Thanks for subscribing!
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Avoxell Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
