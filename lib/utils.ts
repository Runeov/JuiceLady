import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { DrinkTemp, DrinkSize, Language } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `฿${price}`;
}

export function formatPriceTHB(price: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
  }).format(price);
}

export function getTempLabel(temp: DrinkTemp, lang: Language = 'en'): string {
  const labels: Record<DrinkTemp, Record<Language, string>> = {
    hot: { en: 'Hot', th: 'ร้อน' },
    iced: { en: 'Iced', th: 'เย็น' },
    frappe: { en: 'Frappé', th: 'เฟรนเป้' },
  };
  return labels[temp][lang];
}

export function getSizeLabel(size: DrinkSize, lang: Language = 'en'): string {
  const labels: Record<DrinkSize, Record<Language, string>> = {
    S: { en: 'Small', th: 'เล็ก' },
    M: { en: 'Medium', th: 'กลาง' },
    bucket: { en: 'Bucket', th: 'ถัง' },
    giraffe: { en: 'Smoothie', th: 'ยีราฟ' },
  };
  return labels[size][lang];
}

export function getSizePrice(size: DrinkSize): number {
  const prices: Record<DrinkSize, number> = {
    S: 30,
    M: 35,
    bucket: 40,
    giraffe: 45,
  };
  return prices[size];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}
