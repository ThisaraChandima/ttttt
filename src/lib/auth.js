import { cookies } from 'next/headers';

const JWT_SECRET = 'tuitionrate-secret-key-2025-change-in-production';

// Simple base64 encode/decode for JWT-like tokens (no external deps needed)
function base64Encode(str) {
  return Buffer.from(str).toString('base64url');
}

function base64Decode(str) {
  return Buffer.from(str, 'base64url').toString('utf-8');
}

// Simple HMAC-like signature using the secret
function sign(payload) {
  const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64Encode(JSON.stringify(payload));
  // Simple hash: combine payload with secret
  const signature = base64Encode(
    JSON.stringify({ h: header.slice(0, 10), b: body.slice(0, 10), s: JWT_SECRET.slice(0, 10) })
  );
  return `${header}.${body}.${signature}`;
}

function verify(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64Decode(parts[1]));
    // Check expiration
    if (payload.exp && Date.now() > payload.exp) return null;
    // Verify signature
    const expectedSig = base64Encode(
      JSON.stringify({ h: parts[0].slice(0, 10), b: parts[1].slice(0, 10), s: JWT_SECRET.slice(0, 10) })
    );
    if (parts[2] !== expectedSig) return null;
    return payload;
  } catch {
    return null;
  }
}

export function createToken(user) {
  return sign({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function verifyToken(token) {
  return verify(token);
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function checkPassword(inputPassword, storedPasswordPlain) {
  return inputPassword === storedPasswordPlain;
}
