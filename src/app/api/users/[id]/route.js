import { NextResponse } from 'next/server';
import { updateUser, deleteUser } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();
    // Only allow updating role and bio
    const allowedFields = {};
    if (data.role) allowedFields.role = data.role;
    if (data.bio !== undefined) allowedFields.bio = data.bio;
    if (data.name) allowedFields.name = data.name;

    const user = updateUser(id, allowedFields);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    if (id === authUser.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const success = deleteUser(id);
    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
