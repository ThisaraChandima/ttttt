'use client';

import { useState, useEffect } from 'react';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { useToast } from '@/components/Toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [tuitions, setTuitions] = useState({});
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [revRes, tutRes, usrRes] = await Promise.all([
      fetch('/api/reviews?all=true'),
      fetch('/api/tuitions'),
      fetch('/api/users'),
    ]);
    const revData = await revRes.json();
    const tutData = await tutRes.json();
    const usrData = await usrRes.json();

    setReviews(revData.reviews || []);
    const tutMap = {};
    (tutData.tuitions || []).forEach(t => { tutMap[t.id] = t.name; });
    setTuitions(tutMap);
    const usrMap = {};
    (usrData.users || []).forEach(u => { usrMap[u.id] = u.name; });
    setUsers(usrMap);
    setLoading(false);
  }

  async function handleStatusChange(id, status) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Review ${status}`);
      fetchData();
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this review?')) return;
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Review deleted');
      fetchData();
    }
  }

  return (
    <div>
      <h2 className="admin-page-title">Manage Reviews</h2>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tuition</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No reviews</td></tr>
            ) : (
              reviews.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tuitions[r.tuitionId] || '—'}
                  </td>
                  <td>{users[r.userId] || '—'}</td>
                  <td><StarRating rating={r.rating} size={12} /></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                    {r.title || r.comment.substring(0, 50)}
                  </td>
                  <td>
                    <span className={`badge badge-${r.status === 'approved' ? 'success' : r.status === 'rejected' ? 'error' : 'warning'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      {r.status !== 'approved' && (
                        <button onClick={() => handleStatusChange(r.id, 'approved')} className="btn btn-sm btn-secondary" title="Approve">
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button onClick={() => handleStatusChange(r.id, 'rejected')} className="btn btn-sm btn-secondary" title="Reject">
                          <XCircle size={14} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(r.id)} className="btn btn-sm btn-danger" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
