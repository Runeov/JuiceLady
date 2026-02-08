'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderSummary {
  id: string;
  customerName: string;
  total: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Poll every 30 seconds for new orders
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?limit=20');
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
      console.error('Failed to update status:', err);
    }
  };

  // Stats
  const todayOrders = orders.filter((o) => {
    const today = new Date().toISOString().split('T')[0];
    return o.createdAt?.startsWith(today);
  });
  const todayRevenue = todayOrders
    .filter((o) => o.paymentStatus === 'paid' || o.paymentMethod === 'cash')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed'
  );

  const stats = [
    {
      label: "Today's Revenue",
      value: `฿${todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: "Today's Orders",
      value: todayOrders.length,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Pending',
      value: pendingOrders.length,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Avg Order',
      value: todayOrders.length
        ? `฿${Math.round(todayRevenue / todayOrders.length)}`
        : '฿0',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cameron-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <button
            onClick={fetchOrders}
            className="text-xs text-cameron-600 hover:text-cameron-700 font-medium"
          >
            Refresh
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {orders.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              No orders yet
            </div>
          ) : (
            orders.slice(0, 15).map((order) => (
              <div
                key={order.id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
              >
                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-400">
                      #{order.id.slice(0, 6)}
                    </span>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', statusColors[order.orderStatus] || 'bg-gray-100')}>
                      {order.orderStatus}
                    </span>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full',
                      order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                    )}>
                      {order.paymentMethod === 'cash' ? '💵 cash' : '💳 card'}{' '}
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {order.items?.map((i: any) => `${i.quantity}x ${i.name_en}`).join(', ')}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">฿{order.total}</p>
                  <p className="text-[10px] text-gray-400">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 shrink-0">
                  {order.orderStatus === 'pending' && (
                    <button
                      onClick={() => updateStatus(order.id, 'confirmed')}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      title="Confirm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </button>
                  )}
                  {order.orderStatus === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(order.id, 'preparing')}
                      className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                      title="Start preparing"
                    >
                      <Clock className="w-4 h-4 text-purple-600" />
                    </button>
                  )}
                  {order.orderStatus === 'preparing' && (
                    <button
                      onClick={() => updateStatus(order.id, 'ready')}
                      className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                      title="Ready"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                  {order.orderStatus === 'ready' && (
                    <button
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      title="Complete"
                    >
                      <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                  {['pending', 'confirmed'].includes(order.orderStatus) && (
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                      title="Cancel"
                    >
                      <XCircle className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
