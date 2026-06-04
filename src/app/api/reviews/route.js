import { NextResponse } from 'next/server';
import { getAllReviews, getReviewsByTuition, createReview } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tuitionId = searchParams.get('tuitionId');
    const all = searchParams.get('all');

    if (all === 'true') {
      const user = await getAuthUser();
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      return NextResponse.json({ reviews: getAllReviews() });
    }

    if (tuitionId) {
      const reviews = getReviewsByTuition(tuitionId);
      return NextResponse.json({ reviews });
    }

    return NextResponse.json({ reviews: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Must be logged in to submit a review' }, { status: 401 });
    }

    const data = await request.json();
    if (!data.tuitionId || !data.rating || !data.comment) {
      return NextResponse.json({ error: 'tuitionId, rating and comment are required' }, { status: 400 });
    }

    const review = createReview({
      ...data,
      userId: user.id,
      rating: Math.min(5, Math.max(1, parseInt(data.rating))),
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
