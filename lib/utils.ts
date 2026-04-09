import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatPrice as configFormatPrice } from '@/lib/config';
import type { ItemVariant, ItemSize } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return configFormatPrice(price);
}

export function getVariantLabel(variant: ItemVariant): string {
  const labels: Record<ItemVariant, string> = {
    hot: 'Hot',
    iced: 'Iced',
    frappe: 'Frapp\u00e9',
  };
  return labels[variant];
}

export function getSizeLabel(size: ItemSize): string {
  const labels: Record<ItemSize, string> = {
    S: 'Small',
    M: 'Medium',
    L: 'Large',
    XL: 'Extra Large',
  };
  return labels[size];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

/** Export orders/sales data to CSV */
export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str = val === null || val === undefined ? '' : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.click();
  URL.revokeObjectURL(url);
}
