import Link from 'next/link';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  BarChart3,
  Users,
  Store,
  ArrowLeft,
  Package,
} from 'lucide-react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminPendingBadge from '@/components/admin/AdminPendingBadge';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-900 text-white flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold">Admin Panel</h1>
            <p className="text-[10px] text-brand-300 uppercase tracking-wider">
              Management
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-200 hover:text-white hover:bg-brand-800 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span className="flex items-center">
                {item.label}
                {item.href === '/admin/orders' && <AdminPendingBadge className="ml-2" />}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-brand-400 hover:text-brand-200 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to store
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-brand-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-white" />
          <span className="font-display text-sm font-bold">Admin</span>
        </div>
        <nav className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-2 rounded-lg hover:bg-brand-800 transition-colors"
            >
              <span className="relative inline-flex">
                <item.icon className="w-4 h-4 text-brand-200" />
                {item.href === '/admin/orders' && (
                  <span className="absolute -top-1 -right-1">
                    <AdminPendingBadge />
                  </span>
                )}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto mt-12 md:mt-0">
        <AdminGuard>{children}</AdminGuard>
      </main>
    </div>
  );
}
