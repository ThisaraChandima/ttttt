'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function NewTuitionPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', categoryId: '', location: '',
    phone: '', email: '', website: '', fees: '', schedule: '', subjects: '',
    featured: false, verified: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/tuitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        toast.success('Tuition created successfully!');
        router.push('/admin/tuitions');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to create');
      }
    } catch (e) {
      toast.error('Failed to create tuition');
    }
    setSubmitting(false);
  }

  return (
    <div>
      <Link href="/admin/tuitions" className="btn btn-ghost" style={{ marginBottom: 'var(--space-lg)' }}>
        <ArrowLeft size={16} /> Back to Tuitions
      </Link>

      <h2 className="admin-page-title">Add New Tuition</h2>

      <div className="admin-form">
        <form onSubmit={handleSubmit} className="admin-form-card">
          <div className="admin-form-grid">
            <div className="form-group admin-form-full">
              <label className="form-label">Tuition Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Excel Academy" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
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
              <input type="text" className="form-input" placeholder="e.g. Colombo 07" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} required />
            </div>
            <div className="form-group admin-form-full">
              <label className="form-label">Description *</label>
              <textarea className="form-input form-textarea" placeholder="Describe this tuition..." value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} required></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" className="form-input" placeholder="+94 77 123 4567" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" placeholder="info@example.com" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Website</label>
              <input type="url" className="form-input" placeholder="https://..." value={form.website} onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Fees</label>
              <input type="text" className="form-input" placeholder="Rs. 3,500/month" value={form.fees} onChange={(e) => setForm(f => ({ ...f, fees: e.target.value }))} />
            </div>
            <div className="form-group admin-form-full">
              <label className="form-label">Schedule</label>
              <input type="text" className="form-input" placeholder="Mon-Fri 4:00 PM - 6:00 PM" value={form.schedule} onChange={(e) => setForm(f => ({ ...f, schedule: e.target.value }))} />
            </div>
            <div className="form-group admin-form-full">
              <label className="form-label">Subjects (comma-separated)</label>
              <input type="text" className="form-input" placeholder="Mathematics, Physics, Chemistry" value={form.subjects} onChange={(e) => setForm(f => ({ ...f, subjects: e.target.value }))} />
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
              {submitting ? 'Creating...' : 'Create Tuition'}
            </button>
            <Link href="/admin/tuitions" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
