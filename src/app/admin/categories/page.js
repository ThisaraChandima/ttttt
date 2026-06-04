'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', icon: '', color: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', description: '', icon: 'book-open', color: '#6C5CE7' });
  const toast = useToast();

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newForm),
    });
    if (res.ok) {
      toast.success('Category added');
      setShowAdd(false);
      setNewForm({ name: '', description: '', icon: 'book-open', color: '#6C5CE7' });
      fetchData();
    }
  }

  async function handleEdit(id) {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      toast.success('Category updated');
      setEditId(null);
      fetchData();
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete category "${name}"?`)) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Category deleted');
      fetchData();
    }
  }

  function startEdit(cat) {
    setEditId(cat.id);
    setEditForm({ name: cat.name, description: cat.description, icon: cat.icon, color: cat.color });
  }

  return (
    <div>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Manage Categories</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="admin-form-card" style={{ marginBottom: 'var(--space-xl)', maxWidth: 600 }}>
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>New Category</h3>
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input type="text" className="form-input" value={newForm.name} onChange={(e) => setNewForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={newForm.color} onChange={(e) => setNewForm(f => ({ ...f, color: e.target.value }))} style={{ width: 40, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer' }} />
                <input type="text" className="form-input" value={newForm.color} onChange={(e) => setNewForm(f => ({ ...f, color: e.target.value }))} style={{ flex: 1 }} />
              </div>
            </div>
            <div className="form-group admin-form-full">
              <label className="form-label">Description</label>
              <input type="text" className="form-input" value={newForm.description} onChange={(e) => setNewForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary"><Save size={16} /> Add</button>
            <button type="button" onClick={() => setShowAdd(false)} className="btn btn-secondary"><X size={16} /> Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Color</th>
              <th>Name</th>
              <th>Description</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: cat.color }}></div>
                  </td>
                  <td>
                    {editId === cat.id ? (
                      <input type="text" className="form-input" value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '4px 8px' }} />
                    ) : (
                      <span style={{ fontWeight: 600 }}>{cat.name}</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {editId === cat.id ? (
                      <input type="text" className="form-input" value={editForm.description} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))} style={{ padding: '4px 8px' }} />
                    ) : (
                      cat.description
                    )}
                  </td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>{cat.slug}</td>
                  <td>
                    <div className="admin-table-actions">
                      {editId === cat.id ? (
                        <>
                          <button onClick={() => handleEdit(cat.id)} className="btn btn-sm btn-primary"><Save size={14} /></button>
                          <button onClick={() => setEditId(null)} className="btn btn-sm btn-secondary"><X size={14} /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(cat)} className="btn btn-sm btn-secondary"><Edit size={14} /></button>
                          <button onClick={() => handleDelete(cat.id, cat.name)} className="btn btn-sm btn-danger"><Trash2 size={14} /></button>
                        </>
                      )}
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
