'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Search, RefreshCw } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt?: string;
  items: any[];
  userId?: string | null;
  userEmail?: string | null;
}

interface CustomerSummary {
  key: string;
  name: string;
  phone?: string;
  email?: string;
  userId?: string | null;
  orders: Order[];
  totalSpent: number;
  lastOrderAt?: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  ready: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?limit=500');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const customers = useMemo<CustomerSummary[]>(() => {
    const map = new Map<string, CustomerSummary>();
    for (const order of orders) {
      const key = order.userId || (order.customerPhone ? `phone:${order.customerPhone}` : order.id);
      const existing = map.get(key);
      const createdAt = order.createdAt || undefined;
      if (!existing) {
        map.set(key, {
          key,
          name: order.customerName || 'Unknown',
          phone: order.customerPhone || undefined,
          email: order.userEmail || undefined,
          userId: order.userId || undefined,
          orders: [order],
          totalSpent: order.total || 0,
          lastOrderAt: createdAt,
        });
      } else {
        existing.orders.push(order);
        existing.totalSpent += order.total || 0;
        if (createdAt && (!existing.lastOrderAt || Date.parse(createdAt) > Date.parse(existing.lastOrderAt))) {
          existing.lastOrderAt = createdAt;
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => {
      const aTime = a.lastOrderAt ? Date.parse(a.lastOrderAt) : 0;
      const bTime = b.lastOrderAt ? Date.parse(b.lastOrderAt) : 0;
      return bTime - aTime;
    });
  }, [orders]);

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.userId || '').toLowerCase().includes(q)
    );
  });

  const selected = customers.find((c) => c.key === selectedKey) || null;

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
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-cameron-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="divide-y divide-gray-50 max-h-[560px] overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400">No customers found</div>
            ) : (
              filteredCustomers.map((customer) => (
                <button
                  key={customer.key}
                  onClick={() => setSelectedKey(customer.key)}
                  className={cn(
                    'w-full text-left px-5 py-4 hover:bg-gray-50/60 transition-colors',
                    selectedKey === customer.key && 'bg-cameron-50/60'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-400">{customer.phone || 'No phone'}</p>
                      {customer.email && <p className="text-xs text-gray-400">{customer.email}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(customer.totalSpent)}</p>
                      <p className="text-xs text-gray-400">
                        {customer.orders.length} orders
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {!selected ? (
            <div className="text-sm text-gray-400">Select a customer to view history.</div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                  <p className="text-xs text-gray-400">{selected.phone || 'No phone'}</p>
                  {selected.email && <p className="text-xs text-gray-400">{selected.email}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatPrice(selected.totalSpent)}</p>
                  <p className="text-xs text-gray-400">{selected.orders.length} orders</p>
                </div>
              </div>

              <div className="space-y-3">
                {selected.orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-gray-100 p-4 bg-gray-50/40"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 font-mono">#{order.id.slice(0, 8)}</p>
                        <p className="text-[11px] text-gray-400">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString('th-TH', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
                        <span
                          className={cn(
                            'text-[10px] font-medium px-2 py-0.5 rounded-full',
                            statusColors[order.orderStatus] || 'bg-gray-100'
                          )}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {order.items?.map((i: any) => `${i.quantity}x ${i.name_en}`).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
