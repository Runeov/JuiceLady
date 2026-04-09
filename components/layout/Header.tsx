'use client';

import Link from 'next/link';
import { ShoppingBag, Store, User } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { shopConfig } from '@/lib/config';

export default function Header() {
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const { user } = useAuth();
  const userLabel = user?.displayName || user?.email || user?.phoneNumber;

  return (
    <header className="sticky top-0 z-50 glass border-b border-brand-200/30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="font-display text-lg font-bold text-brand-800 tracking-tight">
              {shopConfig.name}
            </h1>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Account */}
          <Link
            href="/account"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 text-sm font-medium transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {userLabel ? 'Account' : 'Sign in'}
            </span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all',
              itemCount > 0
                ? 'bg-brand-700 text-white shadow-lg shadow-brand-700/25 hover:bg-brand-800 pulse-brand'
                : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <>
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-accent-light text-brand-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
