import { NextResponse } from 'next/server';
import { searchTuitions, createTuition } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const categoryId = searchParams.get('category') || '';
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const sort = searchParams.get('sort') || 'rating';

    const tuitions = searchTuitions({ query, categoryId, minRating, sort });
    return NextResponse.json({ tuitions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tuitions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    const tuition = createTuition(data);
    return NextResponse.json({ tuition }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tuition' }, { status: 500 });
  }
}
