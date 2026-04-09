'use client';

import { create } from 'zustand';
import type { CartItem, MenuItem, ItemVariant, ItemSize, Addon } from '@/types';
import { generateId } from '@/lib/utils';

interface CartStore {
  items: CartItem[];

  // Cart actions
  addItem: (
    menuItem: MenuItem,
    variant: ItemVariant,
    size: ItemSize,
    addons: Addon[],
    quantity: number,
    unitPrice: number,
    notes?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;

  // Computed
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (menuItem, variant, size, addons, quantity, unitPrice, notes) => {
    const addonTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const totalPrice = (unitPrice + addonTotal) * quantity;

    const newItem: CartItem = {
      id: generateId(),
      menuItem,
      variant,
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

  getTotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
