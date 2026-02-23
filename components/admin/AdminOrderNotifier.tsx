'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface OrderSummary {
  id: string;
  createdAt?: string;
}

export default function AdminOrderNotifier() {
  const hasLoadedRef = useRef(false);
  const lastSeenAtRef = useRef<string | null>(null);

  const playAlert = () => {
    try {
      const AudioContext =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.value = 0.08;

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        ctx.close();
      }, 220);
    } catch (error) {
      console.error('Failed to play alert:', error);
    }
  };

  const sendNotification = (count: number) => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') return;
    const title = count === 1 ? 'New order received' : 'New orders received';
    const body =
      count === 1
        ? 'An order just came in.'
        : `${count} new orders just came in.`;
    try {
      new Notification(title, { body });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchLatest = async () => {
      try {
        const res = await fetch('/api/orders?limit=10');
        const data = await res.json();
        if (!active) return;

        const incoming: OrderSummary[] = data.orders || [];
        if (incoming.length === 0) {
          hasLoadedRef.current = true;
          return;
        }

        const mostRecent = incoming[0]?.createdAt || null;

        if (hasLoadedRef.current) {
          if (!lastSeenAtRef.current) {
            toast.success(
              incoming.length === 1 ? 'New order received' : `${incoming.length} new orders received`
            );
            playAlert();
            sendNotification(incoming.length);
          } else {
            const lastSeenTime = Date.parse(lastSeenAtRef.current);
            const newOrders = incoming.filter(
              (order) => order.createdAt && Date.parse(order.createdAt) > lastSeenTime
            );
            if (newOrders.length > 0) {
              toast.success(
                newOrders.length === 1
                  ? 'New order received'
                  : `${newOrders.length} new orders received`
              );
              playAlert();
              sendNotification(newOrders.length);
            }
          }
        }

        if (mostRecent) lastSeenAtRef.current = mostRecent;
        hasLoadedRef.current = true;
      } catch (error) {
        console.error('Failed to check new orders:', error);
      }
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 20000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return null;
}
