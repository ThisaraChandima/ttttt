'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function EditTuitionPage({ params }) {
  const { id } = use(params);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    const [tutRes, catRes] = await Promise.all([
      fetch(`/api/tuitions/${id}`),
      fetch('/api/categories'),
    ]);
    const tutData = await tutRes.json();
    const catData = await catRes.json();
    setCategories(catData.categories || []);
    if (tutData.tuition) {
      setForm({
        ...tutData.tuition,
        subjects: tutData.tuition.subjects?.join(', ') || '',
      });
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/tuitions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        toast.success('Tuition updated!');
        router.push('/admin/tuitions');
      } else {
        toast.error('Failed to update');
      }
    } catch (e) {
      toast.error('Failed to update tuition');
    }
    setSubmitting(false);
  }

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>;
  if (!form) return <div>Tuition not found.</div>;

  return (
    <div>
      <Link href="/admin/tuitions" className="btn btn-ghost" style={{ marginBottom: 'var(--space-lg)' }}>
        <ArrowLeft size={16} /> Back to Tuitions
      </Link>

      <h2 className="admin-page-title">Edit: {form.name}</h2>

      <div className="admin-form">
        <form onSubmit={handleSubmit} className="admin-form-card">
          <div className="admin-form-grid">
            <div className="form-group admin-form-full">
              <label className="form-label">Tuition Name *</label>
              <input type="text" className="form-input" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input form-select" value={form.categoryId} onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input type="text" className="form-input" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} required />
            </div>
            <div className="form-group admin-form-full">
              <label className="form-label">Description *</label>
              <textarea className="form-input form-textarea" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} required></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input type="url" className="form-input" value={form.website || ''} onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Fees</label>
              <input type="text" className="form-input" value={form.fees} onChange={(e) => setForm(f => ({ ...f, fees: e.target.value }))} />
            </div>
            <div className="form-group admin-form-full">
              <label className="form-label">Schedule</label>
              <input type="text" className="form-input" value={form.schedule} onChange={(e) => setForm(f => ({ ...f, schedule: e.target.value }))} />
            </div>
            <div className="form-group admin-form-full">
              <label className="form-label">Subjects (comma-separated)</label>
              <input type="text" className="form-input" value={form.subjects} onChange={(e) => setForm(f => ({ ...f, subjects: e.target.value }))} />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))} />
                <span className="form-label" style={{ marginBottom: 0 }}>Featured</span>
              </label>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.verified} onChange={(e) => setForm(f => ({ ...f, verified: e.target.checked }))} />
                <span className="form-label" style={{ marginBottom: 0 }}>Verified</span>
              </label>
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={16} />
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/tuitions" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
