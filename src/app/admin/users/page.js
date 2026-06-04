'use client';

import { useState, useEffect } from 'react';
import { Trash2, Shield, ShieldOff } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  async function toggleRole(id, currentRole) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      toast.success(`Role changed to ${newRole}`);
      fetchData();
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('User deleted');
      fetchData();
    } else {
      const err = await res.json();
      toast.error(err.error || 'Failed to delete');
    }
  }

  return (
    <div>
      <h2 className="admin-page-title">Manage Users</h2>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '8px',
                        background: 'var(--gradient-primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '0.75rem'
                      }}>
                        {u.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span className={`badge badge-${u.role === 'admin' ? 'primary' : 'success'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        onClick={() => toggleRole(u.id, u.role)}
                        className="btn btn-sm btn-secondary"
                        title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                      >
                        {u.role === 'admin' ? <ShieldOff size={14} /> : <Shield size={14} />}
                      </button>
                      <button onClick={() => handleDelete(u.id, u.name)} className="btn btn-sm btn-danger" title="Delete">
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
