/**
 * Central configuration file.
 * All shop-specific settings are driven by environment variables.
 */

export const shopConfig = {
  name: process.env.NEXT_PUBLIC_SHOP_NAME || 'My Shop',
  phone: process.env.NEXT_PUBLIC_SHOP_PHONE || '',
  description: process.env.NEXT_PUBLIC_SHOP_DESCRIPTION || 'Order online from our menu.',
  tagline: process.env.NEXT_PUBLIC_SHOP_TAGLINE || 'Fresh & Delicious',
  currency: process.env.NEXT_PUBLIC_CURRENCY || 'USD',
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$',
  locale: process.env.NEXT_PUBLIC_LOCALE || 'en-US',
  secondaryLocale: process.env.NEXT_PUBLIC_SECONDARY_LOCALE || '',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  /** Stripe uses the smallest currency unit (cents, satang, etc.) */
  currencyMultiplier: Number(process.env.NEXT_PUBLIC_CURRENCY_MULTIPLIER || '100'),
};

export function formatPrice(price: number): string {
  return `${shopConfig.currencySymbol}${price.toLocaleString(shopConfig.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPriceIntl(price: number): string {
  return new Intl.NumberFormat(shopConfig.locale, {
    style: 'currency',
    currency: shopConfig.currency,
    minimumFractionDigits: 0,
  }).format(price);
}
