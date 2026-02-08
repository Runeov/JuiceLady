import type { Category, MenuItem, Addon, SizeOption } from '@/types';

// ── Categories ──────────────────────────────────────────
export const categories: Omit<Category, 'id'>[] = [
  {
    name_th: 'นม&ชา',
    name_en: 'Milk & Tea',
    order: 1,
    priceColumns: ['hot', 'iced', 'frappe'],
    icon: '🍵',
  },
  {
    name_th: 'กาแฟ',
    name_en: 'Coffee',
    order: 2,
    priceColumns: ['hot', 'iced', 'frappe'],
    icon: '☕',
  },
  {
    name_th: 'อิตาเลี่ยนโซดา',
    name_en: 'Italian Soda',
    order: 3,
    priceColumns: ['iced', 'frappe'],
    icon: '🥤',
  },
  {
    name_th: 'อื่นๆ',
    name_en: 'Other Drinks',
    order: 4,
    priceColumns: ['iced', 'frappe'],
    icon: '🧋',
  },
  {
    name_th: 'มัทฉะ',
    name_en: 'Matcha',
    order: 5,
    priceColumns: [],
    icon: '🍃',
  },
];

// ── Milk & Tea Items ────────────────────────────────────
export const milkTeaItems: Omit<MenuItem, 'id'>[] = [
  { categoryId: 'milk-tea', name_th: 'ชาเย็น', name_en: 'Thai Tea', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 1, popular: true },
  { categoryId: 'milk-tea', name_th: 'ชาเขียว', name_en: 'Green Tea', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 2, popular: true },
  { categoryId: 'milk-tea', name_th: 'ชาเขียวโออิชิ', name_en: 'Oishi Green Tea', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 3 },
  { categoryId: 'milk-tea', name_th: 'ชาดำ', name_en: 'Black Tea', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 4 },
  { categoryId: 'milk-tea', name_th: 'ชามะนาว', name_en: 'Lemon Tea', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 5 },
  { categoryId: 'milk-tea', name_th: 'ชาเขียวมะนาว', name_en: 'Green Tea with Lemon', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 6 },
  { categoryId: 'milk-tea', name_th: 'ชานมใต้หวัน', name_en: 'Taiwanese Tea', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 7, popular: true },
  { categoryId: 'milk-tea', name_th: 'โกโก้', name_en: 'Cocoa', prices: { hot: 30, iced: 35, frappe: 45 }, available: true, order: 8 },
  { categoryId: 'milk-tea', name_th: 'โอวัลติน', name_en: 'Ovaltine Milk', prices: { hot: 30, iced: 35, frappe: 45 }, available: true, order: 9 },
  { categoryId: 'milk-tea', name_th: 'นมสด', name_en: 'Fresh Milk', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 10 },
  { categoryId: 'milk-tea', name_th: 'นมชมพู', name_en: 'Pink Milk', prices: { hot: 30, iced: 35, frappe: 45 }, available: true, order: 11 },
  { categoryId: 'milk-tea', name_th: 'เผือกหอม', name_en: 'Taro Milk Tea', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 12, popular: true },
  { categoryId: 'milk-tea', name_th: 'แคนตาลูป', name_en: 'Cantaloupe Milk', prices: { hot: 30, iced: 30, frappe: 45 }, available: true, order: 13 },
];

// ── Coffee Items ────────────────────────────────────────
export const coffeeItems: Omit<MenuItem, 'id'>[] = [
  { categoryId: 'coffee', name_th: 'เนสกาแฟ', name_en: 'Nescafe', prices: { hot: 30, iced: 35, frappe: 45 }, available: true, order: 1 },
  { categoryId: 'coffee', name_th: 'กาแฟโบราณ', name_en: 'Traditional Coffee', prices: { hot: 30, iced: 35, frappe: 45 }, available: true, order: 2, popular: true },
  { categoryId: 'coffee', name_th: 'โอเลี้ยง', name_en: 'Thai Black Coffee', prices: { hot: 30, iced: 35, frappe: 45 }, available: true, order: 3 },
  { categoryId: 'coffee', name_th: 'โอเลี้ยงยกล้อ', name_en: 'Thai Coffee with Milk', prices: { hot: 30, iced: 35, frappe: 45 }, available: true, order: 4 },
  { categoryId: 'coffee', name_th: 'มอคค่า', name_en: 'Mocha', prices: { hot: 30, iced: 40, frappe: 50 }, available: true, order: 5 },
];

