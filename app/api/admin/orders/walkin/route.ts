import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import adminApp, { adminDb } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

async function requireAdmin(request: NextRequest) {
  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    return { error: NextResponse.json({ error: 'Missing auth token' }, { status: 401 }) };
  }
  try {
    const decoded = await getAuth(adminApp).verifyIdToken(token);
    if (!decoded.admin) {
      return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) };
    }
    return { decoded };
  } catch (error: any) {
    return {
      error: NextResponse.json(
        { error: error.message || 'Invalid auth token' },
        { status: 401 }
      ),
    };
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();
    const {
      items,
      total,
      customerName,
      customerPhone,
      customerNote,
      userId,
      userEmail,
      userPhone,
    } = body;

    if (!items?.length || !total || !customerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const orderData = {
      items,
      subtotal: total,
      total,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      orderStatus: 'completed',
      customerName,
      customerPhone: customerPhone || '',
      userId: userId || null,
      userEmail: userEmail || null,
      userPhone: userPhone || null,
      customerNote: customerNote || null,
      stripeSessionId: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const orderRef = await adminDb.collection('orders').add(orderData);

    return NextResponse.json({ orderId: orderRef.id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create walk-in order' },
      { status: 500 }
    );
  }
}
