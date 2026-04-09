import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/providers/AuthProvider';
import './globals.css';

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || 'My Shop';
const shopDescription =
  process.env.NEXT_PUBLIC_SHOP_DESCRIPTION || 'Order online from our menu.';

export const metadata: Metadata = {
  title: shopName,
  description: shopDescription,
  openGraph: {
    title: shopName,
    description: shopDescription,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-surface surface-pattern antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#4338ca',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'var(--font-body)',
            },
          }}
        />
      </body>
    </html>
  );
}
