'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, MessageSquare, Star, TrendingUp } from 'lucide-react';
import StarRating from '@/components/StarRating';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
    setLoading(false);
  }

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load dashboard.</div>;

  return (
    <div>
      <h2 className="admin-page-title">Dashboard Overview</h2>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-label"><BookOpen size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Total Tuitions</span>
          <span className="admin-stat-value">{stats.totalTuitions}</span>
          <span className="admin-stat-change"><TrendingUp size={12} /> Active</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label"><MessageSquare size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Total Reviews</span>
          <span className="admin-stat-value">{stats.totalReviews}</span>
          <span className="admin-stat-change"><TrendingUp size={12} /> Growing</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label"><Users size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Total Users</span>
          <span className="admin-stat-value">{stats.totalUsers}</span>
          <span className="admin-stat-change"><TrendingUp size={12} /> Active</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-label"><Star size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Avg Rating</span>
          <span className="admin-stat-value">{stats.averageRating}</span>
          <span className="admin-stat-change"><TrendingUp size={12} /> Excellent</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
        {/* Top Rated */}
        <div className="admin-table-wrapper">
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>Top Rated Tuitions</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Rating</th><th>Reviews</th></tr>
            </thead>
            <tbody>
              {stats.topRatedTuitions?.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td><StarRating rating={t.rating} size={12} /></td>
                  <td>{t.totalReviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Reviews */}
        <div className="admin-table-wrapper">
          <div style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700 }}>Recent Reviews</h3>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>Review</th><th>Rating</th><th>Status</th></tr>
            </thead>
            <tbody>
              {stats.recentReviews?.map(r => (
                <tr key={r.id}>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.title || r.comment.substring(0, 40)}
                  </td>
                  <td><StarRating rating={r.rating} size={12} /></td>
                  <td><span className={`badge badge-${r.status === 'approved' ? 'success' : 'warning'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
