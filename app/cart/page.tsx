'use client';

import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice, getTempLabel, cn } from '@/lib/utils';
import Header from '@/components/layout/Header';

export default function CartPage() {
  const { items, language, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-cameron-50 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-cameron-300" />
          </div>
          <h2 className="font-display text-2xl font-bold text-cameron-900 mb-2">
            {language === 'th' ? 'ตะกร้าว่างเปล่า' : 'Your cart is empty'}
          </h2>
          <p className="text-cameron-500 text-sm mb-8">
            {language === 'th'
              ? 'เลือกเครื่องดื่มที่ชอบแล้วเพิ่มลงตะกร้าเลย!'
              : 'Browse our menu and add some delicious drinks!'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-cameron-700 text-white px-6 py-3 rounded-full font-medium hover:bg-cameron-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'th' ? 'กลับหน้าเมนู' : 'Back to Menu'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back + title */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-white border border-cameron-100 flex items-center justify-center hover:bg-cameron-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cameron-700" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-cameron-900">
              {language === 'th' ? 'ตะกร้าสินค้า' : 'Your Cart'}
            </h1>
            <p className="text-sm text-cameron-500">
              {items.length} {language === 'th' ? 'รายการ' : 'items'}
            </p>
          </div>
        </div>

        {/* Cart items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-cameron-100/60 p-4 animate-fade-in"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-cameron-900 text-sm">
                    {language === 'th'
                      ? item.menuItem.name_th
                      : item.menuItem.name_en}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs bg-cameron-50 text-cameron-600 px-2 py-0.5 rounded-lg">
                      {getTempLabel(item.temp, language)}
                    </span>
                    {item.addons.map((addon) => (
                      <span
                        key={addon.id}
                        className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg"
                      >
                        +{language === 'th' ? addon.name_th : addon.name_en}
                      </span>
                    ))}
                  </div>
                  {item.notes && (
                    <p className="text-xs text-gray-400 mt-1 italic">
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>

              {/* Quantity + price row */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3 text-gray-600" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-cameron-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-cameron-100 hover:bg-cameron-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3 text-cameron-700" />
                  </button>
                </div>
                <p className="font-bold text-cameron-800">
                  {formatPrice(item.totalPrice)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Clear cart */}
        <button
          onClick={clearCart}
          className="mt-4 text-sm text-red-400 hover:text-red-500 transition-colors"
        >
          {language === 'th' ? 'ล้างตะกร้า' : 'Clear Cart'}
        </button>
      </div>

      {/* Fixed bottom checkout bar */}
      <div className="fixed bottom-0 inset-x-0 glass border-t border-cameron-100 p-4 z-40">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-cameron-600">
              {language === 'th' ? 'ยอดรวม' : 'Total'}
            </span>
            <span className="font-display text-2xl font-bold text-cameron-900">
              {formatPrice(total)}
            </span>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-cameron-700 hover:bg-cameron-800 text-white text-center py-4 rounded-2xl font-semibold shadow-lg shadow-cameron-700/25 transition-all active:scale-[0.98]"
          >
            {language === 'th' ? 'ไปชำระเงิน' : 'Proceed to Checkout'}
          </Link>
        </div>
      </div>
    </div>
  );
}
