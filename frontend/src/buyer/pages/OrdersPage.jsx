import React, { useState } from 'react';
import { ShoppingBag, Clock, CheckCircle2, XCircle, ChevronRight, Package, AlertCircle } from 'lucide-react';
import { EmptyState } from '../components/ui/StateViews';

export const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const orders = [
    {
      id: 'ORD-9821',
      cropName: 'Sharbati Organic Wheat',
      farmerName: 'Gurpreet Singh',
      quantity: '100 Quintals',
      totalAmount: 285000,
      orderDate: '2026-07-18',
      status: 'Pending',
      dispatchLocation: 'Ludhiana Warehouse',
      expectedDelivery: '2026-07-22'
    },
    {
      id: 'ORD-9750',
      cropName: '1121 Super Basmati Rice',
      farmerName: 'Ramesh Patel',
      quantity: '200 Quintals',
      totalAmount: 980000,
      orderDate: '2026-07-10',
      status: 'Completed',
      dispatchLocation: 'Karnal Distribution Yard',
      deliveryDate: '2026-07-14'
    },
    {
      id: 'ORD-9612',
      cropName: 'Desi Red Onions',
      farmerName: 'Sunil Deshmukh',
      quantity: '50 Quintals',
      totalAmount: 92500,
      orderDate: '2026-06-28',
      status: 'Completed',
      dispatchLocation: 'Nashik Mandi Yard',
      deliveryDate: '2026-07-02'
    },
    {
      id: 'ORD-9504',
      cropName: 'Golden Sweet Corn',
      farmerName: 'Anil Kumar',
      quantity: '80 Quintals',
      totalAmount: 116000,
      orderDate: '2026-06-15',
      status: 'Cancelled',
      cancellationReason: 'Transport route logistics unavailable'
    }
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'pending') return o.status === 'Pending';
    if (activeTab === 'completed') return o.status === 'Completed';
    if (activeTab === 'cancelled') return o.status === 'Cancelled';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text font-display">Orders History & Preview</h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Track active procurement dispatches and historical order receipts.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-bold self-start sm:self-auto">
          Module 9 Preview Mode
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/80 gap-6 text-xs font-bold">
        {[
          { id: 'all', label: 'All Orders', count: orders.length },
          { id: 'pending', label: 'Pending', count: orders.filter((o) => o.status === 'Pending').length },
          { id: 'completed', label: 'Completed', count: orders.filter((o) => o.status === 'Completed').length },
          { id: 'cancelled', label: 'Cancelled', count: orders.filter((o) => o.status === 'Cancelled').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400 font-extrabold'
                : 'border-transparent text-text/50 hover:text-text'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-2 py-0.5 rounded-full bg-surface text-[10px]">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Found"
          description="There are no purchase orders matching the selected filter tab."
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-card border border-border/80 rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                    {ord.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      ord.status === 'Pending'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : ord.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {ord.status === 'Pending' && <Clock className="w-3 h-3" />}
                    {ord.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                    {ord.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                    <span>{ord.status}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-text font-display">{ord.cropName}</h3>
                <p className="text-xs text-text/50">
                  Seller: <span className="text-text font-medium">{ord.farmerName}</span> • Quantity:{' '}
                  <span className="text-text font-medium">{ord.quantity}</span>
                </p>
                <p className="text-[11px] text-text/40">Dispatch Hub: {ord.dispatchLocation}</p>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-border/60 pt-3 md:pt-0 shrink-0">
                <span className="text-lg font-extrabold text-text font-display">₹{ord.totalAmount.toLocaleString()}</span>
                <span className="text-[11px] text-text/40">Date: {ord.orderDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
