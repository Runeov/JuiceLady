'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  User,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice, getTempLabel, cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import type { PaymentMethod } from '@/types';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, language, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (items.length === 0 && !orderComplete) {
    router.push('/cart');
    return null;
  }

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast.error(language === 'th' ? 'กรุณากรอกชื่อ' : 'Please enter your name');
      return;
    }
    if (!customerPhone.trim()) {
      toast.error(
        language === 'th' ? 'กรุณากรอกเบอร์โทร' : 'Please enter your phone number'
      );
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          name_en: item.menuItem.name_en,
          name_th: item.menuItem.name_th,
          temp: item.temp,
          size: item.size,
          addons: item.addons.map((a) => ({
            name_en: a.name_en,
            name_th: a.name_th,
            price: a.price,
          })),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          notes: item.notes,
        })),
        total,
        paymentMethod,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerNote: customerNote.trim() || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      if (paymentMethod === 'stripe' && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        // Cash payment - show confirmation
        setOrderId(data.orderId);
        setOrderComplete(true);
        clearCart();
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(
        language === 'th'
          ? 'เกิดข้อผิดพลาด กรุณาลองใหม่'
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Order complete screen
  if (orderComplete) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-cameron-100 flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle2 className="w-10 h-10 text-cameron-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-cameron-900 mb-2">
            {language === 'th' ? 'สั่งซื้อสำเร็จ!' : 'Order Confirmed!'}
          </h2>
          <p className="text-cameron-500 text-sm mb-2">
            {language === 'th'
              ? 'ขอบคุณที่สั่งซื้อ กรุณารอสักครู่'
              : 'Thank you for your order. Please wait for preparation.'}
          </p>
          <div className="bg-cameron-50 rounded-2xl p-4 mt-6 mb-8">
            <p className="text-xs text-cameron-500">
              {language === 'th' ? 'หมายเลขออเดอร์' : 'Order ID'}
            </p>
            <p className="font-mono text-lg font-bold text-cameron-800 mt-1">
              {orderId.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-cameron-400 mt-2">
              {language === 'th'
                ? 'ชำระเงินที่หน้าร้าน'
                : 'Pay at the counter'}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-cameron-700 text-white px-6 py-3 rounded-full font-medium hover:bg-cameron-800 transition-colors"
          >
            {language === 'th' ? 'กลับหน้าเมนู' : 'Back to Menu'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back + title */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/cart"
            className="w-10 h-10 rounded-full bg-white border border-cameron-100 flex items-center justify-center hover:bg-cameron-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-cameron-700" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-cameron-900">
            {language === 'th' ? 'ชำระเงิน' : 'Checkout'}
          </h1>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-cameron-100/60 p-4 mb-6">
          <h2 className="text-sm font-semibold text-cameron-800 mb-3">
            {language === 'th' ? 'สรุปรายการ' : 'Order Summary'}
          </h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-cameron-700">
                  {item.quantity}x{' '}
                  {language === 'th' ? item.menuItem.name_th : item.menuItem.name_en}
                  <span className="text-cameron-400 text-xs ml-1">
                    ({getTempLabel(item.temp, language)})
                  </span>
                </span>
                <span className="font-medium text-cameron-900">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-cameron-900">
              {language === 'th' ? 'รวมทั้งหมด' : 'Total'}
            </span>
            <span className="font-display text-xl font-bold text-cameron-800">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-white rounded-2xl border border-cameron-100/60 p-4 mb-6">
          <h2 className="text-sm font-semibold text-cameron-800 mb-4">
            {language === 'th' ? 'ข้อมูลลูกค้า' : 'Customer Info'}
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cameron-400" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={language === 'th' ? 'ชื่อ *' : 'Name *'}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-sm focus:border-cameron-400 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cameron-400" />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={language === 'th' ? 'เบอร์โทร *' : 'Phone *'}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-sm focus:border-cameron-400 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-cameron-400" />
              <textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder={
                  language === 'th' ? 'หมายเหตุเพิ่มเติม' : 'Additional notes'
                }
                rows={2}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-sm focus:border-cameron-400 focus:bg-white focus:outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-2xl border border-cameron-100/60 p-4 mb-8">
          <h2 className="text-sm font-semibold text-cameron-800 mb-4">
            {language === 'th' ? 'วิธีชำระเงิน' : 'Payment Method'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                paymentMethod === 'cash'
                  ? 'border-cameron-600 bg-cameron-50'
                  : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
              )}
            >
              <Banknote
                className={cn(
                  'w-8 h-8',
                  paymentMethod === 'cash' ? 'text-cameron-700' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  paymentMethod === 'cash' ? 'text-cameron-800' : 'text-gray-500'
                )}
              >
                {language === 'th' ? 'เงินสด' : 'Cash'}
              </span>
              <span className="text-[10px] text-cameron-400">
                {language === 'th' ? 'ชำระที่ร้าน' : 'Pay at store'}
              </span>
            </button>

            <button
              onClick={() => setPaymentMethod('stripe')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                paymentMethod === 'stripe'
                  ? 'border-cameron-600 bg-cameron-50'
                  : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
              )}
            >
              <CreditCard
                className={cn(
                  'w-8 h-8',
                  paymentMethod === 'stripe' ? 'text-cameron-700' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  paymentMethod === 'stripe' ? 'text-cameron-800' : 'text-gray-500'
                )}
              >
                {language === 'th' ? 'บัตรเครดิต' : 'Credit Card'}
              </span>
              <span className="text-[10px] text-cameron-400">
                Visa, Mastercard
              </span>
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className={cn(
            'w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-base shadow-lg transition-all active:scale-[0.98]',
            isProcessing
              ? 'bg-cameron-400 cursor-not-allowed'
              : 'bg-cameron-700 hover:bg-cameron-800 shadow-cameron-700/25'
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 text-white animate-spin" />
              <span className="text-white">
                {language === 'th' ? 'กำลังดำเนินการ...' : 'Processing...'}
              </span>
            </>
          ) : (
            <>
              {paymentMethod === 'stripe' ? (
                <CreditCard className="w-5 h-5 text-white" />
              ) : (
                <Banknote className="w-5 h-5 text-white" />
              )}
              <span className="text-white">
                {paymentMethod === 'stripe'
                  ? language === 'th'
                    ? 'ชำระด้วยบัตร'
                    : 'Pay with Card'
                  : language === 'th'
                  ? 'ยืนยันสั่งซื้อ'
                  : 'Confirm Order'}
              </span>
              <span className="bg-white/20 text-white px-3 py-0.5 rounded-lg text-sm">
                {formatPrice(total)}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
