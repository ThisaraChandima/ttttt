'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, Clock, DollarSign, BookOpen, BadgeCheck, ArrowLeft, Send } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { useToast } from '@/components/Toast';
import './detail.css';

export default function TuitionDetailPage({ params }) {
  const { id } = use(params);
  const [tuition, setTuition] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [category, setCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const [tuitionRes, reviewsRes, authRes, categoriesRes] = await Promise.all([
        fetch(`/api/tuitions/${id}`),
        fetch(`/api/reviews?tuitionId=${id}`),
        fetch('/api/auth/me'),
        fetch('/api/categories'),
      ]);

      const tuitionData = await tuitionRes.json();
      const reviewsData = await reviewsRes.json();
      const authData = await authRes.json();
      const categoriesData = await categoriesRes.json();

      setTuition(tuitionData.tuition);
      setReviews(reviewsData.reviews || []);
      if (authData.user) setUser(authData.user);

      const cat = categoriesData.categories?.find(c => c.id === tuitionData.tuition?.categoryId);
      setCategory(cat);

      // Fetch users for reviews
      try {
        const usersRes = await fetch('/api/users');
        const usersData = await usersRes.json();
        const usersMap = {};
        (usersData.users || []).forEach(u => { usersMap[u.id] = u; });
        setUsers(usersMap);
      } catch (e) {
        // Non-admin can't access users list — that's fine
      }
    } catch (error) {
      console.error('Failed to fetch tuition data:', error);
    }
    setLoading(false);
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!user) {
      toast.warning('Please log in to submit a review');
      return;
    }
    if (reviewForm.rating === 0) {
      toast.warning('Please select a rating');
      return;
    }
    if (!reviewForm.comment.trim()) {
      toast.warning('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tuitionId: id,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment,
        }),
      });

      if (res.ok) {
        toast.success('Review submitted successfully!');
        setReviewForm({ rating: 0, title: '', comment: '' });
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review');
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading tuition details...</p>
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Tuition not found</h2>
        <Link href="/tuitions" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Tuitions</Link>
      </div>
    );
  }

  // Rating distribution
  const ratingDist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="detail-page">
      {/* Hero */}
      <div className="detail-hero" style={{ background: `linear-gradient(135deg, ${category?.color || '#6C5CE7'}22 0%, var(--bg-secondary) 100%)` }}>
        <div className="container">
          <Link href="/tuitions" className="detail-back">
            <ArrowLeft size={16} /> Back to Tuitions
          </Link>
          <div className="detail-hero-content">
            <div className="detail-hero-info">
              <div className="detail-hero-badges">
                <span className="badge badge-primary">{category?.name || 'General'}</span>
                {tuition.verified && (
                  <span className="badge badge-success"><BadgeCheck size={12} /> Verified</span>
                )}
                {tuition.featured && (
                  <span className="badge badge-warning">Featured</span>
                )}
              </div>
              <h1 className="detail-title">{tuition.name}</h1>
              <div className="detail-meta">
                <div className="detail-rating-big">
                  <StarRating rating={tuition.rating} size={22} />
                  <span className="detail-rating-count">({tuition.totalReviews} reviews)</span>
                </div>
                <div className="detail-location">
                  <MapPin size={16} />
                  <span>{tuition.location}</span>
                </div>
              </div>
            </div>
            <div className="detail-hero-letter" style={{ color: category?.color || '#6C5CE7' }}>
              {tuition.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-content">
        <div className="detail-grid">
          {/* Main Content */}
          <div className="detail-main">
            {/* About */}
            <section className="detail-section glass-card">
              <h2 className="detail-section-title">About</h2>
              <p className="detail-description">{tuition.description}</p>
              <div className="detail-subjects">
                <h3>Subjects Offered</h3>
                <div className="detail-tags">
                  {tuition.subjects?.map((s, i) => (
                    <span key={i} className="detail-tag">{s}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Rating Breakdown */}
            <section className="detail-section glass-card">
              <h2 className="detail-section-title">Rating Breakdown</h2>
              <div className="rating-breakdown">
                <div className="rating-overview">
                  <span className="rating-big-number">{tuition.rating}</span>
                  <StarRating rating={tuition.rating} size={20} />
                  <span className="rating-total">{tuition.totalReviews} reviews</span>
                </div>
                <div className="rating-bars">
                  {ratingDist.map(d => (
                    <div key={d.star} className="rating-bar-row">
                      <span className="rating-bar-label">{d.star} ★</span>
                      <div className="rating-bar-track">
                        <div className="rating-bar-fill" style={{ width: `${d.percent}%` }}></div>
                      </div>
                      <span className="rating-bar-count">{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="detail-section glass-card">
              <h2 className="detail-section-title">Student Reviews ({reviews.length})</h2>
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="reviews-empty">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-user">
                          <div className="review-avatar">
                            {(users[review.userId]?.name || 'U').charAt(0)}
                          </div>
                          <div>
                            <span className="review-name">{users[review.userId]?.name || 'Student'}</span>
                            <span className="review-date">
                              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      {review.title && <h4 className="review-title">{review.title}</h4>}
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Write Review */}
            <section className="detail-section glass-card">
              <h2 className="detail-section-title">Write a Review</h2>
              {user ? (
                <form onSubmit={handleSubmitReview} className="review-form">
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <StarRating
                      rating={reviewForm.rating}
                      size={28}
                      interactive={true}
                      onChange={(val) => setReviewForm(f => ({ ...f, rating: val }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Review Title (optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Summarize your experience"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm(f => ({ ...f, title: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Share your experience with this tuition..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    <Send size={16} />
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="review-login-prompt">
                  <p>You need to be logged in to submit a review.</p>
                  <Link href="/login" className="btn btn-primary">Log In</Link>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">Tuition Details</h3>
              <div className="sidebar-info">
                <div className="sidebar-row">
                  <DollarSign size={16} className="sidebar-icon" />
                  <div>
                    <span className="sidebar-label">Fees</span>
                    <span className="sidebar-value">{tuition.fees}</span>
                  </div>
                </div>
                <div className="sidebar-row">
                  <Clock size={16} className="sidebar-icon" />
                  <div>
                    <span className="sidebar-label">Schedule</span>
                    <span className="sidebar-value">{tuition.schedule}</span>
                  </div>
                </div>
                <div className="sidebar-row">
                  <MapPin size={16} className="sidebar-icon" />
                  <div>
                    <span className="sidebar-label">Location</span>
                    <span className="sidebar-value">{tuition.location}</span>
                  </div>
                </div>
                <div className="sidebar-row">
                  <Phone size={16} className="sidebar-icon" />
                  <div>
                    <span className="sidebar-label">Phone</span>
                    <span className="sidebar-value">{tuition.phone}</span>
                  </div>
                </div>
                <div className="sidebar-row">
                  <Mail size={16} className="sidebar-icon" />
                  <div>
                    <span className="sidebar-label">Email</span>
                    <span className="sidebar-value">{tuition.email}</span>
                  </div>
                </div>
                {tuition.website && (
                  <div className="sidebar-row">
                    <Globe size={16} className="sidebar-icon" />
                    <div>
                      <span className="sidebar-label">Website</span>
                      <a href={tuition.website} target="_blank" rel="noopener noreferrer" className="sidebar-value sidebar-link">
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">Subjects</h3>
              <div className="sidebar-subjects">
                {tuition.subjects?.map((s, i) => (
                  <span key={i} className="sidebar-subject">
                    <BookOpen size={12} /> {s}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
