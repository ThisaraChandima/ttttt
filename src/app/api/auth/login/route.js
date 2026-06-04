import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { createToken, checkPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!checkPassword(password, user.passwordPlain)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = createToken(user);

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      message: 'Login successful',
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
