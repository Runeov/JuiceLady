'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  AlertTriangle,
  Package,
  Loader2,
  RefreshCw,
  Save,
} from 'lucide-react';
import { cn, formatPrice, exportToCSV } from '@/lib/utils';
import type { MenuItem, Category } from '@/types';
import { getCategories, getMenuItems, updateMenuItemStock } from '@/lib/firestore';
import { toast } from 'sonner';

interface StockEdit {
  [itemId: string]: number;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockEdits, setStockEdits] = useState<StockEdit>({});
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, menuItems] = await Promise.all([getCategories(), getMenuItems()]);
      setCategories(cats);
      setItems(menuItems);
    } catch (error) {
      console.error('Load inventory error:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        if (filter === 'low') return item.stock !== undefined && item.stock > 0 && item.stock <= 10;
        if (filter === 'out') return item.stock === 0;
        return true;
      })
      .filter((item) => {
        if (!searchQuery) return true;
        return (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
  }, [items, searchQuery, filter]);

  const lowStockCount = items.filter(
    (i) => i.stock !== undefined && i.stock > 0 && i.stock <= 10
  ).length;
  const outOfStockCount = items.filter((i) => i.stock === 0).length;

  const handleStockChange = (itemId: string, value: number) => {
    setStockEdits((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleSaveAll = async () => {
    const edits = Object.entries(stockEdits);
    if (edits.length === 0) {
      toast.error('No changes to save');
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        edits.map(([itemId, stock]) => updateMenuItemStock(itemId, stock))
      );
      // Update local state
      setItems((prev) =>
        prev.map((item) =>
          stockEdits[item.id] !== undefined
            ? { ...item, stock: stockEdits[item.id] }
            : item
        )
      );
      setStockEdits({});
      toast.success(`Updated stock for ${edits.length} items`);
    } catch (error) {
      console.error('Save stock error:', error);
      toast.error('Failed to update stock');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const csvData = items.map((item) => ({
      Name: item.name,
      SKU: item.sku || '',
      Category: categories.find((c) => c.id === item.categoryId)?.name || '',
      'Current Stock': item.stock ?? 'Unlimited',
      Available: item.available ? 'Yes' : 'No',
      Price: item.singlePrice || Object.values(item.prices)[0] || 0,
    }));
    exportToCSV(csvData, 'inventory-report');
  };

  const getCategoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name || categoryId;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">
            {items.length} items total
            {lowStockCount > 0 && (
              <span className="text-amber-600 ml-2">
                {lowStockCount} low stock
              </span>
            )}
            {outOfStockCount > 0 && (
              <span className="text-red-500 ml-2">
                {outOfStockCount} out of stock
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          {Object.keys(stockEdits).length > 0 && (
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-700 text-white rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : `Save ${Object.keys(stockEdits).length} changes`}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-brand-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'low', 'out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border',
                filter === f
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Item</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">SKU</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Current Stock</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">New Stock</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No items found
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const currentStock = stockEdits[item.id] ?? item.stock;
                  const isLow = currentStock !== undefined && currentStock > 0 && currentStock <= 10;
                  const isOut = currentStock === 0;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            {item.name_secondary && (
                              <p className="text-xs text-gray-400">{item.name_secondary}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getCategoryName(item.categoryId)}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-400">
                        {item.sku || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          'text-sm font-medium',
                          isOut ? 'text-red-500' : isLow ? 'text-amber-600' : 'text-gray-900'
                        )}>
                          {item.stock ?? '∞'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          value={stockEdits[item.id] ?? ''}
                          onChange={(e) =>
                            handleStockChange(item.id, Number(e.target.value))
                          }
                          placeholder={String(item.stock ?? '∞')}
                          className="w-20 mx-auto px-2 py-1 rounded-lg border border-gray-200 text-sm text-center focus:border-brand-400 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isOut ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                            <AlertTriangle className="w-3 h-3" />
                            Out
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                            <AlertTriangle className="w-3 h-3" />
                            Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                            <Package className="w-3 h-3" />
                            OK
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
