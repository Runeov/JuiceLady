export type ItemSize = 'S' | 'M' | 'L' | 'XL';
export type ItemVariant = 'hot' | 'iced' | 'frappe';
export type PaymentMethod = 'stripe' | 'cash' | 'promptpay';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type NotificationChannel = 'email' | 'sms' | 'line';

export interface Category {
  id: string;
  name: string;
  name_secondary?: string;
  order: number;
  priceColumns: ItemVariant[];
  icon?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  name_secondary?: string;
  description?: string;
  prices: Partial<Record<ItemVariant, number>>;
  singlePrice?: number;
  available: boolean;
  order: number;
  image?: string;
  popular?: boolean;
  /** Track stock quantity. undefined = unlimited */
  stock?: number;
  sku?: string;
}

export interface Addon {
  id: string;
  name: string;
  name_secondary?: string;
  price: number;
  available: boolean;
}

export interface SizeOption {
  id: ItemSize;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  variant: ItemVariant;
  size: ItemSize;
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
  userId?: string;
  userEmail?: string;
  userPhone?: string;
  customerNote?: string;
  stripeSessionId?: string;
  promptpayRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailySales {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  itemsSold: Record<string, number>;
}

export interface InventoryItem {
  menuItemId: string;
  sku: string;
  name: string;
  currentStock: number;
  lowStockThreshold: number;
  lastRestockedAt?: Date;
}

export interface NotificationConfig {
  channel: NotificationChannel;
  enabled: boolean;
  recipientId?: string;
}
