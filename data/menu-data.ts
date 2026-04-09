import type { Category, MenuItem, Addon, SizeOption } from '@/types';

// ── Categories ──────────────────────────────────────────
export const categories: Omit<Category, 'id'>[] = [
  {
    name: 'Hot Drinks',
    order: 1,
    priceColumns: ['hot', 'iced', 'frappe'],
    icon: '☕',
  },
  {
    name: 'Cold Drinks',
    order: 2,
    priceColumns: ['iced', 'frappe'],
    icon: '🥤',
  },
  {
    name: 'Food',
    order: 3,
    priceColumns: [],
    icon: '🍽️',
  },
  {
    name: 'Desserts',
    order: 4,
    priceColumns: [],
    icon: '🍰',
  },
];

// ── Hot Drinks ──────────────────────────────────────────
export const hotDrinkItems: Omit<MenuItem, 'id'>[] = [
  { categoryId: 'hot-drinks', name: 'Latte', prices: { hot: 4.50, iced: 5.00, frappe: 5.50 }, available: true, order: 1, popular: true },
  { categoryId: 'hot-drinks', name: 'Cappuccino', prices: { hot: 4.50, iced: 5.00, frappe: 5.50 }, available: true, order: 2, popular: true },
  { categoryId: 'hot-drinks', name: 'Americano', prices: { hot: 3.50, iced: 4.00, frappe: 4.50 }, available: true, order: 3 },
  { categoryId: 'hot-drinks', name: 'Espresso', prices: { hot: 3.00 }, available: true, order: 4 },
  { categoryId: 'hot-drinks', name: 'Mocha', prices: { hot: 5.00, iced: 5.50, frappe: 6.00 }, available: true, order: 5 },
  { categoryId: 'hot-drinks', name: 'Hot Chocolate', prices: { hot: 4.00, iced: 4.50, frappe: 5.00 }, available: true, order: 6 },
  { categoryId: 'hot-drinks', name: 'Chai Latte', prices: { hot: 4.50, iced: 5.00, frappe: 5.50 }, available: true, order: 7 },
  { categoryId: 'hot-drinks', name: 'Green Tea', prices: { hot: 3.00, iced: 3.50 }, available: true, order: 8 },
];

// ── Cold Drinks ─────────────────────────────────────────
export const coldDrinkItems: Omit<MenuItem, 'id'>[] = [
  { categoryId: 'cold-drinks', name: 'Iced Tea', prices: { iced: 3.00, frappe: 4.00 }, available: true, order: 1, popular: true },
  { categoryId: 'cold-drinks', name: 'Lemonade', prices: { iced: 3.50, frappe: 4.50 }, available: true, order: 2 },
  { categoryId: 'cold-drinks', name: 'Mango Smoothie', prices: { frappe: 5.50 }, available: true, order: 3, popular: true },
  { categoryId: 'cold-drinks', name: 'Berry Smoothie', prices: { frappe: 5.50 }, available: true, order: 4 },
  { categoryId: 'cold-drinks', name: 'Orange Juice', prices: { iced: 4.00 }, available: true, order: 5 },
  { categoryId: 'cold-drinks', name: 'Sparkling Water', prices: { iced: 2.50 }, available: true, order: 6 },
];

// ── Food Items ──────────────────────────────────────────
export const foodItems: Omit<MenuItem, 'id'>[] = [
  { categoryId: 'food', name: 'Club Sandwich', prices: {}, singlePrice: 8.50, available: true, order: 1, popular: true },
  { categoryId: 'food', name: 'Caesar Salad', prices: {}, singlePrice: 7.50, available: true, order: 2 },
  { categoryId: 'food', name: 'Chicken Wrap', prices: {}, singlePrice: 7.00, available: true, order: 3 },
  { categoryId: 'food', name: 'Veggie Bowl', prices: {}, singlePrice: 8.00, available: true, order: 4 },
  { categoryId: 'food', name: 'Soup of the Day', prices: {}, singlePrice: 5.00, available: true, order: 5 },
];

// ── Desserts ────────────────────────────────────────────
export const dessertItems: Omit<MenuItem, 'id'>[] = [
  { categoryId: 'desserts', name: 'Chocolate Brownie', prices: {}, singlePrice: 4.50, available: true, order: 1, popular: true },
  { categoryId: 'desserts', name: 'Cheesecake', prices: {}, singlePrice: 5.50, available: true, order: 2 },
  { categoryId: 'desserts', name: 'Croissant', prices: {}, singlePrice: 3.50, available: true, order: 3 },
  { categoryId: 'desserts', name: 'Muffin', prices: {}, singlePrice: 3.00, available: true, order: 4 },
  { categoryId: 'desserts', name: 'Cookie', prices: {}, singlePrice: 2.50, available: true, order: 5 },
];

// ── Addons ──────────────────────────────────────────────
export const addons: Omit<Addon, 'id'>[] = [
  { name: 'Extra Shot', price: 1.00, available: true },
  { name: 'Oat Milk', price: 0.75, available: true },
  { name: 'Whipped Cream', price: 0.50, available: true },
  { name: 'Caramel Drizzle', price: 0.50, available: true },
  { name: 'Vanilla Syrup', price: 0.50, available: true },
];

// ── Sizes ───────────────────────────────────────────────
export const sizeOptions: SizeOption[] = [
  { id: 'S', name: 'Small', price: 0 },
  { id: 'M', name: 'Medium', price: 0.50 },
  { id: 'L', name: 'Large', price: 1.00 },
  { id: 'XL', name: 'Extra Large', price: 1.50 },
];

// All menu items combined
export const allMenuItems = [
  ...hotDrinkItems,
  ...coldDrinkItems,
  ...foodItems,
  ...dessertItems,
];
