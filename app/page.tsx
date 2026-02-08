'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/menu/Hero';
import CategoryTabs from '@/components/menu/CategoryTabs';
import MenuItemCard from '@/components/menu/MenuItemCard';
import ItemModal from '@/components/menu/ItemModal';
import { useCartStore } from '@/lib/store';
import type { MenuItem, Category } from '@/types';
import {
  categories as categoryData,
  milkTeaItems,
  coffeeItems,
  italianSodaItems,
  otherItems,
  matchaItems,
} from '@/data/menu-data';

// Build local data with IDs (in production, this comes from Firestore)
const categoriesWithIds: Category[] = [
  { ...categoryData[0], id: 'milk-tea' },
  { ...categoryData[1], id: 'coffee' },
  { ...categoryData[2], id: 'italian-soda' },
  { ...categoryData[3], id: 'other' },
  { ...categoryData[4], id: 'matcha' },
];

function addIdsToItems(items: Omit<MenuItem, 'id'>[], prefix: string): MenuItem[] {
  return items.map((item, i) => ({ ...item, id: `${prefix}-${i}` }));
}

const allItems: MenuItem[] = [
  ...addIdsToItems(milkTeaItems, 'mt'),
  ...addIdsToItems(coffeeItems, 'cf'),
  ...addIdsToItems(italianSodaItems, 'is'),
  ...addIdsToItems(otherItems, 'ot'),
  ...addIdsToItems(matchaItems, 'ma'),
];

export default function MenuPage() {
  const { language } = useCartStore();
  const [activeCategory, setActiveCategory] = useState(categoriesWithIds[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(
    () => allItems.filter((item) => item.categoryId === activeCategory),
    [activeCategory]
  );

  const activeCat = categoriesWithIds.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CategoryTabs
        categories={categoriesWithIds}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Menu grid */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Section title */}
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold text-cameron-900">
            {language === 'th' ? activeCat.name_th : activeCat.name_en}
          </h2>
          <p className="text-xs text-cameron-500 mt-0.5">
            {filteredItems.length}{' '}
            {language === 'th' ? 'รายการ' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <MenuItemCard
                item={item}
                category={activeCat}
                onSelect={setSelectedItem}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center border-t border-cameron-100">
        <p className="text-xs text-cameron-400">
          Cameron Natural — {language === 'th' ? 'สาขาพัทยา' : 'Pattaya Branch'} — 063-296-9062
        </p>
      </footer>

      {/* Item customization modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          category={categoriesWithIds.find((c) => c.id === selectedItem.categoryId)!}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
