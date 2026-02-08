'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
  customerNote?: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

const statusOptions = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?limit=100');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, orderStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  const filtered = orders
    .filter((o) => statusFilter === 'all' || o.orderStatus === statusFilter)
    .filter(
      (o) =>
        !searchQuery ||
        o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.includes(searchQuery)
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cameron-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or order ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-cameron-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border',
                statusFilter === status
                  ? 'bg-cameron-700 text-white border-cameron-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-1 opacity-60">
                  ({orders.filter((o) => o.orderStatus === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Order</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Items</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Total</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Payment</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</p>
                      <p className="text-[10px] text-gray-400">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString('th-TH', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600 truncate max-w-[200px]">
                        {order.items?.map((i: any) => `${i.quantity}x ${i.name_en}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-sm text-gray-900">฿{order.total}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('text-[10px] font-medium px-2 py-1 rounded-full',
                        order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                      )}>
                        {order.paymentMethod === 'cash' ? '💵' : '💳'} {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={cn(
                          'text-[11px] font-medium px-2 py-1 rounded-lg border-0 cursor-pointer',
                          statusColors[order.orderStatus] || 'bg-gray-100'
                        )}
                      >
                        {statusOptions.filter((s) => s !== 'all').map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-xs text-cameron-600 hover:text-cameron-700 font-medium"
                      >
                        {selectedOrder?.id === order.id ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail panel */}
      {selectedOrder && (
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-3">
            Order #{selectedOrder.id.slice(0, 8)} — {selectedOrder.customerName}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-500">Phone:</span>{' '}
              <span className="font-medium">{selectedOrder.customerPhone}</span>
            </div>
            <div>
              <span className="text-gray-500">Payment:</span>{' '}
              <span className="font-medium">{selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</span>
            </div>
            {selectedOrder.customerNote && (
              <div className="col-span-2">
                <span className="text-gray-500">Note:</span>{' '}
                <span className="font-medium text-amber-700">{selectedOrder.customerNote}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {selectedOrder.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                <div>
                  <span className="font-medium">{item.quantity}x {item.name_en}</span>
                  <span className="text-gray-400 text-xs ml-2">({item.name_th})</span>
                  {item.addons?.length > 0 && (
                    <p className="text-xs text-amber-600">
                      + {item.addons.map((a: any) => a.name_en).join(', ')}
                    </p>
                  )}
                  {item.notes && <p className="text-xs text-gray-400 italic">{item.notes}</p>}
                </div>
                <span className="font-medium">฿{item.totalPrice}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
            <span className="text-lg font-bold text-gray-900">Total: ฿{selectedOrder.total}</span>
          </div>
        </div>
      )}
    </div>
  );
}
