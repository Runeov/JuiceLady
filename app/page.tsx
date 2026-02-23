'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { getCategories, getMenuItems } from '@/lib/firestore';

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

const fallbackItems: MenuItem[] = [
  ...addIdsToItems(milkTeaItems, 'mt'),
  ...addIdsToItems(coffeeItems, 'cf'),
  ...addIdsToItems(italianSodaItems, 'is'),
  ...addIdsToItems(otherItems, 'ot'),
  ...addIdsToItems(matchaItems, 'ma'),
];

export default function MenuPage() {
  const { language } = useCartStore();
  const [categories, setCategories] = useState<Category[]>(categoriesWithIds);
  const [items, setItems] = useState<MenuItem[]>(fallbackItems);
  const [activeCategory, setActiveCategory] = useState(categoriesWithIds[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        const [cats, menuItems] = await Promise.all([getCategories(), getMenuItems()]);
        if (cats.length > 0) {
          setCategories(cats);
          setActiveCategory(cats[0].id);
        }
        if (menuItems.length > 0) {
          setItems(menuItems.filter((item) => item.available));
        }
      } catch (error) {
        console.error('Failed to load menu from Firestore:', error);
      }
    }
    loadMenu();
  }, []);

  const filteredItems = useMemo(
    () => items.filter((item) => item.categoryId === activeCategory),
    [activeCategory, items]
  );

  const activeCat = categories.find((c) => c.id === activeCategory)!;

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CategoryTabs
        categories={categories}
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
          category={categories.find((c) => c.id === selectedItem.categoryId)!}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
