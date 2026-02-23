'use client';

import { useEffect, useState } from 'react';

export default function AdminNotificationPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default') {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      if (result !== 'default') {
        setVisible(false);
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  return (
    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-amber-900">Enable desktop alerts?</p>
        <p className="text-xs text-amber-700">
          Turn on browser notifications so new orders show up even if this tab is in the background.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={requestPermission}
          className="px-3 py-2 text-xs font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
        >
          Enable
        </button>
        <button
          onClick={() => setVisible(false)}
          className="px-3 py-2 text-xs font-medium rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
