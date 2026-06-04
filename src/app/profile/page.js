'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Edit3, Star, Calendar } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { useToast } from '@/components/Toast';
import './profile.css';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tuitions, setTuitions] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const authRes = await fetch('/api/auth/me');
      const authData = await authRes.json();

      if (!authData.user) {
        router.push('/login');
        return;
      }

      setUser(authData.user);

      // Fetch all reviews and filter by user
      const reviewsRes = await fetch('/api/reviews?all=true');
      const reviewsData = await reviewsRes.json();
      const userReviews = (reviewsData.reviews || []).filter(r => r.userId === authData.user.id);
      setReviews(userReviews);

      // Fetch tuitions for review references
      const tutitionsRes = await fetch('/api/tuitions');
      const tutitionsData = await tutitionsRes.json();
      const tutMap = {};
      (tutitionsData.tuitions || []).forEach(t => { tutMap[t.id] = t; });
      setTuitions(tutMap);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
    setLoading(false);
  }

  if (loading) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="container">
          <div className="profile-hero-content">
            <div className="profile-avatar-big">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="profile-name">{user.name}</h1>
              <p className="profile-email"><Mail size={14} /> {user.email}</p>
              <span className="badge badge-primary" style={{ marginTop: '8px' }}>{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container section">
        <div className="profile-grid">
          {/* Stats */}
          <div className="profile-stats glass-card">
            <h3>Your Activity</h3>
            <div className="profile-stats-grid">
              <div className="profile-stat">
                <Star size={20} className="profile-stat-icon" />
                <span className="profile-stat-number">{reviews.length}</span>
                <span className="profile-stat-label">Reviews</span>
              </div>
              <div className="profile-stat">
                <Edit3 size={20} className="profile-stat-icon" />
                <span className="profile-stat-number">
                  {reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0'}
                </span>
                <span className="profile-stat-label">Avg Rating</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="profile-reviews glass-card">
            <h3>Your Reviews</h3>
            {reviews.length === 0 ? (
              <p className="profile-empty">You haven&apos;t written any reviews yet. Start exploring tuition classes!</p>
            ) : (
              <div className="profile-reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="profile-review-item">
                    <div className="profile-review-header">
                      <div>
                        <h4 className="profile-review-tuition">{tuitions[review.tuitionId]?.name || 'Tuition Class'}</h4>
                        <span className="profile-review-date">
                          <Calendar size={12} />
                          {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    {review.title && <h5 className="profile-review-title">{review.title}</h5>}
                    <p className="profile-review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
