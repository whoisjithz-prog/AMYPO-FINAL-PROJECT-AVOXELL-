import React from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ShieldCheck } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900">About Avoxell</h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Crafting premium audio engineering, intelligent wearable tech, and modern lifestyle essentials.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6 text-sm leading-relaxed text-slate-600">
        <p>
          Founded on the principle of uncompromised acoustic fidelity and modern industrial design, Avoxell brings studio-grade audio experiences and smart everyday devices to discerning listeners and tech enthusiasts worldwide.
        </p>
        <p>
          Every curve, membrane, and driver in our flagship ProPods and wearable collection undergoes rigorous acoustic benchmarking to guarantee exceptional clarity, deep dynamic range, and ergonomic all-day comfort.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 text-center">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <h3 className="text-2xl font-extrabold text-blue-600">1M+</h3>
            <p className="text-xs text-slate-500 mt-1">Happy Customers</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl">
            <h3 className="text-2xl font-extrabold text-blue-600">4.8★</h3>
            <p className="text-xs text-slate-500 mt-1">Average Product Rating</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl">
            <h3 className="text-2xl font-extrabold text-blue-600">100%</h3>
            <p className="text-xs text-slate-500 mt-1">Genuine Warranty</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact Customer Support</h1>
        <p className="text-slate-500 text-sm">We are here 24/7 to assist with your orders and inquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center space-y-2">
          <Mail className="w-6 h-6 text-blue-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Email Us</h3>
          <p className="text-xs text-slate-500">support@avoxell.com</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center space-y-2">
          <Phone className="w-6 h-6 text-blue-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Call Us</h3>
          <p className="text-xs text-slate-500">+91 (800) 425-9000</p>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center space-y-2">
          <MapPin className="w-6 h-6 text-blue-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Headquarters</h3>
          <p className="text-xs text-slate-500">Bandra West, Mumbai 400050</p>
        </div>
      </div>
    </div>
  );
}
