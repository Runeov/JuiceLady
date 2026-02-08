import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Category, MenuItem, Addon, Order, OrderStatus } from '@/types';

// ── Categories ──────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const q = query(collection(db, 'categories'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
}

// ── Menu Items ──────────────────────────────────────────
export async function getMenuItems(): Promise<MenuItem[]> {
  const q = query(collection(db, 'menuItems'), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MenuItem));
}

export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  const q = query(
    collection(db, 'menuItems'),
    where('categoryId', '==', categoryId),
    orderBy('order')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MenuItem));
}

export async function updateMenuItem(id: string, data: Partial<MenuItem>): Promise<void> {
  await updateDoc(doc(db, 'menuItems', id), data as DocumentData);
}

export async function addMenuItem(data: Omit<MenuItem, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'menuItems'), data);
  return docRef.id;
}

export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'menuItems', id));
}

// ── Addons ──────────────────────────────────────────────
export async function getAddons(): Promise<Addon[]> {
  const snapshot = await getDocs(collection(db, 'addons'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Addon));
}

// ── Orders ──────────────────────────────────────────────
export async function createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: Timestamp.fromDate(orderData.createdAt),
    updatedAt: Timestamp.fromDate(orderData.updatedAt),
  });
  return docRef.id;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const docSnap = await getDoc(doc(db, 'orders', orderId));
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    orderStatus: status,
    updatedAt: Timestamp.now(),
  });
}

export async function updateOrderPayment(
  orderId: string,
  paymentStatus: 'paid' | 'failed',
  stripeSessionId?: string
): Promise<void> {
  const updateData: Record<string, unknown> = {
    paymentStatus,
    updatedAt: Timestamp.now(),
  };
  if (stripeSessionId) updateData.stripeSessionId = stripeSessionId;
  await updateDoc(doc(db, 'orders', orderId), updateData);
}

export async function getRecentOrders(count: number = 50): Promise<Order[]> {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Order;
  });
}

export async function getOrdersByDate(date: string): Promise<Order[]> {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, 'orders'),
    where('createdAt', '>=', Timestamp.fromDate(start)),
    where('createdAt', '<=', Timestamp.fromDate(end)),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Order;
  });
}
