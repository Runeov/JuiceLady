'use client';

import { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Flame, Snowflake, IceCream2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice, getVariantLabel, cn } from '@/lib/utils';
import type { MenuItem, Category, ItemVariant, Addon } from '@/types';
import { addons as defaultAddons } from '@/data/menu-data';
import { toast } from 'sonner';

interface ItemModalProps {
  item: MenuItem;
  category: Category;
  onClose: () => void;
}

const variantIcons: Record<ItemVariant, React.ReactNode> = {
  hot: <Flame className="w-4 h-4" />,
  iced: <Snowflake className="w-4 h-4" />,
  frappe: <IceCream2 className="w-4 h-4" />,
};

export default function ItemModal({ item, category, onClose }: ItemModalProps) {
  const { addItem } = useCartStore();
  const isSinglePrice = category.priceColumns.length === 0;

  const availableVariants = isSinglePrice
    ? (['iced'] as ItemVariant[])
    : category.priceColumns.filter((v) => item.prices[v] !== undefined);

  const [selectedVariant, setSelectedVariant] = useState<ItemVariant>(availableVariants[0]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Calculate price
  const basePrice = isSinglePrice
    ? item.singlePrice || 0
    : item.prices[selectedVariant] || 0;
  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAdd = () => {
    addItem(item, selectedVariant, 'M', selectedAddons, quantity, basePrice, notes || undefined);
    toast.success(`Added ${item.name} to cart!`);
    onClose();
  };

  // Addon data with IDs for local use
  const addonOptions: Addon[] = defaultAddons.map((a, i) => ({
    ...a,
    id: `addon-${i}`,
    available: true,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <div className="pr-8 flex items-start gap-4">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-100"
              />
            )}
            <div>
              <h2 className="font-display text-xl font-bold text-brand-900">{item.name}</h2>
              {item.name_secondary && (
                <p className="text-sm text-brand-500 mt-0.5">
                  {item.name_secondary}
                </p>
              )}
              {item.description && (
                <p className="text-xs text-gray-400 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Variant selection */}
          {availableVariants.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-brand-800 mb-3">
                Select Option
              </h3>
              <div className="flex gap-2">
                {availableVariants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border-2',
                      selectedVariant === variant
                        ? 'border-brand-600 bg-brand-50 text-brand-800'
                        : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:border-gray-200'
                    )}
                  >
                    {variantIcons[variant]}
                    <span>{getVariantLabel(variant)}</span>
                    <span className="text-xs opacity-60">
                      {formatPrice(item.prices[variant] || 0)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Addons */}
          <div>
            <h3 className="text-sm font-semibold text-brand-800 mb-3">
              Add-ons
            </h3>
            <div className="space-y-2">
              {addonOptions.map((addon) => {
                const isSelected = selectedAddons.some((a) => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-xl transition-all border-2',
                      isSelected
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                    )}
                  >
                    <span className="text-sm font-medium text-brand-800">
                      {addon.name}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        isSelected ? 'text-brand-700' : 'text-gray-400'
                      )}
                    >
                      +{formatPrice(addon.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-semibold text-brand-800 mb-2">
              Special Notes
            </h3>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. no ice, extra hot, allergies..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-sm focus:border-brand-400 focus:bg-white focus:outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brand-800">
              Quantity
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-8 text-center font-bold text-brand-900 text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl bg-brand-100 hover:bg-brand-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-brand-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Add to cart button */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-3 bg-brand-700 hover:bg-brand-800 text-white py-4 rounded-2xl font-semibold text-base shadow-lg shadow-brand-700/25 transition-all active:scale-[0.98]"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add to Cart</span>
            <span className="bg-white/20 px-3 py-0.5 rounded-lg text-sm">
              {formatPrice(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
