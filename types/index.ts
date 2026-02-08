export type DrinkSize = 'S' | 'M' | 'bucket' | 'giraffe';
export type DrinkTemp = 'hot' | 'iced' | 'frappe';
export type PaymentMethod = 'stripe' | 'cash';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Category {
  id: string;
  name_th: string;
  name_en: string;
  order: number;
  priceColumns: DrinkTemp[];
  icon?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name_th: string;
  name_en: string;
  prices: Partial<Record<DrinkTemp, number>>;
  singlePrice?: number; // for matcha items with one price
  available: boolean;
  order: number;
  image?: string;
  popular?: boolean;
}

export interface Addon {
  id: string;
  name_th: string;
  name_en: string;
  price: number;
  available: boolean;
}

export interface SizeOption {
  id: DrinkSize;
  name_th: string;
  name_en: string;
  price: number;
}

export interface CartItem {
  id: string; // unique cart item id
  menuItem: MenuItem;
  temp: DrinkTemp;
  size: DrinkSize;
  addons: Addon[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerNote?: string;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailySales {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  itemsSold: Record<string, number>;
}

export type Language = 'th' | 'en';
