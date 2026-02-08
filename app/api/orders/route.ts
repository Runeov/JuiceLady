import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { stripe } from '@/lib/stripe';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      total,
      paymentMethod,
      customerName,
      customerPhone,
      customerNote,
    } = body;

    // Validate
    if (!items?.length || !total || !paymentMethod || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in Firestore
    const orderData = {
      items,
      subtotal: total,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending',
      orderStatus: 'pending',
      customerName,
      customerPhone,
      customerNote: customerNote || null,
      stripeSessionId: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const orderRef = await adminDb.collection('orders').add(orderData);
    const orderId = orderRef.id;

    // If Stripe payment, create checkout session
    if (paymentMethod === 'stripe') {
      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: 'thb',
          product_data: {
            name: `${item.name_en} (${item.name_th})`,
            description: item.addons?.length
              ? `Toppings: ${item.addons.map((a: any) => a.name_en).join(', ')}`
              : undefined,
          },
          unit_amount: item.unitPrice * 100, // Stripe uses smallest unit (satang)
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancelled=true`,
        metadata: {
          orderId,
        },
      });

      // Update order with Stripe session ID
      await orderRef.update({
        stripeSessionId: session.id,
        updatedAt: Timestamp.now(),
      });

      return NextResponse.json({
        orderId,
        checkoutUrl: session.url,
      });
    }

    // Cash payment - just return order ID
    return NextResponse.json({
      orderId,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET recent orders (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get('limit') || '50');
    const date = searchParams.get('date');

    let queryRef = adminDb
      .collection('orders')
      .orderBy('createdAt', 'desc');

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      queryRef = adminDb
        .collection('orders')
        .where('createdAt', '>=', Timestamp.fromDate(start))
        .where('createdAt', '<=', Timestamp.fromDate(end))
        .orderBy('createdAt', 'desc');
    }

    const snapshot = await queryRef.limit(limitCount).get();

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate()?.toISOString(),
        updatedAt: data.updatedAt?.toDate()?.toISOString(),
      };
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
