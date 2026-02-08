'use client';

import { Star, Plus } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice, getTempLabel, cn } from '@/lib/utils';
import type { MenuItem, Category } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  category: Category;
  onSelect: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, category, onSelect }: MenuItemCardProps) {
  const { language } = useCartStore();
  const isMatcha = category.id === 'matcha';

  const name = language === 'th' ? item.name_th : item.name_en;

  // Get the lowest price for display
  const displayPrice = isMatcha
    ? item.singlePrice
    : Math.min(...Object.values(item.prices).filter((p): p is number => p !== undefined));

  return (
    <button
      onClick={() => onSelect(item)}
      disabled={!item.available}
      className={cn(
        'group relative w-full text-left rounded-2xl bg-white border border-cameron-100/60 p-4 transition-all duration-200',
        item.available
          ? 'hover:shadow-lg hover:shadow-cameron-200/30 hover:border-cameron-300/50 hover:-translate-y-0.5 active:translate-y-0'
          : 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Popular badge */}
      {item.popular && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          <Star className="w-2.5 h-2.5 fill-current" />
          {language === 'th' ? 'ยอดนิยม' : 'Popular'}
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="font-semibold text-cameron-900 text-sm leading-snug">
            {name}
          </h3>
          {/* Secondary name */}
          <p className="text-xs text-cameron-500 mt-0.5 font-thai">
            {language === 'th' ? item.name_en : item.name_th}
          </p>

          {/* Price row */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {isMatcha ? (
              <span className="inline-flex items-center bg-matcha/10 text-matcha-dark text-xs font-semibold px-2 py-0.5 rounded-lg">
                {formatPrice(item.singlePrice || 0)}
              </span>
            ) : (
              category.priceColumns.map((temp) => {
                const price = item.prices[temp];
                if (price === undefined) return null;
                return (
                  <span
                    key={temp}
                    className="inline-flex items-center gap-1 bg-cameron-50 text-cameron-700 text-[11px] font-medium px-2 py-0.5 rounded-lg"
                  >
                    <span className="text-cameron-400">
                      {getTempLabel(temp, language)}
                    </span>
                    {formatPrice(price)}
                  </span>
                );
              })
            )}
          </div>
        </div>

        {/* Add button */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-cameron-50 group-hover:bg-cameron-600 group-hover:text-white text-cameron-600 flex items-center justify-center transition-colors">
          <Plus className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
}
