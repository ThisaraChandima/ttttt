'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  return (
    <nav id="mainNav" className={scrolled ? 'scrolled' : ''}>
      <Link href="/" className="nav-logo">
        <span className="nav-logo-si">ගයිඩ්</span>
        <div className="nav-logo-pill">
          <span className="nav-logo-text">GU<span className="ir">I</span>DE</span>
        </div>
      </Link>
      <div className="nav-links">
        <Link href="/tuitions">ගුරුවරුන් සොයන්න</Link>
        <Link href="/categories">විෂයයන්</Link>
        <Link href="/#how-it-works">How It Works</Link>
        <Link href="/#reviews">Reviews</Link>
        <Link href="/register" className="nav-cta">⭐ Review ලියන්න</Link>
      </div>
    </nav>
  );
}
