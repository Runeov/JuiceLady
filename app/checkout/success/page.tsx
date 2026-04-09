'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Store } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import Header from '@/components/layout/Header';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-brand-600" />
        </div>

        <h2 className="font-display text-2xl font-bold text-brand-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-brand-500 text-sm mb-2">
          Thank you for your order. We are preparing it now.
        </p>

        {orderId && (
          <div className="bg-brand-50 rounded-2xl p-4 mt-6 mb-8">
            <p className="text-xs text-brand-500">Order ID</p>
            <p className="font-mono text-lg font-bold text-brand-800 mt-1">
              {orderId.slice(0, 8).toUpperCase()}
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-xs text-brand-600">Paid</span>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-700 text-white px-6 py-3 rounded-full font-medium hover:bg-brand-800 transition-colors"
        >
          <Store className="w-4 h-4" />
          Back to Menu
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-brand-500">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
