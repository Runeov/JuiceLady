'use client';

import { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, Flame, Snowflake, IceCream2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice, getTempLabel, cn } from '@/lib/utils';
import type { MenuItem, Category, DrinkTemp, Addon } from '@/types';
import { addons as defaultAddons } from '@/data/menu-data';
import { toast } from 'sonner';

interface ItemModalProps {
  item: MenuItem;
  category: Category;
  onClose: () => void;
}

const tempIcons: Record<DrinkTemp, React.ReactNode> = {
  hot: <Flame className="w-4 h-4" />,
  iced: <Snowflake className="w-4 h-4" />,
  frappe: <IceCream2 className="w-4 h-4" />,
};

export default function ItemModal({ item, category, onClose }: ItemModalProps) {
  const { language, addItem } = useCartStore();
  const isMatcha = category.id === 'matcha';

  const availableTemps = isMatcha
    ? (['iced'] as DrinkTemp[])
    : category.priceColumns.filter((t) => item.prices[t] !== undefined);

  const [selectedTemp, setSelectedTemp] = useState<DrinkTemp>(availableTemps[0]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const name = language === 'th' ? item.name_th : item.name_en;

  // Calculate price
  const basePrice = isMatcha
    ? item.singlePrice || 0
    : item.prices[selectedTemp] || 0;
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
    addItem(item, selectedTemp, 'M', selectedAddons, quantity, basePrice, notes || undefined);
    toast.success(
      language === 'th'
        ? `เพิ่ม ${item.name_th} ลงตะกร้าแล้ว!`
        : `Added ${item.name_en} to cart!`
    );
    onClose();
  };

  // Fake addon data with IDs for local use
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
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-100"
              />
            )}
            <div>
              <h2 className="font-display text-xl font-bold text-cameron-900">{name}</h2>
              <p className="text-sm text-cameron-500 mt-0.5 font-thai">
                {language === 'th' ? item.name_en : item.name_th}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Temperature selection */}
          {availableTemps.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-cameron-800 mb-3">
                {language === 'th' ? 'เลือกอุณหภูมิ' : 'Temperature'}
              </h3>
              <div className="flex gap-2">
                {availableTemps.map((temp) => (
                  <button
                    key={temp}
                    onClick={() => setSelectedTemp(temp)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border-2',
                      selectedTemp === temp
                        ? 'border-cameron-600 bg-cameron-50 text-cameron-800'
                        : 'border-gray-100 bg-gray-50/50 text-gray-500 hover:border-gray-200'
                    )}
                  >
                    {tempIcons[temp]}
                    <span>{getTempLabel(temp, language)}</span>
                    <span className="text-xs opacity-60">
                      {formatPrice(item.prices[temp] || 0)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Addons */}
          <div>
            <h3 className="text-sm font-semibold text-cameron-800 mb-3">
              {language === 'th' ? 'ท็อปปิ้ง' : 'Toppings'}
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
                        ? 'border-cameron-600 bg-cameron-50'
                        : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                    )}
                  >
                    <span className="text-sm font-medium text-cameron-800">
                      {language === 'th' ? addon.name_th : addon.name_en}
                    </span>
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        isSelected ? 'text-cameron-700' : 'text-gray-400'
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
            <h3 className="text-sm font-semibold text-cameron-800 mb-2">
              {language === 'th' ? 'หมายเหตุ' : 'Special Notes'}
            </h3>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                language === 'th' ? 'เช่น หวานน้อย, ไม่ใส่น้ำแข็ง' : 'e.g. less sugar, no ice'
              }
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-sm focus:border-cameron-400 focus:bg-white focus:outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-cameron-800">
              {language === 'th' ? 'จำนวน' : 'Quantity'}
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-8 text-center font-bold text-cameron-900 text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-xl bg-cameron-100 hover:bg-cameron-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-cameron-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Add to cart button */}
        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-3 bg-cameron-700 hover:bg-cameron-800 text-white py-4 rounded-2xl font-semibold text-base shadow-lg shadow-cameron-700/25 transition-all active:scale-[0.98]"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>
              {language === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to Cart'}
            </span>
            <span className="bg-white/20 px-3 py-0.5 rounded-lg text-sm">
              {formatPrice(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
