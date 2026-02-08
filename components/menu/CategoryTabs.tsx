'use client';

import { useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
}: CategoryTabsProps) {
  const { language } = useCartStore();

  return (
    <div className="sticky top-16 z-40 glass border-b border-cameron-100/50">
      <div className="max-w-5xl mx-auto">
        <nav className="flex gap-1 px-4 py-3 overflow-x-auto category-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
                activeCategory === cat.id
                  ? 'bg-cameron-700 text-white shadow-md shadow-cameron-700/20'
                  : 'bg-white/60 text-cameron-700 hover:bg-cameron-100'
              )}
            >
              <span>{cat.icon}</span>
              <span>{language === 'th' ? cat.name_th : cat.name_en}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
