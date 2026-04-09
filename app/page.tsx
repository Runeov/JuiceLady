'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/menu/Hero';
import CategoryTabs from '@/components/menu/CategoryTabs';
import MenuItemCard from '@/components/menu/MenuItemCard';
import ItemModal from '@/components/menu/ItemModal';
import type { MenuItem, Category } from '@/types';
import {
  categories as categoryData,
  hotDrinkItems,
  coldDrinkItems,
  foodItems,
  dessertItems,
} from '@/data/menu-data';
import { getCategories, getMenuItems } from '@/lib/firestore';
import { shopConfig } from '@/lib/config';

// Build local data with IDs (in production, this comes from Firestore)
const categoriesWithIds: Category[] = [
  { ...categoryData[0], id: 'hot-drinks' },
  { ...categoryData[1], id: 'cold-drinks' },
  { ...categoryData[2], id: 'food' },
  { ...categoryData[3], id: 'desserts' },
];

function addIdsToItems(items: Omit<MenuItem, 'id'>[], prefix: string): MenuItem[] {
  return items.map((item, i) => ({ ...item, id: `${prefix}-${i}` }));
}

const fallbackItems: MenuItem[] = [
  ...addIdsToItems(hotDrinkItems, 'hd'),
  ...addIdsToItems(coldDrinkItems, 'cd'),
  ...addIdsToItems(foodItems, 'fd'),
  ...addIdsToItems(dessertItems, 'ds'),
];

export default function MenuPage() {
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
          <h2 className="font-display text-xl font-bold text-brand-900">
            {activeCat.name}
          </h2>
          <p className="text-xs text-brand-500 mt-0.5">
            {filteredItems.length} items
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
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center border-t border-brand-100">
        <p className="text-xs text-brand-400">
          {shopConfig.name}
          {shopConfig.phone ? ` — ${shopConfig.phone}` : ''}
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
