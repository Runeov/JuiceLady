'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, TrendingUp, DollarSign, ShoppingBag, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Order {
  id: string;
  total: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?limit=500');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      if (!o.createdAt) return false;
      const d = new Date(o.createdAt);
      if (timeRange === 'today') {
        return d.toDateString() === now.toDateString();
      }
      if (timeRange === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
      }
      const monthAgo = new Date(now);
      monthAgo.setDate(monthAgo.getDate() - 30);
      return d >= monthAgo;
    });
  }, [orders, timeRange]);

  const stats = useMemo(() => {
    const completed = filteredOrders.filter(
      (o) => o.orderStatus !== 'cancelled'
    );
    const revenue = completed.reduce((sum, o) => sum + o.total, 0);
    const avgOrder = completed.length ? revenue / completed.length : 0;
    const cashOrders = completed.filter((o) => o.paymentMethod === 'cash').length;
    const cardOrders = completed.filter((o) => o.paymentMethod === 'stripe').length;

    // Top items
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    completed.forEach((order) => {
      order.items?.forEach((item: any) => {
        const key = item.name_en;
        if (!itemCounts[key]) {
          itemCounts[key] = { name: key, count: 0, revenue: 0 };
        }
        itemCounts[key].count += item.quantity;
        itemCounts[key].revenue += item.totalPrice;
      });
    });
    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Revenue by hour (for today view)
    const hourlyRevenue: Record<number, number> = {};
    if (timeRange === 'today') {
      for (let i = 8; i <= 22; i++) hourlyRevenue[i] = 0;
      completed.forEach((o) => {
        const hour = new Date(o.createdAt).getHours();
        hourlyRevenue[hour] = (hourlyRevenue[hour] || 0) + o.total;
      });
    }

    return {
      totalOrders: completed.length,
      revenue,
      avgOrder: Math.round(avgOrder),
      cashOrders,
      cardOrders,
      cancelled: filteredOrders.length - completed.length,
      topItems,
      hourlyRevenue,
    };
  }, [filteredOrders, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cameron-600 animate-spin" />
      </div>
    );
  }

  const maxHourlyRevenue = Math.max(...Object.values(stats.hourlyRevenue), 1);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(['today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                timeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Revenue',
            value: `฿${stats.revenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-green-50 text-green-600',
          },
          {
            label: 'Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Avg Order',
            value: `฿${stats.avgOrder}`,
            icon: TrendingUp,
            color: 'bg-purple-50 text-purple-600',
          },
          {
            label: 'Cancelled',
            value: stats.cancelled,
            icon: BarChart3,
            color: 'bg-red-50 text-red-600',
          },
        ].map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly revenue chart (today only) */}
        {timeRange === 'today' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Revenue by Hour</h3>
            <div className="flex items-end gap-1 h-40">
              {Object.entries(stats.hourlyRevenue).map(([hour, revenue]) => (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-cameron-200 hover:bg-cameron-400 rounded-t-md transition-colors"
                    style={{
                      height: `${Math.max((revenue / maxHourlyRevenue) * 100, 2)}%`,
                    }}
                    title={`${hour}:00 — ฿${revenue}`}
                  />
                  <span className="text-[9px] text-gray-400">{hour}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment method breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">💵 Cash</span>
                <span className="font-medium">{stats.cashOrders} orders</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{
                    width: `${stats.totalOrders ? (stats.cashOrders / stats.totalOrders) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">💳 Card (Stripe)</span>
                <span className="font-medium">{stats.cardOrders} orders</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all"
                  style={{
                    width: `${stats.totalOrders ? (stats.cardOrders / stats.totalOrders) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Top Items</h3>
          {stats.topItems.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-2">
              {stats.topItems.map((item, i) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <span
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                      i === 0
                        ? 'bg-amber-100 text-amber-700'
                        : i === 1
                        ? 'bg-gray-200 text-gray-600'
                        : i === 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-50 text-gray-400'
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-900">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.count} sold
                  </span>
                  <span className="text-sm font-bold text-cameron-700">
                    ฿{item.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
