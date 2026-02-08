import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cameron Natural | ชาคาเมรอน พัทยา',
  description:
    'Order bubble tea, matcha, coffee & Italian soda online from Cameron Natural Pattaya. Fresh, natural, premium drinks.',
  keywords: ['bubble tea', 'matcha', 'cameron natural', 'pattaya', 'ชาคาเมรอน', 'พัทยา'],
  openGraph: {
    title: 'Cameron Natural | ชาคาเมรอน',
    description: 'Premium bubble tea & matcha drinks in Pattaya',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="min-h-screen bg-cream leaf-pattern antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a6b28',
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
