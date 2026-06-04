'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useToast } from '@/components/Toast';
import './auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login successful!');
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
      </div>
      <div className="auth-container">
        <div className="auth-card glass-card animate-scale-in">
          <div className="auth-header">
            <div className="auth-logo">
              <GraduationCap size={28} />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your TuitionRate account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-input auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don&apos;t have an account? <Link href="/register" className="auth-link">Sign up</Link></p>
          </div>

          <div className="auth-demo">
            <p className="auth-demo-title">Demo Credentials</p>
            <div className="auth-demo-grid">
              <button className="auth-demo-btn" onClick={() => { setEmail('admin@tuitionrate.com'); setPassword('admin123'); }}>
                <span className="auth-demo-role">Admin</span>
                <span className="auth-demo-email">admin@tuitionrate.com</span>
              </button>
              <button className="auth-demo-btn" onClick={() => { setEmail('kasun@example.com'); setPassword('user123'); }}>
                <span className="auth-demo-role">User</span>
                <span className="auth-demo-email">kasun@example.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
