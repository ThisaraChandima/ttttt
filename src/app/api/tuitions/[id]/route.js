import { NextResponse } from 'next/server';
import { getTuitionById, updateTuition, deleteTuition } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const tuition = getTuitionById(id);
    if (!tuition) {
      return NextResponse.json({ error: 'Tuition not found' }, { status: 404 });
    }
    return NextResponse.json({ tuition });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tuition' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const data = await request.json();
    const tuition = updateTuition(id, data);
    if (!tuition) {
      return NextResponse.json({ error: 'Tuition not found' }, { status: 404 });
    }
    return NextResponse.json({ tuition });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tuition' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const success = deleteTuition(id);
    if (!success) {
      return NextResponse.json({ error: 'Tuition not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Tuition deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tuition' }, { status: 500 });
  }
}
