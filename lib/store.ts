'use client';

import { create } from 'zustand';
import type { CartItem, Language, MenuItem, DrinkTemp, DrinkSize, Addon } from '@/types';
import { generateId } from '@/lib/utils';

interface CartStore {
  items: CartItem[];
  language: Language;

  // Cart actions
  addItem: (
    menuItem: MenuItem,
    temp: DrinkTemp,
    size: DrinkSize,
    addons: Addon[],
    quantity: number,
    unitPrice: number,
    notes?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // Language
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;

  // Computed
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  language: 'th',

  addItem: (menuItem, temp, size, addons, quantity, unitPrice, notes) => {
    const addonTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const totalPrice = (unitPrice + addonTotal) * quantity;

    const newItem: CartItem = {
      id: generateId(),
      menuItem,
      temp,
      size,
      addons,
      quantity,
      unitPrice: unitPrice + addonTotal,
      totalPrice,
      notes,
    };

    set((state) => ({ items: [...state.items, newItem] }));
  },

  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== cartItemId),
    }));
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  setLanguage: (lang) => set({ language: lang }),
  toggleLanguage: () =>
    set((state) => ({ language: state.language === 'th' ? 'en' : 'th' })),

  getTotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
