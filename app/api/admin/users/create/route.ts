import { NextRequest, NextResponse } from 'next/server';
import adminApp from '@/lib/firebase-admin';
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
    const email = (body.email || '').trim();
    const phone = (body.phone || '').trim();
    const displayName = (body.displayName || '').trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const adminAuth = getAuth(adminApp);
    let user;
    try {
      user = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') throw error;
    }

    if (!user) {
      user = await adminAuth.createUser({
        email,
        phoneNumber: phone || undefined,
        displayName: displayName || undefined,
      });
    } else if (displayName || phone) {
      user = await adminAuth.updateUser(user.uid, {
        displayName: displayName || user.displayName || undefined,
        phoneNumber: phone || user.phoneNumber || undefined,
      });
    }

    return NextResponse.json({
      user: {
        uid: user.uid,
        email: user.email || null,
        phoneNumber: user.phoneNumber || null,
        displayName: user.displayName || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}
