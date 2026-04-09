'use client';

import { Star, Plus } from 'lucide-react';
import { formatPrice, getVariantLabel, cn } from '@/lib/utils';
import type { MenuItem, Category } from '@/types';

interface MenuItemCardProps {
  item: MenuItem;
  category: Category;
  onSelect: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, category, onSelect }: MenuItemCardProps) {
  const isSinglePrice = category.priceColumns.length === 0;

  const displayPrice = isSinglePrice
    ? item.singlePrice
    : Math.min(...Object.values(item.prices).filter((p): p is number => p !== undefined));

  return (
    <button
      onClick={() => onSelect(item)}
      disabled={!item.available}
      className={cn(
        'group relative w-full text-left rounded-2xl bg-white border border-brand-100/60 p-4 transition-all duration-200',
        item.available
          ? 'hover:shadow-lg hover:shadow-brand-200/30 hover:border-brand-300/50 hover:-translate-y-0.5 active:translate-y-0'
          : 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Popular badge */}
      {item.popular && (
        <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          <Star className="w-2.5 h-2.5 fill-current" />
          Popular
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="font-semibold text-brand-900 text-sm leading-snug">
            {item.name}
          </h3>
          {/* Secondary name */}
          {item.name_secondary && (
            <p className="text-xs text-brand-500 mt-0.5">
              {item.name_secondary}
            </p>
          )}
          {/* Description */}
          {item.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {item.description}
            </p>
          )}

          {/* Price row */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {isSinglePrice ? (
              <span className="inline-flex items-center bg-accent/10 text-accent-dark text-xs font-semibold px-2 py-0.5 rounded-lg">
                {formatPrice(item.singlePrice || 0)}
              </span>
            ) : (
              category.priceColumns.map((variant) => {
                const price = item.prices[variant];
                if (price === undefined) return null;
                return (
                  <span
                    key={variant}
                    className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 text-[11px] font-medium px-2 py-0.5 rounded-lg"
                  >
                    <span className="text-brand-400">
                      {getVariantLabel(variant)}
                    </span>
                    {formatPrice(price)}
                  </span>
                );
              })
            )}
          </div>

          {/* Stock indicator */}
          {item.stock !== undefined && item.stock <= 5 && item.stock > 0 && (
            <p className="text-[10px] text-amber-600 mt-1">Only {item.stock} left</p>
          )}
          {item.stock === 0 && (
            <p className="text-[10px] text-red-500 mt-1">Out of stock</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-14 h-14 rounded-xl object-cover border border-brand-100/60"
            />
          )}
          {/* Add button */}
          <div className="w-9 h-9 rounded-xl bg-brand-50 group-hover:bg-brand-600 group-hover:text-white text-brand-600 flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4" />
          </div>
        </div>
      </div>
    </button>
  );
}
