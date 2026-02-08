'use client';

import Link from 'next/link';
import { ShoppingBag, Globe, Leaf } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function Header() {
  const { language, toggleLanguage, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 glass border-b border-cameron-200/30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-cameron-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5 text-matcha-light" />
          </div>
          <div className="leading-tight">
            <h1 className="font-display text-lg font-bold text-cameron-800 tracking-tight">
              Cameron
            </h1>
            <p className="text-[10px] text-cameron-600 uppercase tracking-[0.2em] -mt-0.5">
              Natural
            </p>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cameron-50 hover:bg-cameron-100 text-cameron-700 text-sm font-medium transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'th' ? 'EN' : 'TH'}</span>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all',
              itemCount > 0
                ? 'bg-cameron-700 text-white shadow-lg shadow-cameron-700/25 hover:bg-cameron-800 pulse-green'
                : 'bg-cameron-50 text-cameron-700 hover:bg-cameron-100'
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <>
                <span className="hidden sm:inline">
                  {language === 'th' ? 'ตะกร้า' : 'Cart'}
                </span>
                <span className="bg-matcha-light text-cameron-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
