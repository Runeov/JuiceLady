'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import AdminOrderNotifier from '@/components/admin/AdminOrderNotifier';
import AdminNotificationPrompt from '@/components/admin/AdminNotificationPrompt';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    async function check() {
      if (!user) {
        if (active) {
          setIsAdmin(false);
          setChecking(false);
        }
        return;
      }
      try {
        const token = await user.getIdTokenResult(true);
        if (active) {
          setIsAdmin(Boolean(token.claims.admin));
        }
      } catch {
        if (active) setIsAdmin(false);
      } finally {
        if (active) setChecking(false);
      }
    }
    check();
    return () => {
      active = false;
    };
  }, [user]);

  if (loading || checking) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cameron-600 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 p-6 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Admin Access Only</h1>
        <p className="text-sm text-gray-500 mb-4">
          Please sign in with an admin account to access this area.
        </p>
        <Link
          href="/account"
          className="inline-flex items-center justify-center rounded-xl bg-cameron-700 text-white px-4 py-2 text-sm font-medium hover:bg-cameron-800 transition-colors"
        >
          Go to Account
        </Link>
      </div>
    );
  }

  return (
    <>
      <AdminOrderNotifier />
      <AdminNotificationPrompt />
      {children}
    </>
  );
}
