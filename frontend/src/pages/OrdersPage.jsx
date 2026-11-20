import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await api.getOrders();
      if (data && data.length > 0) {
        setOrders(data);
      } else {
        // Fallback demo order
        setOrders([
          {
            id: 1,
            order_no: 'AVX-928410',
            created_at: '2026-11-20T10:30:00Z',
            total: 7498,
            status: 'Confirmed',
            payment_status: 'Paid',
            items: [
              {
                id: 1,
                product_name: 'Avoxell ProPods Wireless Headphones',
                price: 4999,
                quantity: 1,
                image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'
              },
              {
                id: 2,
                product_name: 'Avoxell Backpack (Black)',
                price: 2499,
                quantity: 1,
                image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80'
              }
            ]
          }
        ]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const formatPrice = (val) => '₹' + Number(val).toLocaleString('en-IN');

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order History
          </h1>
          <p className="text-xs text-slate-500 mt-1">Track and manage your past purchases</p>
        </div>
        <Link
          to="/shop"
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          Shop More →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500">Your orders will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_no}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Order: </span>
                  <span className="font-mono font-bold text-slate-900">{order.order_no}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[11px] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {order.status}
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-12 h-12 object-contain rounded-xl bg-slate-50 p-1"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{item.product_name}</p>
                        <p className="text-slate-400 text-[11px]">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-blue-600" /> Standard Delivery (2–4 Days)
                </span>
                <span className="font-medium text-slate-400">Paid securely via {order.payment_method || 'Online'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
