/**
 * Notification service scaffolding for LINE and SMS notifications.
 *
 * To enable LINE notifications:
 *   1. Create a LINE Messaging API channel
 *   2. Set LINE_CHANNEL_ACCESS_TOKEN and LINE_ADMIN_USER_ID in .env.local
 *
 * To enable SMS notifications (via Twilio):
 *   1. Create a Twilio account
 *   2. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env.local
 */

interface NotificationPayload {
  title: string;
  message: string;
  orderId?: string;
}

// ── LINE Notifications ──────────────────────────────────
export async function sendLINENotification(payload: NotificationPayload): Promise<boolean> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_ADMIN_USER_ID;

  if (!token || !userId) {
    console.log('[LINE] Not configured - skipping notification');
    return false;
  }

  try {
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: userId,
        messages: [
          {
            type: 'text',
            text: `${payload.title}\n${payload.message}${payload.orderId ? `\nOrder: #${payload.orderId.slice(0, 8).toUpperCase()}` : ''}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error('[LINE] Notification failed:', await res.text());
      return false;
    }

    console.log('[LINE] Notification sent successfully');
    return true;
  } catch (error) {
    console.error('[LINE] Notification error:', error);
    return false;
  }
}

// ── SMS Notifications (Twilio) ──────────────────────────
export async function sendSMSNotification(
  phoneNumber: string,
  payload: NotificationPayload
): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.log('[SMS] Twilio not configured - skipping notification');
    return false;
  }

  try {
    const message = `${payload.title}: ${payload.message}`;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        To: phoneNumber,
        From: fromNumber,
        Body: message,
      }),
    });

    if (!res.ok) {
      console.error('[SMS] Notification failed:', await res.text());
      return false;
    }

    console.log('[SMS] Notification sent successfully');
    return true;
  } catch (error) {
    console.error('[SMS] Notification error:', error);
    return false;
  }
}

// ── Notify admin about new order ────────────────────────
export async function notifyNewOrder(orderId: string, customerName: string, total: number): Promise<void> {
  const payload: NotificationPayload = {
    title: 'New Order Received',
    message: `${customerName} placed an order for $${total.toFixed(2)}`,
    orderId,
  };

  // Send all configured notifications in parallel
  await Promise.allSettled([
    sendLINENotification(payload),
  ]);
}

// ── Notify customer about order status ──────────────────
export async function notifyOrderStatus(
  phoneNumber: string,
  orderId: string,
  status: string
): Promise<void> {
  const statusMessages: Record<string, string> = {
    confirmed: 'Your order has been confirmed and is being prepared.',
    preparing: 'Your order is being prepared now.',
    ready: 'Your order is ready for pickup!',
    completed: 'Your order has been completed. Thank you!',
    cancelled: 'Your order has been cancelled.',
  };

  const message = statusMessages[status];
  if (!message) return;

  await sendSMSNotification(phoneNumber, {
    title: 'Order Update',
    message,
    orderId,
  });
}
