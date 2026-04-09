'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithCredential,
  PhoneAuthProvider,
  signOut,
  updateProfile,
  type ConfirmationResult,
} from 'firebase/auth';
import Header from '@/components/layout/Header';
import { useAuth } from '@/components/providers/AuthProvider';
import { auth } from '@/lib/firebase';
import { getOrdersByUserId } from '@/lib/firestore';
import type { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function AccountPage() {
  const { user, loading } = useAuth();

  const [emailMode, setEmailMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const greeting = useMemo(() => {
    if (!user) return '';
    return user.displayName || user.email || user.phoneNumber || '';
  }, [user]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    getOrdersByUserId(user.uid)
      .then(setOrders)
      .catch((error) => {
        console.error('Fetch orders error:', error);
        toast.error('Failed to load order history');
      })
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Enter email and password');
      return;
    }
    setAuthLoading(true);
    try {
      if (emailMode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
        toast.success('Account created');
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password.trim());
        toast.success('Signed in');
      }
      setPassword('');
    } catch (error: any) {
      console.error('Email auth error:', error);
      toast.error(error?.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const ensureRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
    return recaptchaRef.current;
  };

  const handleSendCode = async () => {
    if (!phone.trim()) {
      toast.error('Enter phone number');
      return;
    }
    setAuthLoading(true);
    try {
      const verifier = ensureRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone.trim(), verifier);
      setConfirmationResult(result);
      toast.success('Code sent');
    } catch (error: any) {
      console.error('Send code error:', error);
      toast.error(error?.message || 'Failed to send code');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) {
      toast.error('Send the code first');
      return;
    }
    if (!code.trim()) {
      toast.error('Enter the code');
      return;
    }
    setAuthLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        code.trim()
      );
      await signInWithCredential(auth, credential);
      toast.success('Signed in');
      setCode('');
      setConfirmationResult(null);
    } catch (error: any) {
      console.error('Verify code error:', error);
      toast.error(error?.message || 'Invalid code');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="bg-white rounded-2xl border border-brand-100/60 p-5">
          <h1 className="font-display text-2xl font-bold text-brand-900 mb-2">
            Account
          </h1>
          <p className="text-sm text-brand-500 mb-5">
            Sign in to view your order history
          </p>

          {loading ? (
            <p className="text-sm text-brand-500">Loading...</p>
          ) : user ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-brand-50 p-4">
                <p className="text-xs uppercase tracking-wide text-brand-500">
                  Signed in as
                </p>
                <p className="text-sm font-semibold text-brand-900 mt-1">{greeting}</p>
                <div className="text-xs text-brand-500 mt-2 space-y-1">
                  {user.email && <p>Email: {user.email}</p>}
                  {user.phoneNumber && <p>Phone: {user.phoneNumber}</p>}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full rounded-xl bg-brand-700 text-white py-2.5 font-medium hover:bg-brand-800 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-brand-100/60 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-brand-800">
                    Email
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEmailMode('login')}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emailMode === 'login'
                          ? 'bg-brand-700 text-white'
                          : 'bg-brand-50 text-brand-600'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setEmailMode('register')}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emailMode === 'register'
                          ? 'bg-brand-700 text-white'
                          : 'bg-brand-50 text-brand-600'
                      }`}
                    >
                      Register
                    </button>
                  </div>
                </div>
                {emailMode === 'register' && (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name (optional)"
                    className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:border-brand-400 focus:bg-white focus:outline-none"
                  />
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:border-brand-400 focus:bg-white focus:outline-none"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:border-brand-400 focus:bg-white focus:outline-none"
                />
                <button
                  onClick={handleEmailAuth}
                  disabled={authLoading}
                  className="w-full rounded-lg bg-brand-700 text-white py-2 text-sm font-medium hover:bg-brand-800 transition-colors disabled:opacity-60"
                >
                  {emailMode === 'register' ? 'Create account' : 'Sign in'}
                </button>
              </div>

              <div className="rounded-xl border border-brand-100/60 p-4">
                <h2 className="text-sm font-semibold text-brand-800 mb-4">
                  Phone
                </h2>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:border-brand-400 focus:bg-white focus:outline-none"
                />
                {confirmationResult && (
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Verification code"
                    className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm focus:border-brand-400 focus:bg-white focus:outline-none"
                  />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSendCode}
                    disabled={authLoading}
                    className="flex-1 rounded-lg bg-brand-50 text-brand-700 py-2 text-sm font-medium hover:bg-brand-100 transition-colors disabled:opacity-60"
                  >
                    Send code
                  </button>
                  <button
                    onClick={handleVerifyCode}
                    disabled={authLoading}
                    className="flex-1 rounded-lg bg-brand-700 text-white py-2 text-sm font-medium hover:bg-brand-800 transition-colors disabled:opacity-60"
                  >
                    Verify
                  </button>
                </div>
              </div>

              <div id="recaptcha-container" />
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-brand-100/60 p-5">
          <h2 className="text-sm font-semibold text-brand-800 mb-4">
            Order History
          </h2>
          {!user && (
            <p className="text-sm text-brand-500">
              Sign in to see your purchases.
            </p>
          )}
          {user && ordersLoading && (
            <p className="text-sm text-brand-500">Loading...</p>
          )}
          {user && !ordersLoading && orders.length === 0 && (
            <p className="text-sm text-brand-500">No orders yet.</p>
          )}
          {user && !ordersLoading && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border border-brand-100/60 bg-brand-50/60 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-brand-500">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm font-semibold text-brand-900">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-brand-800">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <div className="mt-2 text-xs text-brand-600">
                    {order.items.length} items · {order.orderStatus}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
