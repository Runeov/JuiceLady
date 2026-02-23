'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

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

interface FoundUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
}

interface WalkInItem {
  name: string;
  price: number;
  qty: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();

  // Walk-in form state
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
  const [searchingUser, setSearchingUser] = useState(false);

  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInEmail, setWalkInEmail] = useState('');
  const [walkInNote, setWalkInNote] = useState('');
  const [walkInItems, setWalkInItems] = useState<WalkInItem[]>([
    { name: 'Walk-in item', price: 30, qty: 1 },
  ]);
  const [creatingOrder, setCreatingOrder] = useState(false);

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

  const walkInTotal = useMemo(
    () => walkInItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0),
    [walkInItems]
  );

  const getIdToken = async () => {
    if (!user) throw new Error('Not signed in');
    return user.getIdToken();
  };

  const handleUserSearch = async () => {
    if (!lookupEmail.trim() && !lookupPhone.trim()) {
      toast.error('Enter email or phone to search');
      return;
    }
    setSearchingUser(true);
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/users/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: lookupEmail.trim(), phone: lookupPhone.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to search user');

      if (data.user) {
        setFoundUser(data.user);
        setWalkInName(data.user.displayName || walkInName);
        setWalkInEmail(data.user.email || walkInEmail);
        setWalkInPhone(data.user.phoneNumber || walkInPhone);
        toast.success('User found');
      } else {
        setFoundUser(null);
        toast.error('User not found');
      }
    } catch (error: any) {
      console.error('User search error:', error);
      toast.error(error.message || 'Failed to search user');
    } finally {
      setSearchingUser(false);
    }
  };

  const handleCreateUserAndSendEmail = async () => {
    if (!lookupEmail.trim()) {
      toast.error('Email is required to send invite');
      return;
    }
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: lookupEmail.trim(),
          phone: lookupPhone.trim(),
          displayName: walkInName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      setFoundUser(data.user);
      setWalkInEmail(data.user.email || walkInEmail);
      setWalkInPhone(data.user.phoneNumber || walkInPhone);
      setWalkInName(data.user.displayName || walkInName);

      await sendPasswordResetEmail(auth, lookupEmail.trim());
      toast.success('Invite email sent');
    } catch (error: any) {
      console.error('Invite error:', error);
      toast.error(error.message || 'Failed to send invite');
    }
  };

  const handleCreateWalkInOrder = async () => {
    if (!walkInName.trim()) {
      toast.error('Customer name is required');
      return;
    }
    if (walkInItems.length === 0 || walkInTotal <= 0) {
      toast.error('Add at least one item');
      return;
    }
    setCreatingOrder(true);
    try {
      const token = await getIdToken();
      const items = walkInItems.map((item, idx) => ({
        menuItemId: `walkin-${Date.now()}-${idx}`,
        name_en: item.name.trim(),
        name_th: item.name.trim(),
        temp: 'iced',
        size: 'M',
        addons: [],
        quantity: item.qty,
        unitPrice: item.price,
        totalPrice: item.price * item.qty,
        notes: '',
      }));

      const res = await fetch('/api/admin/orders/walkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          total: walkInTotal,
          customerName: walkInName.trim(),
          customerPhone: walkInPhone.trim(),
          customerNote: walkInNote.trim() || 'Walk-in',
          userId: foundUser?.uid,
          userEmail: foundUser?.email || walkInEmail.trim() || undefined,
          userPhone: foundUser?.phoneNumber || walkInPhone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create walk-in order');
      toast.success('Walk-in order created');
      fetchOrders();
      setWalkInItems([{ name: 'Walk-in item', price: 30, qty: 1 }]);
      setWalkInNote('');
    } catch (error: any) {
      console.error('Walk-in order error:', error);
      toast.error(error.message || 'Failed to create walk-in order');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cameron-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Walk-in Order</h2>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500">Find customer</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder="Email (optional)"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <input
                value={lookupPhone}
                onChange={(e) => setLookupPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUserSearch}
                disabled={searchingUser}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                {searchingUser ? 'Searching...' : 'Search user'}
              </button>
              <button
                onClick={handleCreateUserAndSendEmail}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-cameron-700 text-white hover:bg-cameron-800 transition-colors"
              >
                Create + send email
              </button>
            </div>
            {foundUser && (
              <div className="text-xs text-gray-500">
                Linked user: {foundUser.displayName || 'No name'} · {foundUser.email || 'No email'}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500">Customer details</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                placeholder="Name"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <input
                value={walkInEmail}
                onChange={(e) => setWalkInEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
              <input
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              />
            </div>
            <input
              value={walkInNote}
              onChange={(e) => setWalkInNote(e.target.value)}
              placeholder="Note (optional)"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Items</p>
          <div className="space-y-2">
            {walkInItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_80px_70px_40px] gap-2">
                <input
                  value={item.name}
                  onChange={(e) =>
                    setWalkInItems((prev) =>
                      prev.map((row, i) => (i === idx ? { ...row, name: e.target.value } : row))
                    )
                  }
                  placeholder="Item name"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    setWalkInItems((prev) =>
                      prev.map((row, i) =>
                        i === idx ? { ...row, price: Number(e.target.value) } : row
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    setWalkInItems((prev) =>
                      prev.map((row, i) =>
                        i === idx ? { ...row, qty: Number(e.target.value) } : row
                      )
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
                <button
                  onClick={() =>
                    setWalkInItems((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="rounded-lg border border-gray-200 text-xs hover:bg-gray-50"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() =>
                setWalkInItems((prev) => [...prev, { name: '', price: 0, qty: 1 }])
              }
              className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Add item
            </button>
            <div className="text-sm font-semibold text-gray-900">Total: ฿{walkInTotal}</div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreateWalkInOrder}
            disabled={creatingOrder}
            className="px-4 py-2 rounded-lg bg-cameron-700 text-white text-sm font-medium hover:bg-cameron-800 disabled:opacity-60"
          >
            {creatingOrder ? 'Saving...' : 'Create walk-in order'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div />
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
                filtered.map((order) => {
                  const isServed = order.orderStatus === 'completed';
                  return (
                    <tr
                      key={order.id}
                      className={cn(
                        'hover:bg-gray-50/50 transition-colors',
                        isServed && 'opacity-60'
                      )}
                    >
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
                      <p
                        className={cn(
                          'text-sm font-medium text-gray-900',
                          isServed && 'line-through text-gray-400'
                        )}
                      >
                        {order.customerName}
                      </p>
                      <p
                        className={cn(
                          'text-xs text-gray-400',
                          isServed && 'line-through'
                        )}
                      >
                        {order.customerPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p
                        className={cn(
                          'text-xs text-gray-600 truncate max-w-[200px]',
                          isServed && 'line-through text-gray-400'
                        )}
                      >
                        {order.items?.map((i: any) => `${i.quantity}x ${i.name_en}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          'font-bold text-sm text-gray-900',
                          isServed && 'line-through text-gray-400'
                        )}
                      >
                        ฿{order.total}
                      </span>
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
                );
              })
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
