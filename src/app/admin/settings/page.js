'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setSettings(d.settings);
      setLoading(false);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success('Settings saved!');
      } else {
        toast.error('Failed to save');
      }
    } catch (e) {
      toast.error('Failed to save settings');
    }
    setSaving(false);
  }

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading settings...</div>;
  if (!settings) return <div>Failed to load settings.</div>;

  return (
    <div>
      <h2 className="admin-page-title">Site Settings</h2>

      <div className="admin-form">
        <form onSubmit={handleSubmit} className="admin-form-card">
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">Site Name</label>
              <input type="text" className="form-input" value={settings.siteName} onChange={(e) => setSettings(s => ({ ...s, siteName: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input type="text" className="form-input" value={settings.tagline} onChange={(e) => setSettings(s => ({ ...s, tagline: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input type="email" className="form-input" value={settings.contactEmail} onChange={(e) => setSettings(s => ({ ...s, contactEmail: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input type="text" className="form-input" value={settings.contactPhone} onChange={(e) => setSettings(s => ({ ...s, contactPhone: e.target.value }))} />
            </div>
            <div className="form-group admin-form-full">
              <label className="form-label">Address</label>
              <input type="text" className="form-input" value={settings.address} onChange={(e) => setSettings(s => ({ ...s, address: e.target.value }))} />
            </div>
            <div className="form-group admin-form-full" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-lg)', marginTop: 'var(--space-sm)' }}>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Social Links</h3>
            </div>
            <div className="form-group">
              <label className="form-label">Facebook</label>
              <input type="url" className="form-input" value={settings.socialLinks?.facebook || ''} onChange={(e) => setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, facebook: e.target.value } }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Twitter</label>
              <input type="url" className="form-input" value={settings.socialLinks?.twitter || ''} onChange={(e) => setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, twitter: e.target.value } }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input type="url" className="form-input" value={settings.socialLinks?.instagram || ''} onChange={(e) => setSettings(s => ({ ...s, socialLinks: { ...s.socialLinks, instagram: e.target.value } }))} />
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
