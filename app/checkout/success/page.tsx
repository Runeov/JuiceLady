'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Leaf } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import Header from '@/components/layout/Header';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { language, clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-cameron-100 flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-cameron-600" />
        </div>

        <h2 className="font-display text-2xl font-bold text-cameron-900 mb-2">
          {language === 'th' ? 'ชำระเงินสำเร็จ!' : 'Payment Successful!'}
        </h2>
        <p className="text-cameron-500 text-sm mb-2">
          {language === 'th'
            ? 'ขอบคุณสำหรับการสั่งซื้อ เรากำลังเตรียมเครื่องดื่มให้คุณ'
            : 'Thank you for your order. We are preparing your drinks.'}
        </p>

        {orderId && (
          <div className="bg-cameron-50 rounded-2xl p-4 mt-6 mb-8">
            <p className="text-xs text-cameron-500">
              {language === 'th' ? 'หมายเลขออเดอร์' : 'Order ID'}
            </p>
            <p className="font-mono text-lg font-bold text-cameron-800 mt-1">
              {orderId.slice(0, 8).toUpperCase()}
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cameron-500 animate-pulse" />
              <span className="text-xs text-cameron-600">
                {language === 'th' ? 'ชำระเงินแล้ว' : 'Paid'}
              </span>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-cameron-700 text-white px-6 py-3 rounded-full font-medium hover:bg-cameron-800 transition-colors"
        >
          <Leaf className="w-4 h-4" />
          {language === 'th' ? 'กลับหน้าเมนู' : 'Back to Menu'}
        </Link>
      </div>
    </div>
  );
}
