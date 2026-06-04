'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, BadgeCheck } from 'lucide-react';
import StarRating from '@/components/StarRating';
import { useToast } from '@/components/Toast';

export default function AdminTuitions() {
  const [tuitions, setTuitions] = useState([]);
  const [categories, setCategories] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [tutRes, catRes] = await Promise.all([
      fetch('/api/tuitions'),
      fetch('/api/categories'),
    ]);
    const tutData = await tutRes.json();
    const catData = await catRes.json();
    setTuitions(tutData.tuitions || []);
    const catMap = {};
    (catData.categories || []).forEach(c => { catMap[c.id] = c.name; });
    setCategories(catMap);
    setLoading(false);
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/tuitions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Tuition deleted');
      fetchData();
    } else {
      toast.error('Failed to delete');
    }
  }

  const filtered = tuitions.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Manage Tuitions</h2>
        <Link href="/admin/tuitions/new" className="btn btn-primary">
          <Plus size={16} /> Add Tuition
        </Link>
      </div>

      <div style={{ marginBottom: 'var(--space-lg)', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: 40, maxWidth: 400 }}
          placeholder="Search tuitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No tuitions found</td></tr>
            ) : (
              filtered.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td>{categories[t.categoryId] || '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.location}</td>
                  <td><StarRating rating={t.rating} size={12} /></td>
                  <td>{t.totalReviews}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {t.verified && <span className="badge badge-success"><BadgeCheck size={10} /> Verified</span>}
                      {t.featured && <span className="badge badge-warning">Featured</span>}
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <Link href={`/admin/tuitions/${t.id}/edit`} className="btn btn-sm btn-secondary">
                        <Edit size={14} />
                      </Link>
                      <button onClick={() => handleDelete(t.id, t.name)} className="btn btn-sm btn-danger">
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
