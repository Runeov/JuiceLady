'use client';

import { useState } from 'react';
import { Search, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { cn, formatPrice, getTempLabel } from '@/lib/utils';
import type { Category, MenuItem } from '@/types';
import {
  categories as categoryData,
  milkTeaItems,
  coffeeItems,
  italianSodaItems,
  otherItems,
  matchaItems,
} from '@/data/menu-data';

// Build local data (in production, fetch from Firestore)
const categoriesWithIds: Category[] = [
  { ...categoryData[0], id: 'milk-tea' },
  { ...categoryData[1], id: 'coffee' },
  { ...categoryData[2], id: 'italian-soda' },
  { ...categoryData[3], id: 'other' },
  { ...categoryData[4], id: 'matcha' },
];

function addIds(items: Omit<MenuItem, 'id'>[], prefix: string): MenuItem[] {
  return items.map((item, i) => ({ ...item, id: `${prefix}-${i}` }));
}

const initialItems: MenuItem[] = [
  ...addIds(milkTeaItems, 'mt'),
  ...addIds(coffeeItems, 'cf'),
  ...addIds(italianSodaItems, 'is'),
  ...addIds(otherItems, 'ot'),
  ...addIds(matchaItems, 'ma'),
];

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState('milk-tea');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAvailability = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    );
    // In production: call updateMenuItem(itemId, { available: !currentValue })
  };

  const filtered = items
    .filter((i) => i.categoryId === activeCategory)
    .filter(
      (i) =>
        !searchQuery ||
        i.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.name_th.includes(searchQuery)
    );

  const activeCat = categoriesWithIds.find((c) => c.id === activeCategory)!;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-sm text-gray-500">
          {items.filter((i) => i.available).length}/{items.length} items active
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {categoriesWithIds.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border',
              activeCategory === cat.id
                ? 'bg-cameron-700 text-white border-cameron-700'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            )}
          >
            {cat.icon} {cat.name_en}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search menu items..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-cameron-400 focus:outline-none"
        />
      </div>

      {/* Items list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              No items found
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'px-4 py-3 flex items-center gap-4 transition-colors',
                  !item.available && 'opacity-50 bg-gray-50/50'
                )}
              >
                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">{item.name_en}</h3>
                    {item.popular && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-thai">{item.name_th}</p>
                </div>

                {/* Prices */}
                <div className="flex gap-2 shrink-0">
                  {item.singlePrice ? (
                    <span className="text-xs bg-matcha/10 text-matcha-dark font-medium px-2 py-1 rounded-lg">
                      {formatPrice(item.singlePrice)}
                    </span>
                  ) : (
                    activeCat.priceColumns.map((temp) => {
                      const price = item.prices[temp];
                      if (price === undefined) return null;
                      return (
                        <span
                          key={temp}
                          className="text-xs bg-gray-50 text-gray-600 font-medium px-2 py-1 rounded-lg"
                        >
                          {getTempLabel(temp, 'en').charAt(0)}: {formatPrice(price)}
                        </span>
                      );
                    })
                  )}
                </div>

                {/* Toggle availability */}
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className="shrink-0"
                  title={item.available ? 'Click to disable' : 'Click to enable'}
                >
                  {item.available ? (
                    <ToggleRight className="w-8 h-8 text-cameron-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-300" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Note: In production, changes are saved to Firestore in real-time.
        <br />
        This demo uses local state. Connect to your Firebase project to enable persistence.
      </p>
    </div>
  );
}
