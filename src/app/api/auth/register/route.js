import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db';
import { createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const result = createUser({ name, email, passwordPlain: password });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    const token = createToken(result);

    const response = NextResponse.json({
      user: { id: result.id, name: result.name, email: result.email, role: result.role, avatar: result.avatar },
      message: 'Registration successful',
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