// ── Italian Soda Items ──────────────────────────────────
export const italianSodaItems: Omit<MenuItem, 'id'>[] = [
  { categoryId: 'italian-soda', name_th: 'บลูฮาวายโซดา', name_en: 'Blue Hawaiian Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 1 },
  { categoryId: 'italian-soda', name_th: 'บลูเบอรี่โซดา', name_en: 'Blueberry Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 2 },
  { categoryId: 'italian-soda', name_th: 'สตอเบอรี่โซดา', name_en: 'Strawberry Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 3 },
  { categoryId: 'italian-soda', name_th: 'ลิ้นจี่โซดา', name_en: 'Lychee Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 4, popular: true },
  { categoryId: 'italian-soda', name_th: 'สับปะรดโซดา', name_en: 'Pineapple Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 5 },
  { categoryId: 'italian-soda', name_th: 'องุ่นโซดา', name_en: 'Grape Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 6 },
  { categoryId: 'italian-soda', name_th: 'แอปเปิ้ลเขียวโซดา', name_en: 'Green Apple Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 7 },
  { categoryId: 'italian-soda', name_th: 'กีวีโซดา', name_en: 'Kiwi Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 8 },
  { categoryId: 'italian-soda', name_th: 'เสาวรสโซดา', name_en: 'Passion Fruit Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 9 },
  { categoryId: 'italian-soda', name_th: 'เขียวโซดา', name_en: 'Green Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 10 },
  { categoryId: 'italian-soda', name_th: 'น้ำผึ้งมะนาวโซดา', name_en: 'Honey Lemon Soda', prices: { iced: 35, frappe: 45 }, available: true, order: 11 },
  { categoryId: 'italian-soda', name_th: 'บ๊วยโซดา', name_en: 'Plum Soda', prices: { iced: 30, frappe: 45 }, available: true, order: 12 },
];

// ── Other Drinks ────────────────────────────────────────
export const otherItems: Omit<MenuItem, 'id'>[] = [
  { categoryId: 'other', name_th: 'นมสดคาราเมล', name_en: 'Caramel Milk', prices: { iced: 35, frappe: 45 }, available: true, order: 1 },
  { categoryId: 'other', name_th: 'นมสดบราวชูก้า', name_en: 'Brown Sugar Milk', prices: { iced: 35, frappe: 45 }, available: true, order: 2, popular: true },
  { categoryId: 'other', name_th: 'ชากาแฟ', name_en: 'Tea & Coffee Mix', prices: { iced: 40, frappe: 50 }, available: true, order: 3 },
  { categoryId: 'other', name_th: 'ชาโกโก้', name_en: 'Tea & Cocoa', prices: { iced: 40, frappe: 50 }, available: true, order: 4 },
  { categoryId: 'other', name_th: 'เฉาก๋วยนมสด', name_en: 'Grass Jelly with Fresh Milk', prices: { iced: 35, frappe: 45 }, available: true, order: 5, popular: true },
];

// ── Matcha Items ────────────────────────────────────────
export const matchaItems: Omit<MenuItem, 'id'>[] = [
  { categoryId: 'matcha', name_th: 'มัทฉะน้ำส้ม', name_en: 'Matcha Orange', prices: {}, singlePrice: 45, available: true, order: 1 },
  { categoryId: 'matcha', name_th: 'มัทฉะน้ำผึ้งมะนาว', name_en: 'Matcha Honey Lime', prices: {}, singlePrice: 50, available: true, order: 2, popular: true },
  { categoryId: 'matcha', name_th: 'มัทฉะสตรอเบอรี่ลาเต้', name_en: 'Matcha Strawberry Latte', prices: {}, singlePrice: 50, available: true, order: 3, popular: true },
  { categoryId: 'matcha', name_th: 'มัทฉะคาราเมล', name_en: 'Matcha Caramel', prices: {}, singlePrice: 50, available: true, order: 4 },
  { categoryId: 'matcha', name_th: 'มัทฉะน้ำมะพร้าว', name_en: 'Matcha Coconut', prices: {}, singlePrice: 45, available: true, order: 5 },
  { categoryId: 'matcha', name_th: 'มัทฉะเอสเพรสโซ่', name_en: 'Matcha Espresso', prices: {}, singlePrice: 50, available: true, order: 6 },
  { categoryId: 'matcha', name_th: 'เพียวมัทฉะ', name_en: 'Pure Matcha', prices: {}, singlePrice: 45, available: true, order: 7 },
  { categoryId: 'matcha', name_th: 'มัทฉะลาเต้', name_en: 'Matcha Latte', prices: {}, singlePrice: 45, available: true, order: 8 },
];

// ── Addons ──────────────────────────────────────────────
export const addons: Omit<Addon, 'id'>[] = [
  { name_th: 'เพิ่มไข่มุก', name_en: 'Add Pearls', price: 5, available: true },
  { name_th: 'เพิ่มมุก (Jokés)', name_en: 'Add Jokés', price: 10, available: true },
  { name_th: 'เพิ่มปั่น', name_en: 'Add Spin', price: 10, available: true },
  { name_th: 'ครีมชีส', name_en: 'Cream Cheese', price: 15, available: true },
  { name_th: 'วิปปิ้ง', name_en: 'Whipping Cream', price: 15, available: true },
];

// ── Sizes ───────────────────────────────────────────────
export const sizeOptions: SizeOption[] = [
  { id: 'S', name_th: 'แก้ว S', name_en: 'Small', price: 30 },
  { id: 'M', name_th: 'แก้ว M', name_en: 'Medium', price: 35 },
  { id: 'bucket', name_th: 'ถัง', name_en: 'Bucket', price: 40 },
  { id: 'giraffe', name_th: 'ยีราฟ (ปั่น)', name_en: 'Smoothie', price: 45 },
];

// All menu items combined
export const allMenuItems = [
  ...milkTeaItems,
  ...coffeeItems,
  ...italianSodaItems,
  ...otherItems,
  ...matchaItems,
];
