'use client';

import { useEffect, useState } from 'react';

const ACTIVE_STATUSES = ['pending', 'confirmed', 'preparing', 'ready'];

interface OrderSummary {
  id: string;
  orderStatus: string;
}

export default function AdminPendingBadge({ className }: { className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchCount = async () => {
      try {
        const res = await fetch('/api/orders?limit=100');
        const data = await res.json();
        if (!active) return;
        const orders: OrderSummary[] = data.orders || [];
        const nextCount = orders.filter((o) => ACTIVE_STATUSES.includes(o.orderStatus)).length;
        setCount(nextCount);
      } catch (error) {
        console.error('Failed to fetch pending count:', error);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 20000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (count === 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-amber-500 text-white text-[10px] font-semibold px-1 ${className || ''}`}
    >
      {count}
    </span>
  );
}
