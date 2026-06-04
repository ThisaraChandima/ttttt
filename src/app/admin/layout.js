'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, MessageSquare, Users, FolderOpen, Settings, LogOut, GraduationCap, Menu, X, ChevronRight } from 'lucide-react';
import { ToastProvider } from '@/components/Toast';
import './admin.css';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/tuitions', icon: BookOpen, label: 'Tuitions' },
  { href: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (!data.user || data.user.role !== 'admin') {
        router.push('/login');
        return;
      }
      setUser(data.user);
    } catch (e) {
      router.push('/login');
    }
    setLoading(false);
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (loading) {
    return <div className="admin-loading">Loading admin panel...</div>;
  }

  if (!user) return null;

  return (
    <ToastProvider>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}>
          <div className="admin-sidebar-header">
            <Link href="/" className="admin-sidebar-brand">
              <div className="admin-sidebar-logo">
                <GraduationCap size={20} />
              </div>
              <span>TuitionRate</span>
            </Link>
            <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="admin-sidebar-nav">
            <span className="admin-sidebar-label">Main Menu</span>
            {navItems.map(item => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} className="admin-sidebar-arrow" />}
                </Link>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <div className="admin-sidebar-user">
              <div className="admin-sidebar-avatar">{user.name.charAt(0)}</div>
              <div>
                <span className="admin-sidebar-name">{user.name}</span>
                <span className="admin-sidebar-role">Administrator</span>
              </div>
            </div>
            <button onClick={handleLogout} className="admin-sidebar-logout">
              <LogOut size={16} />
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)}></div>}

        {/* Main Content */}
        <div className="admin-main">
          <header className="admin-topbar">
            <button className="admin-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="admin-topbar-title">
              {navItems.find(i => i.exact ? pathname === i.href : pathname.startsWith(i.href))?.label || 'Admin'}
            </div>
            <Link href="/" className="btn btn-sm btn-ghost">View Site →</Link>
          </header>
          <div className="admin-content">
            {children}
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
