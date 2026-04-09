'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  QrCode,
  User,
  Phone,
  MessageSquare,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice, getVariantLabel, cn } from '@/lib/utils';
import Header from '@/components/layout/Header';
import type { PaymentMethod } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';

const promptpayEnabled = process.env.NEXT_PUBLIC_PROMPTPAY_ENABLED === 'true';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (!customerPhone && user?.phoneNumber) {
      setCustomerPhone(user.phoneNumber);
    }
    if (!customerName && user?.displayName) {
      setCustomerName(user.displayName);
    }
  }, [customerName, customerPhone, user]);

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart');
    }
  }, [items.length, orderComplete, router]);

  if (items.length === 0 && !orderComplete) {
    return null;
  }

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!customerPhone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          name_secondary: item.menuItem.name_secondary,
          variant: item.variant,
          size: item.size,
          addons: item.addons.map((a) => ({
            name: a.name,
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
        userId: user?.uid,
        userEmail: user?.email || undefined,
        userPhone: user?.phoneNumber || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      if (paymentMethod === 'stripe' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setOrderId(data.orderId);
        setOrderComplete(true);
        clearCart();
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error('Something went wrong. Please try again.');
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
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle2 className="w-10 h-10 text-brand-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-brand-900 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-brand-500 text-sm mb-2">
            Thank you for your order. Please wait for preparation.
          </p>
          <div className="bg-brand-50 rounded-2xl p-4 mt-6 mb-8">
            <p className="text-xs text-brand-500">Order ID</p>
            <p className="font-mono text-lg font-bold text-brand-800 mt-1">
              {orderId.slice(0, 8).toUpperCase()}
            </p>
            <p className="text-xs text-brand-400 mt-2">
              {paymentMethod === 'promptpay' ? 'Scan QR code to pay' : 'Pay at the counter'}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-700 text-white px-6 py-3 rounded-full font-medium hover:bg-brand-800 transition-colors"
          >
            Back to Menu
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
            className="w-10 h-10 rounded-full bg-white border border-brand-100 flex items-center justify-center hover:bg-brand-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-brand-700" />
          </Link>
          <h1 className="font-display text-2xl font-bold text-brand-900">
            Checkout
          </h1>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-brand-100/60 p-4 mb-6">
          <h2 className="text-sm font-semibold text-brand-800 mb-3">
            Order Summary
          </h2>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-brand-700">
                  {item.quantity}x {item.menuItem.name}
                  <span className="text-brand-400 text-xs ml-1">
                    ({getVariantLabel(item.variant)})
                  </span>
                </span>
                <span className="font-medium text-brand-900">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-brand-900">Total</span>
            <span className="font-display text-xl font-bold text-brand-800">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-white rounded-2xl border border-brand-100/60 p-4 mb-6">
          <h2 className="text-sm font-semibold text-brand-800 mb-4">
            Customer Info
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Name *"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-sm focus:border-brand-400 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone *"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-sm focus:border-brand-400 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-brand-400" />
              <textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Additional notes"
                rows={2}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 text-sm focus:border-brand-400 focus:bg-white focus:outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-2xl border border-brand-100/60 p-4 mb-8">
          <h2 className="text-sm font-semibold text-brand-800 mb-4">
            Payment Method
          </h2>
          <div className={cn('grid gap-3', promptpayEnabled ? 'grid-cols-3' : 'grid-cols-2')}>
            <button
              onClick={() => setPaymentMethod('cash')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                paymentMethod === 'cash'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
              )}
            >
              <Banknote
                className={cn(
                  'w-8 h-8',
                  paymentMethod === 'cash' ? 'text-brand-700' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  paymentMethod === 'cash' ? 'text-brand-800' : 'text-gray-500'
                )}
              >
                Cash
              </span>
              <span className="text-[10px] text-brand-400">Pay at store</span>
            </button>

            <button
              onClick={() => setPaymentMethod('stripe')}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                paymentMethod === 'stripe'
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
              )}
            >
              <CreditCard
                className={cn(
                  'w-8 h-8',
                  paymentMethod === 'stripe' ? 'text-brand-700' : 'text-gray-400'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  paymentMethod === 'stripe' ? 'text-brand-800' : 'text-gray-500'
                )}
              >
                Card
              </span>
              <span className="text-[10px] text-brand-400">
                Visa, Mastercard
              </span>
            </button>

            {promptpayEnabled && (
              <button
                onClick={() => setPaymentMethod('promptpay')}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  paymentMethod === 'promptpay'
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                )}
              >
                <QrCode
                  className={cn(
                    'w-8 h-8',
                    paymentMethod === 'promptpay' ? 'text-brand-700' : 'text-gray-400'
                  )}
                />
                <span
                  className={cn(
                    'text-sm font-medium',
                    paymentMethod === 'promptpay' ? 'text-brand-800' : 'text-gray-500'
                  )}
                >
                  QR Pay
                </span>
                <span className="text-[10px] text-brand-400">
                  PromptPay / QR
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className={cn(
            'w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-base shadow-lg transition-all active:scale-[0.98]',
            isProcessing
              ? 'bg-brand-400 cursor-not-allowed'
              : 'bg-brand-700 hover:bg-brand-800 shadow-brand-700/25'
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 text-white animate-spin" />
              <span className="text-white">Processing...</span>
            </>
          ) : (
            <>
              {paymentMethod === 'stripe' ? (
                <CreditCard className="w-5 h-5 text-white" />
              ) : paymentMethod === 'promptpay' ? (
                <QrCode className="w-5 h-5 text-white" />
              ) : (
                <Banknote className="w-5 h-5 text-white" />
              )}
              <span className="text-white">
                {paymentMethod === 'stripe'
                  ? 'Pay with Card'
                  : paymentMethod === 'promptpay'
                  ? 'Pay with QR'
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
