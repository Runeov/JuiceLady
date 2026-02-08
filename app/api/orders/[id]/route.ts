import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderStatus, paymentStatus } = body;

    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    await adminDb.collection('orders').doc(id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await adminDb.collection('orders').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const data = doc.data()!;
    return NextResponse.json({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate()?.toISOString(),
      updatedAt: data.updatedAt?.toDate()?.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
